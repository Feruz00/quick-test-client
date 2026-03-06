import { LoadingOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const Loading = () => {
  return (
    <Card className="w-full max-w-md bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl flex items-center justify-center ">
      <LoadingOutlined className="text-3xl py-15" />
    </Card>
  );
};

export default Loading;
