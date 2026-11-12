"use client";

import { RadioGroupField, SelectField } from "@payloadcms/ui";
import type { SelectFieldClientProps } from "payload";
import { useCompactLayout } from "@/features/admin-studio/shared/ui/useCompactLayout";

export function CaseStatusField(props: SelectFieldClientProps) {
  const compact = useCompactLayout();
  return compact ? (
    <RadioGroupField {...props} field={{ ...props.field, type: "radio" }} />
  ) : (
    <SelectField {...props} />
  );
}
