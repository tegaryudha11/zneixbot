const enmap = require('enmap');
const fs = require('fs');
let aliases = {
    "%": ["percent", "procent"],
    "8ball": ["ask"],
    "about": ["info", "botinfo"],
    "addemote": ["addemoji", "createemote", "createemoji"],
    "avatar": ["awatar", "pfp"],
    "coinflip": ["cf"],
    "color": ["kolor"],
    "config": ["cfg"],
    "currency": ["curr", "money"],
    "dns": ["getip"],
    "emote": ["emoji", "showemote"],
    "feedback": ["devmsg"],
    "help": ["h", "commands", "pomoc", "komendy"],
    "isbanned": ["isban", "checkban"],
    "lenny": ["lennyface"],
    "leaderboard": ["levels", "lvls"],
    "math": ["calc", "calculate"],
    "ping": ["uptime"],
    "role": ["roles"],
    "rps": ["rockpaperscissors"],
    "server": ["serverinfo"],
    "snowflake": ["sf", "discordid"],
    "temperature": ["temp"],
    "user": ["userinfo", "lookup", "whois"],
    "kick": ["yeet"],
    "purge": ["clean", "clear", "prune"],
    "rank": ["level", "lvl"],
    "region": ["serverregion"],
    "unban": ["pardon"],
    "echo": ["say"],
    "botnick": ["botname"],
    "eval": ["debug", "sudo"],
    "wednesday": ["wed"]
}
exports.getCommand = function(commands, name){
    let cmd = commands.get(name);
    if (cmd) return cmd;
    Object.keys(aliases).forEach(alias => {
        if (aliases[alias].includes(name)) cmd = commands.get(alias);
    });
    return cmd;
}
exports.commands = function(client){
    let commands = new enmap();
    client.cooldowns = new Object; //object, that's going to store all the cooldowns for now
    fs.readdir('./commands', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            let props = require(`../../commands/${file}`);
            let name = file.split('.')[0];
            props.name = name; //asserting name of the command to it's object
            client.cooldowns[name] = new Set; //initializing a set for each command
            commands.set(name, props);
        });
    });
    return commands;
}
exports.events = function(client){
    fs.readdir('./events', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            let event = require(`../../events/${file}`);
            let name = file.split('.')[0];
            client.on(name, event.bind(null, client));
            delete require.cache[require.resolve(`../../events/${file}`)];
        });
    });
}