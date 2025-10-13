import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import type { Product } from '../../types/product.ts';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const firstVariant = product.variants.length > 0 ? product.variants[0] : null;
  const displayPrice = firstVariant ? `$${firstVariant.price}` : 'Not available';

  const handleAddToCart = () => {
    if (product && firstVariant) {
      addToCart(product, firstVariant);
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ... CardMedia and CardContent ... */}
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" component="p">
            {displayPrice}
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            aria-label="add to shopping cart"
            onClick={handleAddToCart}
            disabled={!firstVariant || firstVariant.stock === 0}
        >
            {firstVariant && firstVariant.stock > 0 ? 'Add' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;