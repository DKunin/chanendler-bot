'use strict';

//https://oauth2-server.readthedocs.io/en/latest/model/spec.html
//https://github.com/oauthjs/express-oauth-server/blob/master/examples/mongodb/model.js
const express = require('express');
const app = express();

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
// var UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');
const premodel = require('./model');
const model = new premodel();
const oauth = new OAuth2Server({
    model: model,
    allowBearerTokensInQueryString: true
});
console.log(oauth);

// let request = new Request({
//     method: 'GET',
//     query: {},
//     headers: { Authorization: 'Bearer foobar' }
// });

// let response = new Response({
//     headers: {}
// });

// oauth.authenticate(request, response)
//   .then((token) => {
//     // The request was successfully authenticated.
//   })
//   .catch((err) => {
//     // The request failed authentication.
//   });
//
//

var handleResponse = function(req, res, response) {
    if (response.status === 302) {
        var location = response.headers.location;
        delete response.headers.location;
        res.set(response.headers);
        res.redirect(location);
    } else {
        res.set(response.headers);
        res.status(response.status).send(response.body);
    }
};

const authorize = async function(req, res, next) {
    var request = new Request(req);
    var response = new Response(res);
    const code = await oauth.authorize(request, response);
    res.locals.oauth = { code: code };
    // if (options.continueMiddleware) {
    //     return next();
    // }
    handleResponse.call(this, req, res, response);
    // handleError.call(this, e, req, res, response, next);
};

app.use(async function(req, res, next) {
    await authorize(req, res, next);
});

app.get('/', function(req, res) {
    res.send('hello world');
});

app.listen(3131);
