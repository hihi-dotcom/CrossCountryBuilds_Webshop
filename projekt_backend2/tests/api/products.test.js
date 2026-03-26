const { api, getAdminToken, getUserToken } = require('./helper');

describe('GET /api/product?id= - Adott termék lekérése', () => {
  test('sikeres termék lekérése létező azonosítóval', async () => {
    const response = await api.get('/api/product?id=1');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('category');
    expect(response.data).toHaveProperty('maker');
    expect(response.data).toHaveProperty('price');
    expect(response.data).toHaveProperty('stock_number');
    expect(response.data).toHaveProperty('description');
    expect(response.data.id).toBe('1');
  });

  test('nem létező termék esetén 404-es hibakód', async () => {
    const response = await api.get('/api/product?id=99999');

    expect(response.status).toBe(404);
    expect(response.data).toHaveProperty('message');
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const response = await api.get('/api/product?id=');

    expect(response.status).toBe(400);
  });
});

describe('GET /api/products?limit=&offset= - Termékek listázása', () => {
  test('sikeres listázás alapértelmezett paraméterekkel', async () => {
    const response = await api.get('/api/products?limit=5&offset=0');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('products');
    expect(response.data).toHaveProperty('total');
    expect(response.data).toHaveProperty('hasMore');
    expect(Array.isArray(response.data.products)).toBe(true);
    expect(typeof response.data.total).toBe('number');
    expect(typeof response.data.hasMore).toBe('boolean');
  });

  test('szűrés név alapján', async () => {
    const response = await api.get('/api/products?limit=10&offset=0&name=Bike');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.products)).toBe(true);
    response.data.products.forEach(product => {
      expect(product.name.toLowerCase()).toContain('bike');
    });
  });

  test('szűrés kategória alapján', async () => {
    const response = await api.get('/api/products?limit=10&offset=0&category=Mountain Bike');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.products)).toBe(true);
  });

  test('ár intervallum szűrés', async () => {
    const response = await api.get('/api/products?limit=10&offset=0&priceFrom=100000&priceTo=300000');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.products)).toBe(true);
  });

  test('lapozás ellenőrzése', async () => {
    const first = await api.get('/api/products?limit=2&offset=0');
    const second = await api.get('/api/products?limit=2&offset=2');

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    if (first.data.products.length > 0 && second.data.products.length > 0) {
      expect(first.data.products[0].id).not.toBe(second.data.products[0].id);
    }
  });
});

describe('GET /api/admin/products - Összes termék lekérése (admin)', () => {
  test('sikeres lekérés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/products', { token });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('name');
      expect(response.data[0]).toHaveProperty('price');
    }
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/admin/products');

    expect(response.status).toBe(401);
  });

  test('nem admin felhasználó esetén 401-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.get('/api/admin/products', { token });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/product - Új termék feltöltése (admin)', () => {
  test('sikeres termék létrehozása admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const response = await api.post('/api/product', {
      token,
      body: {
        name: 'Test Product',
        category: 'Test Category',
        maker: 'Test Maker',
        price: 100000,
        stock_number: 10,
        description: 'Test description',
        image: ''
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('message');
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.post('/api/product', {
      body: {
        name: 'Test Product 2',
        category: 'Test',
        maker: 'Test',
        price: 50000,
        stock_number: 5,
        description: 'Test'
      }
    });

    expect(response.status).toBe(401);
  });

  test('nem admin felhasználó esetén 401-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.post('/api/product', {
      token,
      body: {
        name: 'Unauthorized Product',
        category: 'Test',
        maker: 'Test',
        price: 50000,
        stock_number: 5,
        description: 'Test'
      }
    });

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/admin/products?id= - Termék frissítése', () => {
  let testProductId;

  beforeAll(async () => {
    const token = await getAdminToken();
    const response = await api.post('/api/product', {
      token,
      body: {
        name: 'Update Test Product',
        category: 'Test',
        maker: 'Test',
        price: 100000,
        stock_number: 10,
        description: 'Original description'
      }
    });
    if (response.status === 200) {
      testProductId = response.data.id;
    }
  });

  test('sikeres részleges frissítés', async () => {
    if (!testProductId) {
      return;
    }
    const token = await getAdminToken();
    const response = await api.patch(`/api/admin/products?id=${testProductId}`, {
      token,
      body: {
        price: 150000,
        stock_number: 20
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
  });

  test('nem létező termék esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.patch('/api/admin/products?id=99999', {
      token,
      body: { price: 100 }
    });

    expect(response.status).toBe(404);
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.patch('/api/admin/products', {
      token,
      body: { price: 100 }
    });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/product?id= - Termék törlése', () => {
  test('sikeres törlés létező termékkel', async () => {
    const token = await getAdminToken();
    const createResponse = await api.post('/api/product', {
      token,
      body: {
        name: 'Product To Delete',
        category: 'Test',
        maker: 'Test',
        price: 10000,
        stock_number: 1,
        description: 'Will be deleted'
      }
    });

    if (createResponse.status === 200 && createResponse.data.id) {
      const deleteResponse = await api.delete(`/api/product?id=${createResponse.data.id}`, { token });
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.data).toHaveProperty('message');
    }
  });

  test('nem létező termék törlése esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.delete('/api/product?id=99999', { token });

    expect(response.status).toBe(404);
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.delete('/api/product?id=1');

    expect(response.status).toBe(401);
  });
});