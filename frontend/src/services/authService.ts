import { User, UserRole } from '../types/auth';

const STORAGE_KEY_USER = 'medikiosk_user';
const STORAGE_KEY_TOKEN = 'medikiosk_token';

export const authService = {
  login: async (emailOrPhone: string, role: UserRole): Promise<{ user: User; token: string }> => {
    // Isolated clean auth implementation with session storage
    await new Promise((resolve) => setTimeout(resolve, 600));

    const isPatient = role === 'patient';
    const mockUser: User = {
      id: isPatient ? 'pat_102938' : 'doc_493821',
      name: isPatient ? 'Rahul Kumar' : 'Dr. Ananya Sharma',
      email: emailOrPhone.includes('@') ? emailOrPhone : (isPatient ? 'rahul.kumar@example.com' : 'dr.sharma@medikiosk.health'),
      role,
      phone: isPatient ? '+91 98765 43210' : '+91 91234 56789',
      dob: isPatient ? '1974-05-14' : '1982-11-20',
      sex: 'male',
      abhaId: isPatient ? 'abha_9nd8_****_12k3' : undefined,
      isVerified: true,
    };

    const token = `jwt_session_${Date.now()}_${role}`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return { user: mockUser, token };
  },

  register: async (data: Partial<User>, role: UserRole): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: User = {
      id: `${role.substring(0, 3)}_${Date.now().toString().slice(-6)}`,
      name: data.name || 'New User',
      email: data.email || 'user@example.com',
      role,
      phone: data.phone,
      dob: data.dob,
      sex: data.sex || 'male',
      abhaId: role === 'patient' ? `abha_${Math.random().toString(36).substring(2, 6)}_****_${Math.random().toString(36).substring(2, 6)}` : undefined,
      isVerified: true,
    };

    const token = `jwt_session_${Date.now()}_${role}`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return { user: newUser, token };
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },
};
