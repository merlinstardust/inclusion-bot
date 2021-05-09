import dotenv from 'dotenv';
import MongoDb from 'mongodb';
const { MongoClient } = MongoDb;

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const getCollection = async ({ name, dbName = 'main' }) => {
  if (!client.isConnected()) {
    await client.connect();
    console.log('Connected successfully to mongo server', client.isConnected());
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
    return await oauthInstalls.findOne({ enterpriseId });
  }
  if (teamId) {
    return await oauthInstalls.findOne({ teamId });
  }
};

const saveInstall = async (install) => {
  const oauthInstalls = await collections.oauthInstalls();
  const { isEnterpriseInstall, enterprise, team } = install;

  if (isEnterpriseInstall) {
    return await oauthInstalls.insertOne({ enterpriseId: enterprise.id, ...install });
  }
  else {
    return await oauthInstalls.insertOne({ teamId: team.id, ...install });
  }
};

process.on('exit', () =>
  client.close().then(() => {
    console.log('Mongo server exited.');
    process.exit();
  }),
);

export default {
  collections,
  getInstall,
  saveInstall,
};
