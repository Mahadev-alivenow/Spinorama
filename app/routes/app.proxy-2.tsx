import { ActionFunction } from "@remix-run/node";
import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("-------------hit app proxy test -------------");
  // console.log(authenticate);
  // const { admin } = await authenticate.admin(request);
  const { session } = await authenticate.public.appProxy(request);

  if (session) {
    console.log(session);
  }
  return null;
};
const Proxy = () => {
  return <Page>Proxy</Page>;
};
export default Proxy;
