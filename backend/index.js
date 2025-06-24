// require("dotenv").config();

const app = require("./app");
const serverless = require("serverless-http");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`NASA Backend running on port ${PORT}`);
// });

module.exports = serverless(app);
