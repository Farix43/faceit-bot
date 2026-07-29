const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const fs = require('fs');
const faceit = require('../services/faceit');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Pokazuje statystyki wszystkich połączonych graczy'),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const users = JSON.parse(fs.readFileSync('./users.json'));

            const ids = Object.keys(users);

            if (!ids.length) {
                return interaction.editReply('❌ Nikt nie połączył jeszcze konta FACEIT.');
            }

            let totalElo = 0;
            let totalLevel = 0;

            let bestPlayer = null;

            for (const discordId of ids) {

                try {

                    const player = await faceit.getPlayer(users[discordId]);

                    const cs2 = player.games.cs2;

                    totalElo += cs2.faceit_elo;
                    totalLevel += cs2.skill_level;

                    if (!bestPlayer || cs2.faceit_elo > bestPlayer.elo) {
                        bestPlayer = {
                            nick: player.nickname,
                            elo: cs2.faceit_elo,
                            level: cs2.skill_level
                        };
                    }

                } catch {
                    // Pomijamy błędne konta
                }

            }

            const averageElo = Math.round(totalElo / ids.length);
            const averageLevel = (totalLevel / ids.length).toFixed(1);

            const embed = new EmbedBuilder()
                .setColor('#ff5500')
                .setTitle('📊 Statystyki serwera FACEIT')
                .addFields(
                    {
                        name: '👥 Połączone konta',
                        value: String(ids.length),
                        inline: true
                    },
                    {
                        name: '📈 Średnie ELO',
                        value: String(averageElo),
                        inline: true
                    },
                    {
                        name: '🎖️ Średni Level',
                        value: String(averageLevel),
                        inline: true
                    },
                    {
                        name: '🥇 Najlepszy gracz',
                        value: bestPlayer
                            ? `**${bestPlayer.nick}**\n🎖️ Level ${bestPlayer.level}\n📈 ${bestPlayer.elo} ELO`
                            : 'Brak danych',
                        inline: false
                    }
                )
                .setFooter({
                    text: 'Faceit Bot • Powered by FACEIT API'
                });

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {

            console.error(error);

            await interaction.editReply(
                '❌ Wystąpił błąd podczas pobierania statystyk serwera.'
            );

        }

    }
};