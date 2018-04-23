const {state} = require('../state');
const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');

exports.start = ctx => {
    ctx.reply(message.start(ctx.from.first_name),
        create_keyboard(keyboard.location, {resize_keyboard: true}));
    ctx.session.state = state.start;
};