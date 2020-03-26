import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo } from '../types'
import { findCommandsIn } from '../helper/'

require('dotenv').config()

export default class HelpCommand implements Command {
  async run(message: Message) {
    const commands = findCommandsIn(__dirname)
    const commandInfo = Object.keys(commands).map(commandName => {
      return `${commandName} => ${commands[commandName]?.info().title}`
    })

    const embed = new MessageEmbed()
      .setTitle('Commands')
      .setDescription(commandInfo)
      .setColor('BLUE')
    message.channel.send({ embed })
  }

  info(): CommandInfo {
    return {
      title: 'Help Command',
      guildOnly: false
    }
  }
}
