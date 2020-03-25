import type { Message } from 'discord.js'
import type { Command, CommandInfo } from '../types'

// const dialogflow = require("dialogflow");
// const uuid = require("uuid");

// const projectId = "newagent-e33ce";
// const sessionId = uuid.v4();
// const sessionClient = new dialogflow.SessionsClient();
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);
// require("dotenv").config();

export default class TalkCommand implements Command {
  async run(_message: Message) {
    // // The text query request.
    // const request = {
    //   session: sessionPath,
    //   queryInput: {
    //     text: {
    //       text: message.content,
    //       languageCode: "en-US"
    //     }
    //   }
    // };
    // // Send request and log result
    // const responses = await sessionClient.detectIntent(request);
    // console.log(responses);
    // // console.log("Detected intent");
    // const result = responses[0].queryResult;
    // // console.log(`  Query: ${result.queryText}`);
    // // console.log(`  Response: ${result.fulfillmentText}`);
    // // if (result.intent) {
    // //   console.log(`  Intent: ${result.intent.displayName}`);
    // // } else {
    // //   console.log(`  No intent matched.`);
    // // }
    // message.channel.send({
    //   embed: new RichEmbed().setTitle(result.fulfillmentText)
    // });
  }

  info(): CommandInfo {
    return {
      title: 'Talk to Jarvis',
      guildOnly: true,
      arguments: [{ type: 'number' }]
    }
  }
}
