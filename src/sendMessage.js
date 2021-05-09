import { WebClient } from '@slack/web-api';
import mongo from '~/mongo';

const sendMessage = async ({ enterprise, team, channel, text }) => {
  try {
    const install = await mongo.getInstall({ teamId: team, enterpriseId: enterprise });
    if (!install) return;

    const web = new WebClient(install.bot.token);
    await web.chat.postMessage({ channel, text });
  } catch (error) {
    console.error(error);
  }
};

export default sendMessage;
