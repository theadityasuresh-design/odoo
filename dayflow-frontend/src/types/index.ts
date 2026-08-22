export interface User {
  id: string;
  employee_id: string;
  email: string;
  role: 'employee' | 'admin';
  profile?: EmployeeProfile;
}

export interface EmployeeProfile {
  full_name: string;
  phone: string;
  address: string;
  job_title: string;
  department: string;
  date_of_joining: string;
  profile_picture_url?: string;
}

export interface AttendanceRecord {
  id: string;
  user_id?: string;
  att_date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'on_leave' | 'half_day';
}

export interface LeaveRequest {
  id: string;
  user_id?: string;
  leave_type: 'sick' | 'casual' | 'annual' | 'unpaid';
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks: string;
  reviewer_comments?: string;
  created_at: string;
}

export interface PayrollRecord {
  id: string;
  user_id: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  pay_cycle: string;
  last_updated: string;
}

export interface SalarySlip {
  employee: {
    full_name: string;
    employee_id: string;
    department: string;
  };
  period: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
}

export interface EmployeeDashboard {
  profile_summary: {
    full_name: string;
    job_title: string;
    department: string;
  };
  attendance_today: {
    status: string;
    check_in: string | null;
    check_out: string | null;
  };
  pending_leaves: number;
  alerts: string[];
}

export interface AdminDashboard {
  employee_count: number;
  pending_approvals: number;
  today_attendance_summary: {
    present: number;
    absent: number;
    on_leave: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
}

export interface ApiError {
  detail: string;
  code: string;
}
