'use client';

import React, { useState } from 'react';
import { useData, Task } from '@/context/data-context';
import { useAuth } from '@/context/auth-context';
import { cn, formatDate } from '@/lib/utils';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Layers,
  Calendar,
  MoreVertical,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FulfillmentOS() {
  const { tasks, clients, addTask, updateTask, deleteTask } = useData();
  const { role } = useAuth();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const statuses = ['Todo', 'In Progress', 'Review', 'Done'];

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: any = {
      clientId: formData.get('clientId') as string,
      name: formData.get('name') as string,
      phase: formData.get('phase') as string,
      currentStage: 'Todo',
      assignedRole: formData.get('assignedRole') as string,
      status: 'Todo',
      deadline: formData.get('deadline') as string,
      priority: formData.get('priority') as string,
      assetLinks: [],
      notes: formData.get('notes') as string,
    };
    addTask(newTask);
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display tracking-tighter">Fulfillment OS</h1>
          <p className="mono-tag mt-1">Sprint Stages & Task Pipelines</p>
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="bg-accent hover:bg-accent-mid text-white px-6 py-3 font-display flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => {
          const statusTasks = tasks.filter(t => t.status === status);
          return (
            <div
              key={status}
              className="space-y-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId) {
                  updateTask(taskId, { status: status as any });
                }
              }}
            >
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    status === 'Done' ? "bg-accent" :
                      status === 'Review' ? "bg-yellow-500" :
                        status === 'In Progress' ? "bg-blue-500" :
                          "bg-muted"
                  )} />
                  <h3 className="mono-tag text-[10px]">{status}</h3>
                </div>
                <span className="mono-tag text-[10px] opacity-50">{statusTasks.length}</span>
              </div>

              <div className="space-y-4 min-h-[500px] bg-white/5 p-2 border border-border rounded-sm">
                {statusTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    onClick={() => setSelectedTask(task)}
                    draggable
                    onDragStart={(e: any) => e.dataTransfer.setData('taskId', task.id)}
                    className="bg-card border border-border p-4 rounded-sm cursor-pointer hover:border-accent transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={cn(
                        "text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                        task.priority === 'Critical' ? "bg-red-500/20 text-red-500" :
                          task.priority === 'High' ? "bg-orange-500/20 text-orange-500" :
                            "bg-blue-500/20 text-blue-500"
                      )}>
                        {task.priority}
                      </span>
                      <span className="mono-tag text-[8px]">{clients.find(c => c.id === task.clientId)?.name}</span>
                    </div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-4 group-hover:text-accent transition-colors">{task.name}</h4>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted" />
                        <span className="mono-tag text-[8px]">{task.assignedRole}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted" />
                        <span className="mono-tag text-[8px]">{formatDate(task.deadline)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {statusTasks.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <p className="mono-tag text-[8px] opacity-20">No Tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-border shadow-2xl"
            >
              <div className="platinum-edge p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="mono-tag text-accent mb-2 block">{clients.find(c => c.id === selectedTask.clientId)?.name}</span>
                    <h2 className="text-2xl font-display tracking-tighter">{selectedTask.name}</h2>
                  </div>
                  <button onClick={() => setSelectedTask(null)} className="p-2 text-muted hover:text-white">
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="mono-tag text-[8px] block mb-1">Status</label>
                      <select
                        value={selectedTask.status}
                        onChange={(e) => updateTask(selectedTask.id, { status: e.target.value as any })}
                        className="w-full bg-[#050505] border border-border p-2 text-xs uppercase tracking-widest"
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mono-tag text-[8px] block mb-1">Assigned Role</label>
                      <p className="text-xs uppercase tracking-wider">{selectedTask.assignedRole}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mono-tag text-[8px] block mb-1">Deadline</label>
                      <p className="text-xs uppercase tracking-wider">{formatDate(selectedTask.deadline)}</p>
                    </div>
                    <div>
                      <label className="mono-tag text-[8px] block mb-1">Priority</label>
                      <p className={cn(
                        "text-xs uppercase tracking-wider",
                        selectedTask.priority === 'Critical' ? "text-red-500" : "text-white"
                      )}>{selectedTask.priority}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="mono-tag text-[8px] block mb-1">Notes / Brief</label>
                    <div className="bg-[#050505] border border-border p-4 text-xs text-platinum leading-relaxed">
                      {selectedTask.notes || 'No notes provided.'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      updateTask(selectedTask.id, { status: 'Done' });
                      setSelectedTask(null);
                    }}
                    className="flex-1 bg-accent text-white py-3 font-display hover:bg-accent-mid transition-all"
                  >
                    Complete Task
                  </button>
                  {role === 'CEO' && (
                    <button
                      onClick={() => {
                        deleteTask(selectedTask.id);
                        setSelectedTask(null);
                      }}
                      className="px-6 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all mono-tag"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTask(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-border shadow-2xl"
            >
              <div className="platinum-edge p-8">
                <h2 className="text-3xl font-display mb-8 tracking-tighter">New Task Entry</h2>
                <form onSubmit={handleAddTask} className="space-y-6">
                  <div>
                    <label className="mono-tag block mb-2">Select Client</label>
                    <select name="clientId" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mono-tag block mb-2">Task Name</label>
                    <input name="name" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Assigned Role</label>
                      <select name="assignedRole" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                        <option>Art Director</option>
                        <option>Video Editor</option>
                        <option>Ops Builder</option>
                        <option>Social Media Manager</option>
                        <option>Doc Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Priority</label>
                      <select name="priority" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mono-tag block mb-2">Phase</label>
                      <input name="phase" placeholder="e.g. Content Creation" className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="mono-tag block mb-2">Deadline</label>
                      <input name="deadline" type="date" required className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                  <div>
                    <label className="mono-tag block mb-2">Notes / Brief</label>
                    <textarea name="notes" rows={4} className="w-full bg-[#050505] border border-border p-3 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-accent text-white py-4 font-display hover:bg-accent-mid transition-all">Create Task</button>
                    <button type="button" onClick={() => setIsAddingTask(false)} className="px-8 border border-border text-muted hover:text-white transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
