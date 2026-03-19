import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Input, Segmented, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useCreateEvent,
  useDeleteEvent,
  useEvent,
  useEvents,
  useStartEvent,
  useUpdateEvent,
} from './useEvents';
import { Space, Tooltip, Popconfirm } from 'antd';

import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  QrcodeOutlined,
  LoadingOutlined,
  EyeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Loading from '../../../components/Loading';
import ErrorPage from '../../../components/Error';
import dayjs from 'dayjs';
import EventModal from '../../../ui/EventModal';
import QrCodeShowModal from '../../../ui/QrCodeModal';
import { useLogout } from '../../Login/useLogin';
const { Column } = Table;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_STATUS = 'active';

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isCreateEvent, setIsCreateEvent] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const [editingEvent, setEditingEvent] = useState(null);

  const [showQrCodeEvent, setShowQrCodeEvent] = useState(null);
  useEffect(() => {
    document.title = 'Events | Quick test';
  }, []);

  const filters = useMemo(() => {
    return {
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 10,
      status: searchParams.get('status') || '',
      title: searchParams.get('title') || '',
    };
  }, [searchParams]);

  const { data, isLoading, isFetching, isError, error, isSuccess } =
    useEvents(filters);
  const { data: event, isLoading: isEventLoading } = useEvent(editingEvent);

  const { isPending: isPendingEvent, mutate: createEvent } = useCreateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: updateEvent, isPending: isPendingUpdate } = useUpdateEvent();
  const { mutate: startEvent } = useStartEvent();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();

  const events = data?.data || [];
  const total = data?.count || 0;

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());

    const merged = {
      ...current,
      ...newParams,
    };

    if ('status' in newParams || 'title' in newParams) {
      merged.page = DEFAULT_PAGE;
      merged.limit = DEFAULT_LIMIT;
    }
    if (merged.page == DEFAULT_PAGE) delete merged.page;
    if (merged.limit == DEFAULT_LIMIT) delete merged.limit;
    if (merged.status == DEFAULT_STATUS) delete merged.status;
    if (!merged.title) delete merged.title;

    setSearchParams(merged);
  };

  const handleCreateEvent = (val) => {
    createEvent(val, {
      onSuccess: () => {
        setIsCreateEvent(false);
      },
    });
  };

  const handleDeleteEvent = (id) => {
    setDeletingEvent(id);
    deleteEvent(id, {
      onSettled: () => {
        setDeletingEvent(null);
      },
    });
  };

  const handleEdit = (id) => {
    setEditingEvent(id);
  };

  const handleUpdateEvent = (val) => {
    updateEvent(
      { id: editingEvent, data: val },
      {
        onSuccess: () => {
          setEditingEvent(null);
        },
      }
    );
  };

  const handleLogout = () => {
    logout(
      {},
      {
        onSuccess: () => {
          navigate('/login');
        },
      }
    );
  };

  return (
    <>
      <div className="h-full w-full text-white p-4 sm:p-6 lg:p-8">
        <div className="mb-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  Events
                </h1>

                <p className="text-gray-400 mt-1 text-xs sm:text-sm lg:text-base">
                  Manage your wedding & party quizzes
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto items-center">
                <Input
                  size="large"
                  placeholder="Search events..."
                  prefix={<SearchOutlined />}
                  allowClear
                  defaultValue={filters.title}
                  onChange={(e) =>
                    updateParams({
                      title: e.target.value,
                      page: 1,
                    })
                  }
                />

                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateEvent(true)}
                >
                  New Event
                </Button>
                <Popconfirm
                  title="Logout?"
                  onConfirm={handleLogout}
                  okText="Logout"
                  cancelText="Cancel"
                >
                  <Button
                    danger
                    size="large"
                    icon={<LogoutOutlined />}
                    loading={isLogoutPending}
                  >
                    Logout
                  </Button>
                </Popconfirm>
              </div>
            </div>

            <div className="mt-3 w-full flex justify-end">
              <Segmented
                size="large"
                value={filters.status}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Active', value: 'active' },
                  { label: 'Finished', value: 'finished' },
                ]}
                onChange={(value) =>
                  updateParams({
                    status: value,
                    page: 1,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className=" rounded-xl shadow-lg overflow-hidden  flex items-center justify-center">
          {isLoading && <Loading />}
          {isError && <ErrorPage error={error} />}
          {isSuccess && (
            <Table
              rowKey="id"
              dataSource={events}
              loading={isFetching}
              className="w-full "
              scroll={{
                x: 'max-content',
                y: '650px',
              }}
              size="middle"
              pagination={{
                current: filters.page,
                pageSize: filters.limit,
                total,
                onChange: (page, pageSize) =>
                  updateParams({
                    page,
                    limit: pageSize,
                  }),
              }}
            >
              <Column
                title="#"
                render={(_, __, index) => index + 1}
                width="5rem"
              />
              <Column
                title="Title"
                dataIndex="title"
                // fixed="left"
                width="15rem"
                render={(text) => (
                  <span className="text-white font-medium">{text}</span>
                )}
              />
              <Column
                title="Starts at"
                dataIndex="startsAt"
                width="10rem"
                render={(text) => (
                  <span className="text-white font-medium">
                    {text
                      ? dayjs(text).format('DD.MM.YYYY HH:mm')
                      : 'Not started'}
                  </span>
                )}
              />
              <Column
                title="Duration(minutes)"
                dataIndex="duration"
                width="10rem"
                render={(text) => (
                  <span className="text-white font-medium">{text}</span>
                )}
              />
              <Column
                title="Status"
                dataIndex="status"
                width="10rem"
                align="center"
                render={(status) => {
                  const map = {
                    finished: { color: 'red', label: 'FINISHED' },
                    active: { color: 'green', label: 'ACTIVE' },
                    upcoming: { color: 'blue', label: 'UPCOMING' },
                  };

                  const config = map[status] || {
                    color: 'default',
                    label: status,
                  };

                  return <Tag color={config.color}>{config.label}</Tag>;
                }}
              />
              <Column
                key="actions"
                title="Actions"
                width="12rem"
                // fixed="right"
                align="center"
                render={(_, record) => {
                  const { status } = record;

                  return (
                    <Space size="middle">
                      {/* Edit */}

                      <EyeOutlined
                        className="text-blue-500 cursor-pointer hover:scale-110 transition"
                        onClick={() => navigate(`/manager/events/${record.id}`)}
                      />
                      <Tooltip title="Edit">
                        {isEventLoading && editingEvent === record.id ? (
                          <LoadingOutlined />
                        ) : (
                          <EditOutlined
                            className="text-blue-500 cursor-pointer hover:scale-110 transition"
                            onClick={() => handleEdit(record.id)}
                          />
                        )}
                      </Tooltip>

                      {/* Delete */}
                      <Popconfirm
                        title="Delete this event?"
                        onConfirm={() => handleDeleteEvent(record.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Tooltip title="Delete">
                          {deletingEvent === record.id ? (
                            <LoadingOutlined />
                          ) : (
                            <DeleteOutlined className="text-red-500 cursor-pointer hover:scale-110 transition" />
                          )}
                        </Tooltip>
                      </Popconfirm>

                      {status === 'upcoming' && (
                        <Tooltip title="Start Event">
                          <PlayCircleOutlined
                            className="text-green-500 cursor-pointer hover:scale-110 transition"
                            onClick={() => startEvent(record.id)}
                          />
                        </Tooltip>
                      )}

                      {status !== 'upcoming' && (
                        <Tooltip title="View Results">
                          <TrophyOutlined
                            className="text-yellow-500 cursor-pointer hover:scale-110 transition"
                            onClick={() =>
                              navigate(`/manager/events/${record.id}/results`)
                            }
                          />
                        </Tooltip>
                      )}

                      <Tooltip title="Show QR Code" className="">
                        <QrcodeOutlined
                          className=" cursor-pointer hover:scale-110 transition"
                          onClick={() => setShowQrCodeEvent(record.join)}
                        />
                      </Tooltip>
                    </Space>
                  );
                }}
              />
            </Table>
          )}
        </div>
      </div>

      <EventModal
        open={isCreateEvent}
        onCancel={() => setIsCreateEvent(false)}
        onSubmit={handleCreateEvent}
        loading={isPendingEvent}
      />
      <EventModal
        open={editingEvent !== null}
        onCancel={() => setEditingEvent(null)}
        onSubmit={handleUpdateEvent}
        loading={isPendingUpdate}
        initialValues={event}
      />
      <QrCodeShowModal
        open={showQrCodeEvent !== null}
        joinCode={showQrCodeEvent}
        onCancel={() => setShowQrCodeEvent(null)}
      />
    </>
  );
};

export default EventsPage;
