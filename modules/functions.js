const { EmbedBuilder } = require('discord.js');

const config = require('../database/config.json');
const brand = config.branding;

function buildFooter(client) {
    if (client && client.user) {
        return { text: brand.footer, iconURL: client.user.displayAvatarURL() };
    }
    return { text: brand.footer };
}

module.exports = {

    embed(target, text, color, client) {
        const channel = target.channel || target;
        const resolvedColor = brand.colors[color] ?? color ?? brand.colors.default;
        const embed = new EmbedBuilder()
            .setDescription(text)
            .setColor(`#${resolvedColor.replace('#', '')}`)
            .setFooter(buildFooter(client))
            .setTimestamp();
        return channel.send({ embeds: [embed] }).catch(err => {
            console.error(`[tools.embed] ${err.message}`);
        });
    },

    error(target, text, client) {
        const channel = target.channel || target;
        const embed = new EmbedBuilder()
            .setDescription(`❌ ${text}`)
            .setColor(`#${brand.colors.error}`)
            .setFooter(buildFooter(client))
            .setTimestamp();
        return channel.send({ embeds: [embed] }).catch(err => {
            console.error(`[tools.error] ${err.message}`);
        });
    },

    success(target, text, client) {
        const channel = target.channel || target;
        const embed = new EmbedBuilder()
            .setDescription(`✅ ${text}`)
            .setColor(`#${brand.colors.success}`)
            .setFooter(buildFooter(client))
            .setTimestamp();
        return channel.send({ embeds: [embed] }).catch(err => {
            console.error(`[tools.success] ${err.message}`);
        });
    },

    warning(target, text, client) {
        const channel = target.channel || target;
        const embed = new EmbedBuilder()
            .setDescription(`⚠️ ${text}`)
            .setColor(`#${brand.colors.warning}`)
            .setFooter(buildFooter(client))
            .setTimestamp();
        return channel.send({ embeds: [embed] }).catch(err => {
            console.error(`[tools.warning] ${err.message}`);
        });
    },

    brandedEmbed(client, colorKey = 'default') {
        const resolvedColor = brand.colors[colorKey] ?? brand.colors.default;
        return new EmbedBuilder()
            .setColor(`#${resolvedColor.replace('#', '')}`)
            .setFooter(buildFooter(client))
            .setTimestamp();
    },

    color(key = 'default') {
        return `#${(brand.colors[key] ?? brand.colors.default).replace('#', '')}`;
    },

    footer(client) {
        return buildFooter(client);
    },

    botName() {
        return brand.name;
    },

    hasPermission(member, flag) {
        return member.permissions.has(flag);
    },

    deleteAfter(message, ms) {
        setTimeout(() => message.delete().catch(() => {}), ms);
    },

    formatNumber(n) {
        return n.toLocaleString();
    },

};
