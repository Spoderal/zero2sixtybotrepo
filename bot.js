// Starts the bot and sets up the commands and events
const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    
    GatewayIntentBits.GuildMessageReactions,
  ],
  shards: "auto",
});

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
      client.commands.set(command.data.name, command);
    }
  }

  const eventFiles = fs
    .readdirSync("./events", { withFileTypes: true })
    .filter((file) => !file.isDirectory() && path.extname(file.name) === ".js");

  for (const file of eventFiles) {
    const event = require(`./events/${file.name}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
      client.on(event.name, (...args) => event.execute(...args, commands));
    }
  }

  client.login();
}
