import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppStore } from "../../store/useAppStore";

export const AuthGuard = (): JSX.Element => {
  const location = useLocation();
  const session = useAppStore((state) => state.session);

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};
