const Database = require('./database');

const table = 'users';

var usersSingleton;

class Users {
    
    constructor() {
        // throws async exception
        this.db = Database.getInstance();

        this.checkTable();
    }

    checkTable() {
        this.db.query(
            `SHOW TABLES LIKE '${table}'`,
            (err, results) => {
                if (err)
                    throw `Could not check '${table}'...\n\n${err}`;
                if (results.length === 0)
                    throw `Table ${table} doesn't exist.`;
            }
        );
    }

    static getInstance() {
        if (!usersSingleton)
            usersSingleton = new Users()
        return usersSingleton;
    }
}

module.exports = users;