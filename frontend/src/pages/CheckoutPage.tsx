import { useState, useEffect } from 'react';
import { Container, Stepper, Step, StepLabel, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import ShippingAddressForm from '../components/checkout/ShippingAddressForm';
import PaymentForm from '../components/checkout/PaymentForm';
import Review from '../components/checkout/Review';

// ... (imports)

// ... (CheckoutPageContent component)

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <ShippingAddressForm onAddressChange={handleAddressChange} />;
            case 1:
                return <PaymentForm />;
            case 2:
                return <Review shippingAddress={shippingAddress} />;
            default:
                throw new Error('Unknown step');
        }
    }

    return (
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Typography component="h1" variant="h4" align="center" sx={{ my: 4 }}>
                Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>Thank you for your order.</Typography>
                        <Typography variant="subtitle1">
                            Your order has been confirmed. We have emailed your order confirmation.
                        </Typography>
                    </>
                ) : (
                    <form onSubmit={handleSubmitOrder}>
                        {getStepContent(activeStep)}
                        {paymentError && <Alert severity="error" sx={{ mt: 2 }}>{paymentError}</Alert>}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>Back</Button>
                            )}
                            
                            {activeStep === steps.length - 1 ? (
                                <Button type="submit" variant="contained" sx={{ mt: 3, ml: 1 }} disabled={isProcessing || !stripe}>
                                    {isProcessing ? <CircularProgress size={24} /> : 'Place order'}
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }} disabled={isProcessing}>
                                    {isProcessing ? <CircularProgress size={24} /> : 'Next'}
                                </Button>
                            )}
                        </Box>
                    </form>
                )}
            </>
        </Container>
    );
};

const CheckoutPage = () => (
    <Elements stripe={stripePromise}>
        <CheckoutPageContent />
    </Elements>
);

export default CheckoutPage;
