
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// ===== Events CRUD (file-based storage for now) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventsFile = path.join(__dirname, 'data', 'events.json');
const templatesFile = path.join(__dirname, 'data', 'templates.json');

async function readEvents(){
  try { const txt = await readFile(eventsFile, 'utf-8'); return JSON.parse(txt||'[]'); } catch { return []; }
}
async function writeEvents(list){ await writeFile(eventsFile, JSON.stringify(list, null, 2)); }

async function readTemplates(){
  try { const txt = await readFile(templatesFile, 'utf-8'); return JSON.parse(txt||'[]'); } catch { return []; }
}
async function writeTemplates(list){ await writeFile(templatesFile, JSON.stringify(list, null, 2)); }

// Get all events
app.get('/api/events', async (req, res) => {
  const list = await readEvents();
  res.json({ events: list });
});

// Create event
app.post('/api/events', async (req, res) => {
  try{
    const { title, category, organizer, city, start, end, banner, desc, ongoing } = req.body||{};
    if(!title||!category||!organizer||!city||!start||!end||!desc){
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const item = {
      id: crypto.randomUUID(),
      title, category, organizer, city, start, end, banner: banner||'', desc,
      ongoing: Boolean(ongoing),
      rsvps: [],
      volunteers: [],
      createdAt: new Date().toISOString(),
    };
    const list = await readEvents();
    list.push(item);
    await writeEvents(list);
    res.status(201).json({ event: item });
  }catch(e){ console.error(e); res.status(500).json({ message: 'Server error' }); }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readEvents();
    const idx = list.findIndex(e=>e.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Not found' });
    list[idx] = { ...list[idx], ...req.body, id };
    await writeEvents(list);
    res.json({ event: list[idx] });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// RSVP to event
app.post('/api/events/:id/rsvp', async (req, res) => {
  try{
    const { id } = req.params;
    const { name, email, message } = req.body || {};
    if(!name || !email){ return res.status(400).json({ message: 'Missing name or email' }); }
    const list = await readEvents();
    const idx = list.findIndex(e=>e.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Event not found' });
    const entry = { id: crypto.randomUUID(), name, email, message: message||'', createdAt: new Date().toISOString() };
    list[idx].rsvps = Array.isArray(list[idx].rsvps) ? [...list[idx].rsvps, entry] : [entry];
    await writeEvents(list);
    res.status(201).json({ rsvp: entry });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Volunteer for event
app.post('/api/events/:id/volunteer', async (req, res) => {
  try{
    const { id } = req.params;
    const { name, email, message, speciality, phone, availableDates, status } = req.body || {};
    if(!name || !email){ return res.status(400).json({ message: 'Missing name or email' }); }
    const list = await readEvents();
    const idx = list.findIndex(e=>e.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Event not found' });
    const entry = { id: crypto.randomUUID(), name, email, message: message||'', speciality: speciality||'', phone: phone||'', availableDates: availableDates||'', status: status||'Available', createdAt: new Date().toISOString() };
    list[idx].volunteers = Array.isArray(list[idx].volunteers) ? [...list[idx].volunteers, entry] : [entry];
    await writeEvents(list);
    res.status(201).json({ volunteer: entry });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// ===== Templates CRUD & Engagement =====
// Get all templates (exclude soft-deleted by default)
app.get('/api/templates', async (req, res) => {
  const list = await readTemplates();
  const includeDeleted = String(req.query.includeDeleted||'false') === 'true';
  const filtered = includeDeleted ? list : list.filter(t=>!t.deletedAt);
  res.json({ templates: filtered });
});

// Create template
app.post('/api/templates', async (req, res) => {
  try{
    const { title, description, datetime, location, images, agenda, organizer, category } = req.body||{};
    if(!title || !description || !datetime || !location || !organizer || !category){
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
      comments: [], // {id, author, text, createdAt}
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    const list = await readTemplates();
    list.push(item);
    await writeTemplates(list);
    res.status(201).json({ template: item });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Update template (append previous version into versions)
app.put('/api/templates/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readTemplates();
    const idx = list.findIndex(t=>t.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Not found' });
    const prev = list[idx];
    const updated = { ...prev, ...req.body, id, updatedAt: new Date().toISOString() };
    updated.versions = [...(prev.versions||[]), { snapshot: prev, savedAt: new Date().toISOString() }];
    list[idx] = updated;
    await writeTemplates(list);
    res.json({ template: updated });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Soft delete template
app.delete('/api/templates/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readTemplates();
    const idx = list.findIndex(t=>t.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Not found' });
    if(!list[idx].deletedAt){ list[idx].deletedAt = new Date().toISOString(); }
    await writeTemplates(list);
    res.json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Restore soft-deleted template
app.post('/api/templates/:id/restore', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readTemplates();
    const idx = list.findIndex(t=>t.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Not found' });
    list[idx].deletedAt = null;
    await writeTemplates(list);
    res.json({ template: list[idx] });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Like template (increment)
app.post('/api/templates/:id/like', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readTemplates();
    const idx = list.findIndex(t=>t.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Not found' });
    list[idx].likes = (Number(list[idx].likes)||0) + 1;
    await writeTemplates(list);
    res.json({ likes: list[idx].likes });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Comment on template
app.post('/api/templates/:id/comment', async (req, res) => {
  try{
    const { id } = req.params;
    const { author, text } = req.body || {};
    if(!text){ return res.status(400).json({ message:'Missing text' }); }
    const list = await readTemplates();
    const idx = list.findIndex(t=>t.id===id);
    if(idx===-1) return res.status(404).json({ message: 'Not found' });
    const comment = { id: crypto.randomUUID(), author: author || 'Anonymous', text, createdAt: new Date().toISOString() };
    list[idx].comments = [...(list[idx].comments||[]), comment];
    await writeTemplates(list);
    res.status(201).json({ comment });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Clone/Remix template
app.post('/api/templates/:id/clone', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readTemplates();
    const src = list.find(t=>t.id===id);
    if(!src) return res.status(404).json({ message:'Not found' });
    const copy = {
      ...src,
      id: crypto.randomUUID(),
      title: `${src.title} (Remix)`,
      likes: 0,
      comments: [],
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    const next = [...list, copy];
    await writeTemplates(next);
    res.status(201).json({ template: copy });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const list = await readEvents();
    const next = list.filter(e=>e.id!==id);
    if(next.length===list.length) return res.status(404).json({ message: 'Not found' });
    await writeEvents(next);
    res.json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});

// Aggregate volunteers across events
app.get('/api/volunteers', async (req, res) => {
  try{
    const events = await readEvents();
    const now = new Date();
    const upcomingCount = events.filter(ev=> new Date(ev.start||ev.end||now) > now).length;
    const vols = [];
    for(const ev of events){
      const arr = Array.isArray(ev.volunteers) ? ev.volunteers : [];
      for(const v of arr){
        vols.push({
          id: v.id,
          name: v.name,
          email: v.email,
          message: v.message||'',
          createdAt: v.createdAt,
          speciality: '',
          phone: '',
          availableDates: '',
          status: 'Available',
          eventId: ev.id,
          eventTitle: ev.title,
          eventDate: ev.start,
          eventCity: ev.city
        });
      }
    }
    res.json({
      volunteers: vols,
      stats: {
        totalVolunteers: vols.length,
        availableVolunteers: vols.filter(v=>String(v.status||'').toLowerCase()==='available').length,
        totalEvents: events.length,
        upcomingEvents: upcomingCount
      }
    });
  }catch(e){ console.error(e); res.status(500).json({ message:'Server error' }); }
});
// Switch role (create or fetch account in the other role)
// body: { email, password, fromRole, toRole, name?, address? }
app.post('/api/auth/switch-role', async (req, res) => {
  try {
    const { email, password, fromRole, toRole, name, address } = req.body || {};
    if (!email || !password || !fromRole || !toRole) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (fromRole === toRole) return res.status(400).json({ message: 'fromRole and toRole must differ' });

    const current = await prisma.user.findUnique({ where: { email_role: { email, role: fromRole } } });
    if (!current) return res.status(404).json({ message: 'Current role account not found' });

    const ok = await bcrypt.compare(String(password), current.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const existingTarget = await prisma.user.findUnique({ where: { email_role: { email, role: toRole } } });
    if (existingTarget) return res.json({ user: existingTarget, token: 'mock-token' });

    const created = await prisma.user.create({
      data: {
        role: toRole,
        email,
        name: name || current.name,
        address: address || current.address,
        passwordHash: current.passwordHash,
      },
    });
    return res.status(201).json({ user: created, token: 'mock-token' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Mock login route
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role, name, email, address, password } = req.body || {};
    if (!role || !name || !email || !address || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await prisma.user.findUnique({ where: { email_role: { email, role } } });
    if (existing) return res.status(409).json({ message: 'Account already exists for this role and email' });
    const passwordHash = await bcrypt.hash(String(password), 10);
    const created = await prisma.user.create({ data: { role, name, email, address, passwordHash } });
    return res.status(201).json({ user: created, token: 'mock-token' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { role, email, password } = req.body || {};
    if (!role || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await prisma.user.findUnique({ where: { email_role: { email, role } } });
    if (!existing) return res.status(404).json({ message: 'Account not found. Please sign up.' });
    const ok = await bcrypt.compare(String(password), existing.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    return res.json({ user: existing, token: 'mock-token' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

// ===== Dashboard mock endpoints (additive) =====
// Simple in-memory mocks to support dashboard2.html
const __dashMock = {
  kpis: { totals: { events: 24, registrations: 1234, revenue: 425000, upcoming: 6 } },
  activities: [
    { type: 'Event', title: 'Cleanup Drive created', time: '2m ago' },
    { type: 'Reg', title: 'New registration: Maya', time: '6m ago' },
    { type: 'Msg', title: 'Vendor confirmed AV setup', time: '14m ago' }
  ],
  alerts: [
    { level: 'warning', msg: 'Payment gateway latency increased' },
    { level: 'info', msg: '3 new registrations' }
  ],
  performance: { series: [10,12,11,13,15,14,18] },
  registrations: [
    { id: 1, eventId: 1, name: 'Maya' },
    { id: 2, eventId: 1, name: 'Rahul' }
  ]
};

// Health already exists at /api/health
app.get('/api/dashboard/kpis', (req, res) => {
  res.json(__dashMock.kpis);
});
app.get('/api/activities', (req, res) => {
  res.json({ items: __dashMock.activities });
});
app.get('/api/alerts', (req, res) => {
  res.json({ items: __dashMock.alerts });
});
app.get('/api/analytics/performance', (req, res) => {
  res.json(__dashMock.performance);
});
app.get('/api/registrations', (req, res) => {
  res.json({ items: __dashMock.registrations });
});
