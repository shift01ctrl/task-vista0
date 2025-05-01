
import React, { createContext, useState, useContext, useEffect } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Default tasks
const defaultTasks: Task[] = [
  {
    id: generateId(),
    title: "Compléter la proposition de projet",
    description: "Rédiger et soumettre la proposition de projet pour l'examen du client.",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: "high",
    status: "in-progress",
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Réunion d'équipe hebdomadaire",
    description: "Discuter des progrès et des tâches à venir avec l'équipe de développement.",
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    priority: "medium",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Mettre à jour la documentation",
    description: "Mettre à jour le guide d'utilisation avec les informations sur les nouvelles fonctionnalités.",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    priority: "low",
    status: "todo",
    createdAt: new Date().toISOString(),
    assignedTo: "3",
    assigneeName: "Bob Johnson",
  },
  {
    id: generateId(),
    title: "Corriger le bug de la page de connexion",
    description: "Résoudre le problème d'authentification sur la page de connexion.",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago (overdue)
    priority: "high",
    status: "todo",
    createdAt: new Date().toISOString(),
    assignedTo: "2",
    assigneeName: "Jane Smith",
  },
  {
    id: generateId(),
    title: "Présentation client",
    description: "Préparer les diapositives et la démo pour la présentation client.",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: "high",
    status: "todo",
    createdAt: new Date().toISOString(),
    assignedTo: "1",
    assigneeName: "John Doe",
  },
];

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const { toast } = useToast();

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Failed to parse stored tasks", error);
        // Fallback to default tasks if parsing fails
        setTasks(defaultTasks);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    // Handle unassigned value or clear assignments based on assignment type
    const finalTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Clear any irrelevant assignment fields based on assignment type
    if (task.assignmentType === "user") {
      finalTask.assignedToTeam = undefined;
      if (task.assignedTo === "unassigned") {
        finalTask.assignedTo = undefined;
        finalTask.assigneeName = undefined;
      }
    } else if (task.assignmentType === "team") {
      finalTask.assignedTo = undefined;
      if (task.assignedToTeam === "unassigned") {
        finalTask.assignedToTeam = undefined;
        finalTask.assigneeName = undefined;
      }
    } else {
      // No assignment
      finalTask.assignedTo = undefined;
      finalTask.assignedToTeam = undefined;
      finalTask.assigneeName = undefined;
      finalTask.assignmentType = undefined;
    }

    setTasks((prevTasks) => [...prevTasks, finalTask]);
    toast({
      title: "Tâche ajoutée",
      description: `"${task.title}" a été ajoutée à vos tâches.`,
    });
  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    // Handle assignment type changes
    const updates = { ...updatedTask };
    
    if (updates.assignmentType === "user") {
      updates.assignedToTeam = undefined;
      if (updates.assignedTo === "unassigned") {
        updates.assignedTo = undefined;
        updates.assigneeName = undefined;
      }
    } else if (updates.assignmentType === "team") {
      updates.assignedTo = undefined;
      if (updates.assignedToTeam === "unassigned") {
        updates.assignedToTeam = undefined;
        updates.assigneeName = undefined;
      }
    } else if (updates.assignmentType === undefined && 'assignedTo' in updates) {
      // Legacy case - maintain backward compatibility
      if (updates.assignedTo === "unassigned") {
        updates.assignedTo = undefined;
        updates.assigneeName = undefined;
      }
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    toast({
      title: "Tâche mise à jour",
      description: "Votre tâche a été mise à jour avec succès.",
    });
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    
    if (taskToDelete) {
      toast({
        title: "Tâche supprimée",
        description: `"${taskToDelete.title}" a été supprimée.`,
        variant: "destructive",
      });
    }
  };

  const getTaskById = (taskId: string) => {
    return tasks.find((task) => task.id === taskId);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, getTaskById }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
