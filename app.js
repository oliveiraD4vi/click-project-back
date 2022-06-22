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
const User = require('./models/User');

app.get('/list', eAdmin, async (req, res) => {
  await User.findAll({
    attributes: ['id', 'name', 'email', 'matricula'],
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
      message: "error: user not found"
    });
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
