import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 TaskPulse API is running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
