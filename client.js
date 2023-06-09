var cronJob = require("cron").CronJob;
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
var optinusers
try { optinusers = require('./optinusers.json'); } catch (e) {optinusers = []; console.error("File optinusers.json not found");}
var TOKEN
if(process.env.TOKEN != undefined){TOKEN = process.env.TOKEN}
else{
	console.log("Getting Token from config.json")
	try { TOKEN = require('./config.json').TOKEN; } catch (e) {return console.error("File config.json not found");}
}
const edf_tempo = require('edf-tempo');
const Colors = {
	Red: "TEMPO_ROUGE",
	White: "TEMPO_BLANC",
	Blue: "TEMPO_BLEU"
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, () => {
	edf_tempo.gettodaycolor().then((value) => {
		client.user.setStatus("online")
		client.user.setActivity(value.couleurJourJ.split("TEMPO_")[1]);
		console.log('Ready!');
	});
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(TOKEN);

new cronJob("10 06 * * *", function() {
    // Everyday at 6:10AM
	refreshstatus()
}, null, true);

new cronJob("00 20 * * *", function() {
    // Everyday at 8PM
	try { const optinusers = require('./optinusers.json'); } catch (e) {optinusers = []}
	edf_tempo.gettodaycolor().then((value) => {
		refreshstatus(value)
		sendmessagetousers(optinusers, value.couleurJourJ1)
	});
}, null, true);

function refreshstatus(color){
		client.user.setStatus("online")
		client.user.setActivity(color.couleurJourJ);
		if(color.couleurJourJ==Colors.Red){
			client.user.setStatus("dnd")
		}
		console.log('New value:' + color.couleurJourJ);
}

function sendmessagetousers(users, J1color){
	for (var user in users) {
		console.log(users[user])
		if(J1color==Colors.Red){
			client.users.send(users[user], 'Tomorrow is Red');
		}
		if(J1color==Colors.White){
			client.users.send(users[user], 'Tomorrow is White');
		}
	}
}