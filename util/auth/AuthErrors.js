
/**
 * A general authentication error
 * @author wize
 * @version 0 (1 Dec 2018)
 */
class AuthError extends Error {
    static get DEFAULT_MESSAGE() {
        return "There was an error during the authentication process";
    }

    constructor(message = AuthError.DEFAULT_MESSAGE) {
        super("AUTH ERROR: " + message);
    }
}

/**
 * An error, which occurs, if the auth system is unable to find the user in the database
 * @author wize
 * @version 0 (1 Dec 2018)
 */
class NoSuchUserError extends AuthError {
    constructor() {
        super("The given login credentials do not belong to any of the accounts");
    }
}

/**
 * An error, which occurs, if the auth system has found that the user's password is wrong
 * @author wize
 * @version 0 (1 Dec 2018)
 */
class WrongPasswordError extends AuthError {
    constructor() {
        super("The given by authorization password was wrong");
    }
}

module.exports = {
    "AuthError" : AuthError,
    "NoSuchUserError" : NoSuchUserError,
    "WrongPasswordError" : WrongPasswordError,
};