import { useAuth } from 'react-oidc-context';
import { getUserGroups, hasGroup, isAdmin, isUser, getUserRole } from '@/lib/auth-utils';

export function useUserRole() {
  const auth = useAuth();
  const user = auth.user || null;
  
  return {
    groups: getUserGroups(user),
    hasGroup: (group: string) => hasGroup(user, group),
    isAdmin: isAdmin(user),
    isUser: isUser(user),
    role: getUserRole(user),
    user,
  };
} 