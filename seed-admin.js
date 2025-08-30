const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, default: 'admin' },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        const adminExists = await User.findOne({ username: 'admin' });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('6thmarch1957', salt);

            await User.create({
                username: 'admin',
                password: hashedPassword,
            });
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
