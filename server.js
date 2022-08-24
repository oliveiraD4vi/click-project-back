const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

require('dotenv/config');
require('./src/models/db');
require('./src/routes/index')(app);

app.listen(process.env.PORT);
