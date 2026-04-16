<template>
  <nav class="navbar">
    <div class="navbar-brand">
      🗂️ Job Tracker
    </div>

    <div class="navbar-links">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/applications">Applications</RouterLink>
    </div>

    <div class="navbar-user">
      <span>{{ user.name }}</span>
      <button @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || { name: '' }
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4f46e5;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.navbar-links a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.navbar-links a:hover {
  color: #4f46e5;
  background-color: #f0f0ff;
}

.navbar-links a.router-link-active {
  color: #4f46e5;
  background-color: #ede9fe;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-user span {
  font-size: 0.9rem;
  color: #555;
}

button {
  padding: 0.4rem 1rem;
  background-color: #f0f0ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #4f46e5;
  color: white;
}
</style>