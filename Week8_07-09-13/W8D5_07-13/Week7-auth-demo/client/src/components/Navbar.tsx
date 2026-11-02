import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){
    const {user, logout}= useAuth();
    return (
        <nav>
            <Link to='/'>Home</Link>
            {
                user ? ( <>
                <Link to='/dashboard'>Dashboard</Link>

                {user.role === 'admin' && (
                    <Link to={'/admin'}>Admin</Link>
                )}
                {user.role === 'moderator' && (
                    <Link to={'/moderator'}>Moderator</Link>
                )}

                <span>{user.name} ({user.role}) </span>
                <button onClick={logout}>Logout</button>
                </> ) : (
                    <Link to={'/login'}>Login</Link>
                )
            }
        </nav>
    );
}