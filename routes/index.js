const express = require('express');
const router = express.Router();
const Twit = require('twit')
const config = require('../js/config.js');
const moment = require('moment');

const T = new Twit(config); 

const twitterData = {
  userInfo: {},
  tweets: [],
  friends: [],
  messages: []
}
// Each rendered result must include all of the information seen in the sample layout:
    // Tweets
        // tweet content
        // # of retweets
        // # of likes
        // date tweeted
    // Friends
        // profile image
        // real name
        // screen name
    // Messages
        // message body
        // date the message was sent
        // time the message was sent
router.use('/', (req, res, next) => {
  T.get('statuses/user_timeline', { count: 5 }, (err, data, response) => {
    if (err) {
      err.message = 'Sorry, an Error occurred while retrieving the tweets.';
      console.log('an Error occurred while retrieving the tweets');
      return next(err);
    }

    twitterData.userInfo.name = data[0].user.name;
    twitterData.userInfo.screenName = data[0].user.screen_name;
    twitterData.userInfo.profileImg = data[0].user.profile_image_url;
    twitterData.userInfo.freindsCount = data[0].user.friends_count;

    data.forEach((tweetInfo) => {
      let tweetObj = {};
      tweetObj.content = tweetInfo.text;
      tweetObj.retweets = tweetInfo.retweet_count;
      tweetObj.likes = tweetInfo.favorite_count;
      let date = new Date(tweetInfo.created_at);
      tweetObj.date = date.toDateString();
      twitterData.tweets.push(tweetObj);
    });
  });
  T.get('friends/list', { count: 5 }, (err, data, response) => {
    if (err) {
      err.message = 'Sorry, an Error occurred while retrieving the friends list.';
      console.log('an Error occurred while retrieving the friends list');
      return next(err);
    }

    data.users.forEach((friendsInfo) => {
      let friendsObj = {};
      friendsObj.profileImage = friendsInfo.profile_image_url;
      friendsObj.name = friendsInfo.name;
      friendsObj.screenName = friendsInfo.screen_name;
      twitterData.friends.push(friendsObj);
    });
    console.log(twitterData.friends);
  });
  T.get('direct_messages/events/list', { count: 5 }, (err, data, response) => {
    if (err) {
      err.message = 'Sorry, an Error occurred while retrieving the direct messages.';
      console.log('an Error occurred while retrieving the direct messages');
      return next(err);
    }

    data.events.forEach((messageInfo) => {
      let messageObj = {};
      messageObj.text = messageInfo.message_create.message_data.text;
      let timestamp = parseInt(messageInfo.created_timestamp);
      let date = moment(timestamp).format('YYYY-MM-DD');
      let time = moment(timestamp).format('h:mm:ss a');
      messageObj.date = date;
      messageObj.time = time;
      twitterData.messages.push(messageObj);
    });
  });
  next();
});

router.get('/', (req, res, next) => {
  res.render('index', twitterData);
  console.log(twitterData);
});

module.exports = router;