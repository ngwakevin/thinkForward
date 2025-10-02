import React from "react";
import HoverFlowClient from "./HoverFlowClient";

export default function Page() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "radial-gradient(circle at 20% 20%, #0f2027, #203a43, #2c5364)" }}
    >
      <HoverFlowClient />
    </main>
  );
}
