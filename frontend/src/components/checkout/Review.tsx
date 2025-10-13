import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useCart } from '../../context/CartContext';

interface ReviewProps {
  shippingAddress: any;
}

const Review = ({ shippingAddress }: ReviewProps) => {
  const { cartItems } = useCart();
  const totalPrice = cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartItems.map((item) => (
          <ListItem key={item.variant.id} sx={{ py: 1, px: 0 }}>
            <ListItemText 
                primary={item.product.title} 
                secondary={Object.values(item.variant.attributes).join(' / ')} 
            />
            <Typography variant="body2">{`Qty: ${item.quantity}`}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 2 }}>
              ${(item.variant.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${totalPrice.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>{shippingAddress.full_name}</Typography>
          <Typography gutterBottom>{shippingAddress.address_line_1}</Typography>
          <Typography gutterBottom>{shippingAddress.city}, {shippingAddress.postal_code}</Typography>
          <Typography gutterBottom>{shippingAddress.country}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          <Grid container>
              <Grid item xs={6}>
                <Typography gutterBottom>Payment method</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>Credit/Debit Card</Typography>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Review;
