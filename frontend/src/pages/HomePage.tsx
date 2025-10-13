import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ProductList from '../components/products/ProductList';
import { Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Discover Our Collection
            </Typography>
            <Typography variant="h6" color="text.secondary" component="p">
                High-quality products, curated for you.
            </Typography>
        </Box>
      <ProductList />
    </Container>
  );
};

export default HomePage;
