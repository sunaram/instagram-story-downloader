const CLA = require("./lib/cla.js");
const Instagram = require("./lib/ig.js");
const fetch = require('node-fetch');
const fs = require("fs");
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));


let username, password;
// target users
const userIds = [];
// keep track of downloaded items from the current session
const downloadedItems = [];
// default time interval for checking new stories is 30 mins
let timeInterval = 30 * 60 * 1000;
try {
  const options = CLA.getOptions();
  // console.log(options);
  if(options.help) {
    CLA.printUsage();
    process.exit();
  }
  username = options.user ? options.user : "";
  password = options.pass ? options.pass : "";
  if(!username || !password) {
    console.log("Please enter username and password. Use the command line option -h to see usage");
    process.exit();
  }
  const inputFile = options.input ? options.input : "";
  if(fs.existsSync(inputFile)) {
    const inputFileContent = fs.readFileSync(inputFile).toString("utf8");
    // console.log(inputFileContent);
    const inputLines = inputFileContent.split("\r\n");
    // console.log(inputLines);
    inputLines.forEach(inputLine => {
      if(inputLine.trim() != "") {
        userIds.push(inputLine.trim());
      }
    });
  } else {
    console.log("Input file containing the target username list doesn't exist.");
    process.exit();
  }
  if(userIds.length == 0) {
    console.log("You don't have any target users.");
    process.exit();
  }
  // console.log(userIds);
  if(options.time) {
    timeInterval = options.time * 60 * 1000;
  }
  // console.log(timeInterval);
  // process.exit();
  // console.log("Yo");
} catch(err) {
  console.error(err);
  process.exit();
}


// create username dir if not exists
userIds.forEach(userId => {
  const userPath = "./downloads/"+ userId;
  if(!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, {recursive: true});
  }
});

console.log("Time interval for checking new stories is set at "+ timeInterval / (60 * 1000) +"mins");

const downloadStories = async (ig) => {
  console.log("Trying to get the stories...");
  try {
    for(const userId of userIds) {
      const storyItems = await Instagram.getUserStories(ig, userId);
      //console.log(storyItems);
      for(const item of storyItems) {
        //console.log(item.media_type, item.id);
        let url = "";
        if(item.media_type == 1) {
          //console.log(item.image_versions2);
          url = item.image_versions2.candidates[0].url;
        } else if(item.media_type == 2) {
          //console.log(item.video_versions);
          url = item.video_versions[0].url;
        }
        // console.log(url);
        if(url != "") {
          // download media
          // if not already downloaded
          if(!downloadedItems.includes(item.id)) {
            // image
            let fileName = "./downloads/"+ userId +"/"+ item.id +".jpg";
            // video
            if(item.media_type == 2)
              fileName = "./downloads/"+ userId +"/"+ item.id +".mp4";
            // download file if doesn't exist already
            if(!fs.existsSync(fileName)) {
              const res = await fetch(url);
              const dest = fs.createWriteStream(fileName);
              res.body.pipe(dest);
            } else {
              // console.log("File already downloaded");
            }
            // add to downloaded
            downloadedItems.push(item.id);
          }
        }

      }
    }
  } catch(err) {
    console.error(err);
  }
  console.log("Waiting for "+ timeInterval / (60 * 1000) +"mins before checking again...");
  await waitFor(timeInterval);
  await downloadStories(ig);
}

// login and start downloading
Instagram.login(username, password, "./session/"+ username +".json").then(ig => {
  downloadStories(ig).catch(err => {
    console.error(err);
  });

}).catch(err => {
  console.error(err);
});
