"use client";

import { useState } from "react";
import QuickActionButtons from "./quick-action-buttons";
import PanelTask from "./task/panel-task";
import PanelInbox from "./inbox/panel-inbox";

export default function HomeComponent() {
  const [activeTab, setActiveTab] = useState<"none" | "task" | "inbox">("none");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <QuickActionButtons
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {activeTab === "task" && <PanelTask />}
      {activeTab === "inbox" && <PanelInbox />}
    </>
  );
}
