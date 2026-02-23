'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  name: string;
  status: 'Active' | 'Onboarding' | 'Paused' | 'Churned';
  revenueGate: number;
  tier: string;
  ltv: number;
  contractValue: number;
  phone: string;
  email: string;
  contactName: string;
  niche: string;
  startDate: string;
  shadowAvatar: string;
  bleedingNeck: string;
  contentPillars: string[];
  relationshipHealth: 'Good' | 'Neutral' | 'At Risk';
  onboardingStatus: number; // 0-100
  notes: string;
}

export interface Task {
  id: string;
  clientId: string;
  name: string;
  phase: string;
  currentStage: string;
  assignedRole: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assetLinks: string[];
  sopReference?: string;
  notes: string;
  createdAt: string;
  completedAt?: string;
}

interface DataContextType {
  clients: Client[];
  tasks: Task[];
  addClient: (client: Omit<Client, 'id' | 'startDate'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'nerozarb-os-v2';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Use functional updates to avoid lint issues if possible, 
      // but the issue is the sync call in effect.
      // We'll wrap in a timeout to move it out of the sync execution path of the effect.
      setTimeout(() => {
        setClients(parsed.clients || []);
        setTasks(parsed.tasks || []);
      }, 0);
    } else {
      // Initial Mock Data for first launch
      const initialClients: Client[] = [
        {
          id: '1',
          name: 'Quantum Growth',
          status: 'Active',
          revenueGate: 5000,
          tier: 'Platinum',
          ltv: 25000,
          contractValue: 5000,
          phone: '+123456789',
          email: 'ceo@quantum.com',
          contactName: 'John Doe',
          niche: 'SaaS',
          startDate: new Date().toISOString(),
          shadowAvatar: 'Tech Founder',
          bleedingNeck: 'High churn',
          contentPillars: ['Efficiency', 'Scaling'],
          relationshipHealth: 'Good',
          onboardingStatus: 100,
          notes: 'Key client.',
        }
      ];
      setTimeout(() => {
        setClients(initialClients);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients: initialClients, tasks: [] }));
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (clients.length > 0 || tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, tasks }));
    }
  }, [clients, tasks]);

  const addClient = (client: Omit<Client, 'id' | 'startDate'>) => {
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      startDate: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <DataContext.Provider value={{ clients, tasks, addClient, updateClient, addTask, updateTask, deleteTask }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
