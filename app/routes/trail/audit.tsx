import { AuditTable } from "@/app/components/audit-trail/audit_table";
import { Card } from "@/app/components/ui/card";
import React from "react";

const audit = () => {
  return (
    <div className="flex flex-col items-center justify-start gap-4 p-4">
      <Card className="w-full ">
        <AuditTable />
      </Card>
    </div>
  );
};

export default audit;
