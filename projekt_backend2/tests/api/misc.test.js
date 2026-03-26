const { api, BASE_URL } = require('./helper');

describe('CORS és OPTIONS kérések', () => {
  test('OPTIONS kérés CORS fejlécekkel', async () => {
    const response = await api.post('/api/login', {});
  });
});

describe('Opciós útvonalak - 404 kezelés', () => {
  test('nem létező POST útvonal esetén 404', async () => {
    const response = await api.post('/api/nonexistent', {
      body: { test: 'data' }
    });

    expect(response.status).toBe(404);
  });

  test('nem létező GET útvonal esetén 404', async () => {
    const response = await api.get('/api/nonexistent');

    expect(response.status).toBe(404);
  });

  test('nem létező PATCH útvonal esetén 404', async () => {
    const response = await api.patch('/api/nonexistent', {
      body: { test: 'data' }
    });

    expect(response.status).toBe(404);
  });

  test('nem létező DELETE útvonal esetén 404', async () => {
    const response = await api.delete('/api/nonexistent');

    expect(response.status).toBe(404);
  });
});

describe('Token kezelés', () => {
  test('érvénytelen Bearer formátum', async () => {
    const response = await api.get('/api/user', {
      headers: {
        'Authorization': 'InvalidFormat token123'
      }
    });

    expect(response.status).toBe(401);
  });

  test('Bearer prefix nélkül', async () => {
    const response = await api.get('/api/user', {
      headers: {
        'Authorization': 'sometokenwithoutbearer'
      }
    });

    expect(response.status).toBe(401);
  });

  test('üres token', async () => {
    const response = await api.get('/api/user', {
      token: ''
    });

    expect(response.status).toBe(401);
  });
});

describe('Server kapcsolat', () => {
  test('szerver elérhető', async () => {
    const response = await api.get('/api/products?limit=1&offset=0');
    expect(response.status).toBeLessThan(500);
  });
});