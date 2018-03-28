module.exports = {
    messages: {
        start: (ctx) => {
            return 'سلام ' + ctx.from.first_name + '!\n' + 'خوش اومدی!\n' + 'چه کاری از دستم برمیاد؟'
        },
        prayTimes: (times) => {
            return 'اوقات شرعی امروز:\n\n' +
                '<b>' + 'اذان صبح: ' + '</b>' + times.fajr + '\n' +
                '<b>' + 'طلوع خورشید: ' + '</b>' + times.sunrise + '\n' +
                '<b>' + 'اذان ظهر: ' + '</b>' + times.dhuhr + '\n' +
                '<b>' + 'غروب خورشید: ' + '</b>' + times.sunset + '\n' +
                '<b>' + 'اذان مغرب: ' + '</b>' + times.maghrib + '\n' +
                '<b>' + 'نیمه شب شرعی: ' + '</b>' + times.midnight
        }
    },
    actions: {
        today: 'today_owaghat',
        return: 'ret'
    }
};