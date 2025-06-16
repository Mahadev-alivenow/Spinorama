// Create a new file that redirects to /campaigns/create
import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("/campaigns/create");
};

export default function CreateCampaignRedirect() {
  return null;
}
