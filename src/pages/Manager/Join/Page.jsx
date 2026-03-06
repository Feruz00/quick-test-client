import { useEffect } from 'react';
import { Form, Input, Button, Card } from 'antd';
import ErrorPage from '../../../components/Error';
import Loading from '../../../components/Loading';
import { useNavigate, useParams } from 'react-router';
import { useEventByJoinCode, useJoinEvent } from '../Events/useEvents';

const JoinPage = () => {
  useEffect(() => {
    document.title = 'Join Event | Quick Test';
  }, []);

  const navigate = useNavigate();
  const { joinCode } = useParams();
  const { isSuccess, isLoading, isError, error } = useEventByJoinCode(joinCode);

  const { mutate: joinEvent, isPending: isJoining } = useJoinEvent();

  const [form] = Form.useForm();
  const onFinish = (values) => {
    joinEvent(
      { code: joinCode, data: values },
      {
        onSuccess: () => {
          console.log('Joined event successfully', joinCode);
          navigate(`/competition/${joinCode}`);
        },
      }
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      {isLoading && <Loading />}
      {isError && <ErrorPage error={error} />}
      {isSuccess && (
        <Card
          className="w-full max-w-md bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl"
          bodyStyle={{ padding: '28px' }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Start to competation
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-2"
          >
            <Form.Item
              label={<span className="text-gray-300">Name</span>}
              name="name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input
                placeholder="Enter name (e.g. John)"
                className="bg-gray-800! text-white! border-gray-700! hover:border-blue-500! focus:border-blue-500!"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-300">kinship</span>}
              name="kinship"
              rules={[{ required: true, message: 'Please enter kinship' }]}
            >
              <Input
                placeholder="Brother / Best Friend"
                className="bg-gray-800! text-white! border-gray-700! hover:border-blue-500! focus:border-blue-500!"
              />
            </Form.Item>

            <Form.Item className="pt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-11! rounded-lg! bg-blue-600! hover:bg-blue-500!"
                disabled={isJoining}
                loading={isJoining}
              >
                Join
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default JoinPage;

// http://localhost:5173/join/3dbce6f4-ed83-49ad-80c7-8cc9d8b3cf49
