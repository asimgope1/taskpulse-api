import bcrypt from 'bcryptjs';
import { User, Task } from '../types';

class InMemoryStore {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Default demo user: email: test@example.com, password: Password123!
    const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);
    const demoUser: User = {
      id: 'usr_demo_1',
      name: 'Demo Engineer',
      email: 'test@example.com',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    };

    const teammateUser: User = {
      id: 'usr_demo_2',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      passwordHash: defaultPasswordHash,
      role: 'MEMBER',
      createdAt: new Date().toISOString()
    };

    this.users.set(demoUser.id, demoUser);
    this.users.set(teammateUser.id, teammateUser);

    const initialTask1: Task = {
      id: 'tsk_101',
      title: 'Setup CI/CD pipeline for TaskPulse',
      description: 'Configure GitHub Actions for automated linting, test runs, and preview deployments.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      creatorId: demoUser.id,
      assigneeId: teammateUser.id,
      tags: ['devops', 'infrastructure'],
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const initialTask2: Task = {
      id: 'tsk_102',
      title: 'Audit API endpoint authentication headers',
      description: 'Ensure Bearer token format is strictly checked and expired tokens return 401.',
      status: 'TODO',
      priority: 'CRITICAL',
      creatorId: demoUser.id,
      tags: ['security', 'auth'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.set(initialTask1.id, initialTask1);
    this.tasks.set(initialTask2.id, initialTask2);
  }

  // User operations
  public async findUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  public async findUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  public async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  // Task operations
  public async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async findTaskById(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  public async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const id = `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(id, task);
    return task;
  }

  public async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'creatorId'>>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.tasks.set(id, updated);
    return updated;
  }

  public async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  public resetForTesting() {
    this.users.clear();
    this.tasks.clear();
    this.seed();
  }
}

export const store = new InMemoryStore();
