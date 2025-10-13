import { useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';

interface ShippingAddressFormProps {
  onAddressChange: (address: any) => void; // Using 'any' for now as it's a dict
}

const ShippingAddressForm = ({ onAddressChange }: ShippingAddressFormProps) => {
  const [address, setAddress] = useState({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    country: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = {
      ...address,
      [event.target.name]: event.target.value,
    };
    setAddress(newAddress);
    onAddressChange(newAddress); // Pass data up on every change
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="full_name"
            name="full_name"
            label="Full name"
            fullWidth
            autoComplete="name"
            variant="standard"
            value={address.full_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address_line_1"
            name="address_line_1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
            value={address.address_line_1}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address_line_2"
            name="address_line_2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
            value={address.address_line_2}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            value={address.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="postal_code"
            name="postal_code"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            value={address.postal_code}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
            value={address.country}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ShippingAddressForm;
