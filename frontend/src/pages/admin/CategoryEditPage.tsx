
import React from 'react';
import { Container, Typography } from '@mui/material';
import CategoryForm from '../../components/admin/CategoryForm';

const CategoryEditPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Category
      </Typography>
      <CategoryForm />
    </Container>
  );
};

export default CategoryEditPage;
