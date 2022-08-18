module.exports = {
  name: "guildDelete",
  once: false,
  async execute(guild) {
    console.log(`Guild removed: ${guild.name} (${guild.memberCount} members)`);
  },
};
