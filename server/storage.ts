import session from "express-session";
import createMemoryStore from "memorystore";
import { User, InsertUser, Appointment, InsertAppointment } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getInstructors(): Promise<User[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private currentUserId: number;
  private currentAppointmentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.currentUserId = 1;
    this.currentAppointmentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      licenseNumber: insertUser.licenseNumber ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.studentId === userId || apt.instructorId === userId
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const newAppointment: Appointment = { 
      ...appointment, 
      id,
      notes: appointment.notes ?? null,
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async getInstructors(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "instructor"
    );
  }
}

export const storage = new MemStorage();