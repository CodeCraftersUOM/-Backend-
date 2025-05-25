// pages/api/items.js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Your actual API logic below:
  res.status(200).json([
    {
      id: 1,
      title: 'Sample Item',
      description: 'Out of stock',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Keells_Outlet.jpg/330px-Keells_Outlet.jpg'

    },
    {
      id: 2,
      title: 'Sample Item2',
      description: 'Out of stock',
      imageUrl: 'https://via.placeholder.com/150'
    },
    // Add more items here
  ]);
}

