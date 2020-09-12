const mysql = require('mysql');
const url = require('url');

var dbSingleton;

var dbValues;

class Database {    
    constructor() {        
        this.connectionPool = mysql.createPool(Database.getCredentials());
    }

    query(sql, params, callback=undefined) {
        if (!callback) {
            callback = params;
            params = [];
        }
        this.connectionPool.query(sql, params, callback);
    }

    
    
    static getInstance() {
        if (!dbSingleton)
            dbSingleton = new Database();
        return dbSingleton;
    }

    static getCredentials() {
        if (!dbValues)
            dbValues = Database.loadCredentials();
        return dbValues;
    }

    static loadCredentials() {
        const defaultCredentials = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'message_of_the_day'
        }

        if (!process.env.CLEARDB_DATABASE_URL)
            return defaultCredentials;
        
        const urlCredentials = new url.URL(process.env.CLEARDB_DATABASE_URL);

        return {
            host: urlCredentials.host,
            user: urlCredentials.username,
            password: urlCredentials.password,
            database: urlCredentials.pathname.substr(1)
        };
    }
}

module.exports = Database;