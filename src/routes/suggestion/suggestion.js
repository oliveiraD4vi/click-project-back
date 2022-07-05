const { eAdmin } = require('../../middlewares/auth');

const Suggestion = require('../../models/tables/Suggestion');

module.exports = (app) => {
  app.post('/suggestion', eAdmin, async (req, res) => {
    const data = req.body;

    try {
      await Suggestion.create(data);
      return res.json({
        error: false,
        message: 'Sugestão registrada com sucesso!'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Erro desconhecido'
      });
    }
  });
};
