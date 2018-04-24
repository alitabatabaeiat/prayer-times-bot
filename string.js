const {province, cities} = require('./iran');

module.exports = {
    message: {

        inactive: 'با عرض پوزش در حال حاضر غیرفعال!\n\nچه کمکی از من برمیاد؟', // dev

        start: (first_name) => {
            return 'سلام ' + first_name + '!\n' + 'خوش اومدی!\n' + 'برای اینکه بخوای از بات استفاده کنی اول باید یک موقعیت پیشفرض رو برای من مشخص کنی!\nموقعیت جغرافیاییت رو برای من ارسال کن یا یکی از شهر ها رو انتخاب کن!'
        },
        error: 'خطا! لطفا دوباره تلاش کنید.',
        // what_next: 'چیکار میتونم برات انجام بدم؟',
        home: 'در صفحه اصلی هستی!\nچه کاری ازم برات برمیاد؟',
        select_province: 'استان مورد نظر را انتخاب کنید.',
        select_city: 'شهر مورد نظر را انتخاب کنید.',
        pray_times: (times, city) => {
            return 'اوقات شرعی امروز ' + city + ':\n\n' +
                '<b>' + 'اذان صبح: ' + '</b>' + times.fajr + '\n' +
                '<b>' + 'طلوع خورشید: ' + '</b>' + times.sunrise + '\n' +
                '<b>' + 'اذان ظهر: ' + '</b>' + times.dhuhr + '\n' +
                '<b>' + 'غروب خورشید: ' + '</b>' + times.sunset + '\n' +
                '<b>' + 'اذان مغرب: ' + '</b>' + times.maghrib + '\n' +
                '<b>' + 'نیمه شب شرعی: ' + '</b>' + times.midnight + '\n\n' +
                'دیگه چه کاری میتونم برات انجام بدم؟'
        },
        change_city: 'شهر موردنظر را انتخاب کرده یا موقعیت جغرافیایی خود را برای من بفرستید!',
        azan_notif: {
            start: 'برای کدام یک از اذان ها میخوای اطلاع رسانی کنم؟',
            sobh: active => {
                return 'اطلاع رسانی برای <b>اذان صبح ' + `${is_active(!active)}` + ' شد.</b>'
            },
            zohr: active => {
                return 'اطلاع رسانی برای <b>اذان ظهر ' + `${is_active(!active)}` + ' شد.</b>'
            },
            maghreb: active => {
                return 'اطلاع رسانی برای <b>اذان مغرب ' + `${is_active(!active)}` + ' شد.</b>'
            }
        },
        settings: {
            start: 'خب! چه چیزی رو میخوای تنظیم کنی؟',
            ghaza: {
                start: '',
            }
        }
    },
    button: {
        send_location: '🗺 ارسال موقعیت',
        select_city: '🏙 انتخاب شهر',
        provinces: province,
        all_cities: () => {
            let array = [];
            for (let i = 0; i < province.length; i++) {
                let city = cities(i);
                for (c in city)
                    if (city.hasOwnProperty(c))
                        array.push(c);
            }
            return array;
        },
        get_owghat: '🕌 اوقات شرعی',
        azan_notif: {
            start: '🕋 اطلاع رسانی اذان',
            sobh: active => {
                return 'صبح: ' + is_active(active)
            },
            zohr: active => {
                return 'ظهر: ' + is_active(active)
            },
            maghreb: active => {
                return 'مغرب: ' + is_active(active)
            },
            all: active => {
                return (is_active(!active) + ' کردن همه')
            }
        },
        go_home: '🏠 خانه',
        settings: {
            start: '⚙️ تنظیمات',
            ghaza: {
                start: 'یادآوری نماز'
            },
        },
        make_default: '💾 ذخیره اطلاعات',
        change_city: '🏙 شهر دیگر',
        return: '🔙 بازگشت'
    },
    action: {},
    equals: {
        sobh: 'صبح',
        zohr: 'ظهر',
        maghreb: 'مغرب',
        active: 'فعال',
        inactive: 'غیرفعال'
    },

};

let is_active = active => {
    return (active ? module.exports.equals.active : module.exports.equals.inactive);
};