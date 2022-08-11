const { prefix } = require('./config.json')
const { Client, Intents } = require('discord.js');


module.exports = (client, aliases, callback) => {
  if (typeof aliases === 'string') {
    aliases = [aliases]
  }
  try{

    client.on('message', (message) => {
      if(message.author.bot) return
      const { content } = message
  
      aliases.forEach((alias) => {
        const command = `${prefix}${alias}`
  
        if (content.startsWith(`${command} `) || content === command) {
          callback(message)
        }
      })
    })
  }
  catch(err){
    return
  }
}