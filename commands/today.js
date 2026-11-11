const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const edf_tempo = require('edf-tempo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('today')
		.setDescription("Show today's color."),
	async execute(interaction) {
		// The API may retry for a while: acknowledge the interaction first
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const color = await edf_tempo.getdaycolor(edf_tempo.getday(), { retries: 3, retryDelay: 2000 });
		return interaction.editReply({ content: color });
	},
};
