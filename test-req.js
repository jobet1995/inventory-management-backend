const http = require('http');

const data = JSON.stringify({
  role: 'SUPER_ADMIN',
  module: 'TestModule',
  canCreate: true,
  canRead: true,
  canUpdate: false,
  canDelete: false
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/RolePermission',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (process.env.TEST_TOKEN || '')
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
