require('dotenv').config();
const path = require('path');
const express = require('express');
const { pool, initDatabase } = require('./db');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/clases', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, fecha, contenido FROM clases ORDER BY fecha DESC, id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ error: 'No se pudieron cargar las clases.' });
  }
});

app.get('/api/clases/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, fecha, contenido FROM clases WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Clase no encontrada.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la clase:', error);
    res.status(500).json({ error: 'No se pudo cargar la clase.' });
  }
});

app.post('/api/clases', async (req, res) => {
  const { nombre, fecha, contenido } = req.body;

  if (!nombre || !fecha || !contenido) {
    return res
      .status(400)
      .json({ error: 'Los campos nombre, fecha y contenido son obligatorios.' });
  }

  try {
    await pool.query(
      `INSERT INTO clases (nombre, fecha, contenido)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         fecha = VALUES(fecha),
         contenido = VALUES(contenido)`,
      [nombre.trim(), fecha, contenido.trim()]
    );

    const [rows] = await pool.query(
      'SELECT id, nombre, fecha, contenido FROM clases WHERE nombre = ?',
      [nombre.trim()]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al guardar la clase:', error);
    res.status(500).json({ error: 'No se pudo guardar la clase.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function bootstrap() {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
