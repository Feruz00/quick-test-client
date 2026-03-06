import { Modal, Form, Input, InputNumber, Button } from 'antd';
import { useEffect } from 'react';

const EventModal = ({
  open,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialValues?.data || {
          title: '',
          duration: 30,
        }
      );
    }
  }, [open, initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
      title={
        <span className="text-lg font-semibold">
          {initialValues ? 'Update Event' : 'Create Event'}
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4"
      >
        {/* Title */}
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{ required: true, message: 'Please enter event title' }]}
        >
          <Input placeholder="Enter event title" size="large" />
        </Form.Item>

        {/* Duration */}
        <Form.Item
          label="Duration (minutes)"
          name="duration"
          rules={[{ required: true, message: 'Please enter duration' }]}
        >
          <InputNumber
            min={1}
            size="large"
            className="w-full"
            placeholder="Enter duration in minutes"
          />
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Cancel</Button>

          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EventModal;
