const express = require('express');

const app = express();
const userRouter = express.Router();

userRouter.use((req, res, next) => {
    console.log('User router middleware');
    next();
});

userRouter.get('/', (req, res) => {
    res.send('Users');
});

userRouter.get('/profile', (req, res) => {
    res.send('User Profile');
});

app.use('/users', userRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

