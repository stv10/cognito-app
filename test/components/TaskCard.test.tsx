import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '@/components/TaskCard';

// Mock the UI components
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <span data-variant={variant} className={className}>{children}</span>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, size, variant, className }: { children: React.ReactNode; onClick?: () => void; size?: string; variant?: string; className?: string }) => (
    <button onClick={onClick} data-size={size} data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h3 className={className}>{children}</h3>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Edit: () => <span data-testid="edit-icon">Edit</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  CheckCircle: () => <span data-testid="check-icon">Check</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
}));

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending' as const,
    priority: 'medium' as const,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task information', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const editButton = screen.getByTestId('edit-icon').closest('button');
    fireEvent.click(editButton!);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const deleteButton = screen.getByTestId('trash-icon').closest('button');
    fireEvent.click(deleteButton!);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should call onStatusChange when status button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const statusButton = screen.getByTestId('clock-icon').closest('button');
    fireEvent.click(statusButton!);

    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'in-progress');
  });

  it('should display correct status icon for pending task', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('should display correct status icon for in-progress task', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as const };
    
    render(
      <TaskCard
        task={inProgressTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('should display correct status icon for completed task', () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    
    render(
      <TaskCard
        task={completedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should display creation date', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it('should display updated date when different from creation date', () => {
    const updatedTask = {
      ...mockTask,
      updatedAt: new Date('2023-01-02'),
    };

    render(
      <TaskCard
        task={updatedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });
}); 