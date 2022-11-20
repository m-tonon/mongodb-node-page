const express = require('express');

const mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
  const posts = await db
    .getDb()
    .collection('posts')
    .find({})
    .project({ title: 1, summary: 1, 'author.name': 1 })
    .toArray();
  res.render('posts-list', { posts: posts });
});

router.get('/new-post', async function (req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();
  // establishing access to the authors collection
  // '.toArray' get all the authors documents from the collection as an array of data

  res.render('create-post', { authors: authors });
});

router.post('/posts', async function (req, res) {
  const authorId = new ObjectId(req.body.author.trim());
  // holds the object id based on the id submited
  //'.trim()' removes the extra blank space - getting error w/o it
  const author = await db
    .getDb()
    .collection('authors')
    .findOne({ _id: authorId });
  // filter by the id set on the page

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId, //this submit the value of the option on 'create-post'
      name: author.name, // getting the name from the const author in the filter object
      email: author.email,
    },
  };

  const result = await db.getDb().collection('posts').insertOne(newPost);
  //this create the new post data on mongodb

  console.log(result);
  res.redirect('/posts');
});

router.get('/posts/:id', async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) }, { summary: 0 }); //summary will be exclude from query

  if (!post) {
    return res.status(404).render('404');
  }

  post.easyDate = post.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  post.date = post.date.toISOString(); // gives a string version of the date

  res.render('post-detail', { post: post });
});

router.get('/posts/:id/edit', async function (req, res) {
  const postId = req.params.id;
  const posts = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) }, {title:1, summary:1, body: 1});

  if (!posts) {
    return res.status(404).render('404');
  }

  res.render('update-post', { post: posts });
});

router.post('/posts/:id/edit', async function (req, res) {
  const postId = new ObjectId(req.params.id);
 
  const result = await db.getDb().collection('posts').updateOne(
    { _id: postId },
    {
      $set: {
        title: req.body.title,
        summary: req.body.summary,
        body: req.body.content,
      }
    }
  );

  res.redirect('/posts');
});

module.exports = router;
