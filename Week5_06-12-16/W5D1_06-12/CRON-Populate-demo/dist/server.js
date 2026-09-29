import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import "./jobs/daily-report.job.js";
const PORT = Number(process.env.PORT) || 3000;
const startServer = async () => {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map