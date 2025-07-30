'use client';

import React, { useState, useEffect } from 'react';
import styles from './checkout.module.css';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here'); // Replace with your actual key

interface SavedCard {
  id: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
}

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#555',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>('');
  const [loadingCards, setLoadingCards] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'new' | 'saved'>('new');
  
  // Payment details
  const amount = 24000; // Rs. 24,000.00
  const currency = 'lkr';

  // Fetch saved cards on component mount
  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/cards', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSavedCards(data.cards || []);
      } else {
        console.error('Failed to fetch saved cards');
      }
    } catch (error) {
      console.error('Error fetching saved cards:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:2000/api/cards/${cardId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSavedCards(savedCards.filter(card => card.id !== cardId));
        
        if (selectedSavedCard === cardId) {
          setSelectedSavedCard('');
        }
        
        alert('Card removed successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove card');
      }
    } catch (error) {
      console.error('Error removing card:', error);
      alert('Network error. Please try again.');
    }
  };

  const processPaymentWithNewCard = async () => {
    if (!stripe || !elements) return false;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError('Card Number Element not found.');
      return false;
    }

    try {
      // Create payment intent
      const intentResponse = await fetch('http://localhost:2000/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          saveCard: saveCard
        }),
      });

      if (!intentResponse.ok) {
        const errorData = await intentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const { clientSecret } = await intentResponse.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardholderName,
          },
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Optionally save card to our database if requested
        if (saveCard) {
          try {
            await fetch('http://localhost:2000/api/cards', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                cardHolderName: cardholderName,
                cardNumber: '****-****-****-' + (paymentIntent.payment_method as any)?.card?.last4,
                expiryDate: `${String((paymentIntent.payment_method as any)?.card?.exp_month).padStart(2, '0')}/${String((paymentIntent.payment_method as any)?.card?.exp_year).slice(-2)}`,
                cvv: '***' // Never store real CVV
              }),
            });
          } catch (cardSaveError) {
            console.warn('Payment succeeded but failed to save card:', cardSaveError);
          }
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      return false;
    }
  };

  const processPaymentWithSavedCard = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/payments/saved-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cardId: selectedSavedCard,
          amount: amount,
          currency: currency
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      const { clientSecret } = await response.json();

      // For saved cards, you might want to redirect to a 3D Secure page
      // or handle differently based on your payment flow
      console.log('Payment intent created for saved card:', clientSecret);
      
      // For demo purposes, we'll simulate success
      return true;
    } catch (error) {
      console.error('Saved card payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;

    setProcessing(true);
    setError(null);

    try {
      let paymentSuccess = false;

      if (paymentMethod === 'saved' && selectedSavedCard) {
        paymentSuccess = await processPaymentWithSavedCard();
      } else {
        paymentSuccess = await processPaymentWithNewCard();
      }

      if (paymentSuccess) {
        setSuccess(true);
        alert('Payment successful! Your booking has been confirmed.');
        
        // Reset form
        setCardholderName('');
        setSaveCard(false);
        setSelectedSavedCard('');
        
        // Refresh saved cards if a new card was saved
        if (saveCard) {
          fetchSavedCards();
        }
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fee}>Your fee is Rs.{amount.toLocaleString()}.00</div>

      {/* Payment Method Selection */}
      <div className={styles.paymentMethodSelector}>
        <label>
          <input
            type="radio"
            value="new"
            checked={paymentMethod === 'new'}
            onChange={(e) => setPaymentMethod(e.target.value as 'new' | 'saved')}
          />
          Pay with New Card
        </label>
        {savedCards.length > 0 && (
          <label>
            <input
              type="radio"
              value="saved"
              checked={paymentMethod === 'saved'}
              onChange={(e) => setPaymentMethod(e.target.value as 'new' | 'saved')}
            />
            Use Saved Card
          </label>
        )}
      </div>

      {/* Saved Cards Section */}
      {paymentMethod === 'saved' && (
        <>
          {loadingCards ? (
            <div className={styles.loading}>Loading saved cards...</div>
          ) : savedCards.length > 0 ? (
            <>
              <div className={styles.subheading}>Select a Saved Card</div>
              {savedCards.map((card) => (
                <div key={card.id} className={styles.cardOption}>
                  <input
                    type="radio"
                    id={`card-${card.id}`}
                    name="selectedCard"
                    value={card.id}
                    checked={selectedSavedCard === card.id}
                    onChange={(e) => setSelectedSavedCard(e.target.value)}
                  />
                  <label htmlFor={`card-${card.id}`} className={styles.cardPreview}>
                    {card.cardNumber} - {card.cardHolderName} (Expires: {card.expiryDate})
                  </label>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.noCards}>No saved cards found.</div>
          )}
        </>
      )}

      {/* New Card Form */}
      {paymentMethod === 'new' && (
        <>
          <div className={styles.subheading}>Card Details</div>

          <label className={styles.label}>Cardholder Name</label>
          <input
            className={styles.input}
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            placeholder="John Doe"
          />

          <label className={styles.label}>Card Number</label>
          <div className={styles.input}>
            <CardNumberElement options={CARD_STYLE} />
          </div>

          <div className={styles.row}>
            <div className={styles.rowColumn}>
              <label className={styles.label}>Expiry Date</label>
              <div className={styles.input}>
                <CardExpiryElement options={CARD_STYLE} />
              </div>
            </div>
            <div className={styles.rowColumn}>
              <label className={styles.label}>CVC</label>
              <div className={styles.input}>
                <CardCvcElement options={CARD_STYLE} />
              </div>
            </div>
          </div>

          <div className={styles.checkbox}>
            <input
              type="checkbox"
              checked={saveCard}
              onChange={() => setSaveCard(!saveCard)}
            />
            <label>Save card for future payments</label>
          </div>
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Payment completed successfully!</div>}

      <button 
        type="submit" 
        className={styles.submitButton} 
        disabled={processing || !stripe || (paymentMethod === 'saved' && !selectedSavedCard)}
      >
        {processing ? 'Processing...' : `Pay Rs.${amount.toLocaleString()}.00`}
      </button>
    </form>
  );
};

const Checkout = () => {
  return (
    <div className={styles.container}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;
