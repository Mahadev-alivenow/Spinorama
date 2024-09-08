const express = require("express");
const { createRequestHandler } = require("@remix-run/express");
const cors = require("cors");

const app = express();

// Set allowed origin to your Shopify domain
const allowedOrigins = ["https://stingray-app-eevdq.ondigitalocean.app/"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable credentials if needed
  }),
);

// Static assets middleware
app.use(express.static("public"));

// Remix request handler
app.all(
  "*",
  createRequestHandler({
    getLoadContext() {
      // Anything you want to pass to loaders
    },
  }),
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
