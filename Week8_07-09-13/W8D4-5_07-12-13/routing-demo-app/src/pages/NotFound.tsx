import { Link } from "react-router-dom"
function NotFound() {
    return (
        <div>
            <h2>404 - Page Not Found</h2>
            <p>this page is unavailable.</p>
            <Link to="/">Go Home</Link>
        </div>
    );
}

export default NotFound;
