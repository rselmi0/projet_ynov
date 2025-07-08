export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  local_id?: string; // For offline sync
  synced: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface OfflineTask {
  localId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  action: 'create' | 'update' | 'delete';
  // For updates and deletes
  serverId?: string;
}

// Component-specific types - using type alias instead of empty interface
export type TaskCardTask = Task;

export interface TaskCardProps {
  task: TaskCardTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: TaskCardTask) => void;
}

export interface TaskListProps {
  tasks: TaskCardTask[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: TaskCardTask) => void;
}

export interface EditTaskModalProps {
  task: TaskCardTask | null;
  isVisible: boolean;
  isUpdating: boolean;
  onClose: () => void;
  onUpdate: (title: string, description?: string) => void;
}

export interface CreateTaskFormProps {
  onCreateTask: (data: { title: string; description?: string }) => Promise<void>;
}

export interface StatusBadgesProps {
  isConnected: boolean;
  pendingCount: number;
  onManualSync?: () => void;
  showSyncButton?: boolean;
} 