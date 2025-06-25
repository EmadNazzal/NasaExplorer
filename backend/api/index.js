// // require("dotenv").config();
// const app = require("../app");
// const serverless = require("serverless-http");

// const isLocal = process.env.IS_LOCAL === "true";

// if (isLocal) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`✅ NASA Backend running locally at http://localhost:${PORT}`);
//   });
// } else {
//   console.log("✅ NASA Serverless function loaded for deployment");
//   module.exports = serverless(app);
// }

const app = require("../app");
const serverless = require("serverless-http");

module.exports = serverless(app);
