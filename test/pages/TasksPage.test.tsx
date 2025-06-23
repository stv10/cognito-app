import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TasksPage } from '../../src/pages/TasksPage';
import type { Task, CreateTaskData } from '../../src/types/task';
import '@testing-library/jest-dom';

// Mock the useTasks hook
const mockUseTasks = vi.hoisted(() => vi.fn());
vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: mockUseTasks,
}));

// Mock the useUserRole hook
const mockUseUserRole = vi.hoisted(() => vi.fn());
vi.mock('../../src/hooks/useUserRole', () => ({
  useUserRole: mockUseUserRole,
}));

// Mock the components
vi.mock('../../src/components/TaskForm', () => ({
  TaskForm: ({ onSubmit, onCancel, task }: { onSubmit: (data: CreateTaskData) => void; onCancel: () => void; task?: Task }) => (
    <div data-testid="task-form">
      <button onClick={() => onSubmit({ title: 'Test Task', description: 'Test Description', priority: 'medium' })}>
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      {task && <span>Editing: {task.title}</span>}
    </div>
  ),
}));

vi.mock('../../src/components/TaskCard', () => ({
  TaskCard: ({ task, onEdit, onDelete, onStatusChange }: { task: Task; onEdit: (task: Task) => void; onDelete: (id: string) => void; onStatusChange: (id: string, status: string) => void }) => (
    <div data-testid="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
      <button onClick={() => onStatusChange(task.id, 'completed')}>Complete</button>
    </div>
  ),
}));

// Mock UI components
vi.mock('../../src/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('../../src/components/ui/card', () => ({
  Card: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <h3 {...props}>{children}</h3>,
}));

vi.mock('../../src/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <span data-variant={variant} className={className}>{children}</span>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => <span>Plus</span>,
  Filter: () => <span>Filter</span>,
  Search: () => <span>Search</span>,
  Users: () => <span>Users</span>,
  Shield: () => <span>Shield</span>,
  Eye: () => <span>Eye</span>,
  Settings: () => <span>Settings</span>,
  BarChart3: () => <span>BarChart3</span>,
  ListTodo: () => <span>ListTodo</span>,
}));

describe('TasksPage', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'pending' as const,
      priority: 'high' as const,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'completed' as const,
      priority: 'medium' as const,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
  ];

  const mockCreateTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockDeleteTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useUserRole with default user role
    mockUseUserRole.mockReturnValue({
      groups: [],
      hasGroup: vi.fn(),
      isAdmin: false,
      isUser: true,
      role: 'user',
      user: {},
    });

    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      getTask: vi.fn(),
    });
  });

  it('should render task management page', () => {
    // User role: should see My Tasks, not Task Management
    mockUseUserRole.mockReturnValue({
      groups: [],
      hasGroup: vi.fn(),
      isAdmin: false,
      isUser: true,
      role: 'user',
      user: {},
    });
    render(<TasksPage />);
    expect(screen.getAllByText(/My Tasks/).length).toBeGreaterThan(0);
    expect(screen.getByText(/View and update your assigned tasks/)).toBeInTheDocument();
  });

  it('should display task statistics', () => {
    // User role: should see stats for their own tasks
    mockUseUserRole.mockReturnValue({
      groups: [],
      hasGroup: vi.fn(),
      isAdmin: false,
      isUser: true,
      role: 'user',
      user: {},
    });
    render(<TasksPage />);
    // Should see numbers for My Tasks, Pending, In Progress, Completed
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // My Tasks, Pending
    expect(screen.getAllByText('0').length).toBeGreaterThan(0); // In Progress, Completed
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
  });

  it('should show loading state', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: true,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      getTask: vi.fn(),
    });

    render(<TasksPage />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should show empty state when no tasks', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      getTask: vi.fn(),
    });

    // User role: should see user empty state
    mockUseUserRole.mockReturnValue({
      groups: [],
      hasGroup: vi.fn(),
      isAdmin: false,
      isUser: true,
      role: 'user',
      user: {},
    });

    render(<TasksPage />);

    expect(screen.getByText(/No tasks assigned to you yet/)).toBeInTheDocument();
  });

  it('should render task cards', () => {
    // Admin role: should see all tasks
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {},
    });
    render(<TasksPage />);

    const taskCards = screen.getAllByTestId('task-card');
    expect(taskCards).toHaveLength(2);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should show task form when New Task button is clicked', () => {
    // Admin role: can create tasks
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {},
    });
    render(<TasksPage />);
    const newTaskButton = screen.getByText(/New Task/);
    fireEvent.click(newTaskButton);

    expect(screen.getByTestId('task-form')).toBeInTheDocument();
  });

  it('should handle task creation', async () => {
    // Admin role: can create tasks
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {},
    });
    render(<TasksPage />);
    const newTaskButton = screen.getByText(/New Task/);
    fireEvent.click(newTaskButton);

    // Submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });
    });
  });

  it('should handle task editing', async () => {
    // Admin role: can edit tasks
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {},
    });
    render(<TasksPage />);
    // Click edit on first task
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByText(/Editing: Task 1/)).toBeInTheDocument();
  });

  it('should handle task deletion', () => {
    // Admin role: can delete tasks
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {},
    });
    // Restore window.confirm mock
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<TasksPage />);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
    confirmSpy.mockRestore();
  });

  it('should handle status change', () => {
    render(<TasksPage />);

    const completeButtons = screen.getAllByText('Complete');
    fireEvent.click(completeButtons[0]);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', { status: 'completed' });
  });

  it('should filter tasks by search term', () => {
    render(<TasksPage />);

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'Task 1' } });

    // Should only show Task 1
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('should filter tasks by status', () => {
    render(<TasksPage />);

    const statusSelect = screen.getByDisplayValue('All Status');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    // Should only show completed tasks
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('should filter tasks by priority', () => {
    render(<TasksPage />);

    const prioritySelect = screen.getByDisplayValue('All Priorities');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    // Should only show high priority tasks
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('should show admin-specific content when user is admin', () => {
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {},
    });

    render(<TasksPage />);

    // Admin should see admin task management interface
    expect(screen.getByText(/Admin Task Management/)).toBeInTheDocument();
    expect(screen.getByText(/Create, edit, and manage all tasks/)).toBeInTheDocument();
  });
}); 