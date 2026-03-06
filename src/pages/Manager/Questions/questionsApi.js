import http from '../../../utils/http';

const getQuestionsApi = (eventId) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/questions/events/${eventId}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const getQuestionApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/questions/${id}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const createQuestionApi = (eventId, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post(`/questions/events/${eventId}`, data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const updateQuestionApi = (id, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .patch(`/questions/${id}`, data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteQuestionApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .delete(`/questions/${id}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const getShuffleQuestionApi = (eventId) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/questions/events/${eventId}/shuffle`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const answerQuestionApi = (questionId, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post(`/questions/answer/${questionId}`, data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

const myScoreApi = (code) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/participant/score/${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  getQuestionsApi,
  getQuestionApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
  getShuffleQuestionApi,
  answerQuestionApi,
  myScoreApi,
};
