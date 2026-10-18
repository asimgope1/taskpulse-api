export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  creatorId: string;
  assigneeId?: string;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}
