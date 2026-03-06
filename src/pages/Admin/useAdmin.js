import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createUserApi,
  deleteUserApi,
  getUserApi,
  getUsersApi,
  updateUserApi,
} from './adminApi';

const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created in successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated in successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted in successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });
};

const useGetUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserApi(id),
    enabled: !!id,
  });
};

const useGetUsers = (params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsersApi(params),
  });
};

export { useCreateUser, useDeleteUser, useGetUser, useGetUsers, useUpdateUser };
