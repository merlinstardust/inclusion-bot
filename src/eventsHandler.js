import logger from '~/logger';
import sendMessage from '~/sendMessage';
import wordReplacementsMap from '~/wordReplacementsMap';

const eventsHandler = (event) => {
  if (event.bot_id || event.bot_profile) {
    return;
  }

  const { channel, text, team, enterprise } = event;

  logger.info(`Received text: [${text}]`);

  let suggestionCount = 0;
  const suggestions = Object.entries(wordReplacementsMap)
    .reduce((string, [ word, replacements ]) => {
      const regex = new RegExp(`\\b(${word})\\b`);
      const matches = text.match(regex);
      logger.info(`regex: [${regex}], matches: [${matches}]`);

      if (matches) {
        suggestionCount += 1;
        const randomIndex = Math.floor(Math.random() * replacements.length);
        const randomReplacement = replacements[randomIndex];
        const suggestion = `"${randomReplacement}" in place of "${word}"`;
        return string + suggestion + ', ';
      }

      return string;
    }, '')
    .replace(/, $/, '');

  if (suggestions) {
    const replyText = `Hey there, I suggest using ${suggestions} to be more inclusive.`;

    sendMessage({ enterprise, team, channel, text: replyText });
  }
};

export default eventsHandler;
