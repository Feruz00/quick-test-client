import { Route, Routes } from 'react-router';
import LoginPage from './pages/Login/Page';
import NotFound from './pages/NotFound';
import HomePage from './pages/Home/Page';
import ProtectedRoute from './ui/ProtectedRoute';
import EventsPage from './pages/Manager/Events/Page';
import QuestionPage from './pages/Manager/Questions/Page';
import JoinPage from './pages/Manager/Join/Page';
import CompetationPage from './pages/Competation/Page';
import SocketProvider from './ui/SocketProvider';
import ResultPage from './pages/Manager/Result/Page';
import AdminPage from './pages/Admin/Page';

const App = () => {
  return (
    <SocketProvider>
      <div className="min-h-screen  bg-gray-950 ">
        <Routes>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route index element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />

            <Route path="/manager" element={<EventsPage />} />
            <Route path="/manager/events/:eventId" element={<QuestionPage />} />
            <Route
              path="/manager/events/:eventId/results"
              element={<ResultPage />}
            />
            <Route
              path="/competition/:joinCode"
              element={<CompetationPage />}
            />
          </Route>

          <Route path="/join/:joinCode" element={<JoinPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </SocketProvider>
  );
};

export default App;
