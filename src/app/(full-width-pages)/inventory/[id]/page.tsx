'use client';

import { useParams } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';

const SECRET_KEY = 'my_secret_key_123'; // must match with encryption

const page = () => {
  const { id } = useParams();
  const [decryptedId, setDecryptedId] = useState('');

  useEffect(() => {
    if (typeof id === 'string') {
      try {
        const decodedURI = decodeURIComponent(id);
        const bytes = CryptoJS.AES.decrypt(decodedURI, SECRET_KEY);
        const originalId = bytes.toString(CryptoJS.enc.Utf8);
        setDecryptedId(originalId);
      } catch (error) {
        console.error('Decryption failed:', error);
        setDecryptedId('Invalid or corrupted ID');
      }
    }
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-2">Inventory QR Page</h1>
      <p>Decrypted ID: <strong>{decryptedId}</strong></p>
    </div>
  );
};

export default page;
