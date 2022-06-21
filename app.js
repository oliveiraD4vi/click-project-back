const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv/config');
require('./models/db');

const app = express();
app.use(express.json());

const { eAdmin } = require('./middlewares/auth');
const User = require('./models/User');

app.get('/list', eAdmin, async (req, res) => {
  await User.findAll({
    attributes: ['id', 'name', 'user'],
    order: [['id', "DESC"]]
  })
  .then((users) => {
    return res.json({
      error: false,
      users,
      id_logged_user: req.userId
    });
  }).catch(() => {
    return res.status(400).json({
      error: true,
      message: "Error: User not found"
    });
  });
});

app.post('/register', async (req, res) => {
  const dados = req.body;
  dados.password = await bcrypt.hash(dados.password, 8);

  const user = await User.findOne({
    attributes: ['user'],
    where: {
      user: dados.user
    }
  });

  if (user === null) {
    await User.create(dados);
    return res.json({
      error: false,
      message: 'User successfully registered!'
    });
  } else {
    return res.json({
      error: true,
      message: 'Error: User already exists'
    });
  }
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    attributes: ['id', 'name', 'user', 'password'],
    where: {
      user: req.body.user
    }
  });

  if(user === null){
    return res.status(400).json({
      error: true,
      message: "Error: Inavlid user or password!"
    });
  }

  if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).json({
      error: true,
      message: "Error: Inavlid user or password!"
    });
  }

  var token = jwt.sign({id: user.Id}, process.env.JWT_KEY, {
    expiresIn: '1d'
  });

  return res.json({
    error: false,
    message: 'Logged successfully!',
    token
  });
});

app.listen(8080, () => {
  console.log("Server successfully initialized at http://localhost:8080");
});
