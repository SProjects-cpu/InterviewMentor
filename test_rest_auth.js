// Test REST Authentication
const testRESTAuth = async () => {
  const apiEndpoint = 'http://localhost:5000/api';
  
  try {
    console.log('Testing REST registration...');
    const registerResponse = await fetch(`${apiEndpoint}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser456',
        password: 'testpass456',
        email: 'test456@example.com'
      })
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration result:', registerResult);
    
    if (registerResult.token) {
      console.log('Registration successful! Token:', registerResult.token);
      
      // Test login
      console.log('Testing REST login...');
      const loginResponse = await fetch(`${apiEndpoint}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser456',
          password: 'testpass456'
        })
      });
      
      const loginResult = await loginResponse.json();
      console.log('Login result:', loginResult);
      
      if (loginResult.token) {
        console.log('Login successful!');
        console.log('✅ REST Authentication is working correctly!');
        
        // Test authenticated endpoint
        console.log('Testing authenticated endpoint...');
        const meResponse = await fetch(`${apiEndpoint}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${loginResult.token}`,
          },
        });
        
        const meResult = await meResponse.json();
        console.log('Me result:', meResult);
        
        if (meResult.user) {
          console.log('✅ Authenticated endpoint working!');
        }
      } else {
        console.error('❌ Login failed:', loginResult);
      }
    } else {
      console.error('❌ Registration failed:', registerResult);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testRESTAuth();
