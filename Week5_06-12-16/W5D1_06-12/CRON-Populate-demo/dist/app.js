import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running!'
    });
});
export default app;
//# sourceMappingURL=app.js.map