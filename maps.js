const db = require('quick.db')
const Discord = require("discord.js")
const lodash = require('lodash')
module.exports = (client) => {

    let timeoutchosen = randomRange(100, 500)
    console.log("count:" + timeoutchosen)
    let messages = 0
    client.on('messageCreate', message => { 
        if(message.channel.type == "dm") return
    if(message.author.bot) return;
    messages++
    if(messages >= timeoutchosen){
        db.set(`mapdropped_${message.guild.id}`, true)
        message.channel.send("A barn map dropped! You have 10 seconds to claim it before it goes away! Type /map").then(msg => {
           
    
        setTimeout(() => {
            db.set(`mapdropped_${message.guild.id}`, false)

        }, 10000);
         timeoutchosen = randomRange(100, 500)
        messages = 0

        })
    }

    })



}

function randomRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}