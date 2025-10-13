import { Typography } from '@mui/material';
import { CardElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
    </>
  );
};

export default PaymentForm;
