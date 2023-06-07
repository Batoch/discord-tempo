const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
try { const optinusers = require('../optinusers.json'); } catch (e) {optinusers = []; console.error("File optinusers.json not found");}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('optin')
		.setDescription('Opt-in to notifications.'),
		// .addIntegerOption(option => option.setName('amount').setDescription('exempleint')),
	async execute(interaction) {
        if(optinusers.includes(interaction.member.user.id)){
            return interaction.reply({ content: "Already in", ephemeral: true });
        }
        optinusers.push(interaction.member.user.id);

        fs.writeFile('optinusers.json', JSON.stringify(optinusers, null, 2), (err) => {
            if (err) throw err;
            console.log('New user added: ' + interaction.member.user.id);
        });
        return interaction.reply({ content: "Added in", ephemeral: true });
	},
};