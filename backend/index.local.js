// Load environment variables from .env if available
require("dotenv").config();

const app = require("./app"); // your Express app

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ NASA Backend running locally at http://localhost:${PORT}`);
});
