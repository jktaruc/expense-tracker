import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h1>💰 Budget Tracker</h1>
                </div>
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        to="/summary"
                        className={location.pathname === '/summary' ? 'nav-link active' : 'nav-link'}
                    >
                        📈 Summary
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;