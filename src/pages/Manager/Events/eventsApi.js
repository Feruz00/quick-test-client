import http from '../../../utils/http';

const getEventsApi = (params = {}) => {
  return new Promise((resolve, reject) => {
    http
      .get('/event', { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getEventApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/event/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getEventByJoinCodeApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/event/code/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getEventResult = (id) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/event/result/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const createEventApi = (data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post('/event', data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const updateEventApi = (id, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .patch(`/event/${id}`, data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const stopEventApi = (id, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .put(`/event/${id}`, data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const deleteEventApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .delete(`/event/${id}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const startEventApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .patch(`/event/${id}/start`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const joinEventApi = (code, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post(`/event/join/${code}`, data)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

export {
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
};
