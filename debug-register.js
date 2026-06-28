(async () => {
  try {
    const res = await fetch('http://localhost:8081/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test+cli2@example.com',
        password: 'password123',
        full_name: 'CLI Test2',
        phone: '+1234567890',
      }),
    });

    console.log('STATUS', res.status, res.statusText);
    const body = await res.text();
    console.log('BODY', body);
  } catch (err) {
    console.error('FETCH ERROR', err);
  }
})();
