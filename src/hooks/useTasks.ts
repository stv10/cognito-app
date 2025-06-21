import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

const STORAGE_KEY = 'tasks';

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedTasks = JSON.parse(stored).map((task: Omit<Task, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          }));
          setTasks(parsedTasks);
        } catch {
          setTasks([]);
        }
      }
    } catch (error) {
      // Handle localStorage access errors (e.g., in private browsing mode)
      console.error('Failed to access localStorage:', error);
      setTasks([]);
    }
    setLoading(false);
  }, []);

  // Save tasks to localStorage
  const saveTasks = useCallback((newTasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    setTasks(newTasks);
  }, []);

  const createTask = useCallback((data: CreateTaskData): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const newTasks = [...tasks, newTask];
    saveTasks(newTasks);
    return newTask;
  }, [tasks, saveTasks]);

  const updateTask = useCallback((id: string, data: UpdateTaskData): Task | null => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: new Date(),
    };

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    saveTasks(newTasks);
    return updatedTask;
  }, [tasks, saveTasks]);

  const deleteTask = useCallback((id: string): boolean => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    const newTasks = tasks.filter(task => task.id !== id);
    saveTasks(newTasks);
    return true;
  }, [tasks, saveTasks]);

  const getTask = useCallback((id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTask,
  };
};

export { useTasks }; 