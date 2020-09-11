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
    },

    ensureCredentialsAvailable: (credentials) => {
        return (req, res, next) => {
            for (let [name, nonEmpty] of Object.entries(credentials)) {
                if (req.body[name] === undefined)
                    return res.status(400).json({
                        message: `'${name}' must be provided`
                    });
                
                if (nonEmpty && req.body[name] === '')
                    return res.status(400).json({
                        message: `'${name}' cannot be empty`
                    });
            }
            return next();
        };
    }
}