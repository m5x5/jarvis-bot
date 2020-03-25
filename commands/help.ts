import { Message, MessageEmbed } from 'discord.js'
import type { Command, CommandInfo } from '../types'
import { findCommandsIn } from '../helper/'

require('dotenv').config()

export default class HelpCommand implements Command {
  async run(message: Message) {
    console.log(__dirname)
    const commands = findCommandsIn(__dirname)
    const commandExplanations = Object.keys(commands).map(commandName => {
      return `${commandName} => ${commands[commandName]?.info().title}`
    })

    const embed = new MessageEmbed()
      .setTitle('Commands')
      .setDescription(commandExplanations)
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
