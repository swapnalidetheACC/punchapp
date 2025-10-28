// server/couchbaseClient.js
const couchbase = require('couchbase');

const {
  COUCHBASE_CONNSTR,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
  COUCHBASE_BUCKET,
  COUCHBASE_SCOPE,
  COUCHBASE_COLLECTION
} = process.env;

if (!COUCHBASE_CONNSTR || !COUCHBASE_USERNAME || !COUCHBASE_PASSWORD || !COUCHBASE_BUCKET) {
  console.error('Missing Couchbase environment variables. Set COUCHBASE_CONNSTR, COUCHBASE_USERNAME, COUCHBASE_PASSWORD, COUCHBASE_BUCKET');
  process.exit(1);
}

const scopeName = COUCHBASE_SCOPE || '_default';
const collectionName = COUCHBASE_COLLECTION || '_default';

async function initCouchbase() {
  const cluster = await couchbase.connect(COUCHBASE_CONNSTR, {
    username: COUCHBASE_USERNAME,
    password: COUCHBASE_PASSWORD,
  });

  const bucket = cluster.bucket(COUCHBASE_BUCKET);
  const scope = bucket.scope(scopeName);
  const collection = scope.collection(collectionName);

  // Ensure primary index exists (safe on small datasets)
  try {
    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXISTS ON \`${COUCHBASE_BUCKET}\``);
  } catch (err) {
    console.warn('Could not create primary index (maybe not needed):', err.message);
  }

  return { cluster, bucket, scope, collection };
}

module.exports = { initCouchbase };
