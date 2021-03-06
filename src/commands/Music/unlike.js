const BaseCommand = require('../../utils/structures/BaseCommand');
const MusicUtil = require("../../lavalinkClient/musicUtil");
const musicUtil = new MusicUtil;

module.exports = class UnlikeCommand extends BaseCommand {
    constructor() {
        super({
            name: "unlike",
            description: "Unlike the current playing song",
            category: "music",
        })
    }

    async run({ message, userData }) {
        if (!message.channel.clientPermissions.has("EMBED_LINKS")) return message.channel.send("I don't have permissions to send message embeds in this channel");

        const result = await musicUtil.canModifyPlayer({ message, requiredPerms: "VIEW_QUEUE", errorEmbed: true });
        if (result.error) return;

        const playlist = await userData.music.playlists.getPlaylistWithName('liked');
        const res = await playlist.tracks.removeWithUrl(result.player.queue.current.uri);

        if (!res) {
            await message.channel.send(this.embedify(message.guild, `**[${this.discord.escapeMarkdown(result.player.queue.current.title)}](${result.player.queue.current.uri})**\nDoes not exist in your liked playlist - ${message.author}`, true)).then(msg => msg.delete({ timeout: 5000 }).catch(console.error)).catch(console.error);
        }
        else {
            await message.channel.send(this.embedify(message.guild, `**[${this.discord.escapeMarkdown(res.title)}](${res.uri})**\nRemoved from your liked playlist - ${message.author}`)).then(msg => msg.delete({ timeout: 5000 }).catch(console.error)).catch(console.error);
        }
    }
}