module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        return res.redirect('/');
    },
    ensureNotAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated())
            return next();
        return res.redirect('/dashboard');
    }
}