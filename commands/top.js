const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const fs = require('fs');
const faceit = require('../services/faceit');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Pokazuje ranking ELO serwera'),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const users = JSON.parse(fs.readFileSync('./users.json'));

            const ranking = [];

            for (const discordId of Object.keys(users)) {

                const nick = users[discordId];

                try {

                    const player = await faceit.getPlayer(nick);

                    ranking.push({
                        discordId,
                        nick: player.nickname,
                        elo: player.games.cs2.faceit_elo,
                        level: player.games.cs2.skill_level
                    });

                } catch {}

            }

            ranking.sort((a, b) => b.elo - a.elo);

            if (!ranking.length) {
                return interaction.editReply("❌ Brak powiązanych kont.");
            }

            const description = ranking.map((player, index) => {

                let medal = "🏅";

                if (index === 0) medal = "🥇";
                if (index === 1) medal = "🥈";
                if (index === 2) medal = "🥉";

                return `${medal} **#${index + 1} ${player.nick}**
🎖️ Level: **${player.level}**
📈 ELO: **${player.elo}**`;

            }).join("\n\n");

            const embed = new EmbedBuilder()
                .setColor("#ff5500")
                .setTitle("🏆 Ranking FACEIT")
                .setDescription(description)
                .setFooter({
                    text: `Łącznie graczy: ${ranking.length}`
                });

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {

            console.error(error);

            await interaction.editReply(
                "❌ Wystąpił błąd podczas tworzenia rankingu."
            );

        }

    }
};