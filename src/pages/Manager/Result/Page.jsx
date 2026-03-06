import React, {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useResultsEvent, useStopEvent } from '../Events/useEvents';
import { useParams, useNavigate } from 'react-router';
import { Card, Table, Tag, Typography, Button, Modal } from 'antd';
import Loading from '../../../components/Loading';
import ErrorPage from '../../../components/Error';
import toast from 'react-hot-toast';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Confetti from 'react-confetti';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useSocket } from '../../../ui/SocketContext';

dayjs.extend(duration);

const { Title } = Typography;

const ResultPage = () => {
  useEffect(() => {
    document.title = 'Event Result | Quick Test';
  }, []);
  const answeredRef = useRef(new Set());
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState(null);

  const navigate = useNavigate();
  const { eventId } = useParams();
  const socket = useSocket();

  const { isLoading, data, isError, error, refetch } = useResultsEvent(eventId);

  const stopEventMutation = useStopEvent();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  const event = data?.data?.event;
  const participants = data?.data?.participants ?? [];

  const sortedParticipants = useMemo(() => {
    return [...participants].sort(
      (a, b) => (b.score || 0) - (a.score || 0) || a.timeSpent - b.timeSpent
    );
  }, [participants]);

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(sortedParticipants);
  }, [sortedParticipants]);

  const onAnswer = useEffectEvent((data) => {
    if (data.eventId !== parseInt(eventId)) return;

    const key = `${data.id}-${data.questionId}`;

    if (answeredRef.current.has(key)) return;

    answeredRef.current.add(key);

    setLeaderboard((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === data.id);

      let updated;

      if (existingIndex !== -1) {
        updated = prev.map((p, index) =>
          index === existingIndex
            ? {
                ...p,
                score: (p.score || 0) + 1,
                timeSpent: data.timeSpent,
              }
            : p
        );
      } else {
        updated = [
          ...prev,
          {
            id: data.id,
            name: data.name,
            kinship: data.kinship,
            timeSpent: data.timeSpent,
            score: 1,
          },
        ];
      }

      return [...updated].sort(
        (a, b) => (b.score || 0) - (a.score || 0) || a.timeSpent - b.timeSpent
      );
    });
  });

  useEffect(() => {
    if (!event) return;

    // if event already finished (page refreshed)
    if (event.status === 'finished' && leaderboard.length > 0) {
      const topPlayer = leaderboard[0];

      if (topPlayer) {
        setWinner(topPlayer);
        setShowWinner(true);
      }
    }
  }, [event, leaderboard]);

  useEffect(() => {
    if (!socket) return;

    const handleEventFinished = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setTimeLeft('00:00:00');

      const topPlayer = leaderboard[0];

      if (topPlayer) {
        setWinner(topPlayer);
        setShowWinner(true);
      }

      toast.success('Event finished');
      refetch();
    };

    socket.on('answer', (data, callback) => {
      onAnswer(data);

      if (callback) callback({ received: true });
    });

    socket.on('event-finished', handleEventFinished);

    return () => {
      socket.off('answer');
      socket.off('event-finished', handleEventFinished);
    };
  }, [socket, leaderboard]);

  const startsAt = event?.startsAt ? dayjs(event.startsAt) : null;
  const endsAt =
    startsAt && event?.duration ? startsAt.add(event.duration, 'minute') : null;

  useEffect(() => {
    if (!startsAt || !endsAt) return;

    intervalRef.current = setInterval(() => {
      const now = dayjs();
      const diff = endsAt.diff(now);

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }

      const dur = dayjs.duration(diff);

      const hours = String(dur.hours()).padStart(2, '0');
      const minutes = String(dur.minutes()).padStart(2, '0');
      const seconds = String(dur.seconds()).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startsAt, endsAt]);

  const handleStopEvent = async () => {
    try {
      await stopEventMutation.mutateAsync(eventId);
      toast.success('Event stopped successfully');
      refetch();
      setConfirmVisible(false);
    } catch (err) {
      console.err(err);
      toast.error('Failed to stop event');
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loading />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <ErrorPage error={error} />
      </div>
    );

  const columns = [
    {
      title: '#',
      render: (_, __, index) => (
        <span className="text-gray-400 font-semibold">{index + 1}</span>
      ),
    },
    {
      title: 'Participant',
      dataIndex: 'name',
      render: (text) => <span className="text-white font-medium">{text}</span>,
    },
    {
      title: 'Kinship',
      dataIndex: 'kinship',
      render: (kinship) => <Tag color="blue">{kinship}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      render: (score) => (
        <span className="text-green-400 font-bold">{score}</span>
      ),
    },
    {
      title: 'Time Spent',
      dataIndex: 'timeSpent',
      render: (time) => <span className="text-purple-400">{time}</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="bg-gray-900 border border-gray-800">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="!text-gray-400 hover:!text-white"
          >
            Go Back
          </Button>

          <div className="flex items-center justify-between mt-4">
            <Title level={2} className="!text-white !mb-0">
              {event?.title}
            </Title>

            {event?.status === 'active' && (
              <Button
                danger
                type="primary"
                loading={stopEventMutation.isPending}
                onClick={() => setConfirmVisible(true)}
              >
                Stop Event
              </Button>
            )}
          </div>

          <div className="flex gap-10 mt-4">
            <div>
              <p className="text-gray-400">Start</p>
              <p className="text-green-400">
                {startsAt?.format('MMM D HH:mm')}
              </p>
            </div>

            <div>
              <p className="text-gray-400">End</p>
              <p className="text-red-400">{endsAt?.format('MMM D HH:mm')}</p>
            </div>

            <div>
              <p className="text-gray-400">Time Left</p>
              <p className="text-yellow-400">{timeLeft}</p>
            </div>

            <div>
              <p className="text-gray-400">Participants</p>
              <p className="text-blue-400">{leaderboard.length}</p>
            </div>
          </div>
        </Card>

        <Card
          title={<span className="text-white text-xl">Leaderboard</span>}
          className="bg-gray-900 border border-gray-800"
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={leaderboard}
            pagination={false}
          />
        </Card>
      </div>

      {/* STOP CONFIRM MODAL */}
      <Modal
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onOk={handleStopEvent}
        okText="Stop Event"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to stop this event?</p>
      </Modal>

      {/* WINNER MODAL */}
      <Modal
        open={showWinner}
        footer={null}
        closable={false}
        maskClosable={false}
        keyboard={false}
        centered
        width={700}
      >
        <div className="relative flex flex-col items-center py-16 text-center">
          {showWinner && (
            <div className="fixed inset-0 z-[2000] pointer-events-none">
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={500}
                recycle={false}
              />
            </div>
          )}

          <h1 className="text-4xl font-bold text-yellow-400 mb-6">
            🎉 Winner 🎉
          </h1>

          <div className="bg-gray-900 border border-yellow-500 rounded-xl px-10 py-8">
            <h2 className="text-3xl font-bold text-white">{winner?.name}</h2>

            <p className="text-gray-400">{winner?.kinship}</p>

            <p className="text-green-400 text-xl mt-3">
              Score: {winner?.score}
            </p>

            <p className="text-purple-400">Time: {winner?.timeSpent}</p>
          </div>

          <p className="text-gray-500 mt-8">Event finished successfully</p>
        </div>
      </Modal>
    </div>
  );
};

export default ResultPage;
