module.exports = {
    message: {
        start: (first_name) => {
            return 'سلام ' + first_name + '!\n' + 'خوش اومدی!\n' + 'چه کاری از دستم برات برمیاد؟'
        },
        home: 'در صفحه اصلی هستی!\nچه کاری ازم برات برمیاد؟',
        specify_city: 'شهر خود را مشخص کنید',
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
        saved: 'اطلاعات ذخیره شد',
        settings: {
            start: 'خب! چه چیزی رو میخوای تنظیم کنی؟',
            azan: {
                start: 'برای کدام یک از اذان ها میخوای اطلاع رسانی کنم؟',
                sobh: active => {
                    return 'اطلاع رسانی برای اذان صبح ' + `<b>${is_active(!active)}</b>` + ' شد'
                },
                zohr: active => {
                    return 'اطلاع رسانی برای اذان ظهر ' + `<b>${is_active(!active)}</b>` + ' شد'
                },
                maghreb: active => {
                    return 'اطلاع رسانی برای اذان مغرب ' + `<b>${is_active(!active)}</b>` + ' شد'
                },
                all: active => {
                    return 'اطلاع رسانی برای تمام اذان ها ' + `<b>${is_active(!active)}</b>` + ' شد.'
                },
            },
            ghaza: {
                start: '',
            }
        }
    },
    button: {
        go_home: '🏠 خانه',
        owghat: '🕌 اوقات شرعی',
        settings: {
            start: '⚙️ تنظیمات',
            azan: {
                start: 'اطلاع رسانی اذان',
                sobh: active => {
                    return 'صبح: ' + is_active(active)
                },
                zohr: active => {
                    return 'ظهر: ' + is_active(active)
                },
                maghreb: active => {
                    return 'عصر: ' + is_active(active)
                },
                all: active => {
                    return (is_active(!active) + ' کردن همه')
                }
            },
            ghaza: 'یادآوری نماز',
        },
        send_location: '🗺 ارسال موقعیت',
        choose_city: '🏙 انتخاب شهر',
        make_default: '💾 ذخیره اطلاعات',
        another_city: '🏙 شهر دیگر',
        return: 'بازگشت'
    },
    action: {
        settings: {
            azan: {
                start: 'notif_azan',
                sobh: 'azan_sobh',
                zohr: 'azan_zohr',
                maghreb: 'azan_maghreb',
                all: 'azan_all'
            },
            ghaza: 'remind_ghaza',
        },
        return: 'ret'
    },
    equals: {
        sobh: 'صبح',
        zohr: 'ظهر',
        maghreb: 'مغرب'
    }
};

let is_active = active => {
    return (active ? 'فعال' : 'غیرفعال');
};