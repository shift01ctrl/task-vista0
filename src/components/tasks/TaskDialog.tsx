
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, User, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { translateToFrench } from "@/utils/translations";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface TeamData {
  id: string;
  name: string;
  description: string;
  members: string[];
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
  status: z.enum(["todo", "in-progress", "done"], {
    required_error: "Status is required",
  }),
  assignmentType: z.enum(["user", "team", "none"]).optional(),
  assignedTo: z.string().optional(),
  assignedToTeam: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask?: Task | null;
}

const TaskDialog = ({ open, onOpenChange, editingTask }: TaskDialogProps) => {
  const { addTask, updateTask } = useTaskContext();
  const isEditing = !!editingTask;
  const [users, setUsers] = useState<UserData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [assignmentType, setAssignmentType] = useState<"user" | "team" | "none">("none");

  // Load users and teams from localStorage
  useEffect(() => {
    const loadUsersAndTeams = () => {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        try {
          setUsers(JSON.parse(savedUsers));
        } catch (error) {
          console.error("Failed to parse users:", error);
          setUsers([]);
        }
      }

      const savedTeams = localStorage.getItem("teams");
      if (savedTeams) {
        try {
          setTeams(JSON.parse(savedTeams));
        } catch (error) {
          console.error("Failed to parse teams:", error);
          setTeams([]);
        }
      }
    };

    loadUsersAndTeams();
  }, []);

  // Set assignment type based on existing task
  useEffect(() => {
    if (editingTask) {
      if (editingTask.assignedTo) {
        setAssignmentType("user");
      } else if (editingTask.assignedToTeam) {
        setAssignmentType("team");
      } else {
        setAssignmentType("none");
      }
    } else {
      setAssignmentType("none");
    }
  }, [editingTask]);

  const defaultValues: TaskFormValues = {
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "medium",
    status: "todo",
    assignmentType: "none",
    assignedTo: "",
    assignedToTeam: "",
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: editingTask
      ? {
          ...editingTask,
          dueDate: new Date(editingTask.dueDate),
          assignmentType: editingTask.assignmentType || 
                        (editingTask.assignedTo ? "user" : 
                         editingTask.assignedToTeam ? "team" : "none"),
          assignedTo: editingTask.assignedTo || "",
          assignedToTeam: editingTask.assignedToTeam || "",
        }
      : defaultValues,
  });

  // Reset form when dialog opens or editingTask changes
  useEffect(() => {
    if (open) {
      if (editingTask) {
        const assignmentType = editingTask.assignmentType || 
                             (editingTask.assignedTo ? "user" : 
                              editingTask.assignedToTeam ? "team" : "none");
        
        setAssignmentType(assignmentType as "user" | "team" | "none");
        
        form.reset({
          title: editingTask.title,
          description: editingTask.description,
          dueDate: new Date(editingTask.dueDate),
          priority: editingTask.priority,
          status: editingTask.status,
          assignmentType: assignmentType as "user" | "team" | "none",
          assignedTo: editingTask.assignedTo || "",
          assignedToTeam: editingTask.assignedToTeam || "",
        });
      } else {
        setAssignmentType("none");
        form.reset(defaultValues);
      }
    }
  }, [open, editingTask, form]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getUserById = (userId: string): UserData | undefined => {
    return users.find(user => user.id === userId);
  };

  const getTeamById = (teamId: string): TeamData | undefined => {
    return teams.find(team => team.id === teamId);
  };

  const onSubmit = (data: TaskFormValues) => {
    let assigneeName;
    
    if (data.assignmentType === "user" && data.assignedTo && data.assignedTo !== "unassigned") {
      const assignedUser = getUserById(data.assignedTo);
      assigneeName = assignedUser?.name;
    } else if (data.assignmentType === "team" && data.assignedToTeam && data.assignedToTeam !== "unassigned") {
      const assignedTeam = getTeamById(data.assignedToTeam);
      assigneeName = assignedTeam?.name;
    }
    
    if (isEditing && editingTask) {
      updateTask(editingTask.id, {
        ...data,
        dueDate: data.dueDate.toISOString(),
        assigneeName,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        priority: data.priority,
        status: data.status,
        assignmentType: data.assignmentType,
        assignedTo: data.assignmentType === "user" ? data.assignedTo : undefined,
        assignedToTeam: data.assignmentType === "team" ? data.assignedToTeam : undefined,
        assigneeName,
      });
    }
    onOpenChange(false);
  };

  const handleAssignmentTypeChange = (value: string) => {
    setAssignmentType(value as "user" | "team" | "none");
    form.setValue("assignmentType", value as "user" | "team" | "none");
    
    // Reset the other assignment field
    if (value === "user") {
      form.setValue("assignedToTeam", "");
    } else if (value === "team") {
      form.setValue("assignedTo", "");
    } else {
      form.setValue("assignedTo", "");
      form.setValue("assignedToTeam", "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{isEditing ? translateToFrench("Edit Task") : translateToFrench("Add New Task")}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? translateToFrench("Make changes to your task here")
                  : translateToFrench("Create a new task to keep track of your work")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translateToFrench("Title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={translateToFrench("Title")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translateToFrench("Description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translateToFrench("Description")}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{translateToFrench("Due Date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{translateToFrench("Pick a date")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translateToFrench("Priority")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translateToFrench("Select priority")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">{translateToFrench("Low")}</SelectItem>
                          <SelectItem value="medium">{translateToFrench("Medium")}</SelectItem>
                          <SelectItem value="high">{translateToFrench("High")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translateToFrench("Status")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translateToFrench("Select status")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">{translateToFrench("To Do")}</SelectItem>
                          <SelectItem value="in-progress">{translateToFrench("In Progress")}</SelectItem>
                          <SelectItem value="done">{translateToFrench("Done")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assignmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translateToFrench("Assigned To")}</FormLabel>
                      <Select 
                        onValueChange={(value) => handleAssignmentTypeChange(value)} 
                        value={assignmentType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translateToFrench("Assign to...")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{translateToFrench("Unassigned")}</SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{translateToFrench("Assign to User")}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="team">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{translateToFrench("Assign to Team")}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Conditional rendering based on assignment type */}
              {assignmentType === "user" && (
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translateToFrench("User")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translateToFrench("Select a user")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.length > 0 ? (
                            users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                  </Avatar>
                                  <span>{user.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-users" disabled>
                              {translateToFrench("No users available")}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {assignmentType === "team" && (
                <FormField
                  control={form.control}
                  name="assignedToTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translateToFrench("Team")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translateToFrench("Select a team")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.length > 0 ? (
                            teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-primary" />
                                  <span>{team.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-teams" disabled>
                              {translateToFrench("No teams available")}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                {translateToFrench("Cancel")}
              </Button>
              <Button type="submit">
                {isEditing ? translateToFrench("Save Changes") : translateToFrench("Create Task")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
