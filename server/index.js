require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const couchbase = require('couchbase');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let cluster, bucket, collection;
async function connectDB() {
  try {
    cluster = await couchbase.connect(process.env.COUCHBASE_CONN_STR, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD
    });
    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    collection = bucket.defaultCollection();
    console.log('✅ Connected to Couchbase');
  } catch (e) {
    console.error('❌ Couchbase connection failed:', e);
  }
}
connectDB();

app.post('/api/punch', async (req, res) => {
  try {
    const { timestamp, timezoneOffset, note } = req.body;
    if (!timestamp) return res.status(400).json({ error: 'timestamp required' });

    const id = `punch::${Date.now()}`;
    const doc = {
      type: 'punch',
      timestamp,
      timezoneOffset,
      note,
      createdAt: new Date().toISOString()
    };

    await collection.upsert(id, doc);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save punch' });
  }
});

app.get('/api/punches', async (req, res) => {
  try {
    const q = `SELECT META().id, p.* FROM \`${process.env.COUCHBASE_BUCKET}\` p WHERE p.type='punch' ORDER BY p.timestamp DESC`;
    const result = await cluster.query(q);
    res.json({ success: true, punches: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch punches' });
  }
});

const clientPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientPath));
app.get('*', (req, res) => res.sendFile(path.join(clientPath, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
