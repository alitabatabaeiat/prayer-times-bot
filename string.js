module.exports = {
    messages: {
        start: (ctx) => {
            return 'سلام ' + ctx.from.first_name + '!\n' + 'خوش اومدی!\n' + 'چه کاری از دستم برمیاد؟'
        },
        specifyCity: 'شهر خود را مشخص کنید',
        owghatButton: 'اوقات شرعی',
        returnButton: 'بازگشت',
        basedOnLocationButton: 'براساس نقشه',
        sendYourLocation: 'با استفاده از دکمه زیر موقعیت مکانی خود را ارسال کنید',
        sendLocationButton: 'ارسال موقعیت مکانی',
        prayTimes: (times, city) => {
            return 'اوقات شرعی امروز ' + city + ':\n\n' +
                '<b>' + 'اذان صبح: ' + '</b>' + times.fajr + '\n' +
                '<b>' + 'طلوع خورشید: ' + '</b>' + times.sunrise + '\n' +
                '<b>' + 'اذان ظهر: ' + '</b>' + times.dhuhr + '\n' +
                '<b>' + 'غروب خورشید: ' + '</b>' + times.sunset + '\n' +
                '<b>' + 'اذان مغرب: ' + '</b>' + times.maghrib + '\n' +
                '<b>' + 'نیمه شب شرعی: ' + '</b>' + times.midnight
        }
    },
    actions: {}
};