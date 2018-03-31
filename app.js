require('dotenv').config();
const Telegraf = require('telegraf');
const LocalSession = require('telegraf-session-local');
const {buttons} = require('./string');
const hearsCtrl = require('./controllers/hears');
const eventCtrl = require('./controllers/event');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((new LocalSession({ database: 'example_db.json' })).middleware());

bot.use((ctx, next) => {
    ctx.session = {
        id: ctx.from.id,
        username: ctx.from.username,
        default: ctx.session.default || {},
        last_config: ctx.session.last_config || {}
    };
    next(ctx);
});

bot.start(hearsCtrl.start);

bot.on('message',(ctx, next) => {
    if (ctx.from.id !== parseInt(process.env.OWNER_ID))
        ctx.telegram.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
    next(ctx);
});

bot.hears(buttons.go_home, hearsCtrl.go_home);
bot.hears(buttons.owghat, hearsCtrl.get_owghat);
bot.hears(buttons.make_default, hearsCtrl.make_default);
bot.hears(buttons.another_city, hearsCtrl.another_city);

bot.on('location', eventCtrl.on_location);

bot.startPolling();