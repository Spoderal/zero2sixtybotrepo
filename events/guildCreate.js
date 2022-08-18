module.exports = {
  name: "guildCreate",
  once: false,
  async execute(guild) {
    console.log(`Guild added: ${guild.name} (${guild.memberCount} members)`);
  },
};
