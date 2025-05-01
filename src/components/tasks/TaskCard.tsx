
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Edit, Trash } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

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

const getPriorityLabel = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "Élevée";
    case "medium":
      return "Moyenne";
    case "low":
      return "Faible";
    default:
      return "Inconnue";
  }
};

const getStatusLabel = (status: Task["status"]) => {
  switch (status) {
    case "todo":
      return "À Faire";
    case "in-progress":
      return "En Cours";
    case "done":
      return "Terminé";
    default:
      return "Inconnu";
  }
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const { title, description, dueDate, priority, status } = task;
  const formattedDate = format(new Date(dueDate), "d MMM yyyy", { locale: fr });
  const isOverdue = new Date(dueDate) < new Date() && status !== "done";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-2 mb-4">
          {description || "Aucune description fournie"}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={cn(getPriorityColor(priority))}>
            {getPriorityLabel(priority)}
          </Badge>
          <Badge variant="outline" className={cn(getStatusColor(status))}>
            {getStatusLabel(status)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span className={cn(isOverdue && "text-red-500 font-medium")}>
            {isOverdue ? "En retard: " : "Échéance: "}
            {formattedDate}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4 mr-1" /> Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500"
            onClick={() => onDelete(task.id)}
          >
            <Trash className="h-4 w-4 mr-1" /> Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
