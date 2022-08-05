const db = require("quick.db");
const discord = require("discord.js");
module.exports = (client) => {
  client.on("message", (message) => {
    if (message.author.bot) return;

    const { guild, member } = message;

    let crew = db.fetch(`crew_${member.id}`);
    let crews = db.fetch(`crews`);

    if (crew && crews.includes(crew)) {
      let crew2 = db.fetch(`crew_${crew}`);
      let totalrp = 0;

      let crewmembers = crew2.members;
      let crewrank = crew2.Rank;

      for (i in crewmembers) {
        let user = crewmembers[i];
        let userrp = db.fetch(`rp_${user}`);

        totalrp += userrp;
      }

      let requiredrp = crewrank * 1000;
      if (parseInt(totalrp) > parseInt(requiredrp)) {
        db.add(`crew_${crew}.Rank`, 1);
      }
      if (db.fetch(`crew_${crew}.Rank`) >= 10) {
        for (i in crewmembers) {
          let user = crewmembers[i];
          db.set(`cashgain_${user}`, `10`);
        }
      }
      if (db.fetch(`crew_${crew}.Rank`) >= 20) {
        for (i in crewmembers) {
          let user = crewmembers[i];
          db.set(`cashgain_${user}`, `15`);
        }
      }
      if (db.fetch(`crew_${crew}.Rank`) >= 30) {
        for (i in crewmembers) {
          let user = crewmembers[i];
          db.set(`cashgain_${user}`, `20`);
        }
      }
      if (db.fetch(`crew_${crew}.Rank`) >= 50) {
        for (i in crewmembers) {
          let user = crewmembers[i];
          db.set(`cashgain_${user}`, `25`);
        }
      }
      if (db.fetch(`crew_${crew}.Rank`) >= 100) {
        for (i in crewmembers) {
          let user = crewmembers[i];
          db.set(`cashgain_${user}`, `50`);
        }
      }
    }
  });
};
