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
    },

    validateRegistration: (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        if (username.length < 6)
            return res.status(400).json({
                message: "Username must have at least 6 characters"
            });
        if (/[^a-zA-Z0-9\-_]/.test(username))
            return res.status(400).json({
                message: "Username must only have english letters, digits, '-' and '_'"
            });
        
        if (password.length < 6)
            return res.status(400).json({
                message: "Password mut have at least 6 characters"
            });
        if (/[^a-zA-Z0-9\-_\*\#\$]/.test(password))
            return res.status(400).json({
                message: "Password must only have english letters, digits, '-', '_', '*', '#' and '$'"
            });

        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
            return res.status(400).json({
                message: "Email invalid"
            });
        
        next();
    }
}