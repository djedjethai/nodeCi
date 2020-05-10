const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function() {
    console.log('I AM ABOUT TO RUN A QUERRY');

    // this est une methode des instances de mongoose, 
    // this. fait referance a la methode(Query) qui est appele.
    console.log(this.getQuery());
    // one more method de mongoose. permet de verifier the called collection
    console.log(this.mongooseCollection.name);

    // we don t want to modify the object itself, so we assign(), 
    // or could use the spraid operator to copy/clone the object
    const key = Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name 
    })
    console.log(key);

    // apply() permet de passer un argument
    return exec.apply(this, arguments);
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