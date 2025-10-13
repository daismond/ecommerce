
import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Product } from '../../types/product';
import { Category } from '../../types/category'; // Assuming a category type exists

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();

    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Failed to fetch product', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategoryChange = (e) => {
    setProduct(prev => ({ ...prev, category_id: e.target.value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/admin/products/${id}`, product);
      } else {
        await api.post('/admin/products', product);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="title" label="Title" value={product.title || ''} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="slug" label="Slug" value={product.slug || ''} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="short_description" label="Short Description" value={product.short_description || ''} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="description" label="Description" value={product.description || ''} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select name="category_id" value={product.category_id || ''} onChange={handleCategoryChange}>
          {categories.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel control={<Switch name="is_published" checked={product.is_published || false} onChange={handleChange} />} label="Published" />
      <Button type="submit" variant="contained" color="primary">{id ? 'Update' : 'Create'}</Button>
    </form>
  );
};

export default ProductForm;
