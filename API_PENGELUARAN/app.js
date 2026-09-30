import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import pengeluaranRoutes from './routes/pengeluaran.js';

const app = express();

app.use(cors());
app.use(express.json());

// Tes status API
app.get('/', (req, res) => {
  res.send('API Pengeluaran berjalan');
});

// Endpoint baca kategori (Modul 2C Langkah 4)
app.get('/kategori', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama FROM kategori ORDER BY nama'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ pesan: 'Gagal mengambil kategori' });
  }
});

// Register routing pengeluaran
app.use('/pengeluaran', pengeluaranRoutes);

export default app;