import express from "express";
import cors from 'cors';
import services from './services.js';

const { checkBody, checkIsNotBlank } = services
const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
  const user = req.body;
  if(user && checkBody(["username", "avatar"], user)){
    if(checkIsNotBlank(user.username) && checkIsNotBlank(user.avatar)){
      users.push(user);
      res.status(201).send("CREATED");
    }else{
      res.status(400).send("Todos os campos são obrigatórios!");
    }
  }else{
    res.status(400).send("Todos os campos são obrigatórios!");
  }
});

app.post('/tweets', (req, res) => {
  const username = req.header('User');
  const avatar = users.find(user => user.username === username);
  const tweet = req.body;

  if (checkIsNotBlank(tweet.tweet) && checkIsNotBlank(username)) {
    const dataTweet = {
      "username": username,
      "avatar": avatar.avatar,
      "tweet": tweet.tweet
    }
    console.log(dataTweet);
    tweets.push(dataTweet);
    res.status(201).send("CREATED");
  }
  else {
    res.status(400).json("Todos os campos são obrigatórios!");
  }
});

app.get('/tweets', (req, res) => {
  const page = parseInt(req.query.page);

  if(page <= 0){
    res.status(400).send("Informe uma página válida!");
    return
  }

  if(((page - 1) * 10 > tweets.length)){
    return
  }

  if(tweets.length < 10){
    res.send(tweets.slice(0).reverse());
  }else{
    if(page === 1){
      res.send(tweets.slice((tweets.length - 10), tweets.length).reverse());
    }else{
      let result = [];
      const tweetsSliced = tweets.slice((tweets.length - 10), tweets.length).reverse();
      for (let i = 0; i < tweets.length; i++) {
        const element = tweets[i];
        if(!tweetsSliced.includes(element)){
          result.push(element);
        };
      }

      res.send(result.reverse());
    }
  }
});

app.get('/tweets/:username', (req, res) => {
  const username = req.params.username;

  const selectedUserTweets = tweets.filter((tweet) => {
    return tweet.username === username;
  });

  if(selectedUserTweets.length !== 0){
    res.send(selectedUserTweets);
  }else{
    res.status(400).send('Este usuário não tem tweets no momento, informe outro usuário!');
  }
});

app.listen(5000, () => {
  console.log('Running app in http://localhost:5000');
});