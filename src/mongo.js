import dotenv from 'dotenv';
import MongoDb from 'mongodb';
import logger from '~/logger';

const { MongoClient } = MongoDb;

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const getCollection = async ({ name, dbName = 'main' }) => {
  if (!client.isConnected()) {
    await client.connect();
    logger.info('Connected successfully to mongo server', client.isConnected());
  }

  const db = client.db(dbName);
  return db.collection(name);
};

export const collections = {
  oauthInstalls: async () => await getCollection({ name: 'oauthInstalls' }),
};

const getInstall = async ({ isEnterpriseInstall, enterpriseId, teamId }) => {
  const oauthInstalls = await collections.oauthInstalls();
  if (enterpriseId) {
    const findResult = await oauthInstalls.findOne({ enterpriseId });
    logger.info(`enterprise found: ${!!findResult}`);
    return findResult;
  }
  if (teamId) {
    const findResult = await oauthInstalls.findOne({ teamId });
    logger.info(`team found: ${!!findResult}`);
    return findResult;
  }
};

const saveInstall = async (install) => {
  const oauthInstalls = await collections.oauthInstalls();
  const { isEnterpriseInstall, enterprise, team } = install;
  const updatedAt = new Date().toISOString();

  if (isEnterpriseInstall) {
    const insertResult = await oauthInstalls.update(
      { enterpriseId: enterprise.id },
      { enterpriseId: enterprise.id, updatedAt, ...install },
      { upsert: true },
    );
    logger.info(`enterprise inserted: ${!!insertResult}`);
    logger.info(insertResult);
    return insertResult;
  }
  else {
    const insertResult = await oauthInstalls.update(
      { teamId: team.id },
      { teamId: team.id, updatedAt, ...install },
      { upsert: true },
    );
    logger.info(`team inserted: ${!!insertResult}`);
    logger.info(insertResult);
    return insertResult;
  }
};

process.on('exit', () =>
  client.close().then(() => {
    logger.info('Mongo server exited.');
    process.exit();
  }),
);

export default {
  collections,
  getInstall,
  saveInstall,
};
