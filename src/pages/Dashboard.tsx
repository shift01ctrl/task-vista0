
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTaskContext } from "@/context/TaskContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const PRIORITY_COLORS = {
  high: "hsl(var(--priority-high))",
  medium: "hsl(var(--priority-medium))",
  low: "hsl(var(--priority-low))"
};

const Dashboard = () => {
  const { tasks } = useTaskContext();
  const [username, setUsername] = useState("User");
  
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const statusData = [
    { name: "To Do ⏱️", value: tasks.filter(task => task.status === "todo").length },
    { name: "In Progress 🔄", value: tasks.filter(task => task.status === "in-progress").length },
    { name: "Completed ✅", value: tasks.filter(task => task.status === "done").length }
  ];

  const priorityData = [
    { name: "High 🚨", value: tasks.filter(task => task.priority === "high").length },
    { name: "Medium ⚠️", value: tasks.filter(task => task.priority === "medium").length },
    { name: "Low ℹ️", value: tasks.filter(task => task.priority === "low").length }
  ];

  const dueDateData = [
    { name: "Overdue 😱", value: tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== "done").length },
    { name: "Due Today ⚡", value: tasks.filter(task => {
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === today.getDate() && 
             taskDate.getMonth() === today.getMonth() && 
             taskDate.getFullYear() === today.getFullYear() &&
             task.status !== "done";
    }).length },
    { name: "Upcoming 🔮", value: tasks.filter(task => new Date(task.dueDate) > new Date() && task.status !== "done").length }
  ];

  return (
    <PageLayout title={`Welcome, ${username}! 👋`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status 📊</CardTitle>
            <CardDescription>Distribution of tasks by status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer 
              config={{
                todo: { label: "To Do" },
                inProgress: { label: "In Progress" },
                done: { label: "Completed" },
              }}
              className="w-full h-64"
            >
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Priority Card */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priorities 📈</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer 
              config={{
                high: { label: "High", color: PRIORITY_COLORS.high },
                medium: { label: "Medium", color: PRIORITY_COLORS.medium },
                low: { label: "Low", color: PRIORITY_COLORS.low },
              }}
              className="w-full h-64"
            >
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={Object.values(PRIORITY_COLORS)[index % Object.values(PRIORITY_COLORS).length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Task Stats Summary 📝</CardTitle>
            <CardDescription>Key metrics for your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <div className="text-4xl font-bold">
                  {tasks.length} 📊
                </div>
                <div className="text-sm font-medium mt-1">Total Tasks</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-4xl font-bold text-green-600">
                  {tasks.filter(task => task.status === "done").length} ✅
                </div>
                <div className="text-sm font-medium mt-1">Completed</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-4xl font-bold text-yellow-600">
                  {tasks.filter(task => task.status === "in-progress").length} 🔄
                </div>
                <div className="text-sm font-medium mt-1">In Progress</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {tasks.filter(task => task.status === "todo").length} ⏱️
                </div>
                <div className="text-sm font-medium mt-1">To Do</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due Date Card */}
        <Card>
          <CardHeader>
            <CardTitle>Due Date Status 📅</CardTitle>
            <CardDescription>Tasks by due date status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer 
              config={{
                overdue: { label: "Overdue" },
                today: { label: "Due Today" },
                upcoming: { label: "Upcoming" },
              }}
              className="w-full h-64"
            >
              <PieChart>
                <Pie
                  data={dueDateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {dueDateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
