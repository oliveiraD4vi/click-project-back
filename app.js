const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv/config');
require('./models/db');

const app = express();
var cors = require('cors');

app.use(express.json());
app.use(cors());

const { eAdmin } = require('./middlewares/auth');

const VotingFilm = require('./models/VotingFilm');
const Voting = require('./models/Voting');
const User = require('./models/User');

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
      message: 'error: you already have an on going voting'
    });
  }

  const data = req.body;

  if (!data.films) {
    return res.status(400).json({
      error: true,
      message: 'error: incomplete request'
    });
  }

  try {
    await Voting.create({ current: true })
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
      message: 'voting registered'
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'error: voting not registered'
    });
  }
});

app.put('/voting/end', eAdmin, async (req, res) => {
  const voting = await Voting.findOne({
    attributes: ['id', 'current'],
    where: {
      current: true
    }
  });

  if (!voting) {
    return res.status(400).json({
      error: true,
      message: 'error: there is no on going voting'
    });
  }

  voting.current = false;
  await voting.save()
  .then(() => {
    return res.json({
      error: false,
      message: 'voting ended'
    });
  });
});

app.put('/voting/vote', eAdmin, async (req, res) => {
  const data = req.body;

  const voting = await Voting.findOne({
    attributes: ['id', 'current'],
    where: {
      current: true
    }
  });

  if (!voting) {
    return res.status(400).json({
      error: true,
      message: 'error: there is no on going voting'
    });
  }

  const film = await VotingFilm.findOne({
    attributes: ['id', 'film_code', 'voting_id', 'votes'],
    order: [['id', "DESC"]],
    where: {
      voting_id: voting.id,
      id: data.film_id
    }
  })
  
  if (!film) {
    return res.status(400).json({
      error: true,
      message: 'error: no match'
    });
  }

  await film.increment('votes')
  .then(() => {
    return res.json({
      error: false,
      message: 'vote registered'
    });
  });
});

app.get('/voting/films/list', eAdmin, async (req, res) => {
  const data = req.body;

  await VotingFilm.findAll({
    attributes: ['id', 'film_code', 'voting_id', 'votes'],
    order: [['id', "DESC"]],
    where: {
      voting_id: data.voting_id
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
        message: "error: no match"
      });
    }
  }).catch(() => {
    return res.status(400).json({
      error: true,
      message: "error: access denied"
    });
  });
});

app.get('/voting/list', eAdmin, async (req, res) => {
  await Voting.findAll({
    attributes: ['id', 'current'],
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
        message: "error: no votings registered"
      });
    }
  }).catch(() => {
    return res.status(400).json({
      error: true,
      message: "error: access denied"
    });
  });
});

app.get('/voting/current', eAdmin, async (req, res) => {
  const voting = await Voting.findOne({
    attributes: ['id', 'current'],
    where: {
      current: true
    }
  });
  
  if (voting === null) {
    return res.status(400).json({
      error: true,
      message: "error: voting not found"
    });
  }

  return res.json({
    error: false,
    current_voting_id: voting.id,
  });
});

app.post('/register', async (req, res) => {
  const data = req.body;

  if (!data.name || !data.email || !data.matricula || !data.password) {
    return res.status(400).json({
      error: true,
      message: 'error: incomplete request'
    });
  }

  data.password = await bcrypt.hash(data.password, 8);

  try {
    await User.create(data);
    return res.json({
      error: false,
      message: 'user successfully registered'
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'error: user already exists'
    });
  }
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    attributes: ['id', 'name', 'email', 'matricula', 'password'],
    where: {
      matricula: req.body.matricula
    }
  });

  if(user === null){
    return res.status(400).json({
      error: true,
      message: "error: invalid user or password"
    });
  }

  if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).json({
      error: true,
      message: "error: inavlid user or password"
    });
  }

  var token = jwt.sign({id: user.Id}, process.env.JWT_KEY, {
    expiresIn: '1d'
  });

  return res.json({
    error: false,
    message: 'user successfully logged',
    authData: {
      token,
      role: 'ALUNO'
    }
  });
});

app.listen(8080, () => {
  console.log("Server successfully initialized at http://localhost:8080");
});
