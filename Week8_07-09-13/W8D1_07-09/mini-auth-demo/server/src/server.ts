import 'dotenv/config';
import app from './app.js';
const PORT = parseInt(process.env.PORT || '5000',10);

app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`)
});