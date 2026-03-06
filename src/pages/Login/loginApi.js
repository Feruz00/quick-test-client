import http from '../../utils/http';

const loginApi = (data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post('/auth/login', data)
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

const logoutApi = (data = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post('/auth/logout', data)
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

const currentUserApi = () => {
  return new Promise((resolve, reject) => {
    http
      .get('/auth')
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

export { loginApi, logoutApi, currentUserApi };
