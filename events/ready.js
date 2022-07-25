const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("../config.json");
const dailytasks = require('../dailytasks')
const crews = require('../crewrank')
const badges = require('../badges')
const lodash = require('lodash')
require("dotenv").config()
const patron = require('../patreon')
const items = require('../item')
const double = require('../doublecash')
const db = require('quick.db')
const mongoose = require('mongoose')
const dbSchema = require('../schema/profile-schema')
const auto = require('../autosetcars')

module.exports = {
    name:"ready",
    once: true,
    async execute(client, commands){
    
      await mongoose.connect(
        process.env.dbpass, {
          keepAlive: true
        }
      )
     
      badges(client)
      crews(client)
      dailytasks(client)
      patron(client)
      items(client)
      double(client)
      // auto()
      
      var express = require('express');
      var app = express();
      var bodyParser = require('body-parser');
      
      app.use(bodyParser.json());
      
      app.post('/webhooks/zero2sixtybotgold', function(request, response) {
        // Send OK so server knows we got the webhook
        response.sendStatus(200);
        
        // Use a different token in actual use
        var authenticationToken = process.env.donateAPI;
        // Verify the token set here and the one from the webhook server match
        if (request.headers.authorization === authenticationToken) {
          var webhook = request.body;
          // webhook contains the webhook's body
        }
      });
      
      app.listen(8080, function() {
        console.log("Listening on port 8080");
      });



        console.log("Zero2Sixty is ready.");
        let randomstatuses = [`☀️ Summer ☀️  /season`, `⬆️ BIG UPDATE 6/12`, `Patch 6/28`, `Small Update 6/24`, `Watching ${numberWithCommas(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))} racers`]
        if(db.fetch(`doublecash`) == true){
          randomstatuses.push(`💵 DOUBLE CASH WEEKEND 💵`)
        }
        let randomstatus = lodash.sample(randomstatuses)
        client.user.setActivity(randomstatus)
       

        const CLIENT_ID = client.user.id;
        setInterval(() => {
          let randomstatus = lodash.sample(randomstatuses)
          client.user.setActivity(randomstatus)
          
        }, 20000);
        const rest = new REST({
          version: "9",
        }).setToken(config.token);
      
        (async () => {
          try {
            if (process.env.ENV === "production") {
              await rest.put(Routes.applicationCommands(CLIENT_ID), {
                body: commands,
              });
              console.log("Registered commands globally.");
            } else {
              await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
                {
                  body: commands,
                }
                );
                console.log("Registered commands locally.");
                console.log(commands.length)
            }
          } catch (err) {
            if (err) console.error(err);
            
          }
        })();
        
    }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}