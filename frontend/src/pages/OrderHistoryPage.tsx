import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../services/api';
import type { Order } from '../types/order';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/me');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch order history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography>You have no past orders.</Typography>
      ) : (
        <Box>
          {orders.map((order) => (
            <Accordion key={order.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Order:</strong> #{order.order_number}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</Typography> 
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Total:</strong> ${order.total_amount.toFixed(2)}</Typography>
                  </Grid>
                   <Grid item xs={12} sm={3}>
                    <Typography><strong>Status:</strong> {order.status}</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>Items</Typography>
                        <List disablePadding>
                            {order.items.map(item => (
                                <ListItem key={item.id} disableGutters>
                                    <ListItemText 
                                        primary={item.product_variant.product.title} 
                                        secondary={`Qty: ${item.quantity}`}
                                    />
                                    <Typography>${(item.unit_price * item.quantity).toFixed(2)}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                        <Typography>{order.shipping_address.full_name}</Typography>
                        <Typography>{order.shipping_address.address_line_1}</Typography>
                        {order.shipping_address.address_line_2 && <Typography>{order.shipping_address.address_line_2}</Typography>}
                        <Typography>{`${order.shipping_address.city}, ${order.shipping_address.postal_code}`}</Typography>
                        <Typography>{order.shipping_address.country}</Typography>
                    </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
