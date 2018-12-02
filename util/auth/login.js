const jwt = require("jsonwebtoken");
const User = require("../../models").User;
const bcrypt = require('bcrypt');
const SECRET = require('../../config').auth.secret;
const TOKEN_EXPIRATION_IN_SECONDS = require('../../config').auth.expirationInSeconds;
const NoSuchUserError = require("./AuthErrors").NoSuchUserError;
const WrongPasswordError = require("./AuthErrors").WrongPasswordError;
const TokenPayload = require("./TokenPayload");

/**
 * Given a login credential and a password:
 * - checks if the user with the given credential exists,
 * - checks, whether the given password is the true user's password
 * - generates a token, if two previous points succeeded, 
 *   else creates an error (without throwing)
 * @author banane54
 * @author wize
 * @version 0 (1 Dec 2018)
 * @param {string} loginCredential username or email
 * @param {string} password password
 * @returns {Promise<string>} the promise to return a token string, which fails with an {Error}, 
 *                            if the token cannot be given (e.g. when wrong password)
 */
function login (loginCredential, password) {
    /* ---- STAGE 1: FETCHING USER FROM DB ---- */
    return User.findOne({ $or: [
        { username: loginCredential },
        { email: loginCredential }
    ]}).exec()
    /* ---- STAGE 2: CHECKING IF PASSWORD IS CORRECT ---- */
    .then(function(user) {
        if(!user) return user = new NoSuchUserError();
        return Promise.all([
            user,
            bcrypt.compare(password, user.passwordHash),
        ]);
    })
    /* ---- STAGE 3: GENERATING TOKEN ---- */
    .then(function([user, passwordIsCorrect]) {
        return new Promise(function(resolve, reject) {
            if(passwordIsCorrect) {
                jwt.sign(
                    new TokenPayload(user), 
                    SECRET, 
                    { expiresIn: TOKEN_EXPIRATION_IN_SECONDS },
                    function(error, token) {
                        if(error) reject(error);
                        resolve(token);
                    }
                );
            } else reject(new WrongPasswordError());
        });
    });
}

module.exports = login;
