
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Product } from '../../types/product';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>
      <Button component={Link} to="/admin/products/new" variant="contained" color="primary" sx={{ mb: 2 }}>
        Create Product
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category_id}</TableCell> {/* TODO: Fetch and display category name */}
                <TableCell>{product.is_published ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/admin/products/edit/${product.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductManagementPage;
