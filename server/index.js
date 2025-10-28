// server/index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initCouchbase } = require('./couchbaseClient');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;

async function start() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const { cluster, bucket, scope, collection } = await initCouchbase();
  console.log('Connected to Couchbase bucket:', bucket.name);

  // Simple ping for health checks
  app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

  // Create punch
  app.post('/api/punch', async (req, res) => {
    try {
      const { timestamp, source, localOffsetMinutes } = req.body;
      if (!timestamp || !source) {
        return res.status(400).json({ error: 'Missing required fields: timestamp, source' });
      }

      const id = `punch::${uuidv4()}`;
      const doc = {
        type: 'punch',
        id,
        timestamp,             // ISO string in UTC
        source,                // 'auto' or 'manual'
        localOffsetMinutes: localOffsetMinutes === undefined ? null : localOffsetMinutes,
        createdAt: new Date().toISOString()
      };

      await collection.insert(id, doc);
      return res.status(201).json(doc);
    } catch (err) {
      console.error('Error saving punch:', err);
      return res.status(500).json({ error: 'Failed to save punch', details: err.message });
    }
  });

  // Get punches (sorted descending by timestamp)
  app.get('/api/punches', async (req, res) => {
    try {
      // We run a N1QL query to fetch documents of type 'punch' from the bucket
      const q = `SELECT p.* FROM \`${bucket.name}\`._default._default AS p WHERE p.type = 'punch' ORDER BY p.timestamp DESC LIMIT 1000;`;
      const result = await cluster.query(q);
      const punches = result.rows;
      return res.json(punches);
    } catch (err) {
      console.error('Error fetching punches:', err);
      return res.status(500).json({ error: 'Failed to fetch punches', details: err.message });
    }
  });

  // Serve React app build (if exists)
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));

  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  // gracefully shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    try {
      await cluster.close();
    } catch (e) {}
    server.close(() => process.exit(0));
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
