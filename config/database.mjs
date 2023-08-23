import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri =
    'mongodb+srv://quangtrong1506:Trong1506@admin.g1cwb0a.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const db = {
    connect: async () => {
        mongoose
            .connect(process.env.ATLAS_URI, { dbName: process.env.DATABASE })
            .then(() => console.log('Connected!'))
            .catch((e) => console.log(e));
    },
    run: async () => {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db('admin').command({ ping: 1 });
            console.log(
                'Pinged your deployment. You successfully connected to MongoDB!'
            );
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    },
};
export default db;
