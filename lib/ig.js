const fs = require("fs");
const {IgApiClient} = require("instagram-private-api/dist/index");

const Instagram = {
  saveSession: (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
  },
  getSession: (filePath) => {
    return fs.readFileSync(filePath).toString("utf8");
  },
  login: async (username, password, sessionFile) => {
    const ig = new IgApiClient();
    // console.log("Before generate");
    ig.state.generateDevice(username);
    // console.log("After generate");

    // This function executes after every request
    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      // this deletes the version info, so you'll always use the version provided by the library
      delete serialized.constants;
      Instagram.saveSession(sessionFile, serialized);
    });
    if(fs.existsSync(sessionFile)) {
      // import state accepts both a string as well as an object
      // the string should be a JSON object
      await ig.state.deserialize(Instagram.getSession(sessionFile));
    }

    // This call will provoke request.end$ stream
    await ig.account.login(username, password);
    // Most of the time you don't have to login after loading the state
    // return ig api client instance
    return ig;
  },
  getUserStories: async (ig, targetUsername) => {
    // getting exact user by login
    const targetUser = await ig.user.searchExact(targetUsername);
    // working with reels media feed (stories feed)
    // you can specify multiple user id's, "pk" param is user id
    const reelsFeed = ig.feed.reelsMedia({
      userIds: [targetUser.pk],
    });
    const storyItems = await reelsFeed.items();
    return storyItems;
  }
}

module.exports = Instagram;
