import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTasks } from '@/hooks/useTasks';
import type { CreateTaskData } from '@/types/task';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
});

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with empty tasks', () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should load tasks from localStorage on mount', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
    expect(result.current.tasks[0].createdAt).toBeInstanceOf(Date);
  });

  it('should create a new task', () => {
    const { result } = renderHook(() => useTasks());

    const newTaskData: CreateTaskData = {
      title: 'New Task',
      description: 'New Description',
      priority: 'high',
    };

    act(() => {
      const createdTask = result.current.createTask(newTaskData);
      expect(createdTask.id).toBe('test-uuid-123');
      expect(createdTask.title).toBe('New Task');
      expect(createdTask.status).toBe('pending');
      expect(createdTask.createdAt).toBeInstanceOf(Date);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should update an existing task', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Original Task',
        description: 'Original Description',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks());

    act(() => {
      const updatedTask = result.current.updateTask('1', {
        title: 'Updated Task',
        status: 'completed',
      });

      expect(updatedTask).not.toBeNull();
      expect(updatedTask?.title).toBe('Updated Task');
      expect(updatedTask?.status).toBe('completed');
    });

    expect(result.current.tasks[0].title).toBe('Updated Task');
    expect(result.current.tasks[0].status).toBe('completed');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should return null when updating non-existent task', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      const updateResult = result.current.updateTask('non-existent', {
        title: 'Updated Task',
      });

      expect(updateResult).toBeNull();
    });
  });

  it('should delete a task', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Task to Delete',
        description: 'Description',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toHaveLength(1);

    act(() => {
      const deleted = result.current.deleteTask('1');
      expect(deleted).toBe(true);
    });

    expect(result.current.tasks).toHaveLength(0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should return false when deleting non-existent task', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      const deleted = result.current.deleteTask('non-existent');
      expect(deleted).toBe(false);
    });
  });

  it('should get a specific task', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks());

    const task = result.current.getTask('1');
    expect(task).toBeDefined();
    expect(task?.title).toBe('Test Task');

    const nonExistentTask = result.current.getTask('non-existent');
    expect(nonExistentTask).toBeUndefined();
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock console.error to prevent error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    
    consoleSpy.mockRestore();
  });
}); 