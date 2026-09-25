const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home',{
        name: 'Kamal',
        course: 'Computer Engineering'
    });
});
app.get('/students', (req, res) => {
    const students = [
        'Kamal',
        'Ram',
        'Shyam',
        'Hari'
    ];

    res.render('students', {
        students
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});