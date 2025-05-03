
import { useState } from "react";
import { format } from "date-fns";
import { Plus, Edit, Trash, User, Send } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import PageLayout from "@/components/layout/PageLayout";
import TaskDialog from "@/components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { translateToFrench } from "@/utils/translations";

const TableView = () => {
  const { tasks, deleteTask, updateTask } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [reportText, setReportText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSubmitReport = (taskId: string) => {
    // In a real app, this would send the report to a backend
    toast.success(translateToFrench("Report submitted successfully!"));
    
    // Update the task status to show progress was made
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate && taskToUpdate.status === "in-progress") {
      updateTask(taskId, {
        ...taskToUpdate,
        description: taskToUpdate.description + "\n\nLatest report: " + reportText
      });
    }
    
    setReportText("");
    setSelectedTaskId(null);
  };

  const toggleTaskSelection = (taskId: string, status: Task["status"]) => {
    // Only allow selecting in-progress tasks
    if (status === "in-progress") {
      // If the task is already selected, deselect it
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      } else {
        setSelectedTaskId(taskId);
      }
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  // Get profile image from localStorage
  const profileImage = localStorage.getItem("profileImage");

  // Selected task for reporting
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

  return (
    <PageLayout title="Table View">
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-lg font-medium">{translateToFrench("Task Management")}</h2>
          <p className="text-sm text-muted-foreground">{translateToFrench("View and manage your tasks")}</p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" /> {translateToFrench("Add Task")}
        </Button>
      </div>

      {/* Show report textarea only when a task is selected */}
      {selectedTask && selectedTask.status === "in-progress" && (
        <div className="mb-6 p-4 border rounded-md bg-background">
          <h3 className="text-md font-medium mb-2">
            {translateToFrench("Submit Report for")}: {selectedTask.title}
          </h3>
          <Textarea 
            placeholder={translateToFrench("Enter your report here...")}
            className="mb-3"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={() => handleSubmitReport(selectedTaskId)}
              disabled={!reportText}
              className="gap-2"
            >
              <Send className="h-4 w-4" /> {translateToFrench("Submit Report")}
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => {
                  const dueDate = new Date(task.dueDate);
                  const isOverdue = dueDate < new Date() && task.status !== "done";
                  const isInProgress = task.status === "in-progress";
                  
                  return (
                    <tr 
                      key={task.id} 
                      className={cn(
                        "hover:bg-gray-50 cursor-pointer",
                        selectedTaskId === task.id && "bg-blue-50"
                      )}
                      onClick={() => toggleTaskSelection(task.id, task.status)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("text-sm", isOverdue && "text-red-600 font-medium")}>
                          {isOverdue && "Overdue: "}
                          {format(dueDate, "MMM d, yyyy")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={cn(getPriorityColor(task.priority))}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={cn(getStatusColor(task.status))}>
                          {task.status === "todo" ? "To Do" : task.status === "in-progress" ? "In Progress" : "Done"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.assigneeName ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={profileImage} />
                              <AvatarFallback>{getInitials(task.assigneeName)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assigneeName}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Unassigned</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tasks found. Click "Add Task" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingTask={editingTask}
      />
    </PageLayout>
  );
};

export default TableView;
