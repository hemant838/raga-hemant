import { Link } from "react-router-dom";

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>We could not find that care module.</h1>
      <Link
        className="primary-button"
        to="/"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
