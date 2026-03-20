import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthGuard } from "./components/layout/AuthGuard";
import { AppShell } from "./components/layout/AppShell";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import { registerAppServiceWorker } from "./lib/notifications";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const PatientsPage = lazy(() => import("./pages/PatientsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App(): JSX.Element {
  useAuthBootstrap();

  useEffect(() => {
    void registerAppServiceWorker();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loader">Loading care module...</div>}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route element={<AuthGuard />}>
            <Route element={<AppShell />}>
              <Route
                path="/"
                element={<DashboardPage />}
              />
              <Route
                path="/analytics"
                element={<AnalyticsPage />}
              />
              <Route
                path="/patients"
                element={<PatientsPage />}
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
