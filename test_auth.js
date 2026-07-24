(async () => {
  const base = 'http://127.0.0.1:8080';
  try {
    console.log('Registering user...');
    const reg = await fetch(base + '/ems/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'auto_test@example.com', password: 'Passw0rd!' })
    });
    console.log('Register status:', reg.status);
    const regText = await reg.text();
    console.log('Register body:', regText);

    console.log('\nLogging in...');
    const login = await fetch(base + '/ems/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'auto_test@example.com', password: 'Passw0rd!' })
    });
    console.log('Login status:', login.status);
    const loginBody = await (login.headers.get('content-type') || '').includes('application/json') ? await login.json() : {raw: await login.text()};
    console.log('Login body:', loginBody);

    const token = loginBody.token || loginBody?.raw || null;
    if (!token) {
      console.error('No token returned; aborting protected call.');
      return;
    }

    console.log('\nCalling protected endpoint with token...');
    const detail = await fetch(base + '/ems/EmployeeDetail', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('EmployeeDetail status:', detail.status);
    const detailBody = await detail.text();
    console.log('EmployeeDetail body:', detailBody);
  } catch (e) {
    console.error('Error during test:', e);
  }
})();
