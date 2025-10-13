import { useAuth } from '../context/AuthContext';
import { Container, Typography, Box, Paper, Alert } from '@mui/material';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    // This should technically not happen if the route is protected,
    // but it's good practice for type safety and robustness.
    return <Alert severity="warning">User not found.</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        My Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box>
          <Typography variant="h6">Full Name:</Typography>
          <Typography gutterBottom>{user.first_name} {user.last_name}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Email:</Typography>
          <Typography gutterBottom>{user.email}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Role:</Typography>
          <Typography gutterBottom sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Status:</Typography>
          <Typography gutterBottom>{user.is_active ? 'Active' : 'Inactive'}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
