import { Button, Layout, Page } from '@shopify/polaris';
import React from 'react'

export default function Billing() {
  return (
    <Page title="Billing">
      <Layout>
        <Layout.Section>
          <Button
            target="_top"
            url="https://admin.shopify.com/store/wheel-of-wonders/charges/spinorama/pricing_plans"
          >
            View Plan
          </Button>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
