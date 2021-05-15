import { InstallProvider, LogLevel } from '@slack/oauth';
import mongo from '~/mongo';

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

export default oauthInstaller;
