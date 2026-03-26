const { api, login, getAdminToken, getUserToken } = require('./helper');

describe('POST /api/login - Bejelentkezés', () => {
  test('sikeres bejelentkezés helyes adatokkal', async () => {
    const response = await api.post('/api/login', {
      body: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'password123'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('message');
    expect(response.data).toHaveProperty('role');
    expect(typeof response.data.token).toBe('string');
    expect(response.data.token.length).toBeGreaterThan(0);
  });

  test('hibás jelszó esetén 401-es hibakód', async () => {
    const response = await api.post('/api/login', {
      body: {
        username: 'admin',
        password: 'rosszjelszo123'
      }
    });

    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('message');
  });

  test('hiányzó bejelentkezési adatok esetén 400-as hibakód', async () => {
    const response = await api.post('/api/login', {
      body: {
        username: '',
        password: ''
      }
    });

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('message');
  });

  test('nem létező felhasználó esetén 401-es hibakód', async () => {
    const response = await api.post('/api/login', {
      body: {
        username: 'nemletezofelhasznalo',
        password: 'barmijelszo'
      }
    });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/signup - Regisztráció', () => {
  const uniqueEmail = `test${Date.now()}@example.com`;
  const uniqueUsername = `testuser${Date.now()}`;

  test('sikeres regisztráció helyes adatokkal', async () => {
    const response = await api.post('/api/signup', {
      body: {
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'password123',
        confirmPassword: 'password123'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
    expect(response.data).toHaveProperty('redirect');
    expect(response.data.redirect).toBe('/login');
  });

  test('hiányzó regisztrációs adatok esetén 400-as hibakód', async () => {
    const response = await api.post('/api/signup', {
      body: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    });

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('message');
  });

  test('nem egyező jelszavak esetén 400-as hibakód', async () => {
    const response = await api.post('/api/signup', {
      body: {
        username: 'testuser3',
        email: 'test3@example.com',
        password: 'password123',
        confirmPassword: 'masikjelszo'
      }
    });

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('message');
  });

  test('már foglalt email cím esetén 409-es hibakód', async () => {
    const response = await api.post('/api/signup', {
      body: {
        username: 'admin2',
        email: 'admin@webshop.com',
        password: 'password123',
        confirmPassword: 'password123'
      }
    });

    expect(response.status).toBe(409);
  });
});

describe('POST /api/logout - Kijelentkezés', () => {
  test('sikeres kijelentkezés', async () => {
    const response = await api.post('/api/logout', {});

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
  });
});

describe('GET /api/user - Felhasználó saját adatai', () => {
  test('sikeres adatlekérés bejelentkezett felhasználóval', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/user', { token });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('username');
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('role');
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/user');

    expect(response.status).toBe(401);
  });

  test('érvénytelen token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/user', {
      token: 'ervenytelentoken123'
    });

    expect(response.status).toBe(401);
  });
});