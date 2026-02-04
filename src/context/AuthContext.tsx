import React, { createContext, useState, ReactNode, useContext } from 'react';

export type SectionId = 'statistics' | 'ZAKUP' | 'options' | 'map' | 'help';
export type AccessLevel = 'view' | 'edit' | 'hidden';

export interface UserPermission {
  section: SectionId;
  level: AccessLevel;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'АДМ' | 'user';
  permissions: UserPermission[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string, role: 'АДМ' | 'user', permissions: UserPermission[]) => void;
  updateUserPassword: (userId: string, password: string) => void;
  updateUserPermissions: (userId: string, permissions: UserPermission[]) => void;
  deleteUser: (userId: string) => void;
  canAccess: (section: SectionId, level: AccessLevel) => boolean;
  isSectionVisible: (section: SectionId) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdminUser: User = {
  id: 'admin-1',
  username: 'АДМ',
  password: '123',
  role: 'АДМ',
  permissions: [
    { section: 'statistics', level: 'edit' },
    { section: 'ZAKUP', level: 'edit' },
    { section: 'options', level: 'edit' },
    { section: 'map', level: 'edit' },
    { section: 'help', level: 'edit' },
  ],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([defaultAdminUser]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const addUser = (username: string, password: string, role: 'АДМ' | 'user', permissions: UserPermission[]) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      role,
      permissions,
    };
    setUsers([...users, newUser]);
  };

  const updateUserPassword = (userId: string, password: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, password } : u
    ));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, password });
    }
  };

  const updateUserPermissions = (userId: string, permissions: UserPermission[]) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, permissions } : u
    ));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, permissions });
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === 'admin-1') return;
    setUsers(users.filter(u => u.id !== userId));
  };

  const canAccess = (section: SectionId, level: AccessLevel): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'АДМ') return true;
    
    const permission = currentUser.permissions.find(p => p.section === section);
    if (!permission || permission.level === 'hidden') return false;
    
    if (level === 'edit') return permission.level === 'edit';
    return true;
  };

  const isSectionVisible = (section: SectionId): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'АДМ') return true;
    
    const permission = currentUser.permissions.find(p => p.section === section);
    return permission ? permission.level !== 'hidden' : false;
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      users,
      login,
      logout,
      addUser,
      updateUserPermissions,
      updateUserPassword,
      deleteUser,
      canAccess,
      isSectionVisible,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
