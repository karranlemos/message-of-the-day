module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        return res.status(401).json({
            message: 'Cannot access this route while unauthenticated.'
        });
    },
    ensureNotAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated())
            return next();
        return res.status(403).json({
            message: 'Cannot access this route while authenticated.'
        });
    }
}