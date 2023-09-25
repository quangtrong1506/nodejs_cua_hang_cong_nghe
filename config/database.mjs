import mongoose from 'mongoose';
const db = {
    connect: async () => {
        mongoose
            .connect(process.env.MONGODB_URI, { dbName: process.env.DATABASE })
            .then(() => console.log('Connected!'))
            .catch((e) => console.log(e));
    },
};
export default db;
