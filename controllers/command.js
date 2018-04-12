const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');

exports.start = ctx => {
    ctx.reply(message.start(ctx.from.first_name), create_keyboard(inline_keyboard.start, {inline_keyboard: true}))
};