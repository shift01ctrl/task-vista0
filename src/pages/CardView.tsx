
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useTaskContext } from "@/context/TaskContext";
import TaskDialog from "@/components/tasks/TaskDialog";
import TaskCard from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToast } from "@/components/ui/use-toast";

const CardView = () => {
  const { tasks, updateTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    
    return matchesSearch && matchesPriority;
  });
  
  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "done");

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpen(true);
  };

  const handleDelete = (taskId: string) => {
    // This function is handled by the TaskCard component
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const taskToUpdate = tasks.find(task => task.id === draggableId);
    
    if (!taskToUpdate) return;

    let newStatus: "todo" | "in-progress" | "done";
    
    // Determine the new status based on the destination droppableId
    switch (destination.droppableId) {
      case "todo":
        newStatus = "todo";
        break;
      case "in-progress":
        newStatus = "in-progress";
        break;
      case "done":
        newStatus = "done";
        break;
      default:
        return; // Invalid destination
    }
    
    // Update the task status if it has changed
    if (taskToUpdate.status !== newStatus) {
      updateTask(taskToUpdate.id, { status: newStatus });
      
      toast({
        title: "Tâche mise à jour",
        description: `"${taskToUpdate.title}" déplacée vers ${
          newStatus === "todo" ? "À Faire" : 
          newStatus === "in-progress" ? "En Cours" : 
          "Terminé"
        }`,
      });
    }
  };

  return (
    <PageLayout title="Tableau des Tâches 📝">
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des tâches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 max-w-xs"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrer par priorité</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                  Toutes les priorités
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                  Priorité élevée 🚨
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                  Priorité moyenne ⚠️
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                  Priorité faible ℹ️
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => {
            setEditingTask(null);
            setOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Droppable droppableId="todo">
            {(provided) => (
              <div 
                className="rounded-lg border p-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="font-medium flex items-center border-b pb-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  À Faire ⏱️ ({todoTasks.length})
                </div>
                <div className="space-y-3">
                  {todoTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard 
                            task={task} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {todoTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucune tâche dans cette colonne
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          <Droppable droppableId="in-progress">
            {(provided) => (
              <div 
                className="rounded-lg border p-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="font-medium flex items-center border-b pb-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  En Cours 🔄 ({inProgressTasks.length})
                </div>
                <div className="space-y-3">
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard 
                            task={task} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucune tâche dans cette colonne
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          <Droppable droppableId="done">
            {(provided) => (
              <div 
                className="rounded-lg border p-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="font-medium flex items-center border-b pb-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  Terminé ✅ ({completedTasks.length})
                </div>
                <div className="space-y-3">
                  {completedTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard 
                            task={task} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucune tâche dans cette colonne
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <TaskDialog 
        open={open} 
        onOpenChange={setOpen} 
        editingTask={editingTask} 
      />
    </PageLayout>
  );
};

export default CardView;
