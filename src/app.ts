// EN: Import Swagger configuration and UI middleware
import swaggerSpec from './config/swaggerConfig';
import swaggerUi from 'swagger-ui-express';

// EN: Import core Express framework
import express from 'express';

// EN: Enable Cross-Origin Resource Sharing for frontend-backend communication
import cors from 'cors';

// EN: Import route modules
import authRoute from './routes/authRoute';
import weatherRoute from './routes/weatherRoute';
import userRoute from './routes/userRoute';

// EN: Create Express application instance
const app = express();

// EN: Enable CORS for all origins (can be configured further if needed)
app.use(cors());

// EN: Parse incoming JSON requests to JavaScript objects
app.use(express.json());

// EN: Register API routes for authentication, users, and weather data
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/weather', weatherRoute);

// EN: Simple health check endpoint to verify API is running
app.get('/', (req, res) => {
  res.send('🌤️ Weather API is up and running!');
});

// EN: Setup Swagger UI for API documentation under /api/docs path
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// EN: Export the app instance to be used in server startup scripts
export default app;

