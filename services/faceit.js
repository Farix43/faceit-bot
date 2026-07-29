const axios = require('axios');

const headers = {
    Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
};

async function getPlayer(nickname) {
    const response = await axios.get(
        `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(nickname)}`,
        { headers }
    );

    return response.data;
}

async function getStats(playerId) {
    const response = await axios.get(
        `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`,
        { headers }
    );

    return response.data;
}

async function getRecentMatches(playerId, limit = 5) {
    const response = await axios.get(
        `https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=${limit}`,
        { headers }
    );

    console.log(JSON.stringify(response.data, null, 2));

    return response.data.items;
}
async function getMapStats(playerId) {
    const response = await axios.get(
        `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2/maps`,
        { headers }
    );

    return response.data;
}
module.exports = {
    getPlayer,
    getStats,
    getRecentMatches,
    getMapStats
};