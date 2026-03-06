import { useEffect, useState } from 'react';
import {
  useAnswerQuestion,
  useMyScore,
  useShuffleQuestion,
} from '../Manager/Questions/useQuestions';
import { useParams } from 'react-router';
import { Button } from 'antd';
import {
  LoadingOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import Loading from '../../components/Loading';
import ErrorPage from '../../components/Error';
import { useEventByJoinCode } from '../Manager/Events/useEvents';
import { useSocket } from '../../ui/SocketContext';

const CompetationPage = () => {
  const socket = useSocket();
  useEffect(() => {
    document.title = 'Competition | Quick Test';
  }, []);

  const { joinCode } = useParams();

  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeFinished, setIsTimeFinished] = useState(false);

  const {
    data: question,
    isError,
    isFetching,
    error,
    refetch,
  } = useShuffleQuestion(joinCode);

  const {
    data: myScore,
    isLoading: isMyScoreLoading,
    isSuccess,
  } = useMyScore(showScore, joinCode);

  useEffect(() => {
    if (!socket) return;

    const handleEventFinished = () => {
      setIsTimeFinished((prev) => {
        if (prev) return prev;
        setShowScore(true);
        return true;
      });
    };

    socket.on('event-finished', handleEventFinished);

    return () => socket.off('event-finished', handleEventFinished);
  }, [socket]);

  const { data: eventData } = useEventByJoinCode(joinCode);

  const { mutate: answerQuestion, isPending: isAnswering } =
    useAnswerQuestion();

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!eventData?.data) return;

    const startTime = new Date(eventData.data.startsAt).getTime();
    const durationMs = eventData.data.duration * 60 * 1000;
    const endTime = startTime + durationMs;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('00:00');
        setIsTimeFinished(true);
        setShowScore(true); // auto show score
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
          2,
          '0'
        )}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [eventData]);

  /* ================= ANSWER ================= */

  const handleAnswerClick = (answerId) => {
    if (isTimeFinished) return;

    answerQuestion(
      {
        questionId: question.data.id,
        data: { selectedOptionId: answerId },
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const isFinished = question?.status === 'finished' || isTimeFinished;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-black px-4 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-pink-600/20 blur-3xl rounded-full bottom-0 right-0"></div>

      {isFetching && <Loading />}
      {isError && <ErrorPage error={error} />}

      {/* ================= QUESTION CARD ================= */}
      {!isFinished && question?.status === 'success' && (
        <div className="relative w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 transition-all duration-500">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-400 tracking-widest uppercase">
              Live Competition
            </span>

            {timeLeft && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg shadow-md transition-all duration-300
                ${
                  isTimeFinished
                    ? 'bg-gray-700/40 text-gray-400 border border-gray-600'
                    : 'bg-red-500/20 border border-red-500/40 text-red-400'
                }
              `}
              >
                <ClockCircleOutlined />
                {timeLeft}
              </div>
            )}
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center leading-relaxed">
            {question.data.text}
            {isAnswering && (
              <LoadingOutlined className="ml-3 text-indigo-400" spin />
            )}
          </h2>

          {/* Answers */}
          <div className="grid gap-4">
            {question.data.answers.map((answer, index) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerClick(answer.id)}
                disabled={isAnswering || isTimeFinished}
                className="group relative w-full text-left px-6 py-4 rounded-xl 
                           bg-gray-800/60 border border-gray-700
                           hover:bg-indigo-600/80 hover:border-indigo-400
                           transition-all duration-300 
                           hover:scale-[1.02] active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>

                <span className="ml-8 text-lg">{answer.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= FINISHED SCREEN ================= */}
      {isFinished && (
        <div className="relative w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-12 text-center transition-all duration-500">
          <div className="text-6xl mb-6 animate-bounce text-yellow-400">🏆</div>

          <h2 className="text-3xl font-bold mb-4">Competition Finished!</h2>

          <p className="text-gray-400 mb-10">
            {question?.message ||
              'Time is over. You have completed the competition.'}
          </p>

          {isSuccess ? (
            <div className="space-y-4">
              <div className="text-5xl font-bold text-yellow-400">
                {myScore.data.score} / {myScore.data.total}
              </div>

              <div className="text-gray-300 text-lg">
                Time Used:{' '}
                <span className="text-indigo-400">
                  {myScore.data.timeSpent}s
                </span>
              </div>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<TrophyOutlined />}
              className="bg-yellow-500! hover:bg-yellow-600! border-none! text-black! font-semibold px-10 h-12 rounded-xl"
              onClick={() => setShowScore(true)}
              loading={isMyScoreLoading}
            >
              Show My Score
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CompetationPage;
