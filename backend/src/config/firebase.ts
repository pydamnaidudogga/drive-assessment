import dotenv from 'dotenv';
import admin from 'firebase-admin';
dotenv.config();


   let encodeConfig = process.env.FIREBASE_CONFIG as string
    const credentials = JSON.parse(
      Buffer.from(encodeConfig??"", "base64").toString()
    );
    
    let config = credentials ?? "";
    
    admin.initializeApp({
      credential: admin.credential.cert(config), // or provide a service account key
    });
    
 

export const FirebaseAdmin = admin.auth();