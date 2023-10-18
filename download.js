import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import fs from "fs";

const s3Client = new S3Client({ region: "us-east-1" }); // Reemplaza con tu región

const bucketName = "tu-bucket";
const folderPath = "tu-carpeta-en-s3/";

async function listObjectsInFolder(prefix) {
  const command = new ListObjectsCommand({
    Bucket: bucketName,
    Prefix: prefix,
  });
  return await s3Client.send(command);
}

async function getObject(key) {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  return await s3Client.send(command);
}

async function downloadObject(key, localPath) {
  const response = await getObject(key);

  if (response.Body instanceof Readable) {
    const writeStream = fs.createWriteStream(localPath);
    response.Body.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  }
}

async function downloadFolder(prefix) {
  const objects = (await listObjectsInFolder(prefix)).Contents;

  for (const object of objects) {
    const key = object.Key;
    if (key.endsWith("/")) {
      // Es una carpeta, así que crea la carpeta localmente.
      const folderName = key.slice(prefix.length);
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } else {
      // Es un archivo, así que descárgalo.
      const localPath = key.slice(prefix.length);
      await downloadObject(key, localPath);
      console.log(`Descargado: ${localPath}`);
    }
  }
}

downloadFolder(folderPath);
