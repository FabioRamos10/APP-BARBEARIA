import type { StatusAgendamento } from "@/lib/types/enums";
import {
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/utils/agendamento-status";

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      ].join(" ")}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
