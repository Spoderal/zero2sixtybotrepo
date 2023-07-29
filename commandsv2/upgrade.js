const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const { capitalize } = require("lodash");
const colors = require("../common/colors");
const emotes = require("../common/emotes").emotes;
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json").Cars;
const parttiersdb = require("../data/parttiers.json");
const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("upgrade")
    .setDescription("Upgrade a part on your car")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Your car ID or Name to upgrade")
        .setRequired(true)
    ),

  async execute(interaction) {
    let inputCarIdOrName = interaction.options.getString("car");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let usercars = userdata.cars || [];

    let selected = usercars.filter(
      (car) =>
        car.Name.toLowerCase() == inputCarIdOrName.toLowerCase() ||
        car.ID == inputCarIdOrName
    );

    if (selected.length == 0)
      return interaction.reply(
        "Thats not a car! Make sure to specify a car ID, or car name"
      );
    let carimage =
      selected[0].Image || cardb[selected[0].Name.toLowerCase()].Image;
    let carindb = cardb[selected[0].Name.toLowerCase()];
    let carprice = carindb.Price;
    if (carindb.Price == 0) {
      carprice = 5000;
    }

    let exhausttier = selected[0].exhaust || 0;
    let turbotier = selected[0].turbo || 0;
    let tiretier = selected[0].tires || 0;
    let suspensiontier = selected[0].suspension || 0;
    let enginetier = selected[0].engine || 0;
    let clutchtier = selected[0].clutch || 0;
    let intercoolertier = selected[0].intercooler || 0;
    let braketier = selected[0].brakes || 0;
    let intaketier = selected[0].intake || 0;
    let ecutier = selected[0].ecu || 0;
    let gearboxtier = selected[0].gearbox || 0;

    let newtier1 = (exhausttier += 1);
    let newtier2 = (turbotier += 1);
    let newtier3 = (tiretier += 1);
    let newtier4 = (suspensiontier += 1);
    let newtier5 = (clutchtier += 1);
    let newtier6 = (intercoolertier += 1);
    let newtier7 = (intaketier += 1);
    let newtier8 = (ecutier += 1);
    let newtier9 = (gearboxtier += 1);
    let newtier0 = (enginetier += 1);

    let exhaustcost = parttiersdb[`exhaust1`].Cost * newtier1;
    let turbocost = parttiersdb[`turbo1`].Cost * newtier2;
    let tirecost = parttiersdb[`tires1`].Cost * newtier3;
    let suspensioncost = parttiersdb[`suspension1`].Cost * newtier4;
    let enginecost = parttiersdb[`engine1`].Cost * newtier0;
    let clutchcost = parttiersdb[`clutch1`].Cost * newtier5;
    let intercoolercost = parttiersdb[`intercooler1`].Cost * newtier6;
    let intakecost = parttiersdb[`intake1`].Cost * newtier7;
    let ecucost = parttiersdb[`ecu1`].Cost * newtier8;
    let gearboxcost = parttiersdb[`gearbox1`].Cost * newtier9;

    let exhaustcost2 = parttiersdb[`exhaust1`].Cost * newtier1;
    let turbocost2 = parttiersdb[`turbo1`].Cost * newtier2;
    let tirecost2 = parttiersdb[`tires1`].Cost * newtier3;
    let suspensioncost2 = parttiersdb[`suspension1`].Cost * newtier4;
    let enginecost2 = parttiersdb[`engine1`].Cost * newtier0;
    let clutchcost2 = parttiersdb[`clutch1`].Cost * newtier5;
    let intercoolercost2 = parttiersdb[`intercooler1`].Cost * newtier6;
    let intakecost2 = parttiersdb[`intake1`].Cost * newtier7;
    let ecucost2 = parttiersdb[`ecu1`].Cost * newtier8;
    let gearboxcost2 = parttiersdb[`gearbox1`].Cost * newtier9;

    let totalcost =
      exhaustcost2 +
      turbocost2 +
      tirecost2 +
      suspensioncost2 +
      enginecost2 +
      clutchcost2 +
      intercoolercost2 +
      intakecost2 +
      ecucost2 +
      gearboxcost2;

    let exhaustpower = 0;
    if (exhausttier <= 5) {
      exhaustpower = Math.round(
        parttiersdb[`exhaust1`].Power * selected[0].Speed
      );
    }

    let turbopower = 0;
    if (turbotier <= 5) {
      turbopower = Math.round(parttiersdb[`turbo1`].Power * selected[0].Speed);
    }
    let tirepower = 0;
    if (tiretier <= 5) {
      tirepower = Math.round(
        parttiersdb[`tires1`].Handling * selected[0].Handling
      );
    }
    let suspensionpower = 0;
    if (suspensiontier <= 5) {
      suspensionpower = Math.round(
        parttiersdb[`suspension1`].Handling * selected[0].Handling
      );
    }
    let enginepower = 0;
    if (enginetier <= 5) {
      enginepower = Math.round(
        parttiersdb[`engine1`].Power * selected[0].Speed
      );
    }
    let clutchpower = 0;
    if (clutchtier <= 5) {
      clutchpower = Math.round(
        parttiersdb[`clutch1`].Power * selected[0].Speed
      );
    }
    let intercoolerpower = 0;
    if (intercoolertier <= 5) {
      intercoolerpower = Math.round(
        parttiersdb[`intercooler1`].Power * selected[0].Speed
      );
    }
    let intakepower = 0;
    if (intaketier <= 5) {
      intakepower = Math.round(
        parttiersdb[`intake1`].Power * selected[0].Speed
      );
    }
    let ecupower = 0;
    if (ecutier <= 5) {
      ecupower = Math.round(parttiersdb[`ecu1`].Power * selected[0].Speed);
    }
    let gearboxpower = 0;
    if (gearboxtier <= 5) {
      gearboxpower = Math.round(
        parttiersdb[`gearbox1`].Handling * selected[0].Handling
      );
    }

    let exhaustemote = partdb.Parts[`t1exhaust`].Emote;
    let turboemote = partdb.Parts[`turbo`].Emote;
    let tireemote = partdb.Parts[`t1tires`].Emote;
    let suspensionemote = partdb.Parts[`loan suspension`].Emote;
    let engineemote = partdb.Parts[`no engine`].Emote;
    let clutchemote = partdb.Parts[`t1clutch`].Emote;
    let intercooleremote = partdb.Parts[`t1intercooler`].Emote;
    let intakeemote = partdb.Parts[`t1intake`].Emote;
    let ecuemote = partdb.Parts[`t1ecu`].Emote;
    let gearboxemote = partdb.Parts[`t1gearbox`].Emote;

    let exhaustacc = 0;
    if (exhausttier <= 5) {
      exhaustacc = parttiersdb[`exhaust1`].Acceleration;
    }
    let turboacc = 0;
    if (turbotier <= 5) {
      turboacc = parttiersdb[`turbo1`].Acceleration;
    }
    let intakeacc = 0;
    if (intaketier <= 5) {
      intakeacc = parttiersdb[`intake1`].Acceleration;
    }

    let embed = new EmbedBuilder()
      .setTitle(`Upgrade your ${selected[0].Name}`)
      .setDescription(
        `Total cost to upgrade all parts: ${toCurrency(totalcost)}`
      )
      .addFields(
        {
          name: `${exhaustemote} Exhaust`,
          value: `Next Tier: ${newtier1}\nPower: ${exhaustpower}\nAcceleration: ${exhaustacc}\nCost to upgrade: ${toCurrency(
            exhaustcost
          )}`,
          inline: true,
        },
        {
          name: `${tireemote} Tires`,
          value: `Next Tier: ${newtier3}\nHandling: ${tirepower}\nCost to upgrade: ${toCurrency(
            tirecost
          )}`,
          inline: true,
        },
        {
          name: `${suspensionemote} Suspension`,
          value: `Next Tier: ${newtier4}\nHandling: ${suspensionpower}\nCost to upgrade: ${toCurrency(
            suspensioncost
          )}`,
          inline: true,
        },
        {
          name: `${turboemote} Turbo`,
          value: `Next Tier: ${newtier2}\nPower: ${turbopower}\nAcceleration: ${turboacc}\nCost to upgrade: ${toCurrency(
            turbocost
          )}`,
          inline: true,
        },
        {
          name: `${intakeemote} Intake`,
          value: `Next Tier: ${newtier7}\nPower: ${intakepower}\nAcceleration: ${intakeacc}\nCost to upgrade: ${toCurrency(
            intakecost
          )}`,
          inline: true,
        },
        {
          name: `${engineemote} Engine`,
          value: `Next Tier: ${newtier0}\nPower: ${enginepower}\nCost to upgrade: ${toCurrency(
            enginecost
          )}`,
          inline: true,
        },
        {
          name: `${intercooleremote} Intercooler`,
          value: `Next Tier: ${newtier6}\nPower: ${intercoolerpower}\nCost to upgrade: ${toCurrency(
            intercoolercost
          )}`,
          inline: true,
        },
        {
          name: `${ecuemote} ECU`,
          value: `Next Tier: ${newtier8}\nPower: ${ecupower}\nCost to upgrade: ${toCurrency(
            ecucost
          )}`,
          inline: true,
        },
        {
          name: `${clutchemote} Clutch`,
          value: `Next Tier: ${newtier5}\nPower: ${clutchpower}\nCost to upgrade: ${toCurrency(
            clutchcost
          )}`,
          inline: true,
        },
        {
          name: `${gearboxemote} Gearbox`,
          value: `Next Tier: ${newtier9}\nHandling: ${gearboxpower}\nCost to upgrade: ${toCurrency(
            gearboxcost
          )}`,
          inline: true,
        }
      )
      .setColor(colors.blue)
      .setThumbnail(carimage);

    let row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("exhaust")
        .setLabel("Upgrade Exhaust")
        .setEmoji(exhaustemote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("tires")
        .setLabel("Upgrade Tires")
        .setEmoji(tireemote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("suspension")
        .setLabel("Upgrade Suspension")
        .setEmoji(suspensionemote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("turbo")
        .setLabel("Upgrade Turbo")
        .setEmoji(turboemote)
        .setStyle("Success")
    );
    let row2 = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("intake")
        .setLabel("Upgrade Intake")
        .setEmoji(intakeemote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("engine")
        .setLabel("Upgrade Engine")
        .setEmoji(engineemote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("intercooler")
        .setLabel("Upgrade Intercooler")
        .setEmoji(intercooleremote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("ecu")
        .setLabel("Upgrade ECU")
        .setEmoji(ecuemote)
        .setStyle("Success")
    );
    let row3 = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("clutch")
        .setLabel("Upgrade Clutch")
        .setEmoji(clutchemote)
        .setStyle("Success"),
      new ButtonBuilder()
        .setCustomId("gearbox")
        .setLabel("Upgrade Gearbox")
        .setEmoji(gearboxemote)
        .setStyle("Success")
    );
    for (let butt in row.components) {
      let button = row.components[butt];
      let tier = selected[0][button.data.custom_id.toLowerCase()] || 0;
      let oldtier = tier;
      console.log(button.data.custom_id);
      let newtier = (tier += 1);
      let price = parttiersdb[`${button.data.custom_id}1`].Cost * newtier;
      if (oldtier >= 5) {
        button.setDisabled(true);
      }
      if (price > userdata.cash) {
        console.log("danger");
        button.setStyle(`Danger`);
        button.setDisabled(true);
      }
    }

    for (let butt in row2.components) {
      let button = row2.components[butt];
      let tier = selected[0][button.data.custom_id.toLowerCase()] || 0;
      let oldtier = tier;
      let newtier = (tier += 1);
      let price = parttiersdb[`${button.data.custom_id}1`].Cost * newtier;
      console.log(tier);
      if (oldtier >= 5) {
        button.setDisabled(true);
      }
      if (price > userdata.cash) {
        console.log("danger");
        button.setStyle(`Danger`);
        button.setDisabled(true);
      }
    }

    for (let butt in row3.components) {
      let button = row3.components[butt];

      let tier = selected[0][button.data.custom_id.toLowerCase()] || 0;
      let oldtier = tier;

      let newtier = (tier += 1);

      let price = parttiersdb[`${button.data.custom_id}1`].Cost * newtier;
      if (oldtier >= 5) {
        button.setDisabled(true);
      }

      if (price > userdata.cash) {
        console.log("danger");
        button.setStyle(`Danger`);
        button.setDisabled(true);
      }
    }

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row, row2, row3],
      fetchReply: true,
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector.on("collect", async (i) => {
      let cooldowns =  (await Cooldowns.findOne({ id: interaction.user.id })) || new Cooldowns({ id: interaction.user.id });
      let timeout2 = 5000
      if (
        cooldowns.is_racing !== null &&
        timeout2 - (Date.now() - cooldowns.is_racing) > 0
      ) {
        cooldowns.command_ran = Date.now();
        return await interaction.channel.send({
          content: `Wait for your race to finish to run other commands`,
          fetchReply: true,
          ephemeral: true,
        })

      }
      console.log(selected[0]);
      let tier = selected[0][i.customId] || 0;
      let newtier = (tier += 1);
      let price = Math.round(parttiersdb[`${i.customId}1`].Cost) * newtier;
      let power = Math.round(
        selected[0].Speed * parttiersdb[`${i.customId}1`].Power
      );
      let acceleration = parttiersdb[`${i.customId}1`].Acceleration;
      console.log(parttiersdb[`${i.customId}1`]);
      let handling = Math.round(
        selected[0].Handling * parttiersdb[`${i.customId}1`].Handling
      );
      if (price > userdata.cash) return i.update(`You don't have enough cash!`);
      let useracc = selected[0].Acceleration;
      let newacc = (useracc -= acceleration);
      console.log(power);
      userdata.cash -= price;
      if (parttiersdb[`${i.customId}1`].Power) {
        selected[0].Speed += power;
      }
      if (parttiersdb[`${i.customId}1`].Handling) {
        selected[0].Handling += handling;
      }
      if (parttiersdb[`${i.customId}1`].Acceleration && newacc >= 2) {
        selected[0].Acceleration -= acceleration;
      } else if (parttiersdb[`${i.customId}1`].Acceleration && newacc < 2) {
        selected[0].Acceleration = 2;
      }

      selected[0][i.customId] = newtier;

      console.log(selected[0]);

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": selected[0],
          },
        },

        {
          arrayFilters: [
            {
              "car.Name": selected[0].Name,
            },
          ],
        }
      );

      userdata.save();

      for (let butt in row.components) {
        let button = row.components[butt];
        let tier = selected[0][button.data.custom_id] || 1;
        let oldtier = tier;
        let newtier = (tier += 1);
        let price = parttiersdb[`${button.data.custom_id}1`].Cost * newtier;
        if (oldtier >= 5) {
          button.setDisabled(true);
        }
        if (price > userdata.cash) {
          console.log("danger");
          button.setStyle(`Danger`);
          button.setDisabled(true);
        }
      }
      if (newtier > 5) {
        newtier = 5;
      }

      for (let butt in row2.components) {
        let button = row2.components[butt];
        let tier = selected[0][button.data.custom_id] || 1;
        let oldtier = tier;
        let newtier = (tier += 1);

        let price = parttiersdb[`${button.data.custom_id}1`].Cost * newtier;
        console.log(tier);
        if (oldtier >= 5) {
          button.setDisabled(true);
        }
        if (price > userdata.cash) {
          console.log("danger");
          button.setStyle(`Danger`);
          button.setDisabled(true);
        }
      }

      for (let butt in row3.components) {
        let button = row3.components[butt];

        let tier = selected[0][button.data.custom_id.toLowerCase()] || 1;
        let oldtier = tier;

        let newtier = (tier += 1);
        let price = parttiersdb[`${button.data.custom_id}1`].Cost * newtier;
        if (oldtier >= 5) {
          button.setDisabled(true);
        }

        if (price > userdata.cash) {
          console.log("danger");
          button.setStyle(`Danger`);
          button.setDisabled(true);
        }
      }

      selected = userdata.cars.filter((car) => car == selected[0]);

      exhausttier = selected[0].exhaust || 0;
      turbotier = selected[0].turbo || 0;
      tiretier = selected[0].tires || 0;
      suspensiontier = selected[0].suspension || 0;
      enginetier = selected[0].engine || 0;
      clutchtier = selected[0].clutch || 0;
      intercoolertier = selected[0].intercooler || 0;
      braketier = selected[0].brakes || 0;
      intaketier = selected[0].intake || 0;
      ecutier = selected[0].ecu || 0;
      gearboxtier = selected[0].gearbox || 0;

      newtier1 = exhausttier += 1;
      newtier2 = turbotier += 1;
      newtier3 = tiretier += 1;
      newtier4 = suspensiontier += 1;
      newtier5 = clutchtier += 1;
      newtier6 = intercoolertier += 1;
      newtier7 = intaketier += 1;
      newtier8 = ecutier += 1;
      newtier9 = gearboxtier += 1;
      newtier0 = enginetier += 1;

      exhaustcost = parttiersdb.exhaust1.Cost * newtier1;
      turbocost = parttiersdb.turbo1.Cost * newtier2;
      tirecost = parttiersdb.tires1.Cost * newtier3;
      suspensioncost = parttiersdb.suspension1.Cost * newtier4;
      enginecost = parttiersdb.engine1.Cost * newtier0;
      clutchcost = parttiersdb.clutch1.Cost * newtier5;
      intercoolercost = parttiersdb.intercooler1.Cost * newtier6;
      intakecost = parttiersdb.intake1.Cost * newtier7;
      ecucost = parttiersdb.ecu1.Cost * newtier8;
      gearboxcost = parttiersdb.gearbox1.Cost * newtier9;

      let exhaustacc = 0;
      if (exhausttier <= 5) {
        exhaustacc = parttiersdb[`exhaust1`].Acceleration;
      }
      let turboacc = 0;
      if (turbotier <= 5) {
        turboacc = parttiersdb[`turbo1`].Acceleration;
      }
      let intakeacc = 0;
      if (intaketier <= 5) {
        intakeacc = parttiersdb[`intake1`].Acceleration;
      }
      exhaustpower = 0;
      if (exhausttier <= 5) {
        exhaustpower = Math.round(
          parttiersdb[`exhaust1`].Power * selected[0].Speed
        );
      }

      turbopower = 0;
      if (turbotier <= 5) {
        turbopower = Math.round(
          parttiersdb[`turbo1`].Power * selected[0].Speed
        );
      }
      tirepower = 0;
      if (tiretier <= 5) {
        tirepower = Math.round(
          parttiersdb[`tires1`].Handling * selected[0].Handling
        );
      }
      suspensionpower = 0;
      if (suspensiontier <= 5) {
        suspensionpower = Math.round(
          parttiersdb[`suspension1`].Handling * selected[0].Handling
        );
      }
      enginepower = 0;
      if (enginetier <= 5) {
        enginepower = Math.round(
          parttiersdb[`engine1`].Power * selected[0].Speed
        );
      }
      clutchpower = 0;
      if (clutchtier <= 5) {
        clutchpower = Math.round(
          parttiersdb[`clutch1`].Power * selected[0].Speed
        );
      }
      intercoolerpower = 0;
      if (intercoolertier <= 5) {
        intercoolerpower = Math.round(
          parttiersdb[`intercooler1`].Power * selected[0].Speed
        );
      }
      intakepower = 0;
      if (intaketier <= 5) {
        intakepower = Math.round(
          parttiersdb[`intake1`].Power * selected[0].Speed
        );
      }
      ecupower = 0;
      if (ecutier <= 5) {
        ecupower = Math.round(parttiersdb[`ecu1`].Power * selected[0].Speed);
      }
      gearboxpower = 0;
      if (gearboxtier <= 5) {
        gearboxpower = Math.round(
          parttiersdb[`gearbox1`].Handling * selected[0].Handling
        );
      }

      embed.setFields(
        {
          name: `${exhaustemote} Exhaust`,
          value: `Next Tier: ${newtier1}\nPower: ${exhaustpower}\nAcceleration: ${exhaustacc}\nCost to upgrade: ${toCurrency(
            exhaustcost
          )}`,
          inline: true,
        },
        {
          name: `${tireemote} Tires`,
          value: `Next Tier: ${newtier3}\nHandling: ${tirepower}\nCost to upgrade: ${toCurrency(
            tirecost
          )}`,
          inline: true,
        },
        {
          name: `${suspensionemote} Suspension`,
          value: `Next Tier: ${newtier4}\nHandling: ${suspensionpower}\nCost to upgrade: ${toCurrency(
            suspensioncost
          )}`,
          inline: true,
        },
        {
          name: `${turboemote} Turbo`,
          value: `Next Tier: ${newtier2}\nPower: ${turbopower}\nAcceleration: ${turboacc}\nCost to upgrade: ${toCurrency(
            turbocost
          )}`,
          inline: true,
        },
        {
          name: `${intakeemote} Intake`,
          value: `Next Tier: ${newtier7}\nPower: ${intakepower}\nAcceleration: ${intakeacc}\nCost to upgrade: ${toCurrency(
            intakecost
          )}`,
          inline: true,
        },
        {
          name: `${engineemote} Engine`,
          value: `Next Tier: ${newtier0}\nPower: ${enginepower}\nCost to upgrade: ${toCurrency(
            enginecost
          )}`,
          inline: true,
        },
        {
          name: `${intercooleremote} Intercooler`,
          value: `Next Tier: ${newtier6}\nPower: ${intercoolerpower}\nCost to upgrade: ${toCurrency(
            intercoolercost
          )}`,
          inline: true,
        },
        {
          name: `${ecuemote} ECU`,
          value: `Next Tier: ${newtier8}\nPower: ${ecupower}\nCost to upgrade: ${toCurrency(
            ecucost
          )}`,
          inline: true,
        },
        {
          name: `${clutchemote} Clutch`,
          value: `Next Tier: ${newtier5}\nPower: ${clutchpower}\nCost to upgrade: ${toCurrency(
            clutchcost
          )}`,
          inline: true,
        },
        {
          name: `${gearboxemote} Gearbox`,
          value: `Next Tier: ${newtier9}\nHandling: ${gearboxpower}\nCost to upgrade: ${toCurrency(
            gearboxcost
          )}`,
          inline: true,
        }
      );

      await i.update({
        embeds: [embed],
        content: `✅`,
        components: [row, row2, row3],
      });
    });
  },
};
