const { eAdmin } = require('../../middlewares/auth');

const VotingUser = require('../../models/tables/VotingUser');
const VotingFilm = require('../../models/tables/VotingFilm');
const Voting = require('../../models/tables/Voting');

module.exports = (app) => {
  app.post('/voting', eAdmin, async (req, res) => {
    const currentVoting = await Voting.findOne({
      attributes: ['id', 'current'],
      where: {
        current: true
      }
    });

    if (currentVoting) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Já existe uma votação em andamento'
      });
    }

    const data = req.body;

    if (!data.films) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    try {
      await Voting.create()
      .then((voting) => {
        data.films.forEach((film) => {
          VotingFilm.create({
            film_code: film.id,
            voting_id: voting.id,
            votes: 0
          });
        });
      });
      return res.json({
        error: false,
        message: 'Votação registrada'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Voto não registrado'
      });
    }
  });

  app.put('/voting/end', async (req, res) => {
    const { cancel } = req.query;

    const voting = await Voting.findOne({
      attributes: ['id', 'current'],
      where: {
        current: true
      }
    });

    if (!voting) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Não existe uma votação ocorrendo'
      });
    }

    let winner = null;
    let votesPercent = 0;

    await VotingFilm.findAll({
      attributes: ['id', 'film_code', 'voting_id', 'votes'],
      order: [['id', "DESC"]],
      where: {
        voting_id: voting.id
      }
    })
    .then((films) => {
      winner = films[0];
      let totalVotes = 0;
      
      films.forEach((film) => {
        totalVotes += parseFloat(film.votes);
        if (film.votes > winner.votes)
          winner = film;
      });

      votesPercent = parseFloat(100*parseInt(winner.votes)/totalVotes);
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "Erro: Lista não encontrada"
      });
    });

    if (cancel) voting.cancelled = cancel;
    voting.current = false;
    voting.result = winner.film_code;
    voting.percent = votesPercent;

    await voting.save()
    .then(() => {
      return res.json({
        error: false,
        message: 'Votação encerrada'
      });
    });
  });

  app.get('/voting/check', eAdmin, async (req, res) => {
    const { userId } = req.query;

    const voting = await Voting.findOne({
      attributes: ['id', 'current'],
      where: {
        current: true
      }
    });

    if (!voting) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Não há votações ocorrendo'
      });
    }

    const user = await VotingUser.findOne({
      attributes: ['id', 'user_id', 'voting_id'],
      where: {
        user_id: userId,
        voting_id: voting.id
      }
    });

    if (user) {
      return res.json({
        error: false,
        voted: true,
        message: 'Esse usuário já efetuou a votação'
      });
    }

    return res.json({
      error: false,
      voted: false,
      message: 'Usuário pode votar'
    });
  });

  app.put('/voting/vote', eAdmin, async (req, res) => {
    const { userId, filmId } = req.query;

    const voting = await Voting.findOne({
      attributes: ['id', 'current'],
      where: {
        current: true
      }
    });

    if (!voting) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Não há votações ocorrendo'
      });
    }

    const film = await VotingFilm.findOne({
      attributes: ['id', 'film_code', 'voting_id', 'votes'],
      order: [['id', "DESC"]],
      where: {
        voting_id: voting.id,
        id: filmId
      }
    })
    
    if (!film) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Filme não encontrado'
      });
    }

    await film.increment('votes')
    .then(() => {
      VotingUser.create({ user_id: userId, voting_id: voting.id })
      .then(() => {
        return res.json({
          error: false,
          message: 'Voto registrado'
        });
      })
      .catch(() => {
        return res.json({
          error: true,
          message: 'Erro: Erro deseconhecido'
        });
      });
    });
  });

  app.get('/voting/films/list', async (req, res) => {
    const { voting_id } = req.query;

    await VotingFilm.findAll({
      attributes: ['id', 'film_code', 'voting_id', 'votes'],
      order: [['id', "DESC"]],
      where: {
        voting_id: voting_id
      }
    })
    .then((films) => {
      if (films.length > 0) {
        return res.json({
          error: false,
          films,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "Erro: Lista não encontrada"
        });
      }
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "Erro: Erro desconhecido"
      });
    });
  });

  app.get('/voting/list', async (req, res) => {
    await Voting.findAll({
      attributes: ['id', 'current', 'cancelled', 'result', 'percent', 'createdAt', 'updatedAt'],
      order: [['id', "DESC"]]
    })
    .then((votings) => {
      if (votings.length > 0) {
        return res.json({
          error: false,
          votings,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "Erro: Sem votos registrados"
        });
      }
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "Erro: Erro desconhecido"
      });
    });
  });

  app.get('/voting', async (req, res) => {
    const { id } = req.query;

    const voting = await Voting.findOne({
      attributes: ['id', 'current', 'cancelled', 'result', 'percent', 'createdAt', 'updatedAt'],
      where: {
        id
      }
    });
    
    if (voting === null) {
      return res.status(400).json({
        error: true,
        message: "Erro: Votação não encontrada"
      });
    }

    return res.json({
      error: false,
      voting
    });
  });
};
