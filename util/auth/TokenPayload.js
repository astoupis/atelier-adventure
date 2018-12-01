/**
 * A representation of a token payload that is going to be sent to the client side
 * This object is constructed from the User object, provided with the constructor,
 * Encoded as base64, combined with the header, then hashed, then combined with the
 * hash and header, then sent to the client (for more info, see jwt.io).
 * 
 * Note: This class is open for modification, if the token policy is changed
 *       When this happens, put your name in the authors, increment the version,
 *       replace the date and give a brief changelog.
 * @author wize
 * @version 0 (1 Dec 2018)
 */
class TokenPayload {
	constructor(user) {
		this.id = user._id;
		this.username = user.username;
	}
}

module.exports = TokenPayload;
