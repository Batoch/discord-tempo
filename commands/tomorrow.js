const { SlashCommandBuilder } = require('discord.js');
const edf_tempo = require('edf-tempo');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('tomorrow')
	.setDescription("Show tomorrow's color."),
		// .addIntegerOption(option => option.setName('amount').setDescription('exempleint')),
	async execute(interaction) {
		edf_tempo.gettodaycolor().then((value) => {
			return interaction.reply({ content: value.couleurJourJ1, ephemeral: true });
		  });
		
	},
};