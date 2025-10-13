
import React from 'react';
import { Container, Typography } from '@mui/material';
import ProductForm from '../../components/admin/ProductForm';

const ProductEditPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      <ProductForm />
    </Container>
  );
};

export default ProductEditPage;
