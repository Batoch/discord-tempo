const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display help.'),
		// .addIntegerOption(option => option.setName('amount').setDescription('exempleint')),
	async execute(interaction) {
		return interaction.reply({ content: `Not ready yet.`, ephemeral: true });
	},
};