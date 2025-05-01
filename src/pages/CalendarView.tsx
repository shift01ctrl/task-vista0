
import { useState, useMemo, useCallback } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isEqual, isBefore, parseISO, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/context/TaskContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import TaskDialog from "@/components/tasks/TaskDialog";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CalendarView = () => {
  const { tasks } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const daysInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get the start of the week for the first day
    let calendarStart = startOfWeek(monthStart);
    
    // For a full 6-week calendar (42 days), which ensures we show 
    // all possible days in a month plus the surrounding weeks
    const daysArray = [];
    for (let i = 0; i < 42; i++) {
      daysArray.push(addDays(calendarStart, i));
    }
    
    return daysArray;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    return Array.from({ length: 7 }).map((_, i) => {
      const day = addDays(weekStart, i);
      return format(day, "EEE", { locale: fr });
    });
  }, []);

  const getTasksForDay = useCallback((date: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.dueDate);
      return isEqual(
        new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate()),
        new Date(date.getFullYear(), date.getMonth(), date.getDate())
      );
    });
  }, [tasks]);
  
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
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
  
  return (
    <PageLayout title="Calendar View">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-4 text-lg font-medium">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </div>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 text-center border-b">
          {weekDays.map((day, i) => (
            <div key={i} className="py-2 border-r last:border-r-0 font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-6">
          {daysInMonth.map((date, i) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isSelected = isToday(date);
            const isPast = isBefore(date, new Date()) && !isToday(date);
            const dayTasks = getTasksForDay(date);
            
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[120px] border-r border-b p-1 relative",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isSelected && "bg-blue-50"
                )}
              >
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 text-sm",
                      isSelected && "bg-blue-600 text-white rounded-full"
                    )}
                  >
                    {format(date, "d")}
                  </span>
                </div>
                
                <div className="space-y-1 mt-1 max-h-[80px] overflow-y-auto">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "px-2 py-1 rounded-sm text-xs mb-1 cursor-pointer hover:opacity-90",
                        task.status === "done" ? "bg-gray-100" : "bg-blue-100",
                        task.status === "done" && "line-through text-gray-500"
                      )}
                      onClick={() => handleEditTask(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 truncate">{task.title}</div>
                        <div 
                          className={cn(
                            "w-2 h-2 rounded-full ml-1",
                            getPriorityColor(task.priority)
                          )} 
                        />
                      </div>
                      {task.assigneeName && (
                        <div className="flex items-center mt-1 text-[10px] text-gray-600">
                          <Avatar className="h-3 w-3 mr-1">
                            <AvatarFallback className="text-[6px]">{getInitials(task.assigneeName)}</AvatarFallback>
                          </Avatar>
                          {task.assigneeName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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

export default CalendarView;
