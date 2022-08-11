// const db = require("quick.db");
const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const User = require("./schema/profile-schema");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  shards: "auto",
});

const Topgg = require("@top-gg/sdk");
const webhook = new Topgg.Webhook("ZeroSpideral3!#");
app.post(
  "/vote",
  webhook.listener(async (vote) => {
    console.log("User with id - " + vote.user + " voted!");
    let userdata = await User.findOne({ id: vote.user });
    if (!userdata) return;
    userdata.hasvoted = true;
    userdata.votetimer = Date.now();
    userdata.save();
  })
);

// See .env-example for an explanation of FORCE_DISABLE_BOT
if (process.env.FORCE_DISABLE_BOT === "true") {
  app.listen(8080);
  console.warn(
    `
    !! WARNING - DISCORD BOT DISABLED !!

    The env var 'FORCE_DISABLE_BOT' is set to 'true'.

    This node process will continue to run and listen on port 8080.
    This is only to ensure the CI/CD deployment succeeds.
    
    To re-enable, set 'FORCE_DISABLE_BOT' to 'true' and redeploy.

    `
  );
} else {
  app.listen(4500);

  const commands = [];
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commandsv2")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commandsv2/${file}`);
    const existingCommand = commands.find((c) => c.name === command.data.name);
    if (existingCommand) {
      console.warn(
        `WARNING: The command '${existingCommand.name}' from file '${file}' was not added because it was already added from '${existingCommand.fileLocation}'!`
      );
    } else {
      commands.push({ ...command.data.toJSON(), fileLocation: file });
    }
    client.commands.set(command.data.name, command);
  }

  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
      client.on(event.name, (...args) => event.execute(...args, commands));
    }
  }

  client.on("guildCreate", (guild) => {
    console.log(`New guild joined! : ${guild.memberCount} members`);
  });

  client.login(process.env.TOKEN);
}
