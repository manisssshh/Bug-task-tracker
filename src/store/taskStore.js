// store/taskStore.js
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(persist((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updated) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === updated.id ? updated : t))
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  }))
}), {
  name: 'bug-tracker-tasks'
}));
