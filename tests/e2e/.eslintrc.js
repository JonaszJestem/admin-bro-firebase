module.exports = {
  plugins: ["cypress"],
  extends: ["plugin:cypress/recommended"],
  env: {
    mocha: true,
    "cypress/globals": true
  },
  rules: {
    strict: "off",
    
  }
};
