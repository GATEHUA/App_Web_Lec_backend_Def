import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
} from "./src/config.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Crear una instancia del cliente S3
const s3Client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function getObjectURL(key) {
  const comand = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, comand);
  return url;
}

async function init() {
  console.log("URL : ", await getObjectURL("raton.png"));
}
init();
