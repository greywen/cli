const http = require('http');

const PORT = 3000;
const templates = [
    { value: '1', name: 'React template', url: 'direct:git@github.com:gy2x/great-heat.git#main' }
];

http.createServer((req, res) => {
    if (req.url === '/templates') {
        res.end(JSON.stringify(templates));
    }
}).listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});