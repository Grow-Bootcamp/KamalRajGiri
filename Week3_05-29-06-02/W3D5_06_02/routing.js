const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({
        message: 'List of users'
    }));

    return;
}
if (req.method === 'GET' && req.url.startsWith('/users/')) {
    const userId = req.url.split('/')[2];

    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({
        message: 'User details',
        id: userId
    }));

    return;
}

if (req.method === 'GET' && req.url.startsWith('/search')) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const keyword = url.searchParams.get('keyword');
    const page = url.searchParams.get('page');

    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({
        keyword,
        page
    }));

    return;
}


if (req.method === 'POST' && req.url === '/users') {
    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const user = JSON.parse(body);

        res.writeHead(201, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            message: 'User created',
            user
        }));
    });

    return;
}

res.writeHead(404, { 'Content-Type': 'application/json' });

res.end(JSON.stringify({
    message: 'Route not found'
}));


});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});