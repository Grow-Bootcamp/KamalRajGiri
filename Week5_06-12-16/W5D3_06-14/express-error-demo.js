import express from 'express';
import morgan from 'morgan';
import logger from './logger.js';
import {getStudents }from './student.controller.js';
import { AppError } from './app-error.js';
import {param, validationResult} from 'express-validator';

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Express Error Handling Demo');
});

// app.get('/test-error', (req, res, next) => {
//     const Err = new Error("An error occurred in /test-error route");
//         next(Err);
// });


app.get('/students', getStudents);



app.get("/students/:id",
    param("id").isMongoId()
    .withMessage("Student ID must be a valid MongoDB ObjectId"),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return next(new AppError(errors.array()[0].msg, 400));
        }
        res.json({
            message: "Student ID is valid",
            id: req.params.id
        });
    }
);



// Error handling middleware
app.use((err, req, res, next) => {
    // console.error(err.stack);
    logger.error(err.stack);
    // logger.error(err);
    // res.status(500).send('Something went wrong! Error: ' + err.message);
    res.status(err.statusCode || 500).send(
        'Something went wrong! Error : '+ err.message + "  with status code: " + err.statusCode
    );
}
);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

