
import React from 'react';
import { Container, Typography } from '@mui/material';
import CategoryForm from '../../components/admin/CategoryForm';

const CategoryCreatePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Category
      </Typography>
      <CategoryForm />
    </Container>
  );
};

export default CategoryCreatePage;
