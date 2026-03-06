import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuestionsApi,
  getQuestionApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
  getShuffleQuestionApi,
  answerQuestionApi,
  myScoreApi,
} from './questionsApi';
import toast from 'react-hot-toast';

/*
|--------------------------------------------------------------------------
| QUERIES
|--------------------------------------------------------------------------
*/

export const useQuestions = (eventId) => {
  return useQuery({
    queryKey: ['questions', eventId],
    queryFn: () => getQuestionsApi(eventId),
    enabled: !!eventId,
  });
};

export const useQuestion = (id) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestionApi(id),
    enabled: !!id,
  });
};

export const useMyScore = (enabled = false, joinCode) => {
  return useQuery({
    queryKey: ['score', joinCode],
    queryFn: () => myScoreApi(joinCode),
    enabled,
  });
};

export const useShuffleQuestion = (eventId) => {
  return useQuery({
    queryKey: ['shuffle-question', eventId],
    queryFn: () => getShuffleQuestionApi(eventId),
    enabled: !!eventId,
  });
};

/*
|--------------------------------------------------------------------------
| MUTATIONS
|--------------------------------------------------------------------------
*/

export const useAnswerQuestion = () => {
  return useMutation({
    mutationFn: ({ questionId, data }) => answerQuestionApi(questionId, data),
    onSuccess: () => {
      toast.success('Answer submitted successfully!');
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};

export const useCreateQuestion = (eventId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createQuestionApi(eventId, data),
    onSuccess: () => {
      toast.success('Question created successfully!');
      queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateQuestionApi(id, data),
    onSuccess: (_, variables) => {
      toast.success('Question updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.id] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};

export const useDeleteQuestion = (eventId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      toast.success('Question deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });
};
