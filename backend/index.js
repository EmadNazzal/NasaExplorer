// require("dotenv").config();

const app = require("./app");
const serverless = require("serverless-http");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`NASA Backend running on port ${PORT}`);
// });
console.log("✅ NASA Express Server is loaded and ready!");

module.exports = serverless(app);
