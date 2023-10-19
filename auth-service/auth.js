// const { auth } = require("express-openid-connect")
// require("dotenv").config()

// const config = {
//     authRequired : false,
//     auth0Logout : true,
//     secret : process.env.SECRET,
//     baseURL: process.env.BASE_URL,
//     clientID : process.env.CLIENTID,
//     issuerBaseURL : process.env.ISSUER_BASE_URL
// }

// module.exports = auth(config)

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'awertyujnjhgfdfghj',
  baseURL: 'http://localhost:3005',
  clientID: 'wm3L8e0FqKCL9TS6Ho3Ol4ATA1iiYHFL',
  issuerBaseURL: 'https://dev-lq7m30jvn62zzyr4.us.auth0.com'
};

module.exports = auth(config)
