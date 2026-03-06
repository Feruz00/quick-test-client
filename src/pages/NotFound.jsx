import React from 'react';
import { useNavigate } from 'react-router';
import {
  HomeOutlined,
  ArrowLeftOutlined,
  FrownOutlined,
} from '@ant-design/icons';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-6">
      <div className="text-center max-w-xl w-full">
        {/* Big 404 */}
        <h1 className="text-[120px] md:text-[160px] font-extrabold bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          404
        </h1>

        {/* Icon */}
        <div className="flex justify-center mb-6 text-5xl text-gray-500">
          <FrownOutlined />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8 text-sm md:text-base">
          The page you’re looking for doesn’t exist or has been moved. Let’s get
          you back to something meaningful.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition text-white border border-gray-700"
          >
            <ArrowLeftOutlined />
            Go Back
          </button>

          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white shadow-lg shadow-blue-600/20"
          >
            <HomeOutlined />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
