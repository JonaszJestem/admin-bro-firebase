const dotenvPlugin = require("cypress-dotenv");
const path = require("path");

module.exports = (on, config) => {
  config = dotenvPlugin(config, {
    path: path.resolve(process.cwd(), ".env.test")
  });

  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js"
  });
};
