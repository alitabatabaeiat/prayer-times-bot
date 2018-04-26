require('dotenv').config();
const Telegraf = require('telegraf');
const MySQLSession = require('./session');
const {state} = require('./state');
const {button, action} = require('./string');
const commandCtrl = require('./controllers/command');
const eventCtrl = require('./controllers/event');
const actionCtrl = require('./controllers/action');

const bot = new Telegraf(process.env.BOT_TOKEN);

const hearsCtrl = require('./controllers/hears')(bot);

const session = new MySQLSession({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB
});

// session.getSessions().then(sessions => {
//    for (let key in sessions) {
//        console.log(sessions[key])
//    }
// });

bot.use(session.middleware());

bot.use((ctx, next) => {
    ctx.session = session_constructor(ctx);

    if (ctx.from.id !== parseInt(process.env.OWNER_ID))
        bot.telegram.sendMessage(process.env.OWNER_ID, 'کاربر @' + ctx.from.username + ' در حال استفاده از بات هستش 😍');
    next(ctx);
});

bot.start(commandCtrl.start);

// on
bot.on('message', (ctx, next) => {
    if (ctx.from.id !== parseInt(process.env.OWNER_ID))
        bot.telegram.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
    next(ctx);
});

bot.on('location', eventCtrl.on_location);

// start
bot.hears(button.select_city, hearsCtrl.start.select_province);
bot.hears(button.provinces, hearsCtrl.start.select_city);
bot.hears(button.all_cities(), hearsCtrl.start.city_selected);
//
//
// get_owghat
bot.hears(button.get_owghat, hearsCtrl.get_owghat);
bot.hears(button.azan_notif.start, hearsCtrl.azan_notif.start);
bot.hears(button.change_city, hearsCtrl.change_city);

const azan_notif = {
    sobh: [button.azan_notif.sobh(true), button.azan_notif.sobh(false)],
    zohr: [button.azan_notif.zohr(true), button.azan_notif.zohr(false)],
    maghreb: [button.azan_notif.maghreb(true), button.azan_notif.maghreb(false)]
};
bot.hears(azan_notif.sobh, hearsCtrl.azan_notif.sobh);
bot.hears(azan_notif.zohr, hearsCtrl.azan_notif.zohr);
bot.hears(azan_notif.maghreb, hearsCtrl.azan_notif.maghreb);
// return
bot.hears(button.return, hearsCtrl.return);

bot.startPolling();

let session_constructor = ctx => {
    let s = ctx.session;
    return {
        id: ctx.from.id,
        username: ctx.from.username,
        default_config: s.default_config || {},
        azan_notif: s.azan_notif || {},
        settings: s.settings || {},
        state: s.state >= 0 ? s.state : -1
    };
};