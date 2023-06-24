const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('optout')
		.setDescription('Opt-out to notifications.'),
		// .addIntegerOption(option => option.setName('amount').setDescription('exempleint')),
	async execute(interaction) {
        if(!optinusers.includes(interaction.member.user.id)){
            return interaction.reply({ content: "User not find in the database", ephemeral: true });
        }
        optinusers.splice(optinusers.indexOf(interaction.member.user.id), 1);

        fs.writeFile('data/optinusers.json', JSON.stringify(optinusers, null, 2), (err) => {
            if (err) throw err;
            console.log('User removed: ' + interaction.member.user.id);
        });
        return interaction.reply({ content: "Removed from database", ephemeral: true });
	},
};