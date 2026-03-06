import { useMutation, useQuery } from '@tanstack/react-query';
import { currentUserApi, loginApi, logoutApi } from './loginApi';
import toast from 'react-hot-toast';

const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      toast.success('User logged in successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });
};

const useLogout = () => {
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success('User logget out successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });
};

const useCurrentUser = () => {
  return useQuery({
    queryFn: currentUserApi,
    queryKey: ['current-user'],
  });
};

export { useLogin, useLogout, useCurrentUser };
