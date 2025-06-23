import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Search, Shield, Users } from 'lucide-react';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { useUserRole } from '@/hooks/useUserRole';
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

export const TasksPage = () => {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const { isAdmin, role } = useUserRole();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');

  const handleCreateTask = (data: CreateTaskData) => {
    createTask(data);
    setShowForm(false);
  };

  const handleUpdateTask = (data: UpdateTaskData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleSubmit = (data: CreateTaskData | UpdateTaskData) => {
    if (editingTask) {
      handleUpdateTask(data as UpdateTaskData);
    } else {
      handleCreateTask(data as CreateTaskData);
    }
  };

  const handleEditTask = (task: Task) => {
    // Only admins can edit tasks
    if (!isAdmin) {
      alert('You do not have permission to edit tasks. Please contact an administrator.');
      return;
    }
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    // Only admins can delete tasks
    if (!isAdmin) {
      alert('You do not have permission to delete tasks. Please contact an administrator.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    updateTask(id, { status });
  };

  // Filter tasks based on user role
  const getFilteredTasks = () => {
    let filteredTasks = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // If user is not admin, only show tasks assigned to them (mock implementation)
    if (!isAdmin) {
      // In a real app, you'd filter by actual assignment
      // For now, we'll show a subset of tasks for demonstration
      filteredTasks = filteredTasks.slice(0, Math.ceil(filteredTasks.length / 2));
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  const getStatusCount = (status: Task['status']) => {
    const tasksToCount = isAdmin ? tasks : getFilteredTasks();
    return tasksToCount.filter(task => task.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {isAdmin ? (
                <>
                  <Shield className="h-6 w-6 text-red-500" />
                  Admin Task Management
                </>
              ) : (
                <>
                  <Users className="h-6 w-6 text-blue-500" />
                  My Tasks
                </>
              )}
            </h2>
            <p className="text-muted-foreground">
              {isAdmin 
                ? "Create, edit, and manage all tasks in the system" 
                : "View and update your assigned tasks"
              }
            </p>
          </div>
          <Badge variant={isAdmin ? "destructive" : "secondary"}>
            {role}
          </Badge>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      {/* Role-based info card */}
      {!isAdmin && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Users className="h-4 w-4" />
              <p className="text-sm">
                You are viewing your assigned tasks. Only administrators can create, edit, or delete tasks.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredTasks.length}</div>
            <div className="text-sm text-muted-foreground">
              {isAdmin ? "Total Tasks" : "My Tasks"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{getStatusCount('pending')}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{getStatusCount('in-progress')}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{getStatusCount('completed')}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Form - Only show for admins */}
      {showForm && isAdmin && (
        <TaskForm
          task={editingTask || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isAdmin ? "All Tasks" : "My Tasks"} ({filteredTasks.length})
          </h3>
          {filteredTasks.length === 0 && tasks.length > 0 && (
            <Badge variant="outline">No tasks match your filters</Badge>
          )}
        </div>

        {filteredTasks.length === 0 && tasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {isAdmin 
                  ? "No tasks yet. Create your first task to get started!" 
                  : "No tasks assigned to you yet."
                }
              </p>
              {isAdmin && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                canEdit={isAdmin}
                canDelete={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};