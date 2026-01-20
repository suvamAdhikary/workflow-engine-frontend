import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AppLayout } from './components/layout/AppLayout';
import { WorkflowListPage } from './components/workflows/WorkflowListPage';
import { WorkflowDetailPage } from './components/workflows/WorkflowDetailPage';
import { WorkflowFormPage } from './components/workflows/WorkflowFormPage';
import { RunHistoryPage } from './components/runs/RunHistoryPage';
import { RunDetailPage } from './components/runs/RunDetailPage';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/workflows" replace />} />
          <Route path="workflows" element={<WorkflowListPage />} />
          <Route path="workflows/new" element={<WorkflowFormPage />} />
          <Route path="workflows/:id" element={<WorkflowDetailPage />} />
          <Route path="workflows/:id/edit" element={<WorkflowFormPage />} />
          <Route path="workflows/:workflowId/runs" element={<RunHistoryPage />} />
          <Route path="runs" element={<RunHistoryPage />} />
          <Route path="runs/:id" element={<RunDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
