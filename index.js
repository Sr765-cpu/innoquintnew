import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesFile = path.join(__dirname, '..', '..', 'server', 'data', 'templates.json');

async function readTemplates() {
  try { 
    const txt = await readFile(templatesFile, 'utf-8'); 
    return JSON.parse(txt || '[]'); 
  } catch { 
    return []; 
  }
}

async function writeTemplates(list) { 
  await writeFile(templatesFile, JSON.stringify(list, null, 2)); 
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const list = await readTemplates();
      const includeDeleted = String(req.query.includeDeleted || 'false') === 'true';
      const filtered = includeDeleted ? list : list.filter(t => !t.deletedAt);
      res.status(200).json({ templates: filtered });
    } else if (req.method === 'POST') {
      const { title, description, datetime, location, images, agenda, organizer, category } = req.body || {};
      if (!title || !description || !datetime || !location || !organizer || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const item = {
        id: crypto.randomUUID(),
        title,
        description,
        datetime,
        location,
        images: Array.isArray(images) ? images : (images ? [images] : []),
        agenda: agenda || '',
        organizer,
        category,
        likes: 0,
        comments: [],
        versions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      const list = await readTemplates();
      list.push(item);
      await writeTemplates(list);
      res.status(201).json({ template: item });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
