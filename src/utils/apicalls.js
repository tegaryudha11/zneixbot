const fetch = require('node-fetch');
const baseDiscord = 'https://discordapp.com/api';
const agent = 'zneixbot Project: https://github.com/zneix/zneixbot';
exports.getDiscordUser = async function(client, id){
    //custom query getting partial user profile, used by commands like user.js, avatar.js, etc...
    let response = await fetch(`${baseDiscord}/users/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bot ${client.token}`, 'User-Agent': agent }
    }).then(c => c.json());
    if (!response.id) return null; //escape on wrong user (all valid users should have their ID field returned)
    //hard fix for non-bot users
    if (!response.bot) response.bot = false;
    return response;
}