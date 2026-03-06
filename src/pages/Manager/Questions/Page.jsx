import { useState } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useQuestions,
  useCreateQuestion,
  useDeleteQuestion,
  useUpdateQuestion,
  useQuestion,
} from './useQuestions';

import QuestionModal from '../../../ui/QuestionModal';
import Loading from '../../../components/Loading';
import ErrorPage from '../../../components/Error';

const { Column } = Table;

const QuestionsPage = () => {
  const { eventId } = useParams();

  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const { data, isLoading, isError, error, isSuccess } = useQuestions(eventId);

  const { mutate: createQuestion, isPending: creating } =
    useCreateQuestion(eventId);

  const { mutate: deleteQuestion } = useDeleteQuestion(eventId);
  const { mutate: updateQuestion, isPending: updating } = useUpdateQuestion();
  const { data: questionData, isLoading: isQuestionLoading } =
    useQuestion(editingQuestion);

  const questions = data?.data || [];

  const handleCreate = (values) => {
    createQuestion(values, {
      onSuccess: () => setIsCreate(false),
    });
  };

  const handleUpdate = (values) => {
    updateQuestion(
      { id: editingQuestion, data: values },
      {
        onSuccess: () => setEditingQuestion(null),
      }
    );
  };

  return (
    <>
      <div className="h-full text-white p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex flex-row items-center gap-4">
                <LeftCircleOutlined
                  className="text-2xl sm:text-3xl text-blue-500 cursor-pointer hover:scale-110 transition -mt-3"
                  onClick={() => navigate(-1)}
                />
                {isLoading ? (
                  <LoadingOutlined className="text-2xl sm:text-3xl text-blue-500 animate-spin" />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-semibold">
                    {data.event?.title || 'Questions'}
                  </h1>
                )}
              </div>
              {/* <h1 className="text-2xl sm:text-3xl font-semibold">Questions</h1> */}
              <p className="text-gray-400 mt-1">
                Manage quiz questions for this event
              </p>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsCreate(true)}
            >
              New Question
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {isLoading && <Loading />}
          {isError && <ErrorPage error={error} />}

          {isSuccess && (
            <Table
              rowKey="id"
              dataSource={questions}
              pagination={false}
              scroll={{ x: 'max-content' }}
              className="w-full"
            >
              <Column
                title="#"
                render={(_, __, index) => index + 1}
                width="5rem"
              />

              <Column
                title="Question"
                dataIndex="text"
                render={(text) => (
                  <span className="text-white font-medium">{text}</span>
                )}
              />

              {/* <Column
                title="Options"
                render={(_, record) => (
                  <div className="flex flex-wrap gap-2">
                    {record.answerOptions?.map((opt) => (
                      <Tag
                        key={opt.id}
                        color={opt.isCorrect ? 'green' : 'default'}
                        icon={opt.isCorrect ? <CheckCircleOutlined /> : null}
                      >
                        {opt.text}
                      </Tag>
                    ))}
                  </div>
                )}
              /> */}

              <Column
                title="Actions"
                align="center"
                render={(_, record) => (
                  <Space>
                    <Tooltip title="Edit">
                      {isQuestionLoading && editingQuestion === record.id ? (
                        <LoadingOutlined />
                      ) : (
                        <EditOutlined
                          className="text-blue-400 cursor-pointer hover:scale-110 transition"
                          onClick={() => setEditingQuestion(record.id)}
                        />
                      )}
                    </Tooltip>

                    <Popconfirm
                      title="Delete this question?"
                      onConfirm={() => deleteQuestion(record.id)}
                    >
                      <Tooltip title="Delete">
                        <DeleteOutlined className="text-red-500 cursor-pointer hover:scale-110 transition" />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          )}
        </div>
      </div>

      <QuestionModal
        open={isCreate}
        onCancel={() => setIsCreate(false)}
        onSubmit={handleCreate}
        loading={creating}
      />

      <QuestionModal
        open={!!editingQuestion}
        onCancel={() => setEditingQuestion(null)}
        onSubmit={handleUpdate}
        loading={updating}
        initialValues={questionData}
      />
    </>
  );
};

export default QuestionsPage;
