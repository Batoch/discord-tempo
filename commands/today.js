const { SlashCommandBuilder } = require('discord.js');
const edf_tempo = require('edf-tempo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('today')
		.setDescription("Show today's color."),
		// .addIntegerOption(option => option.setName('amount').setDescription('exempleint')),
	async execute(interaction) {
		edf_tempo.gettodaycolor().then((value) => {
			return interaction.reply({ content: value.couleurJourJ, ephemeral: true });
		  });
	},
};