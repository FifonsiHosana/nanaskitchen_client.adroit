import { AuditTable } from "@/app/components/audit-trail/audit_table";
import { AuditTableSkeleton } from "@/app/components/tables-skeleton";
import { Card } from "@/app/components/ui/card";
import { useAuditStore } from "@/app/store/v2/use-audit-log-store";
import React from "react";

const audit = () => {
  const { logs, isLoading } = useAuditStore();

  if (isLoading && logs.length === 0) {
    return <AuditTableSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-start gap-4 p-4">
      <Card className="w-full ">
        <AuditTable />
      </Card>
    </div>
  );
};

export default audit;
