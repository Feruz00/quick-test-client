import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Tag,
  Input,
  Button,
  Segmented,
  Space,
  Tooltip,
  Popconfirm,
} from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useCreateUser,
  useDeleteUser,
  useGetUser,
  useGetUsers,
  useUpdateUser,
} from './useAdmin';

import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';
import Loading from '../../components/Loading';
import ErrorPage from '../../components/Error';
import UserModal from './UserModal';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../Login/useLogin';

const { Column } = Table;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminPage = () => {
  const navigate = useNavigate();
  const userData = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isCreateUser, setIsCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    document.title = 'Users | Quick test';
  }, []);

  const filters = useMemo(() => {
    return {
      page: parseInt(searchParams.get('page')) || DEFAULT_PAGE,
      limit: parseInt(searchParams.get('limit')) || DEFAULT_LIMIT,
      username: searchParams.get('username') || '',
      isActive: searchParams.get('isActive') || '',
    };
  }, [searchParams]);

  const { data, isLoading, isFetching, isError, error, isSuccess } =
    useGetUsers(filters);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    isSuccess: isUserSuccess,
  } = useGetUser(editingUser);

  const { mutate: createUser, isPending: isPendingCreate } = useCreateUser();
  const { mutate: updateUser, isPending: isPendingUpdate } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const users = data?.data || [];
  const total = data?.count || 0;

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());

    const merged = {
      ...current,
      ...newParams,
    };

    if ('username' in newParams || 'isActive' in newParams) {
      merged.page = DEFAULT_PAGE;
    }

    if (merged.page == DEFAULT_PAGE) delete merged.page;
    if (merged.limit == DEFAULT_LIMIT) delete merged.limit;
    if (!merged.username) delete merged.username;
    if (!merged.isActive) delete merged.isActive;

    setSearchParams(merged);
  };

  const handleCreateUser = (values) => {
    createUser(values, {
      onSuccess: () => {
        setIsCreateUser(false);
      },
    });
  };

  const handleUpdateUser = (values) => {
    updateUser(
      { id: editingUser, data: values },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      }
    );
  };

  const handleDeleteUser = (id) => {
    setDeletingUser(id);

    deleteUser(id, {
      onSettled: () => {
        setDeletingUser(null);
      },
    });
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
        {/* HEADER */}
        <div className="mb-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-semibold">Users</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Manage platform users
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto items-center">
                <Input
                  size="large"
                  placeholder="Search ..."
                  prefix={<SearchOutlined />}
                  allowClear
                  defaultValue={filters.username}
                  onChange={(e) =>
                    updateParams({
                      username: e.target.value,
                    })
                  }
                />

                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateUser(true)}
                >
                  New User
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

            <div className="mt-3 flex justify-end">
              <Segmented
                size="large"
                value={filters.isActive}
                options={[
                  { label: 'All', value: '' },
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
                onChange={(value) =>
                  updateParams({
                    isActive: value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
          {isLoading && <Loading />}
          {isError && <ErrorPage error={error} />}

          {isSuccess && (
            <Table
              rowKey="id"
              dataSource={users}
              loading={isFetching}
              className="w-full"
              scroll={{ x: 'max-content', y: '650px' }}
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
                width="70px"
                render={(_, __, index) => index + 1}
              />

              <Column
                title="Full name"
                dataIndex="fullName"
                render={(text) => (
                  <span className="text-white font-medium">{text}</span>
                )}
              />

              <Column
                title="Username"
                dataIndex="username"
                render={(text) => <span className="text-gray-300">{text}</span>}
              />

              <Column
                title="Role"
                dataIndex="role"
                render={(role) => {
                  const map = {
                    admin: 'red',
                    manager: 'blue',
                    user: 'green',
                  };

                  return <Tag color={map[role] || 'default'}>{role}</Tag>;
                }}
              />

              <Column
                title="Status"
                dataIndex="isActive"
                align="center"
                render={(active) =>
                  active ? (
                    <Tag color="green">ACTIVE</Tag>
                  ) : (
                    <Tag color="red">INACTIVE</Tag>
                  )
                }
              />

              <Column
                title="Last event day"
                dataIndex="maxDate"
                render={(date) => dayjs(date).format('DD.MM.YYYY')}
              />
              <Column
                title="Event count"
                dataIndex="eventsCount"
                render={(text) => (
                  <span className="text-white font-medium">{text}</span>
                )}
              />
              <Column
                title="Actions"
                width="150px"
                align="center"
                render={(_, record) => (
                  <Space>
                    {record.id !== userData?.data?.id && (
                      <>
                        <Tooltip title="Edit">
                          {isUserLoading && editingUser === record.id ? (
                            <LoadingOutlined />
                          ) : (
                            <EditOutlined
                              className="text-blue-500 cursor-pointer hover:scale-110"
                              onClick={() => setEditingUser(record.id)}
                            />
                          )}
                        </Tooltip>
                        <Popconfirm
                          title="Delete this user?"
                          onConfirm={() => handleDeleteUser(record.id)}
                        >
                          <Tooltip title="Delete">
                            {deletingUser === record.id ? (
                              <LoadingOutlined />
                            ) : (
                              <DeleteOutlined className="text-red-500 cursor-pointer hover:scale-110" />
                            )}
                          </Tooltip>
                        </Popconfirm>
                      </>
                    )}
                  </Space>
                )}
              />
            </Table>
          )}
        </div>
      </div>

      {/* CREATE USER */}
      <UserModal
        open={isCreateUser}
        onCancel={() => setIsCreateUser(false)}
        onSubmit={handleCreateUser}
        loading={isPendingCreate}
        isSuccess={true}
      />

      <UserModal
        open={editingUser !== null}
        onCancel={() => setEditingUser(null)}
        onSubmit={handleUpdateUser}
        loading={isPendingUpdate}
        initialValues={isUserSuccess ? user.data : {}}
        isLoading={isUserLoading}
        isError={isUserError}
        error={userError}
        isSuccess={isUserSuccess}
      />
    </>
  );
};

export default AdminPage;
