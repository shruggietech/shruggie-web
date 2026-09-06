import type { Metadata } from "next";

import EditorialWorkspace from "@/components/editorial/EditorialWorkspace";

export const metadata: Metadata = {
  title: "Editorial workspace",
  description: "Private article authoring for approved ShruggieTech staff.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="bg-bg-primary min-h-screen pt-28 pb-24">
      <div className="container-content">
        <EditorialWorkspace />
      </div>
    </div>
  );
}
