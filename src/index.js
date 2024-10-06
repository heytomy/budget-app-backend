import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes de base
app.get('/', (_, res) => {
  res.send('API fonctionnelle');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Route pour récupérer les transactions
app.get('/transactions', async (_, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

// Route pour ajouter une transaction
app.post('/transactions', async (req, res) => {
  const { description, amount, category } = req.body;

  // Vérifiez si la transaction existe déjà
  const existingTransaction = await Transaction.findOne({
    description,
    amount,
    category,
  });
  if (existingTransaction) {
    return res.status(400).json({ message: 'Transaction déjà existante.' });
  }

  // Validation des données
  if (!description || amount <= 0 || !category) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const newTransaction = new Transaction({ description, amount, category });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la transaction." });
  }
});

app.delete('/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).send(); // Pas de contenu à renvoyer
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/transactions/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});