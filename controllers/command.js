const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');

exports.start = ctx => {
    ctx.session = session_constructor(ctx);
    ctx.reply(message.start(ctx.from.first_name), create_keyboard(inline_keyboard.start, {inline_keyboard: true}))
};

let session_constructor = ctx => {
    return Object.assign({}, {
        id: ctx.from.id,
        username: ctx.from.username,
        default_config: {},
        settings: {
            azan: {},
            ghaza: {}
        },
        current_action: ''
    });
};
