import { useMemo } from 'react';
import { Button, Card } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ErrorPage = ({ error }) => {
  const refreshPage = () => {
    window.location.reload();
  };

  const statusCode = useMemo(() => {
    return error?.response?.status || error?.status || 500;
  }, [error]);

  const title = useMemo(() => {
    switch (statusCode) {
      case 404:
        return 'Page Not Found';
      case 401:
        return 'Unauthorized Access';
      case 403:
        return 'Access Denied';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Something went wrong';
    }
  }, [statusCode]);

  const message = useMemo(() => {
    return (
      error?.response?.data?.message ||
      error?.message ||
      'Please try again later.'
    );
  }, [error]);

  return (
    <Card className="w-full max-w-xl bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl flex items-center justify-center ">
      <div className=" text-white rounded-2xl  w-full max-w-5xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-stretch">
          {/* LEFT SIDE - STATUS CODE */}
          <div className="flex items-center justify-center  w-full md:w-1/3 p-8">
            <div className="text-center">
              <WarningOutlined className="text-5xl text-red-500 mb-4" />
              <h1 className="text-6xl font-extrabold text-red-500 tracking-wider">
                {statusCode}
              </h1>
            </div>
          </div>

          {/* RIGHT SIDE - CONTENT */}
          <div className="flex-1 p-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">{title}</h2>

            <p className="text-gray-400 mb-6 text-sm md:text-base">{message}</p>

            <div className="flex flex-col sm:flex-row gap-4 sm:justify-start justify-center">
              <Button type="primary" size="large" onClick={refreshPage}>
                Refresh Page
              </Button>

              <Link
                to="/"
                className="px-6 py-2 rounded-lg border border-gray-600  text-gray-300 hover:bg-gray-700 transition text-center"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ErrorPage;
