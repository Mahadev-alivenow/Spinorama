// app/routes/auth/login.jsx
import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <main>
      <h1>Log in to Spinorama App</h1>
      <Form method="get" action="/auth">
        <label htmlFor="shop">Enter your Shopify domain</label>
        <input
          type="text"
          name="shop"
          placeholder="yourshop.myshopify.com"
          required
        />
        <button type="submit">Continue</button>
      </Form>
    </main>
  );
}
