import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Link, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import TaskForm from './TaskForm';
import { fetchTasks, addTask, updateTask, deleteTask } from '../api/taskApi';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users] = useState([
    { id: 1, email: 'john@example.com' },
    { id: 2, email: 'jane@example.com' },
  ]);

  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const auth = useContext(AuthContext);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setSnackbar({ open: true, message: 'Failed to load tasks', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setOpen(true);
  };

  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
    } catch (error) {
      console.error("Error deleting task:", error);
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
  };

  const handleSaveTask = async (task: any) => {
    try {
      if (task.id) {
        const updatedTask = await updateTask(task.id, task);
        setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
        setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
      } else {
        const newTask = await addTask(task);
        setTasks([...tasks, newTask]);
        setSnackbar({ open: true, message: 'Task added successfully', severity: 'success' });
      }
      setOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
      setSnackbar({ open: true, message: 'Failed to save task', severity: 'error' });
    }
  };

  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Link color="secondary" onClick={auth?.logout} style={{ float: 'right', marginBottom: '10px', cursor: "pointer" }}>
        Logout
      </Link>

      <Button variant="contained" color="primary" style={{ float: 'right', marginTop: '40px' }} onClick={handleAddTask}>
        Add Task
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{users.find(u => u.id === task.assignedToId)?.email || "Unassigned"}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditTask(task)}>Edit</Button>
                  <Button onClick={() => handleDeleteTask(task.id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{currentTask ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogContent>
          <TaskForm users={users} task={currentTask} onSave={handleSaveTask} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as "success" | "error"}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
