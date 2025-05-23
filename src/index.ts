import { buildServer } from './server.js';
import { environment } from './config/environment.js';

buildServer().then(app => {
  app.listen({ port: environment.port, host: '0.0.0.0' }, err => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server running on http://localhost:${environment.port}`);
  });
});
