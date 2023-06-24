const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('optin')
		.setDescription('Opt-in to notifications.')
		.addIntegerOption(option => option.setName('notifyoncolor').setDescription('When to send you a notification. 1: Red, 2: Red and White, 3: Everyday')),
	async execute(interaction, optinusers) {
        if(interaction.options.get('notifyoncolor'))
        {
            console.log(interaction.options.get('notifyoncolor').value)
        }
        else{
            // default
        }
        console.log(optinusers)
        
        if(optinusers.includes(interaction.member.user.id)){
            return interaction.reply({ content: "Already in", ephemeral: true });
        }
        optinusers.push(interaction.member.user.id);

        // Ensure the folder data exist
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');
        }
        
        fs.writeFile('data/optinusers.json', JSON.stringify(optinusers, null, 2), (err) => {
            if (err) throw err;
            console.log('New user added: ' + interaction.member.user.id);
        });
        return interaction.reply({ content: "Added in", ephemeral: true });
	},
};