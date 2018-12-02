const jwt = require("jsonwebtoken");
const config = require("../../config");

const INVALID_TOKEN = "a.b.c";

/**
 * Performs an authentication of a token, given in the argument
 * If the argument is request, the token search goes in priority:
 * - Authorization header **(must have type `config.auth.type`, or will be rejected)**
 * - Cookie with name `config.auth.cookie`
 * @author wize
 * @version 0 (2 Dec 2018)
 * @param {string | Express.Request} tokenOrRequest the token string or the request, 
 *                                                        which contains token to be verified
 * @returns {Promise<Object>} a Promise with the payload object of the given token, 
 *                            which fails if the token is invalid
 */
function authenticate(tokenOrRequest) {
    if(typeof tokenOrRequest !== 'string') {
        if(tokenOrRequest.headers.authorization) {
            const auth = tokenOrRequest.headers.authorization.split(" ");
            tokenOrRequest = (auth[0] == config.auth.type) ? auth[1] : INVALID_TOKEN;
        } else if(tokenOrRequest.cookies[config.auth.cookie]) {
            tokenOrRequest = tokenOrRequest.cookies[config.auth.cookie];
        } else {
            tokenOrRequest = INVALID_TOKEN;
        }
    }
    return new Promise(function(resolve, reject) {
        jwt.verify(
            tokenOrRequest, 
            config.auth.secret, 
            function(err, decoded) {
                if(err) reject(err);
                resolve(decoded);
            }
        );
    });
}

module.exports = authenticate;
