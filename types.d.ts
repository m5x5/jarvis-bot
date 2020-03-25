import { Message, PartialMessage } from 'discord.js'

export interface Command {
  run(message: Message | PartialMessage, args: object): any

  info(): CommandInfo
}

export interface Commands {
  [key: string]: Command | undefined
}

export interface CommandInfo {
  title: string
  help?: string
  guildOnly?: boolean
  dmOnly?: boolean
  groupOnly?: boolean
  channelOnly?: string
  arguments?: Argument[]
  printHash?: boolean
}

export interface Argument {
  type: ArgumentType
  optional?: boolean
}

export interface ProcessedMessage {
  command: string
  args?: string[]
}

type ArgumentType = 'string' | 'number' | 'user'
