import { create } from 'zustand';

interface AdminState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({

  
  token: sessionStorage.getItem('admin_token'),
  username: sessionStorage.getItem('admin_email'),
  isAuthenticated: !!sessionStorage.getItem('admin_token'),



  login: (token, username) => {
    console.log(username,"nameee");
    
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('admin_email', username);
    set({ token, username, isAuthenticated: true });
  },

  logout: () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_email');
    set({ token: null, username: null, isAuthenticated: false });
  },
}));
