// Test GraphQL Authentication
const testGraphQLAuth = async () => {
  const graphqlEndpoint = 'http://localhost:5000/graphql';
  
  // Test registration
  const registerMutation = `
    mutation RegisterUser($input: UserInput!) {
      register(input: $input) {
        message
        token
        user {
          id
          username
          email
          created_at
        }
      }
    }
  `;
  
  const registerVariables = {
    input: {
      username: 'newuser' + Date.now(),
      password: 'testpass123',
      email: 'newuser@example.com'
    }
  };
  
  try {
    console.log('Testing registration...');
    const registerResponse = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: registerMutation,
        variables: registerVariables
      })
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration result:', registerResult);
    
    if (registerResult.data && registerResult.data.register) {
      const token = registerResult.data.register.token;
      console.log('Registration successful! Token:', token);
      
      // Test login
      const loginMutation = `
        mutation LoginUser($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            message
            token
            user {
              id
              username
              email
              created_at
            }
          }
        }
      `;
      
      console.log('Testing login...');
      const loginResponse = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: loginMutation,
          variables: {
            username: registerVariables.input.username,
            password: 'testpass123'
          }
        })
      });
      
      const loginResult = await loginResponse.json();
      console.log('Login result:', loginResult);
      
      if (loginResult.data && loginResult.data.login) {
        console.log('Login successful!');
        console.log('✅ GraphQL Authentication is working correctly!');
      } else {
        console.error('❌ Login failed:', loginResult.errors);
      }
    } else {
      console.error('❌ Registration failed:', registerResult.errors);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testGraphQLAuth();
