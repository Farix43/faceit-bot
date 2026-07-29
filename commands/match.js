const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const fs = require('fs');
const faceit = require('../services/faceit');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription('Pokazuje ostatni mecz FACEIT')
        .addStringOption(option =>
            option
                .setName('nick')
                .setDescription('Nick FACEIT')
                .setRequired(false)
        ),

    async execute(interaction) {

        let nick = interaction.options.getString('nick');

        if (!nick) {
            const users = JSON.parse(fs.readFileSync('./users.json'));

            nick = users[interaction.user.id];

            if (!nick) {
                return interaction.reply({
                    content: '❌ Najpierw połącz konto komendą /bind.',
                    ephemeral: true
                });
            }
        }

        await interaction.deferReply();

        try {

            const player = await faceit.getPlayer(nick);
            const matches = await faceit.getRecentMatches(player.player_id);

            if (!matches || !matches.length) {
                return interaction.editReply('❌ Nie znaleziono ostatnich meczów.');
            }

            const match = matches[0];

            const embed = new EmbedBuilder()
                .setColor('#ff5500')
                .setTitle(`🎮 Ostatni mecz ${player.nickname}`)
                .addFields(
                    {
                        name: '🎯 Tryb',
                        value: match.game_mode || 'CS2 5v5',
                        inline: true
                    },
                    {
                        name: '📅 Data',
                        value: `<t:${match.finished_at}:F>`,
                        inline: true
                    }
                )
                .setFooter({
                    text: 'Faceit Bot • Powered by FACEIT API'
                });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('🌐 Otwórz mecz')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.faceit.com/en/cs2/room/${match.match_id}`)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {

            console.error(error.response?.data || error);

            await interaction.editReply(
                '❌ Nie udało się pobrać ostatniego meczu.'
            );

        }

    }
};