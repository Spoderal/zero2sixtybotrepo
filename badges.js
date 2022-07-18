const db = require('quick.db')
const discord = require("discord.js")
module.exports = (client) => {
    client.on('message', message => {
        
        if(message.author.bot) return
        
        const {guild, member} = message
        
        let cardb = require('./cardb.json')
        let millionbadge = db.fetch(`millionbadge_${member.id}`)
        let cars10badge = db.fetch(`10carsbadge_${member.id}`)
        let driftkingbadge = db.fetch(`driftkingbadge_${member.id}`)
        let evcar = db.fetch(`hasev_${member.id}`)
        let cash = db.fetch(`cash_${member.id}`)
        let cars = db.fetch(`cars_${message.author.id}`) || []
        let drift = db.fetch(`drifttraining_${member.id}`) 
        if(cash >= 1000000 && !db.fetch(`millionbadge_${member.id}`)){
            message.reply(`You just earned the "Millionaire" badge for having 1m cash! Congratulations!`)
            db.set(`millionbadge_${member.id}`, true)
            db.push(`badges_${member.id}`, "1mcash")
        }
        if(cars.length >= 10 && !db.fetch(`10carsbadge_${member.id}`)){
            message.reply(`You just earned the "2ManyCars" badge for having 10 cars or more! Congratulations!`)
            db.set(`10carsbadge_${member.id}`, true)
            db.push(`badges_${member.id}`, "10cars")

        }

        if(drift >= 50 && !db.fetch(`driftkingbadge_${member.id}`)){
            message.reply(`You just earned the "Drift King" badge for having a drift score of 50 or more! Congratulations!`)
            db.set(`driftkingbadge_${member.id}`, true)
            db.push(`badges_${member.id}`, "driftking")

        }

       
        


    
    })
}
