import { readdirSync } from 'fs'
import type {
  Command,
  Commands,
  ProcessedMessage,
  ArgumentType,
  Argument
} from '../types'


require('dotenv').config()
const PREFIX = process.env.PREFIX || '!'

const debug = require('debug')('helper')

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

    if (!commandFile.default) {
      return debug('Wrong file format on ' + fileName)
    }
    commands[PREFIX + fileName] = <Command>new commandFile.default()
  }
  debug(commands)
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
  return args.map((argument, index) => {
    try {
      return validateArgumentByType(argument, types[index].type)
    } catch (err) {
      if (!types[index].optional) {
        throw err
      }
    }
  })
}

export function validateArgumentByType(
  argument: string,
  type: ArgumentType
): any {
  const argumentProcesses = {
    number: (argument: string) => {
      if (isNaN(+argument)) {
        throw new Error()
      } else {
        return +argument
      }
    },
    user: (argument: string) => {
      if (argument.startsWith('<@') && argument.endsWith('>')) {
        return argument.slice(2, -1)
      } else {
        throw new Error()
      }
    },
    string: (argument: string) => argument
  }

  try {
    return argumentProcesses[type](argument)
  } catch {
    throw new Error(`"${argument}" is not of type "${type}"`)
  }
}
