const express = require('express');
const { TeamMember } = require('./model');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/team', async (req, res, next) => {
  const team = await TeamMember.findAll();
  return res.json(team);
});

app.post('/team', async (req, res, next) => {
  const newMember = req.body;
  TeamMember.create(newMember)
    .then(newMember => {
      res.status(200).json({ message: `${newMember} added` });
    })
    .catch(err => {
      res.status(500).json(err);
    });

  return res.json(newMember);
});

module.exports = app;
