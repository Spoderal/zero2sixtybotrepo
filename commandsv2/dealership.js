const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  CommandInteractionOptionResolver,
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency } = require("../common/utils");
const { tipFooterPurchaseCar } = require("../common/tips");
const lodash = require("lodash")
const User = require("../schema/profile-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dealer")
    .setDescription("The car dealership"),
  async execute(interaction) {
    let userdata = await User.findOne({id: interaction.user.id})

     
      let carclassDarr = []
      let carclassCarr = []
      let carclassBarr = []
      let carclassAarr = []
      let carclassSarr = []

      for(let c in cars.Cars){
        let car = cars.Cars[c]

        if(car.Class == "D" && car.Price > 0 && !car.Police){
          carclassDarr.push({Name: car.Name, Price: car.Price, alias: car.alias, icon: car.Emote})
        }
       else if(car.Class == "C" && car.Price > 0 && !car.Police){
          carclassCarr.push({Name: car.Name, Price: car.Price, alias: car.alias, icon: car.Emote})

        }
        else if(car.Class == "B" && car.Price > 0 && !car.Police){
          carclassBarr.push({Name: car.Name, Price: car.Price, alias: car.alias, icon: car.Emote})

        }
        else  if(car.Class == "A" && car.Price > 0 && !car.Police){
          carclassAarr.push({Name: car.Name, Price: car.Price, alias: car.alias, icon: car.Emote})

        }
        else  if(car.Class == "S" && car.Price > 0 && !car.Police){
          carclassSarr.push({Name: car.Name, Price: car.Price, alias: car.alias, icon: car.Emote})

        }
      }
      carclassDarr = carclassDarr.sort((a, b) => {
        return a.Price - b.Price;
    });
    carclassCarr = carclassCarr.sort((a, b) => {
      return a.Price - b.Price;
  });

  carclassBarr = carclassBarr.sort((a, b) => {
    return a.Price - b.Price;
});

carclassAarr = carclassAarr.sort((a, b) => {
  return a.Price - b.Price;
});

carclassSarr = carclassSarr.sort((a, b) => {
  return a.Price - b.Price;
});


      carclassDarr = lodash.chunk(
        carclassDarr.map((a) => a),
        10
      );

      carclassCarr = lodash.chunk(
        carclassCarr.map((a) => a),
        10
      );

      carclassBarr = lodash.chunk(
        carclassBarr.map((a) => a),
        10
      );

      carclassAarr = lodash.chunk(
        carclassAarr.map((a) => a),
        10
      );

      carclassSarr = lodash.chunk(
        carclassSarr.map((a) => a),
        10
      );


      let row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId("classD")
        .setEmoji("<:class_d:1030953018591559720>")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("classC")
        .setEmoji("<:class_c:1030953017249386546>")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("classB")
        .setEmoji("<:class_b:1030953016204996678>")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("classA")
        .setEmoji("<:class_a:1030953021678567554>")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("classS")
        .setEmoji("<:CLASS_S:1030953020806152222>")
        .setStyle("Secondary"),
      )

      let embed = new EmbedBuilder()
      .setThumbnail("https://i.ibb.co/SfwjQY9/dealericon.png")
      .setColor(colors.blue)
      .setDescription(`Welcome to the dealership! Click on a class to begin looking through the cars we have available.`)
      
      
      let msg = await interaction.reply({embeds: [embed], components: [row2], fetchReply: true})
      
      let page
      let filter2 = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector2 = msg.createMessageComponentCollector({
        filter: filter2,
      });
      
      let classpage 
      collector2.on('collect', async (i) => {

        if(i.customId.includes("classD")){
          classpage = carclassDarr
          embed = new EmbedBuilder()
          .setTitle("Class D Dealership")
          let row = new ActionRowBuilder().addComponents(
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
              .setEmoji("⏮️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("last")
              .setEmoji("⏭️")
              .setStyle("Secondary")
          );
           embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/SfwjQY9/dealericon.png")
          .setColor(colors.blue)
          embed.setFooter({ text: `Pages 1/${classpage.length}` });

          console.dir(carclassDarr[0])
          for(let b in carclassDarr[0]){
            let car = carclassDarr[0][b]
            console.dir(car)
            embed.addFields({name: `${car.icon} ${car.Name}`, value:`\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}`, inline: true})
          }
           await i.update({embeds: [embed], components: [row, row2], fetchReply: true})

            page = 1;

           
          }
          else if(i.customId.includes("classC")){
            classpage = carclassCarr
            embed = new EmbedBuilder()
            .setTitle("Class C Dealership")
            let row = new ActionRowBuilder().addComponents(
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
                .setEmoji("⏮️")
                .setStyle("Secondary"),
              new ButtonBuilder()
                .setCustomId("last")
                .setEmoji("⏭️")
                .setStyle("Secondary")
            );
             embed = new EmbedBuilder()
            .setThumbnail("https://i.ibb.co/kGT51Gh/class-c.png")
            .setColor(colors.blue)
            embed.setFooter({ text: `Pages 1/${classpage.length}` });

      
            console.dir(carclassCarr[0])
            for(let b in carclassCarr[0]){
              let car = carclassCarr[0][b]
              console.dir(car)
              embed.addFields({name: `${car.icon} ${car.Name}`, value:`\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}`, inline: true})
            }
             await i.update({embeds: [embed], components: [row, row2], fetchReply: true})
  
              page = 1;
  
             
            }
            else if(i.customId.includes("classB")){
              classpage = carclassBarr
              embed = new EmbedBuilder()
              .setTitle("Class B Dealership")
              let row = new ActionRowBuilder().addComponents(
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
                  .setEmoji("⏮️")
                  .setStyle("Secondary"),
                new ButtonBuilder()
                  .setCustomId("last")
                  .setEmoji("⏭️")
                  .setStyle("Secondary")
              );
               embed = new EmbedBuilder()
              .setThumbnail("https://i.ibb.co/r52rPJ5/class-b.png")
              .setColor(colors.blue)
              embed.setFooter({ text: `Pages 1/${classpage.length}` });

              console.dir(carclassBarr[0])
              for(let b in carclassBarr[0]){
                let car = carclassBarr[0][b]
                console.dir(car)
                embed.addFields({name: `${car.icon} ${car.Name}`, value:`\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}`, inline: true})
              }
               await i.update({embeds: [embed], components: [row, row2], fetchReply: true})
    
                page = 1;
    
               
              }
              else if(i.customId.includes("classA")){
                classpage = carclassAarr
                embed = new EmbedBuilder()
                .setTitle("Class A Dealership")
                let row = new ActionRowBuilder().addComponents(
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
                    .setEmoji("⏮️")
                    .setStyle("Secondary"),
                  new ButtonBuilder()
                    .setCustomId("last")
                    .setEmoji("⏭️")
                    .setStyle("Secondary")
                );
                 embed = new EmbedBuilder()
                .setThumbnail("https://i.ibb.co/1KBwRWR/class-a.png")
                .setColor(colors.blue)
                embed.setFooter({ text: `Pages 1/${classpage.length}` });

                console.dir(carclassAarr[0])
                for(let b in carclassAarr[0]){
                  let car = carclassAarr[0][b]
                  console.dir(car)
                  embed.addFields({name: `${car.icon} ${car.Name}`, value:`\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}`, inline: true})
                }
                 await i.update({embeds: [embed], components: [row, row2], fetchReply: true})
      
                  page = 1;
      
                 
                }

                else if(i.customId.includes("classS")){
                  classpage = carclassSarr
                  embed = new EmbedBuilder()
                  .setTitle("Class A Dealership")
                  let row = new ActionRowBuilder().addComponents(
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
                      .setEmoji("⏮️")
                      .setStyle("Secondary"),
                    new ButtonBuilder()
                      .setCustomId("last")
                      .setEmoji("⏭️")
                      .setStyle("Secondary")
                  );
                   embed = new EmbedBuilder()
                  .setThumbnail("https://i.ibb.co/1KBwRWR/class-a.png")
                  .setColor(colors.blue)
                  embed.setFooter({ text: `Pages 1/${classpage.length}` });
                  console.dir(carclassSarr[0])
                  for(let b in carclassSarr[0]){
                    let car = carclassSarr[0][b]
                    console.dir(car)
                    embed.addFields({name: `${car.icon} ${car.Name}`, value:`\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}`, inline: true})
                  }
                   await i.update({embeds: [embed], components: [row, row2], fetchReply: true})
        
                    page = 1;
        
                   
                  }

          else {
            
            console.log(page)
          let current = page;
          if (i.customId.includes("previous") && page !== 1) {
            embed.data.fields = null;
  
            page--;
          }
          else if (i.customId.includes("next") && page !== classpage.length){
            embed.data.fields = null;
  
            page++;
  
          }
          else if (i.customId.includes("first")){
            embed.data.fields = null;
  
            page = 1;
          } 
          else if (i.customId.includes("last")){
            embed.data.fields = null;
  
            page = classpage.length;
          } 
          for(let e in classpage[page - 1]){
            let car = classpage[page - 1][e]
            console.log(car)
            embed.addFields({name: `${car.icon} ${car.Name}`, value:`\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}`, inline: true})
          }
  
          if (current !== page) {
            embed.setFooter({ text: `Pages ${page}/${classpage.length}` });
           i.update({ embeds: [embed], fetchReply: true });
          } else {
            return i.update({ content: "No pages left!" });
          }
          }



      })
      if (userdata.tutorial && userdata.tutorial.stage == 1) {
        console.log("tutorial");
        interaction.channel.send({
          content: `You can buy a car with /buy [car id], or the full name, the car id is listed next to \`ID:\`, an example would be /buy \`2002 mustang\``,
        });
      }

     
  },
};
