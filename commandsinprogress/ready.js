// This event will run if the bot starts, and logs in, successfully.

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");




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
      console.log("Zero2Sixty Community is ready.");
    } catch (err) {
      if (err) console.error(err);
    }
  },
};
