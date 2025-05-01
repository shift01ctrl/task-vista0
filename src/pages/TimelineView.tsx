
import { useState, useMemo } from "react";
import { format, isToday, compareAsc } from "date-fns";
import { Plus } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import PageLayout from "@/components/layout/PageLayout";
import TaskDialog from "@/components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

const TimelineView = () => {
  const { tasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => 
      compareAsc(new Date(a.dueDate), new Date(b.dueDate))
    );
  }, [tasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
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

  // Group tasks by month and date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    sortedTasks.forEach(task => {
      const date = format(new Date(task.dueDate), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    
    return grouped;
  }, [sortedTasks]);

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <PageLayout title="Timeline View">
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      <div className="relative">
        {/* Timeline center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-12">
          {Object.entries(tasksByDate).map(([dateKey, dateTasks]) => {
            const date = new Date(dateKey);
            const formattedDate = format(date, "MMMM d, yyyy");
            const now = new Date();
            const isPast = date < now && !isToday(date);
            const isPresent = isToday(date);
            const isFuture = date > now;

            return (
              <div key={dateKey} className="relative">
                {/* Date marker */}
                <div className="flex items-center justify-center mb-4">
                  <div 
                    className={cn(
                      "z-10 px-4 py-1 rounded-full font-medium text-sm",
                      isPresent && "bg-primary text-white",
                      isPast && "bg-gray-200 text-gray-700",
                      isFuture && "bg-blue-100 text-blue-800"
                    )}
                  >
                    {formattedDate}
                    {isPresent && " (Today)"}
                  </div>
                </div>

                {/* Tasks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dateTasks.map((task, index) => {
                    const isLeft = index % 2 === 0;
                    const isOverdue = new Date(task.dueDate) < now && task.status !== "done";
                    
                    return (
                      <div 
                        key={task.id}
                        className={cn(
                          "relative p-4 border rounded-lg shadow-sm bg-white cursor-pointer",
                          isLeft ? "md:mr-8" : "md:ml-8 md:col-start-2",
                          isOverdue && task.status !== "done" && "border-red-300"
                        )}
                        onClick={() => handleEditTask(task)}
                      >
                        {/* Connector line */}
                        <div 
                          className={cn(
                            "hidden md:block absolute top-1/2 w-8 h-0.5 bg-gray-200",
                            isLeft ? "right-0 translate-x-full" : "left-0 -translate-x-full"
                          )}
                        ></div>
                        
                        {/* Task content */}
                        <h3 className="font-medium mb-2">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-2 justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={cn(getPriorityColor(task.priority))}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={cn(getStatusColor(task.status))}>
                              {task.status === "todo" ? "To Do" : task.status === "in-progress" ? "In Progress" : "Done"}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(task.dueDate), "h:mm a")}
                          </div>
                        </div>

                        {/* Show assignee if exists */}
                        {task.assigneeName && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{getInitials(task.assigneeName)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">Assigned to: {task.assigneeName}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {Object.keys(tasksByDate).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tasks found. Click "Add Task" to create one.
            </div>
          )}
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

export default TimelineView;
