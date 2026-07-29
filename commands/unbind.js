const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unbind')
        .setDescription('Odłącza konto FACEIT od Discorda'),

    async execute(interaction) {
        const users = JSON.parse(fs.readFileSync('./users.json'));

        if (!users[interaction.user.id]) {
            return interaction.reply({
                content: '❌ Nie masz połączonego konta.',
                ephemeral: true
            });
        }

        delete users[interaction.user.id];

        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

        await interaction.reply('✅ Konto FACEIT zostało odłączone.');
    }
};