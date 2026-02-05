import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { AudienceDiscovery } from "./components/AudienceDiscovery";
import { CreativeStudio } from "./components/CreativeStudio";
import { DistributionFlow } from "./components/DistributionFlow";
import { SuccessDashboard } from "./components/SuccessDashboard";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "audience", Component: AudienceDiscovery },
      { path: "creative", Component: CreativeStudio },
      { path: "distribution", Component: DistributionFlow },
      { path: "success", Component: SuccessDashboard },
    ],
  },
]);
