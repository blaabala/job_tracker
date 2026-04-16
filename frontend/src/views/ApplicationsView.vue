<template>
  <div>
    <NavBar />
    <div class="page-content">

      <!-- Header -->
      <div class="page-header">
        <h2>My Applications</h2>
        <button @click="openModal()">+ Add Application</button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input
          v-model="search"
          type="text"
          placeholder="Search by company or role..."
        />
        <select v-model="filterStatus">
          <option value="">All Statuses</option>
          <option>Wishlist</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table v-if="filteredApplications.length > 0">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Follow Up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in filteredApplications" :key="app.id">
              <td>{{ app.company }}</td>
              <td>{{ app.role }}</td>
              <td>{{ app.location || '-' }}</td>
              <td>
                <span :class="['badge', statusClass(app.status)]">
                  {{ app.status }}
                </span>
              </td>
              <td>{{ formatDate(app.date_applied) }}</td>
              <td :class="{ overdue: isOverdue(app.follow_up_date) }">
                {{ formatDate(app.follow_up_date) }}
              </td>
              <td class="actions">
                <button class="btn-edit" @click="openModal(app)">Edit</button>
                <button class="btn-delete" @click="deleteApplication(app.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          No applications found. Add your first one!
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ editingId ? 'Edit Application' : 'Add Application' }}</h3>

          <div class="form-grid">
            <div class="form-group">
              <label>Company *</label>
              <input v-model="form.company" type="text" required />
            </div>
            <div class="form-group">
              <label>Role *</label>
              <input v-model="form.role" type="text" required />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input v-model="form.location" type="text" />
            </div>
            <div class="form-group">
              <label>Job URL</label>
              <input v-model="form.job_url" type="url" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status">
                <option>Wishlist</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date Applied</label>
              <input v-model="form.date_applied" type="date" />
            </div>
            <div class="form-group">
              <label>Follow Up Date</label>
              <input v-model="form.follow_up_date" type="date" />
            </div>
            <div class="form-group full-width">
              <label>Notes</label>
              <textarea v-model="form.notes" rows="3"></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-save" @click="saveApplication">
              {{ editingId ? 'Update' : 'Add' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import api from '../services/api';

export default {
  name: 'ApplicationsView',
  components: { NavBar },
  data() {
    return {
      applications: [],
      search: '',
      filterStatus: '',
      showModal: false,
      editingId: null,
      form: {
        company: '',
        role: '',
        location: '',
        job_url: '',
        status: 'Applied',
        date_applied: '',
        follow_up_date: '',
        notes: ''
      }
    };
  },
  computed: {
    filteredApplications() {
      return this.applications.filter(app => {
        const matchesSearch =
          app.company.toLowerCase().includes(this.search.toLowerCase()) ||
          app.role.toLowerCase().includes(this.search.toLowerCase());
        const matchesStatus = this.filterStatus
          ? app.status === this.filterStatus
          : true;
        return matchesSearch && matchesStatus;
      });
    }
  },
  methods: {
    async fetchApplications() {
      try {
        const response = await api.get('/applications');
        this.applications = response.data;
      } catch (err) {
        alert('Failed to load applications');
      }
    },
    openModal(app = null) {
      if (app) {
        this.editingId = app.id;
        this.form = {
          company: app.company,
          role: app.role,
          location: app.location || '',
          job_url: app.job_url || '',
          status: app.status,
          date_applied: app.date_applied?.split('T')[0] || '',
          follow_up_date: app.follow_up_date?.split('T')[0] || '',
          notes: app.notes || ''
        };
      } else {
        this.editingId = null;
        this.form = {
          company: '',
          role: '',
          location: '',
          job_url: '',
          status: 'Applied',
          date_applied: '',
          follow_up_date: '',
          notes: ''
        };
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveApplication() {
      if (!this.form.company || !this.form.role) {
        alert('Company and Role are required');
        return;
      }
      try {
        if (this.editingId) {
          await api.put(`/applications/${this.editingId}`, this.form);
        } else {
          await api.post('/applications', this.form);
        }
        await this.fetchApplications();
        this.closeModal();
      } catch (err) {
        alert('Failed to save application');
      }
    },
    async deleteApplication(id) {
      if (!confirm('Are you sure you want to delete this application?')) return;
      try {
        await api.delete(`/applications/${id}`);
        await this.fetchApplications();
      } catch (err) {
        alert('Failed to delete application');
      }
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    isOverdue(date) {
      if (!date) return false;
      return new Date(date) < new Date();
    },
    statusClass(status) {
      const map = {
        Wishlist: 'badge-wishlist',
        Applied: 'badge-applied',
        Interview: 'badge-interview',
        Offer: 'badge-offer',
        Rejected: 'badge-rejected'
      };
      return map[status] || '';
    }
  },
  mounted() {
    this.fetchApplications();
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.5rem;
  color: #333;
}

.page-header button {
  padding: 0.6rem 1.2rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-header button:hover {
  background-color: #4338ca;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters input,
.filters select {
  padding: 0.6rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}

.filters input {
  flex: 1;
}

.filters input:focus,
.filters select:focus {
  border-color: #4f46e5;
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8f8ff;
}

th {
  padding: 0.9rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

td {
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  border-top: 1px solid #f0f0f0;
  color: #333;
}

tr:hover td {
  background-color: #fafafa;
}

.badge {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-wishlist  { background: #f3f4f6; color: #6b7280; }
.badge-applied   { background: #dbeafe; color: #1d4ed8; }
.badge-interview { background: #fef9c3; color: #a16207; }
.badge-offer     { background: #dcfce7; color: #15803d; }
.badge-rejected  { background: #fee2e2; color: #b91c1c; }

.overdue {
  color: #b91c1c;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  padding: 0.3rem 0.75rem;
  background: #ede9fe;
  color: #4f46e5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;
}

.btn-delete {
  padding: 0.3rem 0.75rem;
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;
}

.btn-edit:hover { background: #4f46e5; color: white; }
.btn-delete:hover { background: #b91c1c; color: white; }

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #999;
  font-size: 0.95rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.modal h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
}

input, select, textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
  border-color: #4f46e5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  padding: 0.6rem 1.2rem;
  background: #f3f4f6;
  color: #555;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-save {
  padding: 0.6rem 1.2rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-cancel:hover { background: #e5e7eb; }
.btn-save:hover { background: #4338ca; }
</style>