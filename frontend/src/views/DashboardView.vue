<template>
  <div>
    <NavBar />
    <div class="page-content">

      <div class="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back, {{ user.name }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Applications</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Interviews</div>
          <div class="stat-value">{{ getStatusCount('Interview') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Offers</div>
          <div class="stat-value offer">{{ getStatusCount('Offer') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Overdue Follow Ups</div>
          <div class="stat-value overdue">{{ stats.overdue }}</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">

        <div class="chart-card">
          <h3>Applications by Status</h3>
          <div class="chart-wrapper">
            <Doughnut
              v-if="doughnutData.labels.length > 0"
              :data="doughnutData"
              :options="doughnutOptions"
            />
            <p v-else class="no-data">No data yet</p>
          </div>
        </div>

        <div class="chart-card">
          <h3>Applications Over Time</h3>
          <div class="chart-wrapper">
            <Line
              v-if="lineData.labels.length > 0"
              :data="lineData"
              :options="lineOptions"
            />
            <p v-else class="no-data">No data yet</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import api from '../services/api';
import { Doughnut, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

export default {
  name: 'DashboardView',
  components: { NavBar, Doughnut, Line },
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || { name: '' },
      stats: {
        total: 0,
        overdue: 0,
        statusCounts: [],
        monthly: []
      },
      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      },
      lineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    };
  },
  computed: {
    doughnutData() {
      const colorMap = {
        Wishlist:  { bg: '#f3f4f6', border: '#6b7280' },
        Applied:   { bg: '#dbeafe', border: '#1d4ed8' },
        Interview: { bg: '#fef9c3', border: '#a16207' },
        Offer:     { bg: '#dcfce7', border: '#15803d' },
        Rejected:  { bg: '#fee2e2', border: '#b91c1c' }
      };

      return {
        labels: this.stats.statusCounts.map(s => s.status),
        datasets: [{
          data: this.stats.statusCounts.map(s => s.count),
          backgroundColor: this.stats.statusCounts.map(s => colorMap[s.status]?.bg || '#e5e7eb'),
          borderColor: this.stats.statusCounts.map(s => colorMap[s.status]?.border || '#9ca3af'),
          borderWidth: 2
        }]
      };
    },
    lineData() {
      return {
        labels: this.stats.monthly.map(m => m.month),
        datasets: [{
          data: this.stats.monthly.map(m => m.count),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#4f46e5',
          fill: true,
          tension: 0.4
        }]
      };
    }
  },
  methods: {
    async fetchStats() {
      try {
        const response = await api.get('/dashboard/stats');
        this.stats = response.data;
      } catch (err) {
        alert('Failed to load dashboard stats');
      }
    },
    getStatusCount(status) {
      const found = this.stats.statusCounts.find(s => s.status === status);
      return found ? found.count : 0;
    }
  },
  mounted() {
    this.fetchStats();
  }
};
</script>

<style scoped>
.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.5rem;
  color: #333;
}

.page-header p {
  color: #888;
  margin-top: 0.25rem;
  font-size: 0.95rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.stat-label {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.stat-value.offer {
  color: #15803d;
}

.stat-value.overdue {
  color: #b91c1c;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.chart-card h3 {
  font-size: 1rem;
  color: #444;
  margin-bottom: 1rem;
  font-weight: 600;
}

.chart-wrapper {
  height: 280px;
  position: relative;
}

.no-data {
  text-align: center;
  color: #bbb;
  padding-top: 5rem;
  font-size: 0.9rem;
}
</style>