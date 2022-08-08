const fs = require("fs");

require("dotenv").config();
const express = require("express");
const app = express();

const { Client, Intents, Collection } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  shards: "auto",
});

// const Topgg = require("@top-gg/sdk");
// const webhook = new Topgg.Webhook("ZeroSpideral3!#");
// const DBL = require("dblapi.js");
// app.post(
//   "/vote",
//   webhook.listener((vote) => {
//     console.log("User with id - " + vote.user + " voted!");
//     db.set(`voted_${vote.user}`, true);
//     db.set(`votetimer_${vote.user}`, Date.now());
//     let value = JSON.stringify({
//       embeds: [
//         {
//           title: "New Vote!",
//           description: `<@${vote.user}> Just voted for Zero2Sixty!`,
//           color: "RED",
//         },
//       ],
//     });
//   })
// );

app.listen(4500);

const commandFiles = fs
  .readdirSync("./commandsv2")
  .filter((file) => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();

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
// console.log(JSON.stringify(commands, null, 2));

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

client.login(process.env.DATABASE_URL);
