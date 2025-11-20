import { projectId, publicAnonKey } from './supabase/info.tsx';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-936dcc19`;

export class APIClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token || publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Faculty Profile
  async getProfile() {
    return this.request('/faculty/profile');
  }

  async updateProfile(profile: any) {
    return this.request('/faculty/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Publications
  async getPublications() {
    return this.request('/publications');
  }

  async createPublication(publication: any) {
    return this.request('/publications', {
      method: 'POST',
      body: JSON.stringify(publication),
    });
  }

  async deletePublication(id: string) {
    return this.request(`/publications/${id}`, {
      method: 'DELETE',
    });
  }

  // Skills
  async getSkills() {
    return this.request('/skills');
  }

  async updateSkills(skills: any[]) {
    return this.request('/skills', {
      method: 'PUT',
      body: JSON.stringify(skills),
    });
  }

  // FDPs
  async getFDPs() {
    return this.request('/fdps');
  }

  async enrollInFDP(fdp: any) {
    return this.request('/fdps/enroll', {
      method: 'POST',
      body: JSON.stringify(fdp),
    });
  }

  async completeFDP(id: string) {
    return this.request(`/fdps/${id}/complete`, {
      method: 'POST',
    });
  }

  // Career
  async getMilestones() {
    return this.request('/career/milestones');
  }

  async createMilestone(milestone: any) {
    return this.request('/career/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone),
    });
  }

  // Analytics
  async getDashboardAnalytics() {
    return this.request('/analytics/dashboard');
  }

  // Demo data
  async seedDemoData() {
    return this.request('/seed-demo-data', {
      method: 'POST',
    });
  }

  // Faculty Management (Admin)
  async listFaculties() {
    return this.request('/faculty/list');
  }

  async createFaculty(faculty: any) {
    return this.request('/faculty/create', {
      method: 'POST',
      body: JSON.stringify(faculty),
    });
  }

  async updateFaculty(faculty: any) {
    return this.request(`/faculty/update/${faculty.id}`, {
      method: 'PUT',
      body: JSON.stringify(faculty),
    });
  }

  async deleteFaculty(id: string) {
    return this.request(`/faculty/delete/${id}`, {
      method: 'DELETE',
    });
  }

  async resendCredentials(facultyId: string) {
    return this.request('/faculty/resend-credentials', {
      method: 'POST',
      body: JSON.stringify({ facultyId }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new APIClient();

// Helper function for direct API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}