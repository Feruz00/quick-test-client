import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEventsApi,
  getEventApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
  startEventApi,
  joinEventApi,
  getEventByJoinCodeApi,
  getEventResult,
  stopEventApi,
} from './eventsApi';
import toast from 'react-hot-toast';
import useAuthStore from '../../../store/authStore';

export const useEvents = (params) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEventsApi(params),
    keepPreviousData: true,
  });
};

export const useResultsEvent = (eventId) => {
  return useQuery({
    queryKey: ['results', eventId],
    queryFn: () => getEventResult(eventId),
    keepPreviousData: true,
    enabled: !!eventId,
  });
};

export const useEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventApi(id),
    enabled: !!id,
  });
};

export const useEventByJoinCode = (code) => {
  return useQuery({
    queryKey: ['event-by-join-code', code],
    queryFn: () => getEventByJoinCodeApi(code),
    enabled: !!code,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateEventApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useStopEvent = () => {
  return useMutation({
    mutationFn: (id) => stopEventApi(id),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useStartEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => startEventApi(id),
    onSuccess: () => {
      toast.success('Event started successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};

export const useJoinEvent = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: ({ code, data }) => joinEventApi(code, data),
    onSuccess: (data) => {
      const { user } = data;
      // console.log('User data after joining event:', user);
      setUser(user);
      toast.success('Participant joined successfully!');
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};
