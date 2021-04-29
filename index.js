import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import SlackBot from 'slackbots';

dotenv.config();

const PORT = process.env.PORT || 3000;

const router = express.Router();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.get('/', (request, response) => {
  response.sendFile('index.html');
});

router.post('/events', (request, response) => {
  const { type } = request.body;

  if (!type) {
    return response.send(500);
  }

  if (type === 'url_verification') {
    console.info('URL verification', request.body.challenge); // eslint-disable-line no-console
    return response.send(request.body.challenge);
  }
});

app.listen(PORT, () => {
  console.info(`Server started on port ${PORT}`); // eslint-disable-line no-console
});

app.use('/', router);
