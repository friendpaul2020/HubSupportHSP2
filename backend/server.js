const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos simulada
let tickets = [];
let payments = [];
let nextTicketId = 1;

// Endpoint: Crear pago y ticket
app.post('/api/create-ticket-payment', async (req, res) => {
  try {
    const { ticket: ticketData, paymentAmount, currency } = req.body;

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: currency || 'usd',
      metadata: {
        ticketSubject: ticketData.subject,
        userEmail: ticketData.userEmail,
        userName: ticketData.userName
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Crear ticket después de pago exitoso
app.post('/api/tickets/create-with-payment', (req, res) => {
  const { ticket, paymentInfo } = req.body;

  const newTicket = {
    id: nextTicketId++,
    ticketId: `TKT-${Date.now()}`,
    ...ticket,
    status: 'pagado',
    createdAt: new Date(),
    paymentInfo: paymentInfo
  };

  tickets.push(newTicket);
  payments.push({
    ...paymentInfo,
    ticketId: newTicket.ticketId,
    userEmail: ticket.userEmail,
    createdAt: new Date()
  });

  res.status(201).json(newTicket);
});

// Endpoint: Obtener tickets por email
app.get('/api/tickets/user/:email', (req, res) => {
  const userTickets = tickets.filter(t => t.userEmail === req.params.email);
  res.json(userTickets);
});

// Endpoint: Historial de pagos
app.get('/api/payments/history/:email', (req, res) => {
  const userPayments = payments.filter(p => p.userEmail === req.params.email);
  res.json(userPayments);
});

// Webhook de Stripe
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('Pago exitoso:', paymentIntent.id);
    }

    res.json({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
