import { useCart } from '../../context/CartContext';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';

// ... (imports)

export const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems } = useCart();

  // ... (totalPrice logic)

  return (
    // ... (Drawer, Box, etc.)
        {cartItems.length > 0 && (
            <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                    <Typography variant="h6">Subtotal:</Typography>
                    <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
                </Box>
                <Button 
                    component={RouterLink} 
                    to="/checkout" 
                    variant="contained" 
                    fullWidth
                    onClick={toggleCart} // Close drawer on navigation
                >
                    Go to Checkout
                </Button>
            </>
        )}
      </Box>
    </Drawer>
  );
};