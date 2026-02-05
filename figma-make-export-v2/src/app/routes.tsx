import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/Layout";
import { CrossPlatformDashboard } from "./components/CrossPlatformDashboard";
import { UnifiedAudienceInsights } from "./components/UnifiedAudienceInsights";
import { StrategicCreativeStudio } from "./components/StrategicCreativeStudio";
import { DistributionFlow } from "./components/DistributionFlow";
import { SuccessDashboard } from "./components/SuccessDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: CrossPlatformDashboard },
      { path: "audience", Component: UnifiedAudienceInsights },
      { 
        path: "business-insights", 
        loader: () => redirect("/audience")
      },
      { path: "creative", Component: StrategicCreativeStudio },
      { path: "distribution", Component: DistributionFlow },
      { path: "success", Component: SuccessDashboard },
      {
        path: "*",
        loader: () => redirect("/")
      }
    ],
  },
]);
