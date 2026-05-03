import type { Status } from "../types";

const labels: Record<Status, string> = {
  detected: "Detected",
  in_progress: "In progress",
  fixed: "Fixed",
  reopened: "Reopened",
  false_positive: "False positive",
};

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
