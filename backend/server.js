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
// Empresa actual
app.get('/api/empresas/actual', (req, res) => {
  res.json({
    id: 'empresa-demo-001',
    nombre: 'Empresa Demo',
    email: 'demo@empresa.com',
    ruc: '12345678901'
  });
});

// Obtener todos los tickets (con filtro opcional por empresaId)
app.get('/api/tickets', (req, res) => {
  const { empresaId, estado, prioridad } = req.query;
  let result = tickets;

  if (empresaId) result = result.filter(t => t.empresaId === empresaId);
  if (estado) result = result.filter(t => t.estado === estado);
  if (prioridad) result = result.filter(t => t.prioridad === prioridad);

  res.json(result);
});

// Estadísticas de tickets
app.get('/api/tickets/estadisticas', (req, res) => {
  const { empresaId } = req.query;
  const filtered = empresaId ? tickets.filter(t => t.empresaId === empresaId) : tickets;

  res.json({
    total: filtered.length,
    pendientes: filtered.filter(t => t.estado === 'pendiente').length,
    enProceso: filtered.filter(t => t.estado === 'en_proceso').length,
    resueltos: filtered.filter(t => t.estado === 'resuelto').length
  });
});

// Obtener ticket por ID
app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t => t.id == req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
  res.json(ticket);
});

// Crear ticket
app.post('/api/tickets', (req, res) => {
  const newTicket = {
    id: nextTicketId++,
    ticketId: `TKT-${Date.now()}`,
    ...req.body,
    createdAt: new Date()
  };
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// Actualizar ticket
app.put('/api/tickets/:id', (req, res) => {
  const index = tickets.findIndex(t => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Ticket no encontrado' });

  tickets[index] = { ...tickets[index], ...req.body };
  res.json(tickets[index]);
});

// Eliminar ticket
app.delete('/api/tickets/:id', (req, res) => {
  tickets = tickets.filter(t => t.id != req.params.id);
  res.json({ message: 'Ticket eliminado' });
});

// Estado de pago
app.get('/api/payments/status/:id', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
