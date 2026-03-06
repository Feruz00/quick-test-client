import dayjs from 'dayjs';
import { Modal, Form, Input, Select, Switch, DatePicker } from 'antd';
import Loading from '../../components/Loading';
import ErrorPage from '../../components/Error';
import { useMemo, useEffect } from 'react';

const UserModal = ({
  open,
  onCancel,
  onSubmit,
  loading,
  initialValues,
  isLoading,
  isError,
  error,
  isSuccess,
}) => {
  const [form] = Form.useForm();

  const disabledDate = (current) => {
    return current && current <= dayjs().endOf('day');
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values) => {
    onSubmit(values, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  const initialValue = useMemo(() => {
    if (!initialValues) return {};

    return {
      ...initialValues,
      maxDate: initialValues.maxDate ? dayjs(initialValues.maxDate) : null,
    };
  }, [initialValues]);

  useEffect(() => {
    if (open && initialValue) {
      form.setFieldsValue(initialValue);
    }
  }, [initialValue, open, form]);

  return (
    <Modal
      open={open}
      title="User"
      okText="Save"
      confirmLoading={loading}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      {isLoading && <Loading />}
      {isError && <ErrorPage error={error} />}

      {isSuccess && (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password">
            <Input.Password />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
              ]}
            />
          </Form.Item>

          <Form.Item name="maxDate" label="Max date for create event">
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default UserModal;
