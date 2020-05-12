const mongoose = require('mongoose');
// set redis
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
// if i want to clean redis memory: client.flushall()
// set the redis client to return promise
const util = require('util');
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    console.log('I AM ABOUT TO RUN A QUERRY');
    if (!this.useCache) {
        console.log('SKIP-CACHE');
        return exec.apply(this, arguments);
    }

    // this est une methode des instances de mongoose, 
    // this. fait referance a la methode(Query) qui est appele.
    console.log(this.getQuery());
    // one more method de mongoose. permet de verifier the called collection
    console.log(this.mongooseCollection.name);

    // we don t want to modify the object itself, so we assign(), 
    // or could use the spraid operator to copy/clone the object
    // need to stringify as redis store only strings or numbers
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name 
    }))
    
    // SEE IF WE HAVE A KEY
    const cacheValue = await client.get(key)


    // IF WE DO, RETURN THAT
    if (cacheValue) {
        console.log('IN_CACHE');
       const doc = JSON.parse(cacheValue);

        // need to add the mongoose model, 
        // for the query to ne executed like it come from mongoose
        return Array.isArray(doc) 
            ? doc.map(d => new this.model(d))
            : new this.model(doc);      
    }

    // OTHERWISE ISSUE A QUERY
    // apply() permet de passer un argument
    const result = await exec.apply(this, arguments);

    client.set(key, JSON.stringify(result), '[X', 10);
    
    console.log('FROM_DB');
    return result;
}


/*const cachedBlogs = await client.get(req.user.id)

    if (cachedBlogs) {
      console.log('SERVING_FROM_CACHE');
      // console.log(cachedBlogs);
      return res.send(JSON.parse(cachedBlogs));
    }

    // console.log(req.user.id);
    const blogs = await Blog.find({ _user: req.user.id });
    // console.log(blogs);

    console.log('SERVING_FROM_DB');
    res.send(blogs);
    client.set(req.user.id, JSON.stringify(blogs));
*/