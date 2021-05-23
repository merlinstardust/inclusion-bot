import { InstallProvider, LogLevel } from '@slack/oauth';
import mongo from '~/mongo';
import logger from '~/logger';

const oauthInstaller = new InstallProvider({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  logLevel: process.env.DEBUG || LogLevel.ERROR,

  installationStore: {
    storeInstallation: mongo.saveInstall,
    fetchInstallation: mongo.getInstall,
  },
});

oauthInstaller.callbackOptions = {
  success: (installation, metadata, request, response) => {
    logger.info({ installation, metadata });
    const { team, enterprise, isEnterpriseInstall } = installation;
    const id = isEnterpriseInstall ? enterprise.id : team.id;

    const appUrl = `slack://app?team=${id}`;
    const browserUrl = `https://app.slack.com/client/${id}`;
    response.render('oauthSuccess', { appUrl, browserUrl });
  },
  failure: (error, installOptions, request, response) => {
    logger.error(error, installOptions);
    response.status(500);
    response.render('oauthFailure', { code: error.code, message: error.message });
  },
};

export default oauthInstaller;
