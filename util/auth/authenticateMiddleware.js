module.exports = authenticateMiddleware;
const authenticate = require("./authenticate");

/**
 * The Express.js middleware implementation of login
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
function authenticateMiddleware(req, res, next) {
    req.auth = authenticate(req);
    next();
}