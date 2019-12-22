exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Squishes provided attached image / emote / URL / server meber's avatar (Outputs only in PNG format for now).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <:Kappa:561931926794141768>`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} https://static-cdn.jtvnw.net/emoticons/v1/114836/3.0`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <@506606171906637855>`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 506606171906637855`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let canvas = require('canvas');
        let url;
        let msg = await message.channel.send('Analyzing image...');
        if (message.attachments.size){
            if (!(await client.fetch(message.attachments.first().url)).headers.get('content-type').startsWith('image')) throw 'Provided file is not an image!';
            url = message.attachments.first().url;
        }
        else if (!message.args.length) throw 'No file attachment nor argument was provided!';
        else if (/<:[a-z0-9-_]+:\d+>/i.test(message.args[0]) || /<a:[a-z0-9-_]+:\d+>/i.test(message.args[0])){
            url = `https://cdn.discordapp.com/emojis/${/:\d+>/g.exec(message.args[0]).toString().slice(1, -1)}.${/<a:/.test(message.args[0])?"gif":"png"}`;
        }
        else if (client.users.has(message.args[0])){
            if (!client.users.get(message.args[0]).avatarURL) throw "Provided user doesn't have an avatar!";
            url = client.users.get(message.args[0]).avatarURL;
        }
        else if (message.mentions.members.first()){
            if (!message.mentions.members.first().user.avatarURL) throw "Provided user doesn't have an avatar!";
            url = message.mentions.members.first().user.avatarURL;
        }
        else if ((await client.fetch(message.args[0])).headers.get('content-type').startsWith('image')) url = message.args[0]; else throw "That's not an emote, mention, user ID or image URL!";
        await msg.edit('Squishing image...');
        let img = await canvas.loadImage(url);
        let sq = canvas.createCanvas(img.width, img.height);
        let ctx = sq.getContext('2d');
        ctx.drawImage(img, 0, Math.floor((sq.height-Math.floor(img.height/3))/2), sq.width, Math.floor(img.height/3));

        await message.channel.send('Squished image', {file:sq.toBuffer()});
        msg.delete();
    });
}