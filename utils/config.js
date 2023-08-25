exports.PORT = process.env.PORT;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.NODE_ENV = process.env.NODE_ENV;

exports.JWT_SCERET_KEY = process.env.JWT_SCERET_KEY;
module.exports = {
    'facebookAuth': {
        'clientID':  '836379517801979', 
        'clientSecret':  '78ff0d06ab06270e4b0e2b3e3aadcd9f', 
        'callbackURL':  'http://localhost:8080/auth/facebook/callback'
    }
}