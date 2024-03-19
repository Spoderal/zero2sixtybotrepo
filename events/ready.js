// This event will run if the bot starts, and logs in, successfully.

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const lodash = require("lodash");
require("dotenv").config();

const { updateItemShop } = require("./itemshop");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { numberWithCommas } = require("../common/utils");
const User = require("../schema/profile-schema");
const Topgg = require("@top-gg/sdk");
const gold = require("../gold");
const {itemshop} = require("./shopdata");
const { updateCrew } = require("./crews/updateCrew");
const { newseason } = require("./crews/newseason");
const { season } = require("./season");
const {isWeekend} = require("../common/utils")


let mongoConfig = {
  keepAlive: true,
};

// MongoDB SSL for production only
if (process.env.CA_CERT) {
  let mongoCertPath = path.resolve("./ca-certificate.crt");
  fs.writeFileSync(mongoCertPath, process.env.CA_CERT);
  mongoConfig.sslCA = mongoCertPath;
  mongoConfig.tlsInsecure = true;
  
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client, commands) {
    await mongoose.connect(process.env.DATABASE_URL, mongoConfig);


    gold(client);
 //   stats(client);
    itemshop(client)
   
 
    var express = require("express");
    var app = express();
    var bodyParser = require("body-parser");
    app.use(bodyParser.json());
  
    app.post("/webhooks/zero2sixtybotgold", function (request, response) {
      // Send OK so server knows we got the webhook
      response.sendStatus(200);

      // Use a different token in actual use
      var authenticationToken = process.env.donateAPI;
      // Verify the token set here and the one from the webhook server match
      if (request.headers.authorization === authenticationToken) {
        // webhook contains the webhook's body
        // var webhook = request.body;
      }
    });

    
    console.log("Registered endpoint: /webhooks/zero2sixtybotgold");

    const webhookAuth = "ZeroSpideral3!";
    if (webhookAuth) {
      const webhook = new Topgg.Webhook(webhookAuth);
      app.post(
        "/vote",
        webhook.listener(async (vote) => {
          console.log(vote.user)


          
          console.log("User with id - " + vote.user + " voted!");
          let userdata = await User.findOne({ id: `${vote.user}` });
          
          console.log(userdata)
          if (!userdata) return;
          userdata.hasvoted = true;
          userdata.votetimer = Date.now();
          userdata.save();
        })
      );
      console.log("Registered endpoint: /vote");
    } else {
      console.log(
        "WARNING: Endpoint /vote failed to register. Missing `TOPGG_WEBHOOK_AUTHORIZATION` enviornment variable"
      );
    }

    app.listen(8080, function () {
      console.log("Listening on port 8080.");
    });

    let randomstatuses = [
      `☀️ SPRING 🌸  /season`,
      `with ${numberWithCommas(client.guilds.cache.size)} drivers`,
      "⚙️ NEW ROADMAP 2024 ⚙️ /updates",
      "🪙 Gold starting as low as $0.99!🪙"
    ];
    if(isWeekend() == true){
      randomstatuses.push(`🎉 DOUBLE WEEKEND 🎉`)
    }

    let randomstatus = lodash.sample(randomstatuses);
    client.user.setActivity(randomstatus);

    setInterval(() => {
      let randomstatus = lodash.sample(randomstatuses);
      client.user.setActivity(randomstatus);
    }, 20000);

    updateItemShop();

    try {
      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
      const CLIENT_ID = client.user.id;

      if (process.env.ENV === "production") {
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commands,
        });
        console.log(`Registered ${commands.length} commands globally.`);
      } else {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
          {
            body: commands,
          }
        );
        console.log(`Registered ${commands.length} commands locally.`);
      }
      console.log("Zero2Sixty is ready.");
    } catch (err) {
      if (err) console.error(err);
    }
  },
};
