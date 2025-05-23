import { buildServer } from './server';
import { environment } from './config/environment';
buildServer().then(app => {
    app.listen({ port: environment.port, host: '0.0.0.0' }, err => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        console.log(`🚀 Server running at http://localhost:${environment.port}`);
    });
});
