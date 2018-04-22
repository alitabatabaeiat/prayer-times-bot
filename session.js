const debug = require('debug')('telegraf:session-mysql');
const mysql = require('promise-mysql');

let sessions = {};

class MySQLSession {
    constructor(options) {
        this.options = Object.assign({
            property: 'session',
            getSessionKey: (ctx) => {
                if (ctx.updateType === 'callback_query') {
                    ctx = ctx.update.callback_query.message
                }
                if (!ctx.from || !ctx.chat) {
                    return
                }
                return `${ctx.chat.id}:${ctx.chat.id}`
            },
            store: {}
        }, options);

        this.client = mysql.createPool(this.options)
    }

    getSessions() {
        this.client.query('SELECT * FROM sessions')
            .then((json) => {
                debug('select query', json);
                let session = {};
                if (json && json.length) {
                    try {
                        debug('JSON: ', json);
                        for (let raw of json) {
                            session = JSON.parse(unescape(raw.session));
                            sessions[raw.id] = session
                        }
                    } catch (error) {
                        debug('Parse session state failed', error)
                    }
                }
                return sessions
            });
        return x;
    }

    getSession(key) {
        if (sessions[key]) return {
            then: function (fn) {
                fn(sessions[key])
            }
        };
        let x = this.client.query('SELECT session FROM sessions WHERE id="' + key + '"')
            .then((json) => {
                debug('select query', json);
                let session = {};
                if (json && json.length) {
                    try {
                        debug('JSON: ', json);
                        session = JSON.parse(unescape(json[0].session));
                        debug('session state', session)
                    } catch (error) {
                        debug('Parse session state failed', error)
                    }
                }
                sessions[key] = session;
                return session
            });
        console.log(x);
        return x;
    }

    saveSession(key, session) {
        if (!session || Object.keys(session).length === 0) {
            debug('clear session');
            return this.client.query('DELETE FROM sessions WHERE id="' + key + '"')
        }

        debug('save session', session, 'key', key);

        const sessionString = escape(JSON.stringify(session));
        return this.client.query('INSERT INTO sessions(id,session) value("' + key + '","' + sessionString + '") ' +
            'on duplicate key update session="' + sessionString + '";')
    }

    middleware() {
        return (ctx, next) => {
            const key = this.options.getSessionKey(ctx);
            if (!key) {
                return next()
            }
            console.log(sessions);
            debug('session key %s', key);
            return this.getSession(key).then(() => {
                debug('session value', sessions[key]);
                Object.defineProperty(ctx, this.options.property, {
                    get: function () {
                        return sessions[key]
                    },
                    set: function (newValue) {
                        sessions[key] = Object.assign({}, newValue)
                    }
                });
                return next().then(() => {
                    return this.saveSession(key, sessions[key])
                })
            })
        }
    }
}

module.exports = MySQLSession;
