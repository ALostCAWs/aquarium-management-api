// Setup for a minimal Express server using JS
import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { TankRouter } from './routers/tankRouter';
import { ProductRouter } from './routers/productRouter';
import { PlantRouter } from './routers/plantRouter';
import { LivestockRouter } from './routers/livestockRouter';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// MIDDLEWARE
// Intercept requests before they get to the code (sometimes called filters)
// Can make changes to the request or response
app.use(express.json());
app.use(cors());

// URL decodes Payloads it receives
// URL encoding makes it safe to use special chars in URL
// Will need to URL Encode stuff when calling it, won't need to decode within the APIs because this handles it
app.use(express.urlencoded({ extended: false }));

const client = new DynamoDBClient({});

// ROUTERS
app.use('/tanks', TankRouter);
app.use('/products', ProductRouter);
app.use('/plants', PlantRouter);
app.use('/livestock', LivestockRouter);

app.get('/', async (req, res) => {
  const command = new ListTablesCommand({});
  const response = await client.send(command);
  res.send(response.TableNames);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});