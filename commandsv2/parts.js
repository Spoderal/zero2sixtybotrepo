const parts = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { emotes } = require("../common/emotes");
const { tipFooterPurchasePart } = require("../common/tips");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("parts")
    .setDescription("Check the parts shop"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Select a part")
        .addOptions([
          {
            label: "Exhaust",
            description: "Select this for the list of exhausts",
            value: "first_option",
            customId: "d_class",
            emoji: emotes.partsExhaust,
          },
          {
            label: "Tires",
            description: "Select this for the list of tires",
            value: "first_option_2",
            customId: "d_class",
            emoji: emotes.partsTires,
          },
          {
            label: "Intakes",
            description: "Select this for the list of intakes",
            value: "second_option",
            customId: "c_class",
            emoji: emotes.partsIntake,
          },
          {
            label: "Turbos",
            description: "Select this for the list of turbos",
            value: "second_option_2",
            customId: "c_class",
            emoji: emotes.partsTurbo,
          },
          {
            label: "Suspension",
            description: "Select this for the list of suspensions",
            value: "third_option",
            emoji: emotes.partsSuspension,
          },
          {
            label: "Engines",
            description: "Select this for the list of engines",
            value: "third_option_2",
            emoji: emotes.partsEngine,
          },
          {
            label: "Gearboxes",
            description: "Select this for the list of gearboxes",
            value: "third_option_3",
            emoji: emotes.partsGearBox,
          },
          {
            label: "Body",
            description: "Select this for the list of body options",
            value: "body_option",
            emoji: emotes.partsGearBox,
          },
          {
            label: "Brakes",
            description: "Select this for the list of brake options",
            value: "brakes_option",
            emoji: "<:t1brakes:1011360668533919774>",
          },
          {
            label: "Extras",
            description:
              "Select this for the list of clutch/ecus/nitrous/EV Upgrades",
            value: "fifth_option",
            emoji: emotes.partsECU,
          },
        ])
    );

    let embed = new EmbedBuilder()
      .setTitle("Car Parts")
      .setThumbnail("https://i.ibb.co/89GbzcB/Logo-Makr-8u-BQuo.png")
      .addFields([
        {
          name: "Available Parts",
          value: `
          *Choose a part from the drop down below*\n\nExhausts ${emotes.partsExhaust}
          Tires ${emotes.partsTires}
          Intakes ${emotes.partsIntake}
          Turbos ${emotes.partsTurbo}
          Suspension ${emotes.partsSuspension}
          Engines ${emotes.partsEngine}
          Gearboxes ${emotes.partsGearBox}
          Body (REWORKING)
          Brakes <:t1brakes:1011360668533919774>
          Extras (Clutch, ECU, Nitrous, EV) ${emotes.partsECU}
        `,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setDescription(
        `\`/buy (part)\` to buy a part\n\n[Official Server](https://discord.gg/bHwqpxJnJk)`
      );
    interaction
      .reply({ embeds: [embed], components: [row] })
      .then(async (msg) => {
        try {
          const filter = (interaction) =>
            interaction.isSelectMenu() &&
            interaction.user.id === interaction.user.id;

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter,
              time: 1000 * 30,
            }
          );

          collector.on("collect", async (collected) => {
            const value = collected.values[0];
            if (value === "first_option") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Exhausts")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                  ${parts.Parts["t1exhaust"].Emote}  ${
                    parts.Parts["t1exhaust"].Name
                  } : ${toCurrency(parts.Parts["t1exhaust"].Price)}\n
                  ${parts.Parts["t2exhaust"].Emote}  ${
                    parts.Parts["t2exhaust"].Name
                  } : ${toCurrency(parts.Parts["t2exhaust"].Price)}\n
                  ${parts.Parts["t3exhaust"].Emote}  ${
                    parts.Parts["t3exhaust"].Name
                  } : ${toCurrency(parts.Parts["t3exhaust"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/sP3F1p2/exhaustdefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "first_option_2") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Tires")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                      ${parts.Parts["t1tires"].Emote}  ${
                    parts.Parts["t1tires"].Name
                  } : ${toCurrency(parts.Parts["t1tires"].Price)}\n
                      ${parts.Parts["t2tires"].Emote}  ${
                    parts.Parts["t2tires"].Name
                  } : ${toCurrency(parts.Parts["t2tires"].Price)}\n
                      ${parts.Parts["t3tires"].Emote}  ${
                    parts.Parts["t3tires"].Name
                  } : ${toCurrency(parts.Parts["t3tires"].Price)}\n
                      ${parts.Parts["t1drifttires"].Emote}  ${
                    parts.Parts["t1drifttires"].Name
                  } : ${toCurrency(parts.Parts["t1drifttires"].Price)}\n
                      ${parts.Parts["t2drifttires"].Emote}  ${
                    parts.Parts["t2drifttires"].Name
                  } : ${toCurrency(parts.Parts["t2drifttires"].Price)}\n
                      ${parts.Parts["t3drifttires"].Emote}  ${
                    parts.Parts["t3drifttires"].Name
                  } : ${toCurrency(parts.Parts["t3drifttires"].Price)}\n
                      ${parts.Parts["t1tracktires"].Emote}  ${
                    parts.Parts["t1tracktires"].Name
                  } : ${toCurrency(parts.Parts["t1tracktires"].Price)}\n
                      ${parts.Parts["t2tracktires"].Emote}  ${
                    parts.Parts["t2tracktires"].Name
                  } : ${toCurrency(parts.Parts["t2tracktires"].Price)}\n
                      ${parts.Parts["t3tracktires"].Emote}  ${
                    parts.Parts["t3tracktires"].Name
                  } : ${toCurrency(parts.Parts["t3tracktires"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/NKHhh2r/tiresdefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "second_option") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Intakes")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                    ${parts.Parts["t1intake"].Emote}  ${
                    parts.Parts["t1intake"].Name
                  } : ${toCurrency(parts.Parts["t1intake"].Price)}\n
                    ${parts.Parts["t2intake"].Emote}  ${
                    parts.Parts["t2intake"].Name
                  } : ${toCurrency(parts.Parts["t2intake"].Price)}\n
                    ${parts.Parts["t3intake"].Emote}  ${
                    parts.Parts["t3intake"].Name
                  } : ${toCurrency(parts.Parts["t3intake"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/ZhZ3W91/intakedefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "second_option_2") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Turbos")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                  ${parts.Parts["turbo"].Emote}  ${
                    parts.Parts["turbo"].Name
                  } : ${toCurrency(parts.Parts["turbo"].Price)}\n
                  ${parts.Parts["dualturbo"].Emote}  ${
                    parts.Parts["dualturbo"].Name
                  } : ${toCurrency(parts.Parts["dualturbo"].Price)}\n
                  ${parts.Parts["supercharger"].Emote}  ${
                    parts.Parts["supercharger"].Name
                  } : ${toCurrency(parts.Parts["supercharger"].Price)}\n
                 **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/zP8H95J/turbodefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "body_option") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Body")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                  ${parts.Parts["t1bodykit"].Emote}  ${
                    parts.Parts["t1bodykit"].Name
                  } : ${toCurrency(parts.Parts["t1bodykit"].Price)}\n
                  ${parts.Parts["t2bodykit"].Emote}  ${
                    parts.Parts["t2bodykit"].Name
                  } : ${toCurrency(parts.Parts["t2bodykit"].Price)}\n
                   ${parts.Parts["t3bodykit"].Emote}  ${
                    parts.Parts["t3bodykit"].Name
                  } : ${toCurrency(parts.Parts["t3bodykit"].Price)}\n
                  ${parts.Parts["t1spoiler"].Emote}  ${
                    parts.Parts["t1spoiler"].Name
                  } : ${toCurrency(parts.Parts["t1spoiler"].Price)}\n
                  ${parts.Parts["t2spoiler"].Emote}  ${
                    parts.Parts["t2spoiler"].Name
                  } : ${toCurrency(parts.Parts["t2spoiler"].Price)}\n
                  ${parts.Parts["t3spoiler"].Emote}  ${
                    parts.Parts["t3spoiler"].Name
                  } : ${toCurrency(parts.Parts["t3spoiler"].Price)}\n
                  ${parts.Parts["t1weightreduction"].Emote}  ${
                    parts.Parts["t1weightreduction"].Name
                  } : ${toCurrency(parts.Parts["t1weightreduction"].Price)}\n
                  ${parts.Parts["t2weightreduction"].Emote}  ${
                    parts.Parts["t2weightreduction"].Name
                  } : ${toCurrency(parts.Parts["t2weightreduction"].Price)}\n
                  ${parts.Parts["t3weightreduction"].Emote}  ${
                    parts.Parts["t3weightreduction"].Name
                  } : ${toCurrency(parts.Parts["t3weightreduction"].Price)}\n
                  ${parts.Parts["t1weight"].Emote}  ${
                    parts.Parts["t1weight"].Name
                  } : ${toCurrency(parts.Parts["t1weight"].Price)}\n
                  ${parts.Parts["t2weight"].Emote}  ${
                    parts.Parts["t2weight"].Name
                  } : ${toCurrency(parts.Parts["t2weight"].Price)}\n
                  ${parts.Parts["t3weight"].Emote}  ${
                    parts.Parts["t3weight"].Name
                  } : ${toCurrency(parts.Parts["t3weight"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/zP8H95J/turbodefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "third_option") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Suspension")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                  ${parts.Parts["racesuspension"].Emote}  ${
                    parts.Parts["racesuspension"].Name
                  } : ${toCurrency(parts.Parts["racesuspension"].Price)}\n
                  ${parts.Parts["driftsuspension"].Emote}  ${
                    parts.Parts["driftsuspension"].Name
                  } : ${toCurrency(parts.Parts["driftsuspension"].Price)}\n
                  ${parts.Parts["t1offroadsuspension"].Emote}  ${
                    parts.Parts["t1offroadsuspension"].Name
                  } : ${toCurrency(parts.Parts["t1offroadsuspension"].Price)}\n
                  ${parts.Parts["t2racesuspension"].Emote}  ${
                    parts.Parts["t2racesuspension"].Name
                  } : ${toCurrency(parts.Parts["t2racesuspension"].Price)}\n
                  ${parts.Parts["t2driftsuspension"].Emote}  ${
                    parts.Parts["t2driftsuspension"].Name
                  } : ${toCurrency(parts.Parts["t2driftsuspension"].Price)}\n
                  ${parts.Parts["t3driftsuspension"].Emote}  ${
                    parts.Parts["t3driftsuspension"].Name
                  } : ${toCurrency(parts.Parts["t3driftsuspension"].Price)}\n
                  ${parts.Parts["t2offroadsuspension"].Emote}  ${
                    parts.Parts["t2offroadsuspension"].Name
                  } : ${toCurrency(parts.Parts["t2offroadsuspension"].Price)}\n
                  ${parts.Parts["t3racesuspension"].Emote}  ${
                    parts.Parts["t3racesuspension"].Name
                  } : ${toCurrency(parts.Parts["t3racesuspension"].Price)}\n
                  ${parts.Parts["racesprings"].Emote}  ${
                    parts.Parts["racesprings"].Name
                  } : ${toCurrency(parts.Parts["racesprings"].Price)}\n
                  ${parts.Parts["driftsprings"].Emote}  ${
                    parts.Parts["driftsprings"].Name
                  } : ${toCurrency(parts.Parts["driftsprings"].Price)}\n
                  ${parts.Parts["tracksprings"].Emote}  ${
                    parts.Parts["tracksprings"].Name
                  } : ${toCurrency(parts.Parts["tracksprings"].Price)}\n
                  ${parts.Parts["rwd"].Emote}  ${
                    parts.Parts["rwd"].Name
                  } : ${toCurrency(parts.Parts["rwd"].Price)}\n
                  ${parts.Parts["fwd"].Emote}  ${
                    parts.Parts["fwd"].Name
                  } : ${toCurrency(parts.Parts["fwd"].Price)}\n
                  ${parts.Parts["awd"].Emote}  ${
                    parts.Parts["awd"].Name
                  } : ${toCurrency(parts.Parts["awd"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/mFb3mMk/suspensiondefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "third_option_2") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Engines")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                    Page 1\n
                    ${parts.Parts["2jz-gte"].Emote}  ${
                    parts.Parts["2jz-gte"].Name
                  } : ${toCurrency(parts.Parts["2jz-gte"].Price)}\n
                    ${parts.Parts["v10"].Emote}  ${
                    parts.Parts["v10"].Name
                  } : ${toCurrency(parts.Parts["v10"].Price)}\n
                    ${parts.Parts["v12"].Emote}  ${
                    parts.Parts["v12"].Name
                  } : ${toCurrency(parts.Parts["v12"].Price)}\n
                    ${parts.Parts["ls1"].Emote}  ${
                    parts.Parts["ls1"].Name
                  } : ${toCurrency(parts.Parts["ls1"].Price)}\n
                    ${parts.Parts["ls2"].Emote}  ${
                    parts.Parts["ls2"].Name
                  } : ${toCurrency(parts.Parts["ls2"].Price)}\n
                    ${parts.Parts["ls3"].Emote}  ${
                    parts.Parts["ls3"].Name
                  } : ${toCurrency(parts.Parts["ls3"].Price)}
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/MC6gH5B/enginedefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "third_option_3") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Gearboxes")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                  ${parts.Parts["t1gearbox"].Emote}  ${
                    parts.Parts["t1gearbox"].Name
                  } : ${toCurrency(parts.Parts["t1gearbox"].Price)}\n
                  ${parts.Parts["t2gearbox"].Emote}  ${
                    parts.Parts["t2gearbox"].Name
                  } : ${toCurrency(parts.Parts["t2gearbox"].Price)}\n
                  ${parts.Parts["t3gearbox"].Emote}  ${
                    parts.Parts["t3gearbox"].Name
                  } : ${toCurrency(parts.Parts["t3gearbox"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/NFxgY5N/gearboxdefault.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "fifth_option") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("ECUs & Clutches")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                      ${parts.Parts["t1clutch"].Emote}  ${
                    parts.Parts["t1clutch"].Name
                  } : ${toCurrency(parts.Parts["t1clutch"].Price)}\n
                      ${parts.Parts["t2clutch"].Emote}  ${
                    parts.Parts["t2clutch"].Name
                  } : ${toCurrency(parts.Parts["t2clutch"].Price)}\n
                      ${parts.Parts["t3clutch"].Emote}  ${
                    parts.Parts["t3clutch"].Name
                  } : ${toCurrency(parts.Parts["t3clutch"].Price)}\n
                      ${parts.Parts["t1ecu"].Emote}  ${
                    parts.Parts["t1ecu"].Name
                  } : ${toCurrency(parts.Parts["t1ecu"].Price)}\n
                      ${parts.Parts["t2ecu"].Emote}  ${
                    parts.Parts["t2ecu"].Name
                  } : ${toCurrency(parts.Parts["t2ecu"].Price)}\n
                      ${parts.Parts["t3ecu"].Emote}  ${
                    parts.Parts["t3ecu"].Name
                  } : ${toCurrency(parts.Parts["t3ecu"].Price)}\n
                      ${parts.Parts["t1nitro"].Emote}  ${
                    parts.Parts["t1nitro"].Name
                  } : ${toCurrency(parts.Parts["t1nitro"].Price)} **1 USE**\n
                      ${parts.Parts["t1rangeboost"].Emote}  ${
                    parts.Parts["t1rangeboost"].Name
                  } : ${toCurrency(parts.Parts["t1rangeboost"].Price)}\n
                      ${parts.Parts["t2rangeboost"].Emote}  ${
                    parts.Parts["t2rangeboost"].Name
                  } : ${toCurrency(parts.Parts["t2rangeboost"].Price)}\n
                      ${parts.Parts["t3rangeboost"].Emote}  ${
                    parts.Parts["t3rangeboost"].Name
                  } : ${toCurrency(parts.Parts["t3rangeboost"].Price)}\n
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/ctkwJ64/clutch1.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            } else if (value === "brakes_option") {
              let embed2;
              embed2 = new EmbedBuilder()
                .setTitle("Brakes")
                .setFooter(tipFooterPurchasePart)
                .setDescription(
                  `**
                  Page 1\n
                      ${parts.Parts["t1brakes"].Emote}  ${
                    parts.Parts["t1brakes"].Name
                  } : ${toCurrency(parts.Parts["t1brakes"].Price)}\n
                      ${parts.Parts["t2brakes"].Emote}  ${
                    parts.Parts["t2brakes"].Name
                  } : ${toCurrency(parts.Parts["t2brakes"].Price)}\n
                      ${parts.Parts["t3brakes"].Emote}  ${
                    parts.Parts["t3brakes"].Name
                  } : ${toCurrency(parts.Parts["t3brakes"].Price)}\n
                    
                  **`
                )
                .setColor(colors.blue)
                .setThumbnail("https://i.ibb.co/ctkwJ64/clutch1.png");
              interaction.editReply({ embeds: [embed2], components: [row] });
            }
          });
        } catch (err) {
          return msg.reply(`Error: ${err}`);
        }
      });
  },
};
