import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, CircularProgress, Alert, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import api from '../services/api';
import type { Product, ProductVariant } from '../types/product.ts';
import { useCart } from '../context/CartContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const productData: Product = response.data;
        setProduct(productData);

        if (productData.variants && productData.variants.length > 0) {
          // Set initial selected options from the first variant
          const firstVariant = productData.variants[0];
          setSelectedVariant(firstVariant);
          setSelectedOptions(firstVariant.attributes);
        }
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Find the matching variant whenever selectedOptions changes
  useEffect(() => {
    if (product && product.variants) {
      const findVariant = product.variants.find(variant => 
        Object.entries(selectedOptions).every(([key, value]) => variant.attributes[key] === value)
      );
      setSelectedVariant(findVariant || null);
    }
  }, [selectedOptions, product]);

  const attributeOptions = useMemo(() => {
    if (!product) return {};
    const options: { [key: string]: Set<string> } = {};
    product.variants.forEach(variant => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!options[key]) {
          options[key] = new Set();
        }
        options[key].add(value);
      });
    });
    return options;
  }, [product]);

  const handleOptionChange = (key: string, value: string | null) => {
    if (value !== null) {
      setSelectedOptions(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addToCart(product, selectedVariant);
    }
  };

  if (loading) {
    return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!product) {
    return <Container sx={{ py: 4 }}><Alert severity="warning">Product not found.</Alert></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', pt: '100%' }}>
             <img
                src="https://via.placeholder.com/600x600"
                alt={product.title}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" gutterBottom>
            {selectedVariant ? `$${selectedVariant.price}` : 'Price not available'}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description || product.short_description}
          </Typography>
          
          <Stack spacing={2} sx={{ my: 2 }}>
            {Object.entries(attributeOptions).map(([key, values]) => (
              <Box key={key}>
                <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {key}
                </Typography>
                <ToggleButtonGroup
                  value={selectedOptions[key] || ''}
                  exclusive
                  onChange={(e, value) => handleOptionChange(key, value)}
                  aria-label={key}
                >
                  {Array.from(values).map(value => (
                    <ToggleButton key={value} value={value} aria-label={value}>
                      {value}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            ))}
          </Stack>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            sx={{ mt: 2 }}
          >
            {selectedVariant && selectedVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
