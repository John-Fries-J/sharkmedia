const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Submit finalised link")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("the finalised link")
        .setRequired(true)
    ),

  async execute(interaction) {
    let name = interaction.options.getString("command");

    if (name) {
      if (interaction.client.slashCommands.has(name)) {
        const command = interaction.client.slashCommands.get(name);

        if (command.data.description) {
          const helpEmbed = new EmbedBuilder().setColor("Random");
          helpEmbed.setDescription(
            command.data.description + "ERROR, NO LINK SUBMITTED."
          );

          interaction.reply({ embeds: [helpEmbed] });
        }
      } else {
        const helpEmbed = new EmbedBuilder().setColor("Random");
        helpEmbed.setDescription(
          `Link \`${name}\` has been **submitted** by:${interaction.user} as finalized. \nYou need to wait for one of the team members to accept this.`
        ).setColor("Green");

				// Send the message to the specified channel
				const channelId = "1125392251837755482"; // Replace with your desired channel ID
				const channel = interaction.client.channels.cache.get(channelId);
				if (channel) {
					const message = await channel.send(`${interaction.user} Has submitted ${interaction.channel} Go and accept or deny it please. <@&1125582289053679666>`);
				} else {
					console.log(`Failed to send message to text channel with ID ${channelId}`);
				}
				const acceptButton = new ButtonBuilder()
				.setCustomId("accept")
				.setLabel("Accept")
				.setStyle("Success");
			  
			  const rejectButton = new ButtonBuilder()
				.setCustomId("reject")
				.setLabel("Reject")
				.setStyle("Danger");
			  
			  const buttonRow = new ActionRowBuilder()
				.addComponents([acceptButton, rejectButton]);
			  
			  const replyMessage = await interaction.reply({ embeds: [helpEmbed], components: [buttonRow] });
			  
			  const filter = (interaction) => interaction.message.id === replyMessage.id && interaction.member.roles.cache.has("1125582289053679666");
			  const collector = replyMessage.createMessageComponentCollector({ filter, time: 30000 });
			  
			  collector.on("collect", (interaction) => {
				if (interaction.customId === "accept") {
				  // Handle accept logic
				  interaction.reply("Accepted");
				  // Send the embed to "channel2"
				  const channel2 = interaction.guild.channels.cache.get("1053386550907506782");
				  if (channel2) {
					channel2.send({ embeds: [helpEmbed] });
				  }
				} else if (interaction.customId === "reject") {
				  // Handle reject logic
				  interaction.reply("Rejected");
				}
			  });
			  
			  collector.on("end", () => {
				// Handle collector end logic, if needed
			  });
			  module.exports = helpEmbed;
      }
    }
  },
};
