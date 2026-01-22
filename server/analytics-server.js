#!/usr/bin/env node
/* Lightweight analytics collector for Project Jupiter */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 8787;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'analytics-store.json');
const MAX_EVENTS = Number(process.env.MAX_EVENTS || 100000);
const MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 5000);
const API_KEY = process.env.ANALYTICS_API_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const store = {
  sessions: [],
  events: [],
  lastSaved: 0
};

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      store.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
      store.events = Array.isArray(parsed.events) ? parsed.events : [];
      store.lastSaved = parsed.lastSaved || 0;
    }
  } catch (error) {
    console.error('Failed to load analytics store:', error);
  }
}

function persistStore() {
  try {
    const payload = JSON.stringify({
      sessions: store.sessions,
      events: store.events,
      lastSaved: Date.now()
    });
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, payload, 'utf8');
  } catch (error) {
    console.error('Failed to save analytics store:', error);
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-analytics-key');
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve(null);
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function requireApiKey(req, res) {
  if (!API_KEY) return false;
  const key = req.headers['x-analytics-key'];
  if (key !== API_KEY) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return true;
  }
  return false;
}

function upsertSession(session, eventsCount) {
  if (!session || !session.id) return;
  const idx = store.sessions.findIndex((s) => s.id === session.id);
  const payload = {
    id: session.id,
    startTime: session.startTime || Date.now(),
    lastActivity: session.lastActivity || Date.now(),
    pageViews: Number(session.pageViews || 0),
    eventCount: Number(session.eventCount || 0) + Number(eventsCount || 0)
  };

  if (idx >= 0) {
    store.sessions[idx] = {
      ...store.sessions[idx],
      ...payload,
      lastActivity: Math.max(store.sessions[idx].lastActivity || 0, payload.lastActivity),
      pageViews: Math.max(store.sessions[idx].pageViews || 0, payload.pageViews),
      eventCount: (store.sessions[idx].eventCount || 0) + Number(eventsCount || 0)
    };
  } else {
    store.sessions.push(payload);
  }

  if (store.sessions.length > MAX_SESSIONS) {
    store.sessions = store.sessions.slice(-MAX_SESSIONS);
  }
}

loadStore();

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok', events: store.events.length, sessions: store.sessions.length });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/analytics') {
    if (requireApiKey(req, res)) return;
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.max(0, Number(limitParam)) : store.events.length;
    const events = limit ? store.events.slice(-limit) : [];
    sendJson(res, 200, {
      sessions: store.sessions,
      events,
      lastSaved: store.lastSaved
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/collect') {
    if (requireApiKey(req, res)) return;

    try {
      const payload = await readJson(req);
      if (!payload || !Array.isArray(payload.events)) {
        sendJson(res, 400, { error: 'Invalid payload' });
        return;
      }

      const events = payload.events.map((event) => ({
        ...event,
        receivedAt: Date.now()
      }));

      store.events = store.events.concat(events);
      if (store.events.length > MAX_EVENTS) {
        store.events = store.events.slice(-MAX_EVENTS);
      }

      upsertSession(payload.session, events.length);
      persistStore();

      sendJson(res, 200, { status: 'ok', received: events.length });
    } catch (error) {
      console.error('Collect error:', error);
      sendJson(res, 500, { error: 'Failed to collect analytics' });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Analytics server listening on port ${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
