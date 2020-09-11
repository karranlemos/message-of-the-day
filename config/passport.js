const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const users = require('../model/Users').getInstance();

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {usernameField: 'username'},
        async (username, password, done) => {
            const authData = await users.authenticateUser(username, password);

            if (!authData.authenticated) {
                if (authData.reason === 'internal error')
                    return done(err, false);
                return done(null, false, {
                    message: authData.message,
                    reason: authData.reason
                });
            }

            return done(null, authData.user);
        }
    ));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            var userdata = await users.getUser({id});
        }
        catch (err) {
            return done(err, false);
        }

        if (userdata.type !== 'success')
            return done(null, false, {message: 'Internal Error: user not serialized...'});
        
        return done(null, userdata.data);
    })
};