const express = require('express');
const router = express.Router();
const path = require('path');

// The regex ^/$ means url starts and ends with a /
router.get('^/$|index(.html)?', (req, res) => {
  //res.sendFile('./views/index.html', {root: __dirname});
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html'); //302 by default
});

router.get('/hello(.html)?', (req, res, next) => {
  console.log('request for hello page');
  next();
}, (req, res) => {
  res.send('hello');
});

const one = (req, res, next) => {
  console.log('one');
  next();
}

const two = (req, res) => {
  console.log('two');
  res.send('hello');
}

router.get('/chain(.html)?', [one, two]);


module.exports = router;
