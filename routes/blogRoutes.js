const mongoose = require('mongoose');
const redis = require('redis');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
const util = require('util');
client.get = util.promisify(client.get);

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    let cachedBlogs = null;
    // if data cached in redis
    // as we declared the util.promisify, 
    // client.get do not return a callBack any more but a Promise
    // so we can use aysnc await
    cachedBlogs = await client.get(req.user.id)
    // if no data in cache, query db
    if(cachedBlogs === null) {
      console.log('SERVING_FROM_DB');
      cachedBlogs = await Blog.find({ _user: req.user.id });
    }
    // save data in cache and return
    client.set(req.user.id, JSON.stringify(cachedBlogs))
    res.send(JSON.parse(cachedBlogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
