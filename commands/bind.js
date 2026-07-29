const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bind')
        .setDescription('Łączy konto Discord z FACEIT')
        .addStringOption(option =>
            option
                .setName('nick')
                .setDescription('Twój nick FACEIT')
                .setRequired(true)
        ),

    async execute(interaction) {

        const nick = interaction.options.getString('nick');

        const users = JSON.parse(fs.readFileSync('./users.json'));

        users[interaction.user.id] = nick;

        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

        await interaction.reply(`✅ Połączono konto z **${nick}**`);
    }
};