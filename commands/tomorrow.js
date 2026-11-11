const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const edf_tempo = require('edf-tempo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tomorrow')
		.setDescription("Show tomorrow's color."),
	async execute(interaction) {
		// The API may retry for a while: acknowledge the interaction first
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const color = await edf_tempo.getdaycolor(edf_tempo.getday(1), { retries: 3, retryDelay: 2000 });
		if (color == edf_tempo.UNKNOWN) {
			return interaction.editReply({ content: "Tomorrow's color is not published yet." });
		}
		return interaction.editReply({ content: color });
	},
};
