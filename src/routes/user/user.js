require('dotenv/config');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/tables/User');

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    const data = req.body;

    if (!data.name || !data.email || !data.matricula || !data.password) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    data.password = await bcrypt.hash(data.password, 8);

    try {
      await User.create(data);
      return res.json({
        error: false,
        message: 'Usuário cadastrado com sucesso!'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Usuário já existe'
      });
    }
  });

  app.post('/register/admin', async (req, res) => {
    const data = req.body;

    if (!data.name || !data.email || !data.matricula || !data.password) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    data.password = await bcrypt.hash(data.password, 8);
    const userData = {
      ...data,
      role: 'ADMIN'
    };

    try {
      await User.create(userData);
      return res.json({
        error: false,
        message: 'Administrador cadastrado com sucesso!'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Administrador já existe'
      });
    }
  });

  app.post('/login', async (req, res) => {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email', 'matricula', 'password', 'role'],
      where: {
        matricula: req.body.matricula
      }
    });

    if(user === null){
      return res.status(400).json({
        error: true,
        message: "Erro: Usuário ou senha inválidos"
      });
    }

    if(!(await bcrypt.compare(req.body.password, user.password))){
      return res.status(400).json({
        error: true,
        message: "Erro: Usuário ou senha inválidos"
      });
    }

    var token = jwt.sign({id: user.Id}, process.env.JWT_KEY, {
      expiresIn: '1d'
    });

    return res.json({
      error: false,
      message: 'Usuário logado com sucesso',
      authData: {
        userId: user.id,
        token,
        role: user.role
      }
    });
  });
};
