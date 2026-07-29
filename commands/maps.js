const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maps')
        .setDescription('Mapa statystyk'),

    async execute(interaction) {
        await interaction.reply('🚧 Komenda w budowie.');
    }
};