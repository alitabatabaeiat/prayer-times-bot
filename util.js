const schedule = require('node-schedule');
const {PrayTimes} = require('./praytimes');
const {state} = require('./state');
const {keyboard, inline_keyboard, create_keyboard} = require('./keyboard');
const {message, equals} = require('./string');


exports.schedule_azan_notif = (bot, ctx) => {
    exports.schedule_azan_based_on_session(bot, ctx.session); // every time change  settings schedules must be change

    const rule = new schedule.RecurrenceRule();
    rule.hour = 1;
    rule.minute = 0;
    schedule.scheduleJob(ctx.from.id.toString(), rule, () => {
        exports.schedule_azan_based_on_session(bot, ctx.session);
    });
};

exports.schedule_azan_based_on_session = (bot, session) => {
    let {city, method, coords, rawOffset, dstOffset} = session.default_config;
    let {fajr, dhuhr, maghrib} = new PrayTimes(method).getTimes(new Date(), coords, rawOffset, dstOffset);

    schedule_one_azan_notif(bot, 'sobh', fajr, session);
    schedule_one_azan_notif(bot, 'zohr', dhuhr, session);
    schedule_one_azan_notif(bot, 'maghreb', maghrib, session);
};

const schedule_one_azan_notif = (bot, time_name, time, session) => {
    const name = `${session.id}:${time_name}`;
    const azan = session.azan_notif[time_name];
    const city = session.default_config.city;

    if (schedule.scheduledJobs[name])
        schedule.scheduledJobs[name].cancel();

    if (azan)
        schedule_on_time(bot, time, name, equals[time_name], city);
};

const schedule_on_time = (bot, time, schedule_name, azan_name, city) => {
    time = time.split(":");
    schedule.scheduleJob(schedule_name, {
        hour: time[0],
        minute: time[1]
    }, () => {
        bot.telegram.replyWithHTML('<b>' + 'اذان ' + azan_name + ' به افق ' + city + '</b>');
    });
};

exports.hears_azan_notif = (bot, ctx, time_name) => {
    ctx.session.azan_notif[time_name] = ctx.message.text.search(equals.inactive) === -1;
    ctx.replyWithHTML(message.azan_notif[time_name](ctx.session.azan_notif.sobh),
        create_keyboard(keyboard.azan_notif.start(ctx.session.azan_notif), {resize_keyboard: true}));
    exports.schedule_azan_notif(bot, ctx);
    ctx.session.state = state.azan_notif;
};