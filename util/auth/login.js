const jwt = require("jsonwebtoken");
const User = require("../../models").User;
const bcrypt = require('bcrypt');
const SECRET = require('../../config').auth.secret;
const TOKEN_EXPIRATION_IN_SECONDS = require('../../config').auth.expirationInSeconds;
const NoSuchUserError = require("./AuthErrors").NoSuchUserError;
const WrongPasswordError = require("./AuthErrors").WrongPasswordError;

/**
 * Given a login credential and a password:
 * - checks if the user with the given credential exists,
 * - checks, whether the given password is the true user's password
 * - generates a token, if two previous points succeeded, 
 *   else creates an error (without throwing)
 * @author gary
 * @author wize
 * @version 0 (1 Dec 2018)
 * @param {string} loginCredential username or email
 * @param {string} password password
 * @returns {Promise<string> | Promise<Error>} the promise to return a token string, or an Error
 */
function login (loginCredential, password) {
    /* ---- STAGE 1: FETCHING USER FROM DB ---- */
    User.findMany({ $or: [
        { username: loginCredential },
        { email: loginCredential }
    ]})
    /* ---- STAGE 2: CHECKING IF PASSWORD IS CORRECT ---- */
    .then(function(users) {
        if(users.length == 0) return new NoSuchUserError();
        return Promise.all([
            users[0],
            bcrypt.compare(password, user.passwordHash),
        ]);
    })
    /* ---- STAGE 3: GENERATING TOKEN ---- */
    .then(function([user, passwordIsCorrect]) {
        if(passwordIsCorrect) {
            return jwt.sign(
                new TokenPayload(user),
                { expiresIn: TOKEN_EXPIRATION_IN_SECONDS }
            );
        } else return new WrongPasswordError();
    });
}

module.exports = login;
