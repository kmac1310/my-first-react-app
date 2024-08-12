import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TimeManagementPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', duration: '', start: '' });
  const [remainingMinutes, setRemainingMinutes] = useState(1440);
  const [currentTime, setCurrentTime] = useState('');
  const [totalMinutesLeft, setTotalMinutesLeft] = useState(1440);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#FF6663', '#E0FF4F', '#6B5B95', '#88B04B'];
  const ON_TIME_COLOR = '#4CAF50';

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      const minutesPassed = now.getHours() * 60 + now.getMinutes();
      setTotalMinutesLeft(1440 - minutesPassed);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const totalTaskMinutes = tasks.reduce((sum, task) => sum + parseInt(task.duration), 0);
    setRemainingMinutes(1440 - totalTaskMinutes);
  }, [tasks]);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes}`;
  };

  const handleAddTask = () => {
    if (newTask.name && newTask.duration && newTask.start) {
      const duration = parseInt(newTask.duration);
      const [hours, minutes] = newTask.start.split(':');
      let startHours = parseInt(hours);
      const startTime = new Date(2000, 0, 1, startHours, parseInt(minutes));
      const endTime = new Date(startTime.getTime() + duration * 60000);
      const end = formatTime(endTime);
      
      setTasks([...tasks, { ...newTask, duration, end, start: formatTime(startTime) }]);
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

  return (
    <div>
      <h1>1440 Power System</h1>
      <div>
        <p>1440TIME: {totalMinutesLeft} minutes</p>
        <p>On-Time: {remainingMinutes} minutes</p>
        <p>Current Time: {currentTime}</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={newTask.duration}
          onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
        />
        <input
          type="time"
          value={newTask.start}
          onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div>
        <h2>Task List:</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task.name} ({task.duration} minutes) - Start: {task.start}, End: {task.end}
              <button onClick={() => handleRemoveTask(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Time Distribution:</h2>
        <ResponsiveContainer width="100%" height={300}>
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
  );
};

export default TimeManagementPlanner;