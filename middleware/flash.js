// Flash middleware — reads ?error=... and ?success=... query params
// and exposes them as res.locals so every EJS view can render them.
const flash = (req, res, next) => {
    res.locals.flashError = req.query.error || null;
    res.locals.flashSuccess = req.query.success || null;
    next();
};

module.exports = flash;
