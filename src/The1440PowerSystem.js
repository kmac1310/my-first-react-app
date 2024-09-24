import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function The1440PowerSystem() {
  const [sleep, setSleep] = useState('');
  const [livelihood, setLivelihood] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [remainingMinutes, setRemainingMinutes] = useState(1440);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = Math.floor((endOfDay.getTime() - now.getTime()) / 60000);
      setRemainingMinutes(diff);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const updateTime = (zone, value) => {
    if (zone === 'sleep') setSleep(value);
    if (zone === 'livelihood') setLivelihood(value);
  };

  const calculateOnTime = () => {
    const sleepTime = sleep ? parseInt(sleep) : 0;
    const livelihoodTime = livelihood ? parseInt(livelihood) : 0;
    return Math.max(0, 1440 - sleepTime - livelihoodTime);
  };

  const addTask = () => {
    if (newTaskName && newTaskDuration) {
      const duration = parseInt(newTaskDuration);
      const totalTaskDuration = tasks.reduce((sum, task) => sum + task.duration, 0) + duration;
      if (totalTaskDuration <= calculateOnTime()) {
        setTasks([...tasks, { id: Date.now(), name: newTaskName, duration }]);
        setNewTaskName('');
        setNewTaskDuration('');
      } else {
        alert("Total task duration exceeds On-Time allocation!");
      }
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const totalTaskDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
  const onTime = calculateOnTime();
  const remainingOnTime = onTime - totalTaskDuration;

  const chartData = [
    { name: 'Sleep', value: sleep ? parseInt(sleep) : 0, color: '#FF6384' },
    { name: 'Livelihood', value: livelihood ? parseInt(livelihood) : 0, color: '#36A2EB' },
    { name: 'On-Time (Allocated)', value: totalTaskDuration, color: '#FFCE56' },
    { name: 'On-Time (Remaining)', value: remainingOnTime, color: '#4BC0C0' }
  ];

  const totalAllocated = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="The1440PowerSystem">
      <h1>1440 Power System #1</h1>
      <div>
        <label>Sleep (minutes):
          <input type="number" value={sleep} onChange={(e) => updateTime('sleep', e.target.value)} />
        </label>
      </div>
      <div>
        <label>Livelihood (minutes):
          <input type="number" value={livelihood} onChange={(e) => updateTime('livelihood', e.target.value)} />
        </label>
      </div>
      <div>
        <label>On-Time (minutes): {onTime}</label>
      </div>
      <div>
        <p>Total allocated time: {totalAllocated} minutes</p>
        <p>Remaining unallocated time: {1440 - totalAllocated} minutes</p>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3>On-Time Tasks</h3>
        {tasks.map(task => (
          <div key={task.id}>
            <span>{task.name} - {task.duration} min</span>
            <button onClick={() => removeTask(task.id)}>Remove</button>
          </div>
        ))}
        <div>
          <input
            type="text"
            placeholder="Task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration"
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <p>Remaining On-Time: {remainingOnTime} minutes</p>
      </div>
      <div>
        <p>Minutes remaining today: {remainingMinutes}</p>
      </div>
      <p>Own your minutes, own your life</p>
    </div>
  );
}

export default The1440PowerSystem;