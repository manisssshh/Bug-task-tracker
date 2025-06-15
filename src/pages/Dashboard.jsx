import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useTaskStore } from "../store/taskStore";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { tasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [timeSpent, setTimeSpent] = useState({}); // Store the time spent for each task
  const [isTimerRunning, setIsTimerRunning] = useState({}); // Track which task's timer is running

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditPriority(task.priority);
  };

  const saveEdit = () => {
    updateTask({ id: editingId, title: editTitle, status: editStatus, priority: editPriority });
    setEditingId(null);
    setEditTitle("");
    setEditStatus("");
    setEditPriority("");
  };

  const getTaskColor = (task) => {
    if (task.status === "Closed") return "bg-gray-300 border-gray-400";
    if (task.priority === "High") return "border-red-500";
    if (task.priority === "Medium") return "border-yellow-400";
    if (task.status === "Open") return "border-green-500";
    return "border-blue-500";
  };

  // Start Timer
  const startTimer = (taskId) => {
    setIsTimerRunning((prevState) => ({ ...prevState, [taskId]: true }));
    setTimeSpent((prevState) => ({
      ...prevState,
      [taskId]: { startTime: Date.now(), timeSpent: 0 }
    }));
  };

  // Stop Timer
  const stopTimer = (taskId) => {
    const endTime = Date.now();
    const startTime = timeSpent[taskId]?.startTime;
    const time = (endTime - startTime) / 1000; // Time in seconds
    setIsTimerRunning((prevState) => ({ ...prevState, [taskId]: false }));
    setTimeSpent((prevState) => ({
      ...prevState,
      [taskId]: { ...prevState[taskId], timeSpent: time }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="flex justify-between items-center mb-8 bg-white shadow-2xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.username}!</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manager's Dashboard */}
        {user.role === "manager" && (
          <div className="bg-white p-8 rounded-xl shadow-xl border-l-4 border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manager's Dashboard</h2>
            <p className="text-gray-500 italic">Manage the progress and tasks of the development team.</p>
            <ul className="space-y-4 mt-4">
              {tasks.map((task) => (
                <li key={task.id} className={`border-l-4 ${getTaskColor(task)} p-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-600">
                        Status: <span className="font-semibold">{task.status}</span> | Priority: <span className="font-semibold">{task.priority}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Time Spent: {timeSpent[task.id]?.timeSpent ? timeSpent[task.id].timeSpent.toFixed(2) : "0"} seconds
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => startTimer(task.id)}
                      className="text-sm bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Start Timer
                    </button>
                    <button
                      onClick={() => stopTimer(task.id)}
                      className="text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      Stop Timer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Developer's Dashboard */}
        <div className="bg-white p-8 rounded-xl shadow-xl border-l-4 border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks available.</p>
          ) : (
            <ul className="space-y-6">
              {tasks.map((task) => (
                <li key={task.id} className={`border-l-4 ${getTaskColor(task)} p-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105`}>
                  {editingId === task.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
                      />
                      <div className="flex gap-4">
                        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="p-3 border border-gray-300 rounded-lg shadow-sm">
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="p-3 border border-gray-300 rounded-lg shadow-sm">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-600">
                          Status: <span className="font-semibold">{task.status}</span> | Priority: <span className="font-semibold">{task.priority}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => startEdit(task)}
                          className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button
                      onClick={() => startTimer(task.id)}
                      className="text-sm bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Start Timer
                    </button>
                    <button
                      onClick={() => stopTimer(task.id)}
                      className="text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      Stop Timer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add New Task Button */}
        <div className="bg-white p-8 rounded-xl shadow-xl border-l-4 border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Task</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
            onClick={() => addTask({ id: Date.now(), title: "New Task", status: "Open", priority: "Medium" })}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
}
