require('dotenv').config();

const express = require('express');
const router = require('./routes');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(router);

app.listen(3000)