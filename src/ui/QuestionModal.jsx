import { Modal, Form, Input, Button, Space, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const QuestionModal = ({
  open,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues?.data) {
        form.setFieldsValue({
          text: initialValues?.data.text,
          options: initialValues?.data.answers,
          correct:
            initialValues?.data.answers.findIndex((opt) => opt.isCorrect) || 0,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values) => {
    const formatted = {
      text: values.text,
      options: values.options.map((opt, index) => ({
        text: opt.text,
        isCorrect: values.correct === index,
      })),
    };

    onSubmit(formatted);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
      className="dark-modal"
      title={
        <span className="text-lg font-semibold text-white">
          {initialValues ? 'Update Question' : 'Create Question'}
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4"
      >
        {/* Question */}
        <Form.Item
          label={<span className="text-gray-300">Question</span>}
          name="text"
          rules={[{ required: true, message: 'Enter question' }]}
        >
          <Input
            size="large"
            placeholder="Enter question text"
            className="bg-gray-700 text-white"
          />
        </Form.Item>

        {/* Correct answer selector */}
        <Form.Item
          name="correct"
          rules={[{ required: true, message: 'Select correct answer' }]}
          validateTrigger="onSubmit"
          className="mb-2"
        >
          <Radio.Group className="w-full">
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-2">
                  <label className="text-gray-300 text-base">
                    Answer Options
                  </label>

                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="w-full flex items-center gap-2">
                      <Form.Item
                        {...restField}
                        name={[name, 'text']}
                        rules={[{ required: true, message: 'Enter option' }]}
                        className="flex-1 mb-0"
                      >
                        <Input
                          placeholder={`Option ${index + 1}`}
                          size="large"
                          className="bg-gray-700 text-white"
                        />
                      </Form.Item>

                      <div className="flex items-center gap-2 -mt-4">
                        <Radio value={index} />

                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="text-red-500 cursor-pointer text-lg"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Option
                  </Button>
                </div>
              )}
            </Form.List>
          </Radio.Group>
        </Form.Item>

        <div className="flex justify-end gap-3 ">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default QuestionModal;
