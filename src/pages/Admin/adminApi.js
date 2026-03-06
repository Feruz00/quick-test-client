import http from '../../utils/http';

const createUserApi = (data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post('/users/', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const getUserApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/users/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getUsersApi = (params = {}) => {
  return new Promise((resolve, reject) => {
    http
      .get(`/users/`, {
        params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateUserApi = (id, data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .patch(`/users/${id}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

const deleteUserApi = (id) => {
  return new Promise((resolve, reject) => {
    http
      .delete(`/users/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';

        reject(message);
      });
  });
};

export { createUserApi, deleteUserApi, getUserApi, getUsersApi, updateUserApi };
