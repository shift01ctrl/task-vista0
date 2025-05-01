
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useTaskContext } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { translateToFrench } from "@/utils/translations";

const t = translateToFrench;

const SearchPage = () => {
  const location = useLocation();
  const { tasks } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  
  // Parse query params on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [location.search, tasks]);

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = tasks.filter(task => 
      task.title.toLowerCase().includes(term.toLowerCase()) || 
      task.description.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
    
    // Update URL with search term
    const searchParams = new URLSearchParams();
    if (searchTerm) {
      searchParams.set("q", searchTerm);
    }
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    window.history.pushState({}, "", location.pathname);
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'todo': return '⏱️';
      case 'in-progress': return '🔄';
      case 'done': return '✅';
      default: return '';
    }
  };

  return (
    <PageLayout title={t("Search Tasks 🔍")}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("Task Search 🔎")}</CardTitle>
          <CardDescription>{t("Search for tasks by title or description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search for tasks...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-2 p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit">{t("Search")}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {searchResults.length > 0 ? 
              `${t("Results")} (${searchResults.length})` : 
              t("No results")}
          </h3>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge 
                      variant={task.status === 'done' ? 'outline' : 'default'}
                      className={`
                        ${task.status === 'todo' ? 'bg-blue-100 text-blue-800' : ''}
                        ${task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${task.status === 'done' ? 'bg-green-100 text-green-800' : ''}
                      `}
                    >
                      {t(task.status)} {getStatusEmoji(task.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="font-normal">
                      {t(task.priority)} {getPriorityEmoji(task.priority)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {t("Due")}: {format(new Date(task.dueDate), "MMM d, yyyy")} 📅
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchTerm ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium">{t("No tasks found")}</h3>
            <p className="text-muted-foreground mt-2">{t("Try a different search term")}</p>
          </Card>
        ) : null}
      </div>
    </PageLayout>
  );
};

export default SearchPage;
