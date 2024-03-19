const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tires")
    .setDescription("View the tires/surfaces system"),

  async execute(interaction) {
   
    let embed = new discord.EmbedBuilder()
    .setTitle("tires")
    .setDescription(`Tires are a crucial part of your car. So is the surface, both of these can affect your car's handling, acceleration, and top speed.\n
    The 5 types of surfaces are: Asphalt, Dirt, Snow, Wet, and Ice.\n
    Asphalt is the most common surface, and is the default surface, no stats are changed\n
    Dirt is a surface thats primarly for offroading\n
    Snow is a surface that is slippery, similar to dirt, and can cause your car to slide\n
    Wet is a surface that is slippery, but not as slippery as snow\n
    Ice is the most slippery surface, and can cause your car to slide a lot without the proper tires\n

    Tires are just as important as the surface\n
    The 5 types of tires are: Regular (t1tires), All surface (t1allsurfacetires), Slicks (t1slicks), Track (t1tracktires), and Offroad (t1offroadtires)\n
    They all have their benefits depending on the surface.\n\n
    Regular tires are the default tires, and are good for asphalt, but aren't so great on any other surface\n
    All surface tires are good for any surface, but they aren't the best for any surface, this means the other tires have their niche races they're better than all surface tires at.\n
    Slicks are good for asphalt, and are the best tires for asphalt, it boosts your speed and acceleration, but they are also the worst tires for any other race\n
    Track tires are the best tires for track racing on any surface\n
    Offroad tires are the best tires for offroad racing on any surface, but aren't so great on asphalt

    Tires and surfaces will have an impact on your car's performance, so make sure to choose the right tires for the right surface!
    You will see these performance effects in the cars stats during the race

    `)

    .setColor(colors.blue)
    
    await interaction.reply({ embeds: [embed] });
    
  },
};
