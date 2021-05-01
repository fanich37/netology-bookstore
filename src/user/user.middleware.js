const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const restrictedRouteMiddleware = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(403).render('not-allowed', {
      pageTitle: 'Not allowed',
      currentRoute: 'Not allowed',
    });
  }

  next();
};

exports.urlEncodedParser = urlEncodedParser;
exports.restrictedRouteMiddleware = restrictedRouteMiddleware;
