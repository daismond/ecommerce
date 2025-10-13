
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Category } from '../../types/category';

const CategoryForm: React.FC = () => {
  const [category, setCategory] = useState<Partial<Category>>({});
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const response = await api.get(`/categories/${id}`);
          setCategory(response.data);
        } catch (error) {
          console.error('Failed to fetch category', error);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/admin/categories/${id}`, category);
      } else {
        await api.post('/admin/categories', category);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="name" label="Name" value={category.name || ''} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="slug" label="Slug" value={category.slug || ''} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="description" label="Description" value={category.description || ''} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
      <Button type="submit" variant="contained" color="primary">{id ? 'Update' : 'Create'}</Button>
    </form>
  );
};

export default CategoryForm;
