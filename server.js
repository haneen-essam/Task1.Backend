const express = require("express");
const { ILike } = require("typeorm");
const AppDataSource = require('./db');

const app = express();
app.use(express.json());

AppDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized");
})
.catch((err) => {
    console.error("error during data source initialization:", err);
});

app.get('/users', async (req, res) => {
    try {
        const UserRepository = AppDataSource.getRepository('user');
        const { q } = req.query;

        let users;

        if (q) {
            users = await UserRepository.find({
                where: [
                    { username: ILike(`%${q}%`) },
                    { email: ILike(`%${q}%`) }
                ]
            });
        } else {
            users = await UserRepository.find();
        }

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const UserRepository = AppDataSource.getRepository('user');
        const newUser = UserRepository.create(req.body);
        const savedUser = await UserRepository.save(newUser);
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const UserRepository = AppDataSource.getRepository('user');
        const user = await UserRepository.findOneBy({ id: parseInt(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        UserRepository.merge(user, req.body);
        const updatedUser = await UserRepository.save(user);

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const UserRepository = AppDataSource.getRepository('user');
        const user = await UserRepository.findOneBy({ id: parseInt(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        await UserRepository.remove(user);
        res.json({ message: 'user deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});