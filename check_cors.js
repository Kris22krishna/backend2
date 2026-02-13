const https = require('https');

const options = {
    hostname: 'backend2-krishnas-projects-c104e4ff.vercel.app',
    port: 443,
    path: '/api/v1/auth/login',
    method: 'OPTIONS',
    headers: {
        'Origin': 'https://www.skill100.ai',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
