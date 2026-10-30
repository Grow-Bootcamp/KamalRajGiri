import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <nav className='navbar'>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            {' | '}
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
            {' | '}
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>

        </nav>
    );
}

export default Navbar;