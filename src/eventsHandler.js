import sendMessage from '~/sendMessage';
import wordReplacementsMap from '~/wordReplacementsMap';

const eventsHandler = (event) => {
  if (event.bot_id || event.bot_profile) {
    return;
  }

  const { channel, text, team, enterprise } = event;

  let suggestionCount = 0;
  const suggestions = Object.entries(wordReplacementsMap)
    .reduce((string, [ word, replacements ]) => {
      const regex = new RegExp(`\\b(${word})\\b`);
      if (text.match(regex)) {
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
