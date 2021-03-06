module.exports = {

    secret: 'followthelight', // @deprecated
    database: 'mongodb://localhost/atelier-adventure',

    auth: {
        type: 'Bearer',
        cookie: 'token',
        secret: 'followthelight',
        expirationInSeconds: 60 * 60 * 12, // 12h00m00s
    },

    https: {
        certificatePath: "./apache-selfsigned.crt",
        privateKeyPath: "./apache-selfsigned.key",
        useHTTP: true,
        useHTTPS: true
    }
};