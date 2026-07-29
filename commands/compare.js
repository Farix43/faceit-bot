const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const faceit = require('../services/faceit');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription('Porównuje dwóch graczy FACEIT')
        .addStringOption(option =>
            option
                .setName('nick1')
                .setDescription('Pierwszy gracz')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('nick2')
                .setDescription('Drugi gracz')
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const nick1 = interaction.options.getString('nick1');
            const nick2 = interaction.options.getString('nick2');

            const player1 = await faceit.getPlayer(nick1);
            const player2 = await faceit.getPlayer(nick2);

            const stats1 = await faceit.getStats(player1.player_id);
            const stats2 = await faceit.getStats(player2.player_id);

            const cs21 = player1.games.cs2;
            const cs22 = player2.games.cs2;

            const l1 = stats1.lifetime;
            const l2 = stats2.lifetime;

            const embed = new EmbedBuilder()
                .setColor('#ff5500')
                .setTitle(`⚔️ ${player1.nickname} vs ${player2.nickname}`)
                .setDescription('Porównanie statystyk FACEIT')
                .addFields(
                    {
                        name: '🎖️ Level',
                        value:
                            `${player1.nickname}: **${cs21.skill_level}**\n` +
                            `${player2.nickname}: **${cs22.skill_level}**`,
                        inline: true
                    },
                    {
                        name: '📈 ELO',
                        value:
                            `${player1.nickname}: **${cs21.faceit_elo}**\n` +
                            `${player2.nickname}: **${cs22.faceit_elo}**`,
                        inline: true
                    },
                    {
                        name: '🎯 K/D',
                        value:
                            `${player1.nickname}: **${l1["Average K/D Ratio"] || "Brak"}**\n` +
                            `${player2.nickname}: **${l2["Average K/D Ratio"] || "Brak"}**`,
                        inline: true
                    },
                    {
                        name: '💥 HS%',
                        value:
                            `${player1.nickname}: **${l1["Average Headshots %"] || "Brak"}%**\n` +
                            `${player2.nickname}: **${l2["Average Headshots %"] || "Brak"}%**`,
                        inline: true
                    },
                    {
                        name: '🏆 Mecze',
                        value:
                            `${player1.nickname}: **${l1["Matches"] || "0"}**\n` +
                            `${player2.nickname}: **${l2["Matches"] || "0"}**`,
                        inline: true
                    },
                    {
                        name: '📊 Win Rate',
                        value:
                            `${player1.nickname}: **${l1["Win Rate %"] || "Brak"}%**\n` +
                            `${player2.nickname}: **${l2["Win Rate %"] || "Brak"}%**`,
                        inline: true
                    },
                    {
                        name: '🌍 Region',
                        value:
                            `${player1.nickname}: **${cs21.region || "EU"}**\n` +
                            `${player2.nickname}: **${cs22.region || "EU"}**`,
                        inline: true
                    }
                )
                .setFooter({
                    text: 'Faceit Bot • Powered by FACEIT API'
                });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel(`${player1.nickname} - Profil`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(player1.faceit_url),

                new ButtonBuilder()
                    .setLabel(`${player2.nickname} - Profil`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(player2.faceit_url)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {

            console.error(error.response?.data || error);

            await interaction.editReply(
                '❌ Nie udało się porównać graczy.'
            );

        }

    }
};