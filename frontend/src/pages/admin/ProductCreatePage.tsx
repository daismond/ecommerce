
import React from 'react';
import { Container, Typography } from '@mui/material';
import ProductForm from '../../components/admin/ProductForm';

const ProductCreatePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>
      <ProductForm />
    </Container>
  );
};

export default ProductCreatePage;
