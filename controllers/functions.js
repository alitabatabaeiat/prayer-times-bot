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
    let {city, method, coords, rawOffset, dstOffset} = ctx.session.default_config;
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