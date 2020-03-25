import { Message, TextChannel, DMChannel, MessageEmbed } from 'discord.js'
import { Command, CommandInfo } from '../types'
require('dotenv').config()

/*
  Time => parseInt
  Title?
  setTimeout () => Pomodoro timer is over
  say => Pomodoro Timer set
  setTimeout () => Pause is over start working now
  repeat first timout
  allow cancel with !pomodoro cancel
*/

export default class PomodoroCommand implements Command {
  pomodoros: Map<string, Pomodoro> = new Map()

  async run(message: Message, [time, pause]: [number, number]) {
    const workTime = +time * 1000 * 60
    const breakTime = +pause * 1000 * 60

    const pomodoro = new Pomodoro({
      creator: message.author.id,
      workTime,
      breakTime,
      message
    })

    this.pomodoros.set(message.author.id, pomodoro)

    const embed = new MessageEmbed().setTitle(
      `You set a pomodoro timer for ${time} minutes`
    )
    message.channel.send({ embed })
  }

  info(): CommandInfo {
    return {
      title: 'Pomodoro Command',
      guildOnly: false,
      arguments: [{ type: 'number' }, { type: 'number' }]
    }
  }
}

type PomodoroConfig = {
  currentTimer?: NodeJS.Timeout
  creator: string
  workTime: number
  breakTime: number
  cycles?: number
  message: Message
}

class Pomodoro {
  currentTimer?: NodeJS.Timeout
  creator?: string
  workTime?: number
  breakTime?: number
  cycles?: number
  message: Message
  channel: TextChannel | DMChannel

  constructor({
    currentTimer,
    creator,
    workTime,
    breakTime,
    cycles,
    message
  }: PomodoroConfig) {
    this.currentTimer = currentTimer
    this.creator = creator
    this.workTime = workTime
    this.breakTime = breakTime
    this.cycles = cycles
    this.message = message
    this.channel = message.channel
  }

  startTimer(isBreakTime: boolean) {
    return setTimeout(
      () => {
        const embed = new MessageEmbed().setTitle(
          'Break time is over, work time starts now'
        )
        this.channel.send({ embed })
      },
      isBreakTime ? this.breakTime : this.workTime
    )
  }
}
