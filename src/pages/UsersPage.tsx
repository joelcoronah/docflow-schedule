import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserForm } from '@/components/users/UserForm';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { User, CreateUserDto, UpdateUserDto } from '@/services/users.service';
import { useTranslation } from 'react-i18next';
import { UserPlus, Pencil, Trash2, Mail, Phone, Briefcase, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Access Denied - Admin Only
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleCreate = (data: CreateUserDto | UpdateUserDto) => {
    createUser.mutate(data as CreateUserDto, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleUpdate = (data: CreateUserDto | UpdateUserDto) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, data: data as UpdateUserDto },
        {
          onSuccess: () => {
            setEditingUser(null);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deletingUser) {
      deleteUser.mutate(deletingUser.id, {
        onSuccess: () => {
          setDeletingUser(null);
        },
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('users.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t('users.subtitle')}
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t('users.addUser')}
          </Button>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {user.name}
                        {user.role === 'admin' && (
                          <Shield className="h-4 w-4 text-blue-600" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {user.isActive ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {t('users.active')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <XCircle className="mr-1 h-3 w-3" />
                            {t('users.inactive')}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {t(`users.roles.${user.role}`)}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingUser(user)}
                        disabled={user.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.specialization && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4" />
                      <span>{user.specialization}</span>
                    </div>
                  )}
                  <div className="pt-2 text-xs text-gray-500">
                    {t('users.provider')}: {user.provider}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">{t('users.noUsers')}</p>
            </CardContent>
          </Card>
        )}

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('users.addUser')}</DialogTitle>
              <DialogDescription>
                {t('users.addUserDescription')}
              </DialogDescription>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createUser.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('users.editUser')}</DialogTitle>
              <DialogDescription>
                {t('users.editUserDescription')}
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <UserForm
                user={editingUser}
                onSubmit={handleUpdate}
                onCancel={() => setEditingUser(null)}
                isLoading={updateUser.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation */}
        <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('users.deleteUser')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('users.deleteUserConfirmation', { name: deletingUser?.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
