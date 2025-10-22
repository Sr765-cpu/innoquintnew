const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// In-memory store (reset on restart)
let templates = [];

// Basic validation
function validateTemplate(t) {
  if (!t) return 'Empty payload';
  const required = ['title', 'description', 'datetime', 'location', 'organizer', 'category'];
  for (const k of required) {
    if (!t[k] || String(t[k]).trim() === '') return `Missing field: ${k}`;
  }
  return null;
}

app.get('/api/templates', (req, res) => {
  res.json(templates);
});

app.post('/api/templates', (req, res) => {
  const tpl = req.body || {};
  const err = validateTemplate(tpl);
  if (err) return res.status(400).json({ error: err });
  const id = tpl.id || Date.now();
  const likes = Number.isFinite(tpl.likes) ? tpl.likes : 0;
  const record = { id, likes, ...tpl };
  templates.unshift(record);
  res.status(201).json(record);
});

app.listen(PORT, () => {
  console.log(`Templates API running on http://localhost:${PORT}`);
});