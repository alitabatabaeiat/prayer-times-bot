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

bot.hears(['صبح: فعال', 'صبح: غیرفعال'], hearsCtrl.azan_notif.sobh);
bot.hears(['ظهر: فعال', 'ظهر: غیرفعال'], hearsCtrl.azan_notif.zohr);
bot.hears(['مغرب: فعال', 'مغرب: غیرفعال'], hearsCtrl.azan_notif.maghreb);
//
// // settings
// bot.action(action.settings.start, actionCtrl.settings.start);
//
// bot.action(action.settings.azan.start, actionCtrl.settings.azan.start);
// bot.action(action.settings.azan.sobh, actionCtrl.settings.azan.sobh);
// bot.action(action.settings.azan.zohr, actionCtrl.settings.azan.zohr);
// bot.action(action.settings.azan.maghreb, actionCtrl.settings.azan.maghreb);
// bot.action(action.settings.azan.all, actionCtrl.settings.azan.all);
//
// bot.action(action.settings.ghaza.start, actionCtrl.settings.ghaza.start);
//
//
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
        settings: s.settings || {
            azan: {},
            ghaza: {}
        },
        state: s.state >= 0 ? s.state : -1
    };
};