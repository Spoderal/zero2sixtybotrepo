const { ClusterManager, HeartbeatManager } = require('discord-hybrid-sharding')
require("dotenv").config();

const manager = new ClusterManager('./bot.js', {
    totalShards: 1,
    shardsPerClusters: 1,
    mode: 'process',
    token: process.env.TOKEN,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });

manager.extend(
    new HeartbeatManager({
        interval: 2000, // Interval to send a heartbeat
        maxMissedHeartbeats: 5, // Maximum amount of missed Heartbeats until Cluster will get respawned
    })
)
