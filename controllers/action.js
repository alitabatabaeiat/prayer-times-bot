const schedule = require('node-schedule');
const {inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');

exports.settings = {
    azan: {
        start: ctx => {
            let {sobh, zohr, maghreb, all} = ctx.session.settings.azan;
            ctx.editMessageText(message.settings.azan.start, create_keyboard(inline_keyboard.settings.azan([sobh, zohr, maghreb, all]), {inline_keyboard: true}));
            ctx.session.last_message = message.settings.azan.start;
        },
        sobh: ctx => {
            let {sobh} = ctx.session.settings.azan;
            ctx.editMessageText(message.settings.azan.sobh(sobh), create_keyboard(inline_keyboard.return, {
                inline_keyboard: true,
                extra: {parse_mode: 'HTML'}
            }));
            ctx.session.last_message = message.settings.azan.sobh;
            ctx.session.settings.azan.sobh = !ctx.session.settings.azan.sobh && true;
            ctx.session.settings.azan.all = check_all(ctx.session.settings.azan);
            if (!ctx.session.settings.azan.scheduled) {
                schedule_azan(ctx);
                ctx.session.settings.azan.scheduled = true;
            }
        },
        zohr: ctx => {
            let {zohr} = ctx.session.settings.azan;
            ctx.editMessageText(message.settings.azan.zohr(zohr), create_keyboard(inline_keyboard.return, {
                inline_keyboard: true,
                extra: {parse_mode: 'HTML'}
            }));
            ctx.session.last_message = message.settings.azan.zohr;
            ctx.session.settings.azan.zohr = !ctx.session.settings.azan.zohr && true;
            ctx.session.settings.azan.all = check_all(ctx.session.settings.azan);
        },
        maghreb: ctx => {
            let {maghreb} = ctx.session.settings.azan;
            ctx.editMessageText(message.settings.azan.maghreb(maghreb), create_keyboard(inline_keyboard.return, {
                inline_keyboard: true,
                extra: {parse_mode: 'HTML'}
            }));
            ctx.session.last_message = message.settings.azan.asr;
            ctx.session.settings.azan.maghreb = !ctx.session.settings.azan.maghreb && true;
            ctx.session.settings.azan.all = check_all(ctx.session.settings.azan);
        },
        all: ctx => {
            let {all} = ctx.session.settings.azan;
            ctx.editMessageText(message.settings.azan.all(all), create_keyboard(inline_keyboard.return, {
                inline_keyboard: true,
                extra: {parse_mode: 'HTML'}
            }));
            ctx.session.last_message = message.settings.azan.all;
            let new_all = !ctx.session.settings.azan.all && true;
            ctx.session.settings.azan = Object.assign(ctx.session.settings.azan, {
                sobh: new_all,
                zohr: new_all,
                maghreb: new_all,
                all: new_all
            });
        }
    },
    ghaza: {}
};

exports.return = ctx => {
    ctx.editMessageText('done'); // for test
};

let check_all = azan => {
    let {sobh, zohr, maghreb} = azan;
    return sobh && zohr && maghreb;
};

let schedule_azan = ctx => {
    const rule = new schedule.RecurrenceRule();
    schedule.scheduleJob(rule, () => {

    });
};