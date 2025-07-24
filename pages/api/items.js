// pages/api/items.js

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  const client = await clientPromise;
  const db = client.db('TravelWish'); 
  const collection = db.collection('things to do');

  if (req.method === 'GET') {
    try {
          
      const items = await collection.find({}).toArray();
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Database error', error });
    }
  } 
    
  
  if (req.method === 'POST') {
    try {
      const { id, category, subcategory, title, imageUrl, description, location, googleMapsUrl, openingHours, contactInfo,
entryFee} = req.body;
      const result = await collection.insertOne({ id, category, subcategory, title, imageUrl, description, location, googleMapsUrl, openingHours, contactInfo,
entryFee });
      return res.status(201).json({ message: 'Item created', result});
    }
    catch (error) {
      return res.status(500).json({ message: 'Failed to create item', error});
    }
  }

  res.status(405).json({ message: 'Method Not Allowed' });
  
}


