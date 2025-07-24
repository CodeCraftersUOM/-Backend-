import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const client = await clientPromise;
    const db = client.db('TravelWish');
    const collection = db.collection('thingstodo_reviews');

    if (req.method === 'POST'){
       try{
            const {
                id,
                category,
                title,
                username,
                reviewText,
                rating,
                createdAt,
                
            } = req.body;
            const result = await collection.insertOne({id, category, title, username, reviewText, rating, createdAt});
            return res.status(201).json({message: 'Item Created', result});
        } 
        catch (error) {
            return res.status(500).json({ message: 'Failed to create item', error});
        }


    }

    if (req.method === 'GET'){
        try {
            const reviews = await collection.find({}).toArray();
            res.status(200).json(reviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Database error', error });
            
        }

    }
    
}