require('dotenv').config();
const Telegraf = require('telegraf');
const LocalSession = require('telegraf-session-local');
const {button, action} = require('./string');
const hearsCtrl = require('./controllers/hears');
const eventCtrl = require('./controllers/event');
const actionCtrl = require('./controllers/action');
const http = require('http');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((new LocalSession()).middleware());

bot.use((ctx, next) => {
    ctx.session = session_constructor(ctx);
    next(ctx);
});

bot.start(hearsCtrl.start);

// on
bot.on('message',(ctx, next) => {
    if (ctx.from.id !== parseInt(process.env.OWNER_ID))
        ctx.telegram.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
    next(ctx);
});
bot.on('location', eventCtrl.on_location);

// hears
bot.hears(button.go_home, hearsCtrl.go_home);
bot.hears(button.owghat, hearsCtrl.get_owghat);
bot.hears(button.settings.start, hearsCtrl.settings);
bot.hears(button.make_default, hearsCtrl.make_default);
bot.hears(button.another_city, hearsCtrl.another_city);

// action
bot.action(action.settings.azan.start, actionCtrl.settings.azan.start);
bot.action(action.settings.azan.sobh, actionCtrl.settings.azan.sobh);
bot.action(action.settings.azan.zohr, actionCtrl.settings.azan.zohr);
bot.action(action.settings.azan.maghreb, actionCtrl.settings.azan.maghreb);
bot.action(action.settings.azan.all, actionCtrl.settings.azan.all);
bot.action(action.return, actionCtrl.return);


bot.startPolling();

let session_constructor = (ctx) => {
    return Object.assign({}, {
        id: ctx.from.id,
        username: ctx.from.username,
        default: ctx.session.default || {},
        last_config: ctx.session.last_config || {},
        settings: ctx.session.settings || {azan: {}},
        last_message: ''
    });
};

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
}).listen(process.env.PORT || 8080);