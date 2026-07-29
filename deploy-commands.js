require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🔄 Rejestrowanie komend...');

        await rest.put(
            Routes.applicationGuildCommands(
                '1529565663675416787',
                '1454647453662838966'
            ),
            { body: commands },
        );

        console.log('✅ Komendy zostały zarejestrowane!');
    } catch (error) {
        console.error(error);
    }
})();