const bcrypt = require('bcrypt');

const Database = require('./helpers/database');

const table = 'users';

var usersSingleton;

class Users {
    
    constructor() {
        // throws async exception
        this.db = Database.getInstance();
    }

    getUser(identifiersProvided) {
        // throws exception if no legal identifier is provided
        const identifiersValues = this.getIdentifiersObject(identifiersProvided, true);
        const numberOfIdentifiers = Object.keys(identifiersValues).length;

        return new Promise((resolve, reject) => {
            this.db.query(
                `SELECT id, username, email, password FROM ?? WHERE ${Array(numberOfIdentifiers).fill('?? = ?').join(' OR ')}`,
                [table, ...this.turnObjectTo1dArray(identifiersValues)],
                (err, rows) => {
                    if (err) 
                        return reject(err);
                    if (rows.length === 0)
                        return resolve({
                            type: 'error',
                            data: `User doesn't exist...`
                        });
                    return resolve({
                        type: 'success',
                        data: rows[0]
                    });
                }
            );
        });
    }

    registerUser(username, email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                var hashedPassword = await bcrypt.hash(password, 10);
            }
            catch {
                return reject("Couldn't hash password");
            }

            this.db.query(
                'INSERT INTO ?? (username, password, email) VALUES (?, ?, ?)',
                [table, username, hashedPassword, email],
                (err, data) => {
                    if (err)
                        return reject(err);
                    return resolve({
                        type: 'success'
                    });
                }
            );
        });
    }

    async authenticateUser(username, password) {        
        try {
            var userData = await this.getUser({username: username});
        }
        catch (err) {
            return {
                authenticated: false,
                reason: 'internal error',
                error: err,
                message: 'Internal Server Error'
            };
        }

        if (userData.type === 'error') return {
            authenticated: false,
            reason: 'username',
            message: 'User not found'
        };
        
        if (!bcrypt.compareSync(password, userData.data.password)) return {
            authenticated: false,
            reason: 'password',
            message: 'Password incorrect'
        };

        return {
            authenticated: true,
            user: userData.data
        };
    }

    
    
    getIdentifiersObject(identifiersProvided, exceptionIfEmpty=false) {
        if (typeof identifiersProvided === 'string')
            return { username: identifiersProvided };
        const identifiers = ['username', 'email', 'id'];
        const identifiersValues = {};
        for (const identifier of identifiers)
            if (identifiersProvided[identifier])
                identifiersValues[identifier] = identifiersProvided[identifier];
        
        if (Object.keys(identifiersValues).length === 0 && exceptionIfEmpty)
            throw `At least one identifier in ${identifiers.join(', ')} must be provided...`;

        return identifiersValues;
    }

    turnObjectTo1dArray(obj) {
        const simpleArray = [];
        for (const [key, value] of Object.entries(obj))
            simpleArray.push(key, value);
        return simpleArray;
    }



    static getInstance() {
        if (!usersSingleton)
            usersSingleton = new Users()
        return usersSingleton;
    }
}

module.exports = Users;