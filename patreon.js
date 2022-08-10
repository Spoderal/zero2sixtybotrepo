const db = require("quick.db");

module.exports = (client) => {
  client.on("message", (message) => {
    if (message.author.bot) return;

    const {
      //  guild,
      member,
    } = message;

    let role1 = "931004190220779557";
    let role2 = "932434807605059644";
    let role3 = "932434970876711032";
    let role4 = "976653429801885706";

    if (member.roles.cache.get(role1)) {
      if (!db.fetch(`patreon_tier_1_${member.id}`)) {
        if (!db.fetch(`garagelimit_${member.id}`)) {
          db.set(`garagelimit_${member.id}`, 10);
        }
        let banklimit = db.fetch(`banklimit_${member.id}`) || 10000;
        if (!banklimit) {
          db.set(`banklimit_${member.id}`, 10000);
        }
        db.add(`banklimit_${member.id}`, 25000);

        db.add(`garagelimit_${member.id}`, 5);
        db.set(`timeout_${member.id}`, 30000);
        db.set(`patreon_tier_1_${member.id}`, true);
      }
    }
    if (member.roles.cache.get(role2)) {
      if (!db.fetch(`patreon_tier_2_${member.id}`)) {
        if (!db.fetch(`garagelimit_${member.id}`)) {
          db.set(`garagelimit_${member.id}`, 10);
        }
        let banklimit = db.fetch(`banklimit_${member.id}`) || 10000;
        if (!banklimit) {
          db.set(`banklimit_${member.id}`, 10000);
        }
        db.add(`banklimit_${member.id}`, 50000);
        db.add(`garagelimit_${member.id}`, 10);
        db.set(`timeout_${member.id}`, 15000);
        db.set(`patreon_tier_2_${member.id}`, true);
      }
    }
    if (member.roles.cache.get(role3)) {
      if (!db.fetch(`patreon_tier_3_${member.id}`)) {
        if (!db.fetch(`garagelimit_${member.id}`)) {
          db.set(`garagelimit_${member.id}`, 10);
        }
        let banklimit = db.fetch(`banklimit_${member.id}`) || 10000;
        if (!banklimit) {
          db.set(`banklimit_${member.id}`, 10000);
        }
        db.add(`banklimit_${member.id}`, 75000);
        db.set(`givegold_${member.id}`, 3);
        db.add(`garagelimit_${member.id}`, 15);
        db.set(`timeout_${member.id}`, 5000);
        db.set(`requiredprest_${member.id}`, 40);
        db.set(`patreon_tier_3_${member.id}`, true);
      }
    }
    if (member.roles.cache.get(role4)) {
      if (!db.fetch(`patreon_tier_4_${member.id}`)) {
        if (!db.fetch(`garagelimit_${member.id}`)) {
          db.set(`garagelimit_${member.id}`, 10);
        }
        let banklimit = db.fetch(`banklimit_${member.id}`) || 10000;
        if (!banklimit) {
          db.set(`banklimit_${member.id}`, 10000);
        }
        db.add(`banklimit_${member.id}`, 100000);
        db.set(`givegold_${member.id}`, 10);
        db.add(`garagelimit_${member.id}`, 25);
        db.set(`requiredprest_${member.id}`, 25);
        db.set(`timeout_${member.id}`, 5000);
        db.set(`patreon_tier_4_${member.id}`, true);
      }
    }
  });
};
