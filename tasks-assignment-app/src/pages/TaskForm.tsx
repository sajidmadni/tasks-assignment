import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';

interface TaskFormProps {
  users: { id: number, email: string }[];
  task?: { id?: number, title: string, description: string, assignedToId: number };
  onSave: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ users, task, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assignedToId, setAssignedToId] = useState(task?.assignedToId || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignedToId(task.assignedToId);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: task?.id || undefined, title, description, assignedToId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" multiline rows={3} />
      <TextField select label="Assign To" value={assignedToId} onChange={(e) => setAssignedToId(Number(e.target.value))} fullWidth margin="normal">
        {users.map(user => (
          <MenuItem key={user.id} value={user.id}>{user.email}</MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {task ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
