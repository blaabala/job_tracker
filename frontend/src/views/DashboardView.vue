<template>
  <div>
    <NavBar />
    <div class="page-content">
      <h2>Dashboard</h2>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  name: 'DashboardView',
  components: { NavBar }
};
</script>

<style scoped>
.page-content {
  padding: 2rem;
}
</style>