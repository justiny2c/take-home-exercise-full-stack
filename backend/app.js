const express = require('express');
const { TeamMember } = require('./model');

const app = express();

app.get('/team', async (req, res, next) => {
  const team = await TeamMember.findAll();
  return res.json(team);
});

app.post('/team', async (req, res, next) => {
  const newMember = req.body;
  TeamMember.create(newMember);
  return res.json(newMember);
});

module.exports = app;
