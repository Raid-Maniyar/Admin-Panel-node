const User = require('../models/admin-model');

const checkAuth = async (req, res, next) => {

    try {

        const userId = req.cookies.userId;

        if (!userId) {
            return res.redirect('/login');
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;

        next();

    } catch (err) {

        console.log(err);

        res.redirect('/login');

    }

};

module.exports = checkAuth;