require('dotenv').config();
const Telegraf = require('telegraf');
const MySQLSession = require('telegraf-session-mysql');
const {button, action} = require('./string');
const commandCtrl = require('./controllers/command');
const hearsCtrl = require('./controllers/hears');
const eventCtrl = require('./controllers/event');
const actionCtrl = require('./controllers/action');

const bot = new Telegraf(process.env.BOT_TOKEN);

const session = new MySQLSession({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB
});

bot.use(session.middleware());

bot.use((ctx, next) => {
    console.log(ctx.from);
    if (ctx.from.id === parseInt(process.env.OWNER_ID))
        next(ctx);
    else {
        ctx.reply('بات در دسترس نیست!\nدر صورت در دسترس بودن بات شما رو با خبر میکنیم!');
        bot.telegram.sendMessage(process.env.OWNER_ID, 'کاربر @' + ctx.from.username + ' در حال استفاده از بات هست 😍');
    }
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
bot.action(action.start.send_location, actionCtrl.start.send_location);
bot.action(action.start.choose_city, actionCtrl.start.choose_city);
bot.action(action.start.province(), actionCtrl.start.province);
bot.action(action.start.city(), actionCtrl.start.city);


// get_owghat
bot.action(action.get_owghat, actionCtrl.get_owghat);
bot.action(action.another_city, actionCtrl.another_city);

// settings
bot.action(action.settings.start, actionCtrl.settings.start);
bot.action(action.settings.azan.start, actionCtrl.settings.azan.start);
bot.action(action.settings.azan.sobh, actionCtrl.settings.azan.sobh);
bot.action(action.settings.azan.zohr, actionCtrl.settings.azan.zohr);
bot.action(action.settings.azan.maghreb, actionCtrl.settings.azan.maghreb);
bot.action(action.settings.azan.all, actionCtrl.settings.azan.all);

// return
bot.action(action.return, actionCtrl.return);

bot.startPolling();