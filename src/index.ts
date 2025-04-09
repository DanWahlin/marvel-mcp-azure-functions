import { app } from '@azure/functions';

// Setup HTTP streaming for serverless events
app.setup({
    enableHttpStream: true,
});