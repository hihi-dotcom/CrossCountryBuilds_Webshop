const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function request(method, path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const config = {
    method,
    headers
  };

  if (options.body && method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  return {
    status: response.status,
    data
  };
}

const api = {
  get: (path, options) => request('GET', path, options),
  post: (path, options) => request('POST', path, options),
  patch: (path, options) => request('PATCH', path, options),
  delete: (path, options) => request('DELETE', path, options)
};

async function login(username, password) {
  const response = await api.post('/api/login', {
    body: { username, password }
  });
  if (response.status === 200 && response.data) {
    return response.data;
  }
  return null;
}

async function getAdminToken() {
  const result = await login(
    process.env.ADMIN_USERNAME || 'admin',
    process.env.ADMIN_PASSWORD || 'password123'
  );
  return result ? result.token : null;
}

async function getUserToken() {
  const result = await login(
    process.env.USER_USERNAME || 'user1',
    process.env.USER_PASSWORD || 'password123'
  );
  return result ? result.token : null;
}

module.exports = {
  api,
  login,
  getAdminToken,
  getUserToken,
  BASE_URL
};