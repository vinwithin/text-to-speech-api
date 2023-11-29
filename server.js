const Hapi = require('@hapi/hapi');
const quickStart = require('./src/handler');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    });
    server.route([
        {
            method: "GET",
            path: '/',
            handler: (request, h) => {
                return 'hello world'
            }
        },
        {
            method: "POST",
            path: '/text-to-speech',
            handler: quickStart
        }
    ])
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();