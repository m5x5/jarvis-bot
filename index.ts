import 'module-alias/register'
import { Client } from 'discord.js'
import {
  findCommandsIn,
  processMessageContent,
  validateProcessedMessage as validateArguments
} from './helper/index'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const debug = require('debug')('jarvis:main')
const client = new Client()
const commands = findCommandsIn('./commands')

client.on('ready', () => {
  debug('Jarvis is alive!')
})

client.on('message', message => {
  if (!message?.content?.startsWith(process.env.PREFIX || '!')) {
    return
  }

  const processedMessage = processMessageContent(message.content)
  const commandFile = commands[processedMessage.command]

  const args = validateArguments(
    processedMessage.args,
    commandFile?.info().arguments
  )

  commandFile?.run(message, args)
})

client.login(process.env.TOKEN)
