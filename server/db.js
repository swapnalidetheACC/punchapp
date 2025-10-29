import couchbase from "couchbase";
import dotenv from "dotenv";

dotenv.config();

const clusterConnStr = process.env.COUCHBASE_URL;
const username = process.env.COUCHBASE_USERNAME;
const password = process.env.COUCHBASE_PASSWORD;
const bucketName = process.env.COUCHBASE_BUCKET;

let bucket;

export async function connectToBucket() {
  if (bucket) return bucket;
  try {
    console.log("🔄 Connecting to Couchbase...");
    const cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
      timeouts: {
        kvTimeout: 20000,
        connectTimeout: 20000,
      },
      tlsVerify: false, // disable strict TLS temporarily for Render
    });

    bucket = cluster.bucket(bucketName);
    console.log("✅ Connected to Couchbase bucket:", bucketName);
    return bucket;
  } catch (error) {
    console.error("❌ Couchbase connection failed:", error);
    // Don't crash app
    return null;
  }
}
