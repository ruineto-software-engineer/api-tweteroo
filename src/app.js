import express from "express";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
  const user = req.body;
  users.push(user);
  res.send("OK");
});

app.get('/tweets', (req, res) => {
  res.send(tweets);
});

app.post('/tweets', (req, res) => {
  const tweet = req.body;
  const avatar = users[0].avatar;
  const truthyTweet = {
    ...tweet,
    "avatar": avatar
  }

  console.log(truthyTweet);
  tweets.push(truthyTweet);
  res.send("OK");
});

app.listen(5000, () => {
  console.log('Running app in http://localhost:5000');
});