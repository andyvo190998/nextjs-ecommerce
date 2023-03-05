import User from '@/components/models/User';
import data from '@/utils/data';
import db from '../../utils/db'

const handler = async (req, res) => {
    await db.connect();
    await User.deleteMany();
    await User.insertMany(data.user)
    await db.disconnect();
    res.send({ message: 'seeded successfully' })
}

export default handler