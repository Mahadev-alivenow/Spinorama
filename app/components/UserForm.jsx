import React from "react";
import { Form, useActionData } from "@remix-run/react";

export default function UserForm() {
  const actionData = useActionData();

  return (
    <Form method="post" action="/api/submit-user">
      <div>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
      </div>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      <button type="submit">Submit</button>
    </Form>
  );
}
