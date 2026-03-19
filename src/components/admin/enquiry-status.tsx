"use client";

import * as React from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EnquiryStatus({ id, status }: { id: string; status: "NEW" | "CONTACTED" | "CLOSED" }) {
  const [value, setValue] = React.useState(status);

  async function update(next: typeof value) {
    setValue(next);
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next })
    });
    if (!res.ok) toast.error("Could not update status");
    else toast.message("Updated");
  }

  return (
    <Select value={value} onValueChange={(v) => update(v as any)}>
      <SelectTrigger className="h-9 w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NEW">NEW</SelectItem>
        <SelectItem value="CONTACTED">CONTACTED</SelectItem>
        <SelectItem value="CLOSED">CLOSED</SelectItem>
      </SelectContent>
    </Select>
  );
}

