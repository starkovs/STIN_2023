const jwt = require('jsonwebtoken');

/**
 * Control jwt token and redirect to login page if token is not valid
 *
 * @param {req} //request
 * @param {res} //response
 * @return {next} // next middleware
 */
module.exports = function (req, res, next) {
    const token = req.cookies.token;
    jwt.verify(req.cookies.token, process.env.SECRET , function(err, decodedToken) {
        if(err) { 
            res.clearCookie('token');
            res.redirect('/login');  
        }
        else {
            req.userId = decodedToken.id;
            next();
        }
    });
};