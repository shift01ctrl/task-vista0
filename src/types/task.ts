
export interface Task {
  id: string;
  title: string;
  description: string;
  startDate?: string; // ISO string format
  dueDate: string; // ISO string format
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdAt: string; // ISO string format
  assignedTo?: string; // User ID
  assignedToTeam?: string; // Team ID
  assignmentType?: "user" | "team" | "none"; // Updated to include "none"
  assigneeName?: string; // User name or team name (for display purposes)
}
