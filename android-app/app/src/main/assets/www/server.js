const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 5500;
const types = { '.css':'text/css', '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.pdf':'application/pdf' };

http.createServer((request, response) => {
  const requested = request.url === '/' ? '/Score%20High.html' : request.url.split('?')[0];
  const filePath = path.normalize(path.join(root, decodeURIComponent(requested)));
  if (!filePath.startsWith(root)) { response.writeHead(403); response.end('Forbidden'); return; }
  fs.readFile(filePath, (error, data) => {
    if (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 500); response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error'); return; }
    response.writeHead(200, { 'Content-Type': `${types[path.extname(filePath).toLowerCase()] || 'application/octet-stream'}; charset=utf-8` });
    response.end(data);
  });
}).listen(port, () => console.log(`Score High is running at http://localhost:${port}`));
