<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Job Tracker</h1>
      <h2>Welcome back</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="switch-auth">
          Don't have an account?
          <RouterLink to="/register">Register</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      try {
        const response = await api.post('/auth/login', this.form);
        const { token, user } = response.data;

        // Save token and user to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.$router.push('/dashboard');
      } catch (err) {
        alert(err.response?.data?.message || 'Login failed');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 1.5rem;
  color: #4f46e5;
  margin-bottom: 0.25rem;
}

h2 {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #444;
}

input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  outline: none;
}

input:focus {
  border-color: #4f46e5;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #4338ca;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.switch-auth {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.switch-auth a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}
</style>