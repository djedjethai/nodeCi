const Buffer = require('safe-buffer').Buffer;
// we generate the session signature wich gonna confirm our cookieSession token
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    }
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    // le 'session=' + ... is just fix arbitrairement by the library
    const sig = keygrip.sign('session=' + session);

    return { session, sig };
}