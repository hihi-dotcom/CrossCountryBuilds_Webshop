const { api, getAdminToken, getUserToken } = require('./helper');

describe('GET /api/admin/freeappointments - Szabad időpontok lekérése', () => {
  test('sikeres lekérés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/freeappointments', { token });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('service_date');
    }
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/admin/freeappointments');

    expect(response.status).toBe(401);
  });

  test('nem admin felhasználó esetén 401-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.get('/api/admin/freeappointments', { token });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/newappointment - Új időpont létrehozása', () => {
  test('sikeres időpont létrehozása admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateString = futureDate.toISOString();

    const response = await api.post('/api/newappointment', {
      token,
      body: {
        appointmentDate: dateString
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
  });

  test('hiányzó dátum esetén 400-as hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.post('/api/newappointment', {
      token,
      body: {
        appointmentDate: ''
      }
    });

    expect(response.status).toBe(400);
  });

  test('bejelentkezés nélkül 401-es hibakód', async () => {
    const response = await api.post('/api/newappointment', {
      body: {
        appointmentDate: '2025-05-01T10:00:00'
      }
    });

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/appointment?id= - Időpontfoglalás', () => {
  test('sikeres foglalás bejelentkezett felhasználóval', async () => {
    const adminToken = await getAdminToken();
    const freeResponse = await api.get('/api/admin/freeappointments', { token: adminToken });
    
    if (freeResponse.status === 200 && freeResponse.data.length > 0) {
      const appointmentId = freeResponse.data[0].id;
      const userToken = await getUserToken();
      
      if (userToken) {
        const response = await api.patch(`/api/appointment?id=${appointmentId}`, {
          token: userToken,
          body: {
            problem_description: 'A váltók recsegnek'
          }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message');
      }
    }
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.patch('/api/appointment?id=', {
      token,
      body: {
        problem_description: 'Probléma'
      }
    });

    expect(response.status).toBe(400);
  });

  test('hiányzó problem_description esetén 400-as hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.patch('/api/appointment?id=1', {
      token,
      body: {
        problem_description: ''
      }
    });

    expect(response.status).toBe(400);
  });
});

describe('PATCH /api/admin/finalize?id= - Időpont véglegesítése', () => {
  test('sikeres véglegesítés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const freeResponse = await api.get('/api/admin/freeappointments', { token });
    
    if (freeResponse.status === 200 && freeResponse.data.length > 0) {
      const appointmentId = freeResponse.data[0].id;
      const response = await api.patch(`/api/admin/finalize?id=${appointmentId}`, {
        token,
        body: {
          service_id: 'Váltó csere',
          service_price: 15000,
          bringback_date: '2025-04-15T16:00:00'
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    }
  });

  test('nem létező időpont esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.patch('/api/admin/finalize?id=99999', {
      token,
      body: {
        service_id: 'Szerviz',
        service_price: 10000,
        bringback_date: '2025-04-15T16:00:00'
      }
    });

    expect(response.status).toBe(404);
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.patch('/api/admin/finalize?id=1', {
      body: {
        service_id: 'Szerviz',
        service_price: 10000,
        bringback_date: '2025-04-15T16:00:00'
      }
    });

    expect(response.status).toBe(401);
  });

  test('nem admin felhasználó esetén 401-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.patch('/api/admin/finalize?id=1', {
      token,
      body: {
        service_id: 'Szerviz',
        service_price: 10000,
        bringback_date: '2025-04-15T16:00:00'
      }
    });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/admin/appointments - Összes időpont lekérése', () => {
  test('sikeres lekérés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/appointments', { token });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('status');
    }
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/admin/appointments');

    expect(response.status).toBe(401);
  });
});

describe('GET /api/admin/appointment?id= - Egy időpont adatai', () => {
  test('sikeres lekérés létező azonosítóval', async () => {
    const token = await getAdminToken();
    const allResponse = await api.get('/api/admin/appointments', { token });
    
    if (allResponse.status === 200 && allResponse.data.length > 0) {
      const appointmentId = allResponse.data[0].id;
      const response = await api.get(`/api/admin/appointment?id=${appointmentId}`, { token });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    }
  });

  test('nem létező időpont esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/appointment?id=99999', { token });

    expect(response.status).toBe(404);
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/appointment?id=', { token });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/appointment?id= - Időpont törlése', () => {
  test('sikeres törlés', async () => {
    const token = await getAdminToken();
    const allResponse = await api.get('/api/admin/appointments', { token });
    
    if (allResponse.status === 200 && allResponse.data.length > 0) {
      const lastAppointment = allResponse.data[allResponse.data.length - 1];
      const response = await api.delete(`/api/appointment?id=${lastAppointment.id}`, { token });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    }
  });

  test('nem létező időpont törlése esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.delete('/api/appointment?id=99999', { token });

    expect(response.status).toBe(404);
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.delete('/api/appointment?id=', { token });

    expect(response.status).toBe(400);
  });
});