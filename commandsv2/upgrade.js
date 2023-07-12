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

    let exhaustcost = carprice * 0.25 * newtier1;
    let turbocost = carprice * 0.45 * newtier2;
    let tirecost = carprice * 0.15 * newtier3;
    let suspensioncost = carprice * 0.2 * newtier4;
    let enginecost = carprice * 0.75 * newtier0;
    let clutchcost = carprice * 0.15 * newtier5;
    let intercoolercost = carprice * 0.2 * newtier6;
    let intakecost = carprice * 0.15 * newtier7;
    let ecucost = carprice * 0.2 * newtier8;
    let gearboxcost = carprice * 0.3 * newtier9;

    let exhaustpower = 0;
    if (exhausttier <= 5) {
      exhaustpower = Math.round(
        parttiersdb[`exhaust${newtier1}`].Power * selected[0].Speed
      );
    }

    let turbopower = 0;
    if (turbotier <= 5) {
      turbopower = Math.round(
        parttiersdb[`turbo${newtier2}`].Power * selected[0].Speed
      );
    }
    let tirepower = 0;
    if (tiretier <= 5) {
      tirepower = Math.round(
        parttiersdb[`tires${newtier3}`].Handling * selected[0].Handling
      );
    }
    let suspensionpower = 0;
    if (suspensiontier <= 5) {
      suspensionpower = Math.round(
        parttiersdb[`suspension${newtier4}`].Handling * selected[0].Handling
      );
    }
    let enginepower = 0;
    if (enginetier <= 5) {
      enginepower = Math.round(
        parttiersdb[`engine${newtier0}`].Power * selected[0].Speed
      );
    }
    let clutchpower = 0;
    if (clutchtier <= 5) {
      clutchpower = Math.round(
        parttiersdb[`clutch${newtier5}`].Power * selected[0].Speed
      );
    }
    let intercoolerpower = 0
    if (intercoolertier <= 5) {
      intercoolerpower = Math.round(
        parttiersdb[`intercooler${newtier6}`].Power * selected[0].Speed
      );
    }
    let intakepower = 0;
    if (intaketier <= 5) {
      intakepower = Math.round(
        parttiersdb[`intake${newtier7}`].Power * selected[0].Speed
      );
    }
    let ecupower = 0;
    if (ecutier <= 5) {
      ecupower = Math.round(
        parttiersdb[`ecu${newtier8}`].Power * selected[0].Speed
      );
    }
    let gearboxpower = 0;
    if (gearboxtier <= 5) {
      gearboxpower = Math.round(
        parttiersdb[`gearbox${newtier9}`].Handling * selected[0].Handling
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
      exhaustacc = parttiersdb[`exhaust${newtier1}`].Acceleration;
    }
    let turboacc = 0;
    if (turbotier <= 5) {
      turboacc = parttiersdb[`turbo${newtier2}`].Acceleration;
    }
    let intakeacc = 0;
    if (intaketier <= 5) {
      intakeacc = parttiersdb[`intake${newtier7}`].Acceleration;
    }

    let embed = new EmbedBuilder()
      .setTitle(`Upgrade your ${selected[0].Name}`)
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
      let tier = selected[0][button.data.custom_id] || 1;
      let price =
        carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost * tier;
      if (tier >= 5) {
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
      let tier = selected[0][button.data.custom_id] || 1;
      let price =
        carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost * tier;
      console.log(tier);
      if (tier >= 5) {
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

      let price =
        carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost * tier;
      if (tier >= 5) {
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
      console.log(selected[0]);
      let tier = selected[0][i.customId] || 0;
      let newtier = (tier += 1);
      let price =
        Math.round(carprice * parttiersdb[`${i.customId}${newtier}`].Cost) *
        newtier;
      let power = Math.round(
        selected[0].Speed * parttiersdb[`${i.customId}${newtier}`].Power
      );
      let acceleration = parttiersdb[`${i.customId}${newtier}`].Acceleration;
      console.log(parttiersdb[`${i.customId}${newtier}`]);
      let handling = Math.round(
        selected[0].Handling * parttiersdb[`${i.customId}${newtier}`].Handling
      );
      if (price > userdata.cash) return i.update(`You don't have enough cash!`);
      let useracc = selected[0].Acceleration;
      let newacc = (useracc -= acceleration);
      console.log(power);
      userdata.cash -= price;
      if (parttiersdb[`${i.customId}${newtier}`].Power) {
        selected[0].Speed += power;
      }
      if (parttiersdb[`${i.customId}${newtier}`].Handling) {
        selected[0].Handling += handling;
      }
      if (parttiersdb[`${i.customId}${newtier}`].Acceleration && newacc >= 2) {
        selected[0].Acceleration -= acceleration;
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
        let price =
          carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost;
        if (tier >= 5) {
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
        let price =
          carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost;
        console.log(tier);
        if (tier >= 5) {
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

        let price =
          carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost;
        if (tier >= 5) {
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

      exhaustcost = carprice * 0.15 * newtier1;
      turbocost = carprice * 0.3 * newtier2;
      tirecost = carprice * 0.1 * newtier3;
      suspensioncost = carprice * 0.15 * newtier4;
      enginecost = carprice * 0.5 * newtier0;
      clutchcost = carprice * 0.12 * newtier5;
      intercoolercost = carprice * 0.15 * newtier6;
      intakecost = carprice * 0.1 * newtier7;
      ecucost = carprice * 0.15 * newtier8;
      gearboxcost = carprice * 0.3 * newtier9;

      let exhaustacc = 0;
      if (exhausttier <= 5) {
        exhaustacc = parttiersdb[`exhaust${newtier1}`].Acceleration;
      }
      let turboacc = 0;
      if (turbotier <= 5) {
        turboacc = parttiersdb[`turbo${newtier2}`].Acceleration;
      }
      let intakeacc = 0;
      if (intaketier <= 5) {
        intakeacc = parttiersdb[`intake${newtier7}`].Acceleration;
      }
      exhaustpower = 0;
      if (exhausttier <= 5) {
        exhaustpower = Math.round(
          parttiersdb[`exhaust${newtier1}`].Power * selected[0].Speed
        );
      }

      turbopower = 0;
      if (turbotier <= 5) {
        turbopower = Math.round(
          parttiersdb[`turbo${newtier2}`].Power * selected[0].Speed
        );
      }
      tirepower = 0;
      if (tiretier <= 5) {
        tirepower = Math.round(
          parttiersdb[`tires${newtier3}`].Handling * selected[0].Handling
        );
      }
      suspensionpower = 0;
      if (suspensiontier <= 5) {
        suspensionpower = Math.round(
          parttiersdb[`suspension${newtier4}`].Handling * selected[0].Handling
        );
      }
      enginepower = 0;
      if (enginetier <= 5) {
        enginepower = Math.round(
          parttiersdb[`engine${newtier0}`].Power * selected[0].Speed
        );
      }
      clutchpower = 0;
      if (clutchtier <= 5) {
        clutchpower = Math.round(
          parttiersdb[`clutch${newtier5}`].Power * selected[0].Speed
        );
      }
      intercoolerpower = 0;
      if (intercoolertier <= 5) {
        intercoolerpower = Math.round(
          parttiersdb[`intercooler${newtier6}`].Power * selected[0].Speed
        );
      }
      intakepower = 0;
      if (intaketier <= 5) {
        intakepower = Math.round(
          parttiersdb[`intake${newtier7}`].Power * selected[0].Speed
        );
      }
      ecupower = 0;
      if (ecutier <= 5) {
        ecupower = Math.round(
          parttiersdb[`ecu${newtier8}`].Power * selected[0].Speed
        );
      }
      gearboxpower = 0;
      if (gearboxtier <= 5) {
        gearboxpower = Math.round(
          parttiersdb[`gearbox${newtier9}`].Handling * selected[0].Handling
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
