const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const axios = require('axios');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recent')
        .setDescription('Pokazuje ostatnie mecze FACEIT')
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
                    content: '❌ Nie masz połączonego konta. Użyj `/bind`.',
                    ephemeral: true
                });
            }
        }

        await interaction.deferReply();

        try {

            // Pobranie gracza
            const playerResponse = await axios.get(
                `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(nick)}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
                    }
                }
            );

            const player = playerResponse.data;

            // Ostatnie mecze
            const historyResponse = await axios.get(
                `https://open.faceit.com/data/v4/players/${player.player_id}/history?game=cs2&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
                    }
                }
            );

            const matches = historyResponse.data.items;

            if (!matches.length) {
                return interaction.editReply("❌ Brak rozegranych meczów.");
            }

            const embed = new EmbedBuilder()
                .setColor('#ff5500')
                .setTitle(`📜 Ostatnie mecze ${player.nickname}`)
                .setThumbnail(player.avatar);

            for (const match of matches) {

                embed.addFields({
                    name: `🗺️ ${match.stats?.Map || "Nieznana mapa"}`,
                    value:
                        `📅 ${new Date(match.finished_at * 1000).toLocaleString('pl-PL')}`,
                    inline: false
                });

            }

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {

            console.error(error.response?.data || error);

            await interaction.editReply(
                "❌ Nie udało się pobrać historii meczów."
            );

        }

    }

};