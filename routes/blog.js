const express = require('express');

const db = require('../data/database')

const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/posts');
});

router.get('/posts', function(req, res) {
  res.render('posts-list');
});

router.get('/new-post', async function(req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();
  // establishing access to the authors collection
  // '.toArray' get all the authors documents from the collection as an array of data

  res.render('create-post', { authors: authors });
});

module.exports = router;