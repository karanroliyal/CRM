export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  roleName: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  permissionName: string;
} 