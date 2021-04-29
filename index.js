import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import SlackBot from 'slackbots';

dotenv.config();

const router = express.Router();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.post('/events', (request, response) => {
  const { type } = request.body;

  if (!type) {
    return response.send(500);
  }

  if (type === 'url_verification') {
    console.log('URL verification', request.body.challenge);
    return response.send(request.body.challenge);
  }
});
