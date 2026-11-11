const { CronJob } = require('cron');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const edf_tempo = require('edf-tempo');

var optinusers
try { optinusers = require('./data/optinusers.json'); } catch (e) {optinusers = []; console.error("File data/optinusers.json not found");}
var TOKEN
if(process.env.TOKEN != undefined){TOKEN = process.env.TOKEN}
else{
	console.log("Getting Token from config.json")
	try { TOKEN = require('./config.json').TOKEN; } catch (e) {return console.error("File config.json not found");}
}

const Colors = {
	Red: "TEMPO_ROUGE",
	White: "TEMPO_BLANC",
	Blue: "TEMPO_BLEU",
	Unknown: edf_tempo.UNKNOWN
}

// Options passed to edf-tempo: log each failed attempt
const tempoOptions = {
	onError: (error, attempt) => console.warn(`EDF Tempo API attempt ${attempt} failed: ${error.message}`)
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

client.once(Events.ClientReady, async () => {
	console.log('Ready!');
	await refreshstatus();
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, optinusers);
	} catch (error) {
		console.error(error);
		if (interaction.deferred && !interaction.replied) {
			await interaction.editReply({ content: 'There was an error while executing this command!' });
		} else if (interaction.replied) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(TOKEN);

// Tempo days follow the French calendar (a Tempo day starts at 6AM, Paris time)
new CronJob("10 06 * * *", function() {
	// Everyday at 6:10AM
	refreshstatus()
}, null, true, "Europe/Paris");

new CronJob("00 20 * * *", async function() {
	// Everyday at 8PM
	await refreshstatus()
	try {
		const J1color = await edf_tempo.getdaycolor(edf_tempo.getday(1), tempoOptions);
		sendmessagetousers(optinusers, J1color)
	} catch (error) {
		console.error("Unable to get tomorrow's color: " + error.message);
	}
}, null, true, "Europe/Paris");

async function refreshstatus(){
	let color
	try {
		color = await edf_tempo.getdaycolor(edf_tempo.getday(), tempoOptions);
	} catch (error) {
		console.error("Unable to get today's color: " + error.message);
		return;
	}
	client.user.setStatus(color == Colors.Red ? "dnd" : "online")
	client.user.setActivity(color.split("TEMPO_")[1]);
	console.log('New value: ' + color);
}

function sendmessagetousers(users, J1color){
	let message
	if(J1color==Colors.Red){
		message = 'Tomorrow is Red';
	}
	else if(J1color==Colors.White){
		message = 'Tomorrow is White';
	}
	else{
		return;
	}
	for (const user of users) {
		console.log(user)
		client.users.send(user, message).catch((error) => {
			console.error(`Unable to send a message to ${user}: ${error.message}`);
		});
	}
}
