import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandInfo } from '../types'

type ResponseData = {
  playerWon: boolean
  randomNumber: number
  message: Message
  bet: number
}
export default class FiftyThree implements Command {
  async run(message: Message, [bet]: [number]) {
    if (bet < 1) {
      throw new Error(`Minimum amount of betting is 1€`)
    }

    const randomNumber = Math.ceil(Math.random() * 100)
    const playerWon = this.checkIfPlayerWon(randomNumber)

    this.formResponse({ playerWon, randomNumber, message, bet })
  }

  checkIfPlayerWon(randomNumber: number): boolean {
    if (randomNumber > 50) {
      return true
    } else {
      return false
    }
  }

  formResponse({ playerWon, randomNumber, message, bet }: ResponseData) {
    const embed = new MessageEmbed()
      .setAuthor(message.member?.displayName, message.author.displayAvatarURL())
      .addField('You rolled', randomNumber, true)
      .setDescription(
        playerWon
          ? `Congratulation ${message.author.username}! You have won ${bet *
              2}€`
          : `Bad luck ${message.author.username}! You lost ${bet}€. Better luck next time`
      )
      .setFooter(`Game ID: Not specified yet`)
      .setColor(playerWon ? 'GREEN' : 'RED')

    message.channel.send({ embed })
  }

  info(): CommandInfo {
    return {
      title: '53 Game',
      guildOnly: true,
      arguments: [{ type: 'number', optional: false }]
    }
  }
}
