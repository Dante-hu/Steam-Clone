'use client';
import { useState } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function FirebaseDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recentDocument, setRecentDocument] = useState(null);

  const addHelloWorld = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const timestamp = new Date();
      
      // Add a document with hello: 'world' and a timestamp
      const docRef = await addDoc(collection(db, 'messages'), {
        hello: 'world',
        createdAt: timestamp
      });
      
      setResult(`Successfully added document with ID: ${docRef.id}`);
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Failed to add document. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const readRecentMessage = async () => {
    setIsReading(true);
    setError(null);
    setRecentDocument(null);
    
    try {
      // Create a query to get the most recent document
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setRecentDocument({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || 'No timestamp'
        });
      } else {
        setRecentDocument({ message: 'No documents found in collection' });
      }
    } catch (err) {
      console.error('Error reading document:', err);
      setError('Failed to read document. See console for details.');
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Firestore Demo</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={addHelloWorld}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Hello World'}
        </button>
        
        <button
          onClick={readRecentMessage}
          disabled={isReading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isReading ? 'Reading...' : 'Read Recent Message'}
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {result}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {recentDocument && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Most Recent Document</h2>
          <div className="p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(recentDocument, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}