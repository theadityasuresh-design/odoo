const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_DATA: Record<string, any> = {
  '/auth/login_admin': { access_token: 'mock_access', refresh_token: 'mock_refresh', user: { id: '1', employee_id: 'A001', email: 'admin@dayflow.com', role: 'admin' } },
  '/auth/login_emp': { access_token: 'mock_access', refresh_token: 'mock_refresh', user: { id: '2', employee_id: 'E001', email: 'emp@dayflow.com', role: 'employee' } },
  '/auth/signup': { message: 'Check your email for verification link' },
  '/auth/refresh': { access_token: 'mock_new_access' },
  '/auth/logout': { message: 'Logged out successfully' },
  
  '/dashboard/employee': {
    profile_summary: { full_name: 'John Doe', job_title: 'Software Engineer', department: 'Engineering' },
    attendance_today: { status: 'present', check_in: new Date().toISOString(), check_out: null },
    pending_leaves: 2,
    alerts: ['Performance review due next week']
  },
  '/dashboard/admin': {
    employee_count: 150,
    pending_approvals: 5,
    today_attendance_summary: { present: 130, absent: 5, on_leave: 15 }
  },
  
  '/users/me': {
    id: '1', employee_id: 'A001', email: 'admin@dayflow.com', role: 'admin',
    profile: { full_name: 'Admin User', phone: '1234567890', address: '123 Main St', job_title: 'HR Manager', department: 'HR', date_of_joining: '2020-01-01', profile_picture_url: '' }
  },
  '/users': {
    items: [
      { id: '1', employee_id: 'A001', email: 'admin@dayflow.com', role: 'admin', profile: { full_name: 'Admin User', phone: '1234567890', address: '123 Main St', job_title: 'HR Manager', department: 'HR', date_of_joining: '2020-01-01' } },
      { id: '2', employee_id: 'E001', email: 'emp@dayflow.com', role: 'employee', profile: { full_name: 'John Doe', phone: '0987654321', address: '456 Side St', job_title: 'Software Engineer', department: 'Engineering', date_of_joining: '2022-03-15' } }
    ],
    total: 2,
    page: 1
  },

  '/attendance/check-in': { timestamp: new Date().toISOString() },
  '/attendance/check-out': { timestamp: new Date().toISOString() },
  '/attendance/me': {
    records: [{ id: '1', att_date: '2024-03-01', check_in: '2024-03-01T09:00:00Z', check_out: '2024-03-01T17:00:00Z', status: 'present' }]
  },
  '/attendance': {
    records: [{ id: '1', user_id: '2', att_date: '2024-03-01', check_in: '2024-03-01T09:00:00Z', check_out: '2024-03-01T17:00:00Z', status: 'present' }]
  },

  '/leave': {
    requests: [
      { id: '1', user_id: '2', leave_type: 'sick', start_date: '2024-03-10', end_date: '2024-03-12', status: 'pending', remarks: 'Fever', reviewer_comments: '', created_at: '2024-03-05T10:00:00Z' }
    ]
  },
  '/leave/me': {
    requests: [
      { id: '1', leave_type: 'sick', start_date: '2024-03-10', end_date: '2024-03-12', status: 'pending', remarks: 'Fever', created_at: '2024-03-05T10:00:00Z' }
    ]
  },

  '/payroll/me': {
    id: '1', user_id: '2', base_salary: 5000, allowances: 1000, deductions: 500, net_salary: 5500, pay_cycle: 'monthly', last_updated: '2024-02-28T10:00:00Z'
  }
};

export async function getMockResponse(endpoint: string, method: string, data?: any): Promise<any> {
  await delay(400);

  if (endpoint === '/auth/login' && method === 'POST') {
    if (data.email === 'admin@dayflow.com' && data.password === 'admin123') return MOCK_DATA['/auth/login_admin'];
    if (data.email === 'emp@dayflow.com' && data.password === 'emp123') return MOCK_DATA['/auth/login_emp'];
    throw { response: { data: { detail: 'Invalid credentials', code: 'AUTH_FAILED' } } };
  }

  if (endpoint === '/leave' && method === 'POST') {
    return { id: 'new_id', ...data, status: 'pending', created_at: new Date().toISOString() };
  }
  
  if (endpoint.startsWith('/leave/') && endpoint.endsWith('/decision') && method === 'PATCH') {
    return { id: endpoint.split('/')[2], status: data.status, reviewer_comments: data.reviewer_comments };
  }

  if (endpoint.startsWith('/payroll/reports/salary-slip/')) {
    return {
      employee: { full_name: 'John Doe', employee_id: 'E001', department: 'Engineering' },
      period: 'Feb 2024', base_salary: 5000, allowances: 1000, deductions: 500, net_salary: 5500
    };
  }

  return MOCK_DATA[endpoint] || {};
}
