const schedule = require('node-schedule');
const {inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');
const {PrayTimes} = require('../praytimes');

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
            schedule_azan(ctx);
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
            schedule_azan(ctx);
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
            schedule_azan(ctx);
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
            schedule_azan(ctx);
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
    schedule_azan_based_on_settings(ctx); // every time change  settings schedules must be change

    const rule = new schedule.RecurrenceRule();
    rule.hour = 1;
    rule.minute = 0;
    schedule.scheduleJob(ctx.from.id.toString(), rule, () => {
        schedule_azan_based_on_settings(ctx);
    });

    console.log(schedule.scheduledJobs);
};

let schedule_azan_based_on_settings = ctx => {
    let {city, method, coords, rawOffset, dstOffset} = ctx.session.default;
    let {sobh, zohr, maghreb} = ctx.session.settings.azan;
    let {fajr, dhuhr, maghrib} = new PrayTimes(method).getTimes(new Date(), coords, rawOffset, dstOffset);

    let sobh_name = ctx.from.id + ':sobh';
    let zohr_name = ctx.from.id + ':zohr';
    let maghreb_name = ctx.from.id + ':maghreb';

    if (schedule.scheduledJobs[sobh_name]) schedule.scheduledJobs[sobh_name].cancel();
    if (schedule.scheduledJobs[zohr_name]) schedule.scheduledJobs[zohr_name].cancel();
    if (schedule.scheduledJobs[maghreb_name]) schedule.scheduledJobs[maghreb_name].cancel();

    if (sobh) {
        let azan_name = 'صبح';
        schedule_on_time(ctx, fajr, sobh_name, azan_name, city);
    }

    if (zohr) {
        let azan_name = 'ظهر';
        schedule_on_time(ctx, dhuhr, zohr_name, azan_name, city);
    }

    if (maghreb) {
        let azan_name = 'مغرب';
        schedule_on_time(ctx, maghrib, maghreb_name, azan_name, city);
    }
};

let schedule_on_time = (ctx, time, schedule_name, azan_name, city) => {
    time = time.split(":");
    schedule.scheduleJob(schedule_name, {
        hour: time[0],
        minute: time[1]
    }, () => {
        ctx.replyWithHTML('<b>' + 'اذان ' + azan_name + ' به افق ' + city + '</b>');
    });
};