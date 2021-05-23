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
    response.render('oauthSuccess', { installation, metadata });
  },
  failure: (error, installOptions, request, response) => {
    logger.error(error, installOptions);
    response.status(500);
    response.render('oauthFailure', { code: error.code, message: error.message });
  },
};

export default oauthInstaller;
