import express, {
  type Application,
  type Request,
  type Response
} from 'express';
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!'
  });
});

export default app;