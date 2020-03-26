import { readdirSync } from 'fs'
import { Commands, ProcessedMessage, Argument, ValidationArgs } from '../types'

require('dotenv').config()

const PREFIX = process.env.PREFIX || '!'
const TYPE_VALIDATOR = {
  number: (argument: string, optional?: boolean) => {
    if (!isNaN(+argument)) {
      return +argument
    } else if (optional) {
      return
    } else {
      throw new Error()
    }
  },
  user: (argument: string, optional?: boolean) => {
    if (argument.startsWith('<@') && argument.endsWith('>')) {
      return argument.slice(2, -1)
    } else if (optional) {
      return
    } else {
      throw new Error()
    }
  },
  string: (argument: string, _optional?: boolean) => argument
}

/**
 * This function searches for command files, with the ending .ts or .js
 * @param directory Path to directory where to find the commands in
 */
export function findCommandsIn(directory: string): Commands {
  const commands: Commands = {}
  const files = readdirSync(directory).filter(
    file => file.endsWith('.ts') || file.endsWith('.js')
  )

  for (let file of files) {
    const fileName = file.split('.')[0]
    const commandFile = require('@commands/' + fileName)

    commands[PREFIX + fileName] = new commandFile.default()
  }

  return commands
}

/**
 * Processes the text sent by a user, and splits it into arguments and commands
 * @param msgContent The text sent by the user
 * @returns The function returns an object with the command and arguments as properties
 */
export function processMessageContent(msgContent: string): ProcessedMessage {
  const args = msgContent.trim().split(/ +/g)

  return {
    command: args.shift()?.toLowerCase() ?? '',
    args
  }
}

export function validateProcessedMessage(
  args: string[] = [],
  types: Argument[] | undefined = []
) {
  return args.map((arg, index) => {
    const { type, optional } = types[index]
    return validateByType({ arg, type, optional })
  })
}

export function validateByType({ arg, type, optional }: ValidationArgs): any {
  try {
    return TYPE_VALIDATOR[type](arg, optional)
  } catch {
    throw new Error(`"${arg}" is not of type "${type}"`)
  }
}
