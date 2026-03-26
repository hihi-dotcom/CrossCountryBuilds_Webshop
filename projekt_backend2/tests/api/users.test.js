const { api, getAdminToken, getUserToken } = require('./helper');

describe('GET /api/admin/users - Felhasználók listázása', () => {
  test('sikeres lekérés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/users', { token });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('username');
      expect(response.data[0]).toHaveProperty('email');
      expect(response.data[0]).toHaveProperty('role');
    }
  });

  test('kizárólag nem admin felhasználókat ad vissza', async () => {
    const token = await getAdminToken();
    const response = await api.get('/api/admin/users', { token });

    expect(response.status).toBe(200);
    response.data.forEach(user => {
      expect(user.role).not.toBe('admin');
    });
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.get('/api/admin/users');

    expect(response.status).toBe(401);
  });

  test('nem admin felhasználó esetén 401-es hibakód', async () => {
    const token = await getUserToken();
    if (!token) {
      return;
    }
    const response = await api.get('/api/admin/users', { token });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/user?id= - Felhasználó törlése', () => {
  test('sikeres törlés admin jogosultsággal', async () => {
    const token = await getAdminToken();
    const usersResponse = await api.get('/api/admin/users', { token });
    
    if (usersResponse.status === 200 && usersResponse.data.length > 0) {
      const userToDelete = usersResponse.data[usersResponse.data.length - 1];
      const response = await api.delete(`/api/user?id=${userToDelete.id}`, { token });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    }
  });

  test('nem létező felhasználó törlése esetén 404-es hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.delete('/api/user?id=99999', { token });

    expect(response.status).toBe(404);
  });

  test('hiányzó azonosító esetén 400-as hibakód', async () => {
    const token = await getAdminToken();
    const response = await api.delete('/api/user?id=', { token });

    expect(response.status).toBe(400);
  });

  test('hiányzó token esetén 401-es hibakód', async () => {
    const response = await api.delete('/api/user?id=2');

    expect(response.status).toBe(401);
  });
});