import React from "react";
import AutoprekesComingSoon from "../components/autoparts/AutoprekesComingSoon";
import AutoprekesStore from "../components/autoparts/AutoprekesStore";

const autoprekesViews = {
  comingSoon: AutoprekesComingSoon,
  store: AutoprekesStore
};

const ACTIVE_VIEW = "comingSoon";

export default function AutoprekesPage() {
  const ActiveView = autoprekesViews[ACTIVE_VIEW];
  return <ActiveView />;
}
