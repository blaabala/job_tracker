<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <RouterLink to="/dashboard">Go to Dashboard</RouterLink>
  </div>
</template>

<script>
export default { name: 'NotFoundView' }
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #555;
}

h1 {
  font-size: 5rem;
  font-weight: 700;
  color: #4f46e5;
}

p {
  font-size: 1.2rem;
  color: #888;
}

a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #4f46e5;
  border-radius: 8px;
  transition: all 0.2s;
}

a:hover {
  background-color: #4f46e5;
  color: white;
}
</style>