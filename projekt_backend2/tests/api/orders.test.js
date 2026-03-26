const { api, getAdminToken, getUserToken } = require('./helper');

describe('POST /api/order - Megrendelés rögzítése', () => {
  test('sikeres megrendelés létrehozása', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.post('/api/order', {
      token,
      body: {
        deliveryAddr: {
          zipCode: '1234',
          cityName: 'Budapest',
          streetName: 'Test utca',
          houseNumber: '1'
        },
        billingAddr: {
          zipCode: '1234',
          cityName: 'Budapest',
          streetName: 'Test utca',
          houseNumber: '1'
        },
        pMethod: 'card',
        dMethod: 'delivery',
        products: [
          { id: '1', price: '250000', amount: 1 }
        ]
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
    expect(response.data).toHaveProperty('orderId');
    expect(typeof response.data.orderId).toBe('string');
  });

  test('hiányzó termékek esetén 400-as hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.post('/api/order', {
      token,
      body: {
        deliveryAddr: {
          zipCode: '1234',
          cityName: 'Budapest',
          streetName: 'Test utca',
          houseNumber: '1'
        },
        billingAddr: {
          zipCode: '1234',
          cityName: 'Budapest',
          streetName: 'Test utca',
          houseNumber: '1'
        },
        pMethod: 'card',
        dMethod: 'delivery',
        products: []
      }
    });

    expect(response.status).toBe(400);
  });

  test('bejelentkezés nélkül 401-es hibakód', async () => {
    const response = await api.post('/api/order', {
      body: {
        deliveryAddr: {
          zipCode: '1234',
          cityName: 'Budapest',
          streetName: 'Test',
          houseNumber: '1'
        },
        pMethod: 'card',
        dMethod: 'delivery',
        products: [{ id: '1', price: '100', amount: 1 }]
      }
    });

    expect(response.status).toBe(401);
  });

  test('nem elegendő készlet esetén 404-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.post('/api/order', {
      token,
      body: {
        deliveryAddr: {
          zipCode: '1234',
          cityName: 'Budapest',
          streetName: 'Test',
          houseNumber: '1'
        },
        pMethod: 'card',
        dMethod: 'delivery',
        products: [
          { id: '1', price: '250000', amount: 999999 }
        ]
      }
    });

    expect(response.status).toBe(404);
  });
});

describe('GET /api/admin/orders - Megrendelések lekérése', () => {
  test('sikeres lekérés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/orders', { token });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('status');
      expect(response.data[0]).toHaveProperty('items');
    }
  });

  test('rendelés items tartalmazza a quantity mezőt', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/orders', { token });

    expect(response.status).toBe(200);
    const orderWithItems = response.data.find(o => o.items && o.items.length > 0);
    if (orderWithItems) {
      expect(orderWithItems.items[0]).toHaveProperty('quantity');
    }
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/admin/orders');

    expect(response.status).toBe(401);
  });

  test('nem admin felhasználó esetén 401-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.get('/api/admin/orders', { token });

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/order?id= - Megrendelés állapotának módosítása', () => {
  test('sikeres státusz módosítás', async () => {
    const token = await getAdminToken();
    const ordersResponse = await api.get('/api/admin/orders', { token });
    
    if (ordersResponse.status === 200 && ordersResponse.data.length > 0) {
      const orderId = ordersResponse.data[0].id;
      const response = await api.patch(`/api/order?id=${orderId}`, {
        token,
        body: { status: 'kész' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    }
  });

  test('nem létező rendelés esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.patch('/api/order?id=99999', {
      token,
      body: { status: 'kész' }
    });

    expect(response.status).toBe(404);
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.patch('/api/order', {
      token,
      body: { status: 'kész' }
    });

    expect(response.status).toBe(400);
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.patch('/api/order?id=1', {
      body: { status: 'kész' }
    });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/order?id= - Rendelés törlése', () => {
  test('sikeres törlés', async () => {
    const token = await getAdminToken();
    const ordersResponse = await api.get('/api/admin/orders', { token });
    
    if (ordersResponse.status === 200 && ordersResponse.data.length > 0) {
      const orderId = ordersResponse.data[ordersResponse.data.length - 1].id;
      const response = await api.delete(`/api/order?id=${orderId}`, { token });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    }
  });

  test('nem létező rendelés törlése esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.delete('/api/order?id=99999', { token });

    expect(response.status).toBe(404);
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.delete('/api/order?id=1');

    expect(response.status).toBe(401);
  });
});