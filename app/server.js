import express from 'express';
import cors from 'cors';
import { createRequestHandler } from '@remix-run/express'; // Import Remix Express handler

const app = express();

// Set up CORS to allow requests from your Shopify domain
app.use(cors({
  origin: 'https://your-shopify-store.myshopify.com', // Replace with your actual Shopify domain
}));

// Any additional middlewares like body-parser, etc., can be added here

// Your existing Remix handler here
app.all(
  '*',
  createRequestHandler({
    // You can add options here
    getLoadContext() {
      // Whatever you need in context
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});