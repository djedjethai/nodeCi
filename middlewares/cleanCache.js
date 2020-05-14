const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    // in Express a middleware do not allow us to execute following functions then come back
    // BUT we can use this tricks which works well.

    // that is make sure we call the next function (wich here is the router handler)
    // we await it to be done
    await next();

    // then we come back to execute these one
    clearHash(req.user.id);
}