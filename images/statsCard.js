const {
    createCanvas,
    loadImage
} = require('canvas');

module.exports = async function createStatsCard(player, lifetime) {

    const canvas = createCanvas(900, 500);
    const ctx = canvas.getContext('2d');

    // Tło
    ctx.fillStyle = '#1e1f22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pasek u góry
    ctx.fillStyle = '#ff5500';
    ctx.fillRect(0, 0, canvas.width, 70);

    // Avatar
    try {
        const avatar = await loadImage(player.avatar);

        ctx.save();
        ctx.beginPath();
        ctx.arc(90, 150, 55, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, 35, 95, 110, 110);

        ctx.restore();

    } catch {}

    // Nick
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Arial';
    ctx.fillText(player.nickname, 170, 110);

    // Statystyki
    ctx.font = '26px Arial';

    ctx.fillText(`🎖️ Level: ${player.games.cs2.skill_level}`, 170, 170);
    ctx.fillText(`📈 ELO: ${player.games.cs2.faceit_elo}`, 170, 215);

    ctx.fillText(
        `🎯 K/D: ${lifetime["Average K/D Ratio"] || "-"}`,
        170,
        260
    );

    ctx.fillText(
        `💥 HS: ${lifetime["Average Headshots %"] || "-"}%`,
        170,
        305
    );

    ctx.fillText(
        `🏆 Win Rate: ${lifetime["Win Rate %"] || "-"}%`,
        170,
        350
    );

    ctx.fillText(
        `🌍 Region: ${player.games.cs2.region || "EU"}`,
        170,
        395
    );

    ctx.font = '20px Arial';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText("Faceit Bot • Powered by FACEIT API", 30, 470);

    return canvas.toBuffer();
};