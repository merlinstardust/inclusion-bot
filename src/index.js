import dotenv from 'dotenv';
import * as eta from 'eta';
import express from 'express';
import { createEventAdapter } from '@slack/events-api';
import oauthInstaller from '~/oauthInstaller';
import eventsHandler from '~/eventsHandler';

dotenv.config();
const SIGNING_SECRET = process.env.SIGNING_SECRET;
const PORT = process.env.PORT || 3000;

const router = express.Router();
const app = express();

const slackEvents = createEventAdapter(SIGNING_SECRET);
app.use('/slack/events', slackEvents.requestListener());
slackEvents.on('message', eventsHandler);
slackEvents.on('error', console.error);

app.engine('eta', eta.renderFile);
app.set('view engine', 'eta');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.get('/', async (request, response) => {
  const oauthUrl = await oauthInstaller.generateInstallUrl({
    redirectUri: `${process.env.HOST_URL}/slack/oauth_redirect`,
    scopes: [ 'channels:history', 'groups:history', 'mpim:history', 'chat:write' ],
  });
  response.render('index', { oauthUrl });
});

router.get('/slack/oauth_redirect', (request, response) => {
  oauthInstaller.handleCallback(request, response);
});

router.get('/privacy', (request, response) => {
  response.render('privacy');
});

app.listen(PORT, () => {
  console.info(`\n------------------------------`);
  console.info(`Server started on port ${PORT}`); // eslint-disable-line no-console
});

app.use('/', router);
