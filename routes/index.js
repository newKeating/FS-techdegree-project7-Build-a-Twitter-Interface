const express = require('express');
const router = express.Router();

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
  
  next();
});



module.exports = router;