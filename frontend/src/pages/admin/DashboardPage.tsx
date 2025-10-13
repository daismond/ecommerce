
import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Product Management</Typography>
            <Typography>
              <Link to="/admin/products">Manage Products</Link>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Category Management</Typography>
            <Typography>
              <Link to="/admin/categories">Manage Categories</Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
