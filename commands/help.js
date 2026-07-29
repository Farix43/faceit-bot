const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Pokazuje listę komend bota'),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('#ff5500')
            .setTitle('🤖 FACEIT BOT - Pomoc')
            .setDescription('Lista dostępnych komend:')
            .addFields(
                {
                    name: '📊 Statystyki',
                    value:
                        '`/stats` - Statystyki gracza\n' +
                        '`/compare` - Porównanie dwóch graczy\n' +
                        '`/recent` - Ostatnie mecze\n' +
                        '`/match` - Ostatni mecz',
                },
                {
                    name: '👤 Konto',
                    value:
                        '`/bind` - Połącz konto FACEIT\n' +
                        '`/unbind` - Odłącz konto FACEIT',
                },
                {
                    name: '🏆 Ranking',
                    value:
                        '`/top` - Ranking ELO serwera',
                },
                {
                    name: '❓ Pomoc',
                    value:
                        '`/help` - Wyświetla tę wiadomość',
                }
            )
            .setFooter({
                text: 'Faceit Bot • Powered by FACEIT API'
            });

        await interaction.reply({
            embeds: [embed]
        });

    }
};