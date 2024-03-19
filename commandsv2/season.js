

const seasons = require("../data/seasons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldown = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const cardb = require("../data/cardb.json");
const lodash = require("lodash");
const itemdb = require("../data/items.json");
const emotes = require("../common/emotes").emotes;
const ms = require("ms");
const outfitdb = require("../data/characters.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("season")
    .setDescription("Check the season 4 rewards page"),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata = await Cooldown.findOne({ id: interaction.user.id });
    let seasonRewards = seasons.Seasons.Spring.Rewards;
    let notoriety = userdata.notoriety;
    let premiumpass = userdata.premium

    if(premiumpass == false && userdata.zpass == true){
      userdata.premium = true
      premiumpass = true
    }
  

    let rewards = [];

    for (let rew in seasonRewards) {
      let re = seasonRewards[rew];
      let rewardobj = {
        Number: re.Number,
        Item: re.Item,
        Premium: re.Premium,
        Required: re.Required,
      };

      rewards.push(rewardobj);
    }

    rewards = lodash.chunk(
      rewards.map((a) => a),
      6
    );

    let pages = [
      {
        page: 1,
        image:"https://i.ibb.co/93zQt1N/season4-page.png"
      },
      {
        page: 2,
        image:"https://i.ibb.co/85tHHYV/season4-page2.png"
      },
      {
        page: 3,
        image:"https://i.ibb.co/W2HrN4J/season4-page3.png"
      },
      {
        page: 4,
        image:"https://i.ibb.co/8zfchwz/season4-page4.png"
      },
      {
        page: 5,
        image:"https://i.ibb.co/VCJvxFg/season4-page5.png"
      },
      {
        page: 6,
        image:"https://i.ibb.co/DffLV43/season4-page6.png"
      },
      {
        page: 7,
        image:"https://i.ibb.co/q58HG6y/season4-page7.png"
      },
      {
        page: 8,
        image:"https://i.ibb.co/c6sWBQL/season4-page8.png"
      },
      {
        page: 9,
        image:"https://i.ibb.co/f1kFTmY/season4-page9.png"
      },
      {
        page: 10,
        image:"https://i.ibb.co/X85g6Sf/season4-page10.png"
      },
      {
        page: 11,
        image:"https://i.ibb.co/K79bBg8/season4-page11.png"
      },
      {
        page: 12,
        image:"https://i.ibb.co/3F5Pfhw/season4-page12.png"
      },
      {
        page: 13,
        image:"https://i.ibb.co/C9QMpwK/season4-page13.png"
      }
    ]
    


    let claimable = userdata.seasonclaimed || 1;


 

    let row9 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("first")
        .setEmoji("⏪")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("last")
        .setEmoji("⏩")
        .setStyle("Secondary")
    );

    let rowclaim = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("claim")
        .setEmoji("✔️")
        .setLabel(`Claim Reward ${claimable}`)
        .setStyle("Success"),
      

    );
    console.log(premiumpass)
    if(premiumpass == false){
      rowclaim.addComponents(
        new ButtonBuilder()
        .setCustomId("buy")
        .setEmoji("🪙")
        .setLabel(`Buy Premium Pass 500 Gold`)
        .setStyle("Success")
      )
    }

    let rewardtoclaim = seasonRewards[`${claimable}`];

    if (rewardtoclaim.Required > notoriety) {
      rowclaim.components[0].setEmoji("✖️");
      rowclaim.components[0].setStyle("Danger");
    }

    let page = 0;
    let vispage = 1;
    let rewarddisp = ""
    console.log(rewardtoclaim)
    if(rewardtoclaim.Item.toLowerCase().endsWith("cash")) {
      rewarddisp = `${emotes.cash} Cash: ${toCurrency(rewardtoclaim.Item.split(" ")[0])}`
    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("garage space") || rewardtoclaim.Item.toLowerCase().endsWith("garage spaces")) {
      rewarddisp = `${emotes.garage} garage space: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(itemdb[rewardtoclaim.Item.toLowerCase()]) {
      rewarddisp = `${itemdb[rewardtoclaim.Item.toLowerCase()].Emote} ${itemdb[rewardtoclaim.Item.toLowerCase()].Name}`

    }

    else if(cardb.Cars[rewardtoclaim.Item.toLowerCase()]) {
      rewarddisp = `${cardb.Cars[rewardtoclaim.Item.toLowerCase()].Emote} ${cardb.Cars[rewardtoclaim.Item.toLowerCase()].Name}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("barn map") || rewardtoclaim.Item.toLowerCase().endsWith("barn maps")) {
      rewarddisp = `${emotes.barnMapCommon} Barn Maps: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("t5voucher") || rewardtoclaim.Item.toLowerCase().endsWith("t5vouchers")) {
      rewarddisp = `${emotes.t5voucher} T5Vouchers: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("exotic keys")) {
      rewarddisp = `${emotes.ekey} Exotic Keys: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("rare keys")) {
      rewarddisp = `${emotes.rkey} Rare Keys: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("common keys")) {
      rewarddisp = `${emotes.ckey} Common Keys: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("lockpicks") || rewardtoclaim.Item.toLowerCase().endsWith("lockpick")) {
      rewarddisp = `${emotes.lockpicks} Lockpicks: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("wheelspin") || rewardtoclaim.Item.toLowerCase().endsWith("wheelspins")) {
      rewarddisp = `${emotes.wheelSpin} Wheelspins: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("superwheelspins") || rewardtoclaim.Item.toLowerCase().endsWith("superwheelspin")) {
      rewarddisp = `${emotes.superWheel} Super Wheelspins: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("blueprint") || rewardtoclaim.Item.toLowerCase().endsWith("blueprints")) {
      rewarddisp = `${emotes.blueprints} Blueprints: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("xp")) {
      rewarddisp = `${emotes.xp} XP: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Item.toLowerCase().endsWith("gold")) {
      rewarddisp = `${emotes.gold} Gold: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(outfitdb.Helmets[rewardtoclaim.Item.toLowerCase()]) {
      rewarddisp = `${outfitdb.Helmets[rewardtoclaim.Item.toLowerCase()].Emote} ${outfitdb.Helmets[rewardtoclaim.Item.toLowerCase()].Name}`

    }
    else if(partdb.Parts[rewardtoclaim.Item.toLowerCase()]) {
      rewarddisp = `${partdb.Parts[rewardtoclaim.Item.toLowerCase()].Emote} ${partdb.Parts[rewardtoclaim.Item.toLowerCase()].Name}`

    }

    //premium
    let premiumreward = ""
    if(rewardtoclaim.Premium.toLowerCase().endsWith("cash")) {
      premiumreward = `${emotes.cash} Cash: ${toCurrency(rewardtoclaim.Premium.split(" ")[0])}`
    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("garage space") || rewardtoclaim.Premium.toLowerCase().endsWith("garage spaces")) {
      premiumreward = `${emotes.garage} garage space: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(itemdb[rewardtoclaim.Premium.toLowerCase()]) {
      premiumreward = `${itemdb[rewardtoclaim.Item.toLowerCase()].Emote} ${itemdb[rewardtoclaim.Item.toLowerCase()].Name}`

    }

    else if(cardb.Cars[rewardtoclaim.Premium.toLowerCase()]) {
      premiumreward = `${cardb.Cars[rewardtoclaim.Premium.toLowerCase()].Emote} ${cardb.Cars[rewardtoclaim.Premium.toLowerCase()].Name}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("barn map") || rewardtoclaim.Premium.toLowerCase().endsWith("barn maps")) {
      rewarddisp = `${emotes.barnMapCommon} Barn Maps: ${rewardtoclaim.Item.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("t5voucher") || rewardtoclaim.Premium.toLowerCase().endsWith("t5vouchers")) {
      premiumreward = `${emotes.t5voucher} T5Vouchers: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("exotic keys")) {
      premiumreward = `${emotes.ekey} Exotic Keys: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("rare keys")) {
      premiumreward = `${emotes.rkey} Rare Keys: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("common keys")) {
      premiumreward = `${emotes.ckey} Common Keys: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("lockpicks") || rewardtoclaim.Premium.toLowerCase().endsWith("lockpick")) {
      premiumreward = `${emotes.lockpicks} Lockpicks: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("wheelspin") || rewardtoclaim.Premium.toLowerCase().endsWith("wheelspins")) {
      premiumreward = `${emotes.wheelSpin} Wheelspins: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("superwheelspins") || rewardtoclaim.Premium.toLowerCase().endsWith("superwheelspin")) {
      premiumreward = `${emotes.superWheel} Super Wheelspins: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("blueprint") || rewardtoclaim.Premium.toLowerCase().endsWith("blueprints")) {
      premiumreward = `${emotes.blueprints} Blueprints: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("f1blueprint") || rewardtoclaim.Premium.toLowerCase().endsWith("f1blueprints")) {
      premiumreward = `${emotes.f1blueprint} F1 Blueprints: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("xp")) {
      premiumreward = `${emotes.xp} XP: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(rewardtoclaim.Premium.toLowerCase().endsWith("gold")) {
      premiumreward = `${emotes.gold} Gold: ${rewardtoclaim.Premium.split(" ")[0]}`

    }
    else if(outfitdb.Helmets[rewardtoclaim.Premium.toLowerCase()]) {
      premiumreward = `${outfitdb.Helmets[rewardtoclaim.Premium.toLowerCase()].Emote} ${outfitdb.Helmets[rewardtoclaim.Premium.toLowerCase()].Name}`

    }
    else if(partdb.Parts[rewardtoclaim.Premium.toLowerCase()]) {
      premiumreward = `${partdb.Parts[rewardtoclaim.Premium.toLowerCase()].Emote} ${partdb.Parts[rewardtoclaim.Premium.toLowerCase()].Name}`

    }

    let embed = new EmbedBuilder()
      .setTitle(`Season 4 Page ${vispage}/${pages.length}`)
      .setColor(colors.blue)
      .setThumbnail(seasons.Seasons.Spring.Image)
      .setDescription(`Tier ${claimable}: ${notoriety}/${rewardtoclaim.Required}\nReward: ${rewarddisp}\nPremium Reward: ${premiumreward}\n\nEnds <t:1717128000:f>`)
      .setImage("https://i.ibb.co/93zQt1N/season4-page.png")


    let msg = await interaction.reply({
      embeds: [embed],
      components: [row9, rowclaim],
      fetchReply: true,
    });
    if(userdata.tutorial && userdata.tutorial.type == "season" && userdata.tutorial.stage == 3){
      if(userdata.seasonclaimed > 1) {
        userdata.tutorial.stage = 5
        userdata.tutorial.seasonfinished = true
        userdata.notoriety += 5000
        userdata.save()
       return interaction.channel.send(`**TUTORIAL**: You've already claimed a reward, you can claim more rewards by clicking the claim button.`)
      }
      let tut = userdata.tutorial
      tut.stage += 1
      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "tutorial": tut,
          },
        },

      );
      userdata.notoriety += 1000
      userdata.save()
      interaction.channel.send(`**TUTORIAL**: Ok, now we are at the season page. Here you can see the rewards for the season. You can claim the rewards by clicking the claim button. If you have the premium pass, you can claim the premium rewards as well. You can buy the premium pass for 500 gold. You can navigate through the pages by clicking the buttons. You can also click the first and last button to go to the first and last page of the rewards.\n\nLets try clicking claim, I've given you enough notoriety to claim the reward. Click the claim button now!`)
    }
    cooldowndata.opened = Date.now();
    cooldowndata.save();
    let filter = (btnInt) => {
      return interaction.user.id == btnInt.user.id;
    };
    const collector = msg.createMessageComponentCollector({
      filter: filter,
    });
    collector.on("collect", async (i) => {
      
      if (i.customId == "next") {
        if (page >= 13) return interaction.editReply("No more pages!");
        page ++ ;
        vispage++;
      } else if (i.customId == "previous") {
        if ((page <= 0)) return interaction.editReply("No more pages!");
        page--;
        vispage--;
      }
      else if (i.customId == "last") {
        page = 12
        vispage = 13
      }
      else if (i.customId == "first") {
        page = 0
        vispage = 1
      }
      else if(i.customId == "buy"){
        if(userdata.gold < 500) return interaction.editReply("You don't have enough gold to buy the premium pass!");
        userdata.gold -= 500;
        userdata.premium = true;
        premiumpass = true;
        userdata.save()
        rowclaim = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claim")
            .setEmoji("✔️")
            .setLabel(`Claim Reward ${claimable}`)
            .setStyle("Success"),
          
    
        );

       await interaction.editReply({components: [rowclaim]})
      }
      else if (i.customId == "claim") {
          userdata = await User.findOne({id: interaction.user.id})
          notoriety = userdata.notoriety;

          if (rewardtoclaim.Required > notoriety) return;

          if(rewardtoclaim.Item.toLowerCase().endsWith("cash")) {
            userdata.cash += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }

          else if(rewardtoclaim.Item.toLowerCase().endsWith("garage space") || rewardtoclaim.Item.toLowerCase().endsWith("garage spaces")) {
            userdata.garageLimit += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(itemdb[rewardtoclaim.Item.toLowerCase()]) {
            userdata.items.push(rewardtoclaim.Item.toLowerCase());
          }
      
          else if(cardb.Cars[rewardtoclaim.Item.toLowerCase()]) {
            let car = cardb.Cars[rewardtoclaim.Item.toLowerCase()];
            let carobj = {
              ID: car.alias,
              Name: car.Name,
              Speed: car.Speed,
              Acceleration: car["0-60"],
              Handling: car.Handling,
              WeightStat: car.Weight,
              Emote: car.Emote,
              Livery: car.Image,
              Miles: 0,
              Resale:0,
              Gas: 10,
              MaxGas: 10,
            }
            userdata.cars.push(carobj)
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("barn map") || rewardtoclaim.Item.toLowerCase().endsWith("barn maps")) {
            userdata.barnmaps += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("t5voucher") || rewardtoclaim.Item.toLowerCase().endsWith("t5vouchers")) {
            userdata.t5vouchers += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("exotic keys")) {
            userdata.ekeys += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("rare keys")) {
            userdata.rkeys += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("common keys")) {
            userdata.ckeys += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("lockpicks") || rewardtoclaim.Item.toLowerCase().endsWith("lockpick")) {
            userdata.lockpicks += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("wheelspin") || rewardtoclaim.Item.toLowerCase().endsWith("wheelspins")) {
            userdata.wheelspins += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("superwheelspins") || rewardtoclaim.Item.toLowerCase().endsWith("superwheelspin")) {
            userdata.swheelspins += parseInt(rewardtoclaim.Item.split(" ")[0]);

          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("blueprint") || rewardtoclaim.Item.toLowerCase().endsWith("blueprints")) {
            userdata.blueprints += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("xp")) {
            userdata.xp += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(rewardtoclaim.Item.toLowerCase().endsWith("gold")) {
            userdata.gold += parseInt(rewardtoclaim.Item.split(" ")[0]);
          }
          else if(outfitdb.Helmets[rewardtoclaim.Item.toLowerCase()]) {
            userdata.outfits.push(rewardtoclaim.Item.toLowerCase());
          }
          else if(partdb.Parts[rewardtoclaim.Item.toLowerCase()]) {
            userdata.parts.push(rewardtoclaim.Item.toLowerCase());
          }
      
          //premium
          if(premiumpass == true){

          
          if(rewardtoclaim.Premium.toLowerCase().endsWith("cash")) {
            userdata.cash += parseInt(rewardtoclaim.Premium.split(" ")[0]);
          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("garage space") || rewardtoclaim.Premium.toLowerCase().endsWith("garage spaces")) {
            userdata.garageLimit += parseInt(rewardtoclaim.Premium.split(" ")[0]);
          }
          else if(itemdb[rewardtoclaim.Premium.toLowerCase()]  ) {
            userdata.items.push(rewardtoclaim.Premium.toLowerCase());
          }
      
          else if(cardb.Cars[rewardtoclaim.Premium.toLowerCase()] ) {
            let car = cardb.Cars[rewardtoclaim.Premium.toLowerCase()];
            let carobj = {
              ID: car.alias,
              Name: car.Name,
              Speed: car.Speed,
              Acceleration: car["0-60"],
              Handling: car.Handling,
              WeightStat: car.Weight,
              Emote: car.Emote,
              Livery: car.Image,
              Miles: 0,
              Resale:0,
              Gas: 10,
              MaxGas: 10,
            }
            userdata.cars.push(carobj);
          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("barn map")  || rewardtoclaim.Premium.toLowerCase().endsWith("barn maps") ) {
            userdata.barnMaps += parseInt(rewardtoclaim.Premium.split(" ")[0]);
          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("t5voucher")  || rewardtoclaim.Premium.toLowerCase().endsWith("t5vouchers") ) {
            userdata.t5vouchers += parseInt(rewardtoclaim.Premium.split(" ")[0]);
          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("exotic keys")) {
            userdata.ekeys += parseInt(rewardtoclaim.Premium.split(" ")[0]);
          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("rare keys") ) {
            userdata.rkeys += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("common keys") ) {
            userdata.ckeys += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("lockpicks") || rewardtoclaim.Premium.toLowerCase().endsWith("lockpick")) {
            userdata.lockpicks += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("wheelspin") || rewardtoclaim.Premium.toLowerCase().endsWith("wheelspins") ) {
            userdata.wheelspins += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("superwheelspins") || rewardtoclaim.Premium.toLowerCase().endsWith("superwheelspin")) {
            userdata.swheelspins += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("blueprint") || rewardtoclaim.Premium.toLowerCase().endsWith("blueprints") ) {
            userdata.blueprints += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("f1blueprint")  || rewardtoclaim.Premium.toLowerCase().endsWith("f1blueprints") ) {
            userdata.f1blueprint += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("xp")) {
            userdata.xp += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(rewardtoclaim.Premium.toLowerCase().endsWith("gold") ) {
            userdata.gold += parseInt(rewardtoclaim.Premium.split(" ")[0]);

          }
          else if(outfitdb.Helmets[rewardtoclaim.Premium.toLowerCase()] ) {
            userdata.outfits.push(rewardtoclaim.Premium.toLowerCase());

          }
          else if(partdb.Parts[rewardtoclaim.Premium.toLowerCase()] ) {
            userdata.parts.push(rewardtoclaim.Premium.toLowerCase());
          }
        }
        
          notoriety = userdata.notoriety;
          userdata.seasonclaimed += 1
          userdata.save()
      }
      

      console.log(page)
      embed = new EmbedBuilder()
        .setTitle(`Season 4 Page ${vispage}/${pages.length}`)
        .setColor(colors.blue)
        .setThumbnail(seasons.Seasons.Spring.Image)
        .setImage(pages[page].image)
        .setDescription(`Tier ${claimable}: ${notoriety}/${rewardtoclaim.Required}\nReward: ${rewarddisp}\nPremium Reward: ${premiumreward}\n\nEnds <t:1717128000:f>`)

   
      claimable = userdata.seasonclaimed;

      rowclaim = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claim")
          .setEmoji("✔️")
          .setLabel(`Claim Reward ${claimable}`)
          .setStyle("Success")
      );

      rewardtoclaim = seasonRewards[`${claimable}`];

      if (rewardtoclaim.Required > notoriety) {
        rowclaim.components[0].setEmoji("✖️");
        rowclaim.components[0].setStyle("Danger");
      }

      await interaction.editReply({
        embeds: [embed],
        fetchReply: true,
        components: [row9, rowclaim],
      });

      if(userdata.tutorial && userdata.tutorial.type == "season" && userdata.tutorial.stage == 4){
        let tut = userdata.tutorial
        tut.stage += 1
        tut.seasonfinished = true
        
      tut.started = false
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "tutorial": tut,
            },
          },
  
        );
        userdata.notoriety += 5000
        userdata.save()
        interaction.channel.send(`**TUTORIAL**: Now that we've claimed our reward, we can see that the reward has been added to our inventory. You can also see the premium reward if you have the premium pass\n\nYou can earn more notoriety to claim these rewards with the seasonal race you see in /events\nThats all for the season tutorial! I've given you 5k notoriety as a reward for completing the tutorial`)
      }
    });
  },
};
