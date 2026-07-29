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
        .setName('stats')
        .setDescription('Pokazuje statystyki FACEIT gracza')
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
                    content: '❌ Nie masz połączonego konta. Użyj `/bind nick:twoj_nick`.',
                    ephemeral: true
                });
            }
        }

        await interaction.deferReply();

        try {

            const player = await faceit.getPlayer(nick);
            const stats = await faceit.getStats(player.player_id);

            const lifetime = stats.lifetime;
            const cs2 = player.games.cs2;

            let color = '#ff5500';

            if (cs2.skill_level >= 10) color = '#8000ff';
            else if (cs2.skill_level >= 8) color = '#0099ff';
            else if (cs2.skill_level >= 5) color = '#00cc66';
            else if (cs2.skill_level >= 3) color = '#ffaa00';
            else color = '#ff3333';

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`🎮 ${player.nickname} • FACEIT`)
                .setThumbnail(player.avatar)
                .addFields(
                    {
                        name: '🎖️ Level',
                        value: String(cs2.skill_level),
                        inline: true
                    },
                    {
                        name: '📈 ELO',
                        value: String(cs2.faceit_elo),
                        inline: true
                    },
                    {
                        name: '🎯 K/D',
                        value: lifetime["Average K/D Ratio"] || "Brak",
                        inline: true
                    },
                    {
                        name: '💥 HS%',
                        value: (lifetime["Average Headshots %"] || "Brak") + "%",
                        inline: true
                    },
                    {
                        name: '🏆 Mecze',
                        value: lifetime["Matches"] || "0",
                        inline: true
                    },
                    {
                        name: '📊 Win Rate',
                        value: (lifetime["Win Rate %"] || "Brak") + "%",
                        inline: true
                    },
                    {
                        name: '🌍 Region',
                        value: cs2.region || "EU",
                        inline: true
                    }
                )
                .setFooter({
                    text: `Level ${cs2.skill_level} • Powered by FACEIT API`
                });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('🌐 Profil FACEIT')
                    .setStyle(ButtonStyle.Link)
                    .setURL(player.faceit_url)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {

            console.error(error.response?.data || error);

            await interaction.editReply(
                '❌ Nie znaleziono gracza lub wystąpił błąd API.'
            );

        }

    }
};