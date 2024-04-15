import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as express from 'express';
import lessonsRouter from './routes/lessons.route';
import sequelize from './instances/sequelize';

dotenv.config();

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/', lessonsRouter);

const start = async (): Promise<void> => {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server started on http://${host}:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
