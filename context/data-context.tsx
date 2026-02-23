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

export interface Post {
  id: string;
  clientId: string; // To link post to a client
  platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'YouTube';
  postType: string;
  hook: string;
  scheduledDate: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  pillar: string;
}

export interface Protocol {
  id: string;
  title: string;
  category: 'SOPs' | 'AI Prompts' | 'Client Assets' | 'Legal' | 'Strategy';
  pillar: string;
  updatedAt: string;
  content: string; // To hold the actual protocol/prompt text
}

interface DataContextType {
  clients: Client[];
  tasks: Task[];
  posts: Post[];
  protocols: Protocol[];
  isLoaded: boolean;
  addClient: (client: Omit<Client, 'id' | 'startDate'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void; // Added delete target
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addPost: (post: Omit<Post, 'id'>) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addProtocol: (protocol: Omit<Protocol, 'id' | 'updatedAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'nerozarb-os-v2';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        /* eslint-disable react-hooks/set-state-in-effect */
        setClients(parsed.clients || []);
        setTasks(parsed.tasks || []);
        setPosts(parsed.posts || []);
        setProtocols(parsed.protocols || []);
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
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

      const initialProtocols: Protocol[] = [
        { id: '1', title: 'Client Onboarding Flow', category: 'SOPs', pillar: 'Ops', updatedAt: new Date().toISOString().split('T')[0], content: "Step 1: Welcome email\nStep 2: Slack channel setup" },
        { id: '2', title: 'Viral Reel Script Structure', category: 'AI Prompts', pillar: 'Content', updatedAt: new Date().toISOString().split('T')[0], content: "Act as an expert copywriter. Write a reel script exploring the bleeding neck of [Audience]." },
      ];

      const initialPosts: Post[] = [
        {
          id: '1',
          clientId: '1',
          platform: 'Instagram',
          postType: 'Reel',
          hook: 'How we scaled to $10k/mo',
          scheduledDate: new Date().toISOString(),
          status: 'Scheduled',
          pillar: 'Scaling',
        }
      ];

      /* eslint-disable react-hooks/set-state-in-effect */
      setClients(initialClients);
      setProtocols(initialProtocols);
      setPosts(initialPosts);
      /* eslint-enable react-hooks/set-state-in-effect */
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients: initialClients, tasks: [], posts: initialPosts, protocols: initialProtocols }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, tasks, posts, protocols }));
    }
  }, [clients, tasks, posts, protocols, isLoaded]);

  const addClient = (client: Omit<Client, 'id' | 'startDate'>) => {
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      startDate: new Date().toISOString(),
    };
    setClients((prev: Client[]) => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev: Client[]) => prev.map((c: Client) => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id: string) => {
    setClients((prev: Client[]) => prev.filter((c: Client) => c.id !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev: Task[]) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev: Task[]) => prev.map((t: Task) => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks((prev: Task[]) => prev.filter((t: Task) => t.id !== id));
  };

  const addPost = (post: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPosts((prev: Post[]) => [...prev, newPost]);
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts((prev: Post[]) => prev.map((p: Post) => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePost = (id: string) => {
    setPosts((prev: Post[]) => prev.filter((p: Post) => p.id !== id));
  };

  const addProtocol = (protocol: Omit<Protocol, 'id' | 'updatedAt'>) => {
    const newProtocol: Protocol = {
      ...protocol,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProtocols((prev: Protocol[]) => [...prev, newProtocol]);
  };

  return (
    <DataContext.Provider value={{
      clients, tasks, posts, protocols, isLoaded,
      addClient, updateClient, deleteClient,
      addTask, updateTask, deleteTask,
      addPost, updatePost, deletePost,
      addProtocol
    }}>
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
