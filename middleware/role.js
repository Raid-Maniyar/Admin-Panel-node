// Role-based access guards
// Roles: 'Admin' > 'Manager' > 'User'

const MANAGER_AND_ABOVE = ['Admin', 'Manager'];

/** Only Admin can pass */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') return next();
    res.redirect('/?error=You+don%27t+have+permission+to+access+that+page');
};

/** Manager and Admin can pass */
const requireManager = (req, res, next) => {
    if (req.user && MANAGER_AND_ABOVE.includes(req.user.role)) return next();
    res.redirect('/?error=You+don%27t+have+permission+to+access+that+page');
};

module.exports = { requireAdmin, requireManager };
