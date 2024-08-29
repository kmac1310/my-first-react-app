import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const The1440PowerSystem = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', duration: '', start: '' });
  const [remainingMinutes, setRemainingMinutes] = useState(1440);
  const [currentTime, setCurrentTime] = useState('');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#FF6663', '#E0FF4F', '#6B5B95', '#88B04B'];
  const ON_TIME_COLOR = '#4CAF50'; // Green color for On-Time in pie chart

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const totalTaskMinutes = tasks.reduce((sum, task) => sum + parseInt(task.duration), 0);
    setRemainingMinutes(1440 - totalTaskMinutes);
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.name && newTask.duration && newTask.start) {
      const duration = parseInt(newTask.duration);
      const startTime = new Date(`2000-01-01 ${newTask.start}`);
      const endTime = new Date(startTime.getTime() + duration * 60000);
      const end = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setTasks([...tasks, { ...newTask, duration, end }]);
      setNewTask({ name: '', duration: '', start: '' });
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const getChartData = () => {
    const taskData = tasks.map(task => ({
      name: task.name,
      value: parseInt(task.duration)
    }));
    
    taskData.push({ name: 'On-Time', value: remainingMinutes });
    
    return taskData;
  };

  // Added console.log here
  console.log(getChartData());

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">The 1440 Power System</h1>
      <div className="mb-4">
        <p className="text-xl font-semibold">{remainingMinutes} Minutes Remaining</p>
        <p className="text-xl font-semibold" style={{ color: '#FF0000' }}>On-Time: {remainingMinutes} minutes</p>
        <p>Current Time: {currentTime}</p>
      </div>
      <div className="flex flex-wrap mb-4">
        <input
          type="text"
          placeholder="Task Name"
          className="border p-2 m-1"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          className="border p-2 m-1"
          value={newTask.duration}
          onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
        />
        <input
          type="time"
          className="border p-2 m-1"
          value={newTask.start}
          onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white p-2 m-1 rounded">
          Add Task
        </button>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 pr-4">
          <h2 className="text-xl font-semibold mb-2">Task List:</h2>
          <ul className="mb-4">
            {tasks.map((task, index) => (
              <li key={index} className="mb-2 flex justify-between items-center">
                <span>
                  {task.name} ({task.duration} minutes) - Start: {task.start}, End: {task.end}
                </span>
                <button onClick={() => handleRemoveTask(index)} className="bg-red-500 text-white p-1 text-sm rounded">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-2">Time Distribution:</h2>
          <p className="text-red-500 font-bold">Debug: Pie chart should appear below</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getChartData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {getChartData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.name === 'On-Time' ? ON_TIME_COLOR : COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default The1440PowerSystem;