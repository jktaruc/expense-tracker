import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/App.css";

// Lazy load page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Summary = lazy(() => import("./pages/Summary"));

// Loading fallback component with animated spinner
function PageLoader() {
    return (
        <div className="page-loader">
            <div className="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    );
}

// Fallback for when lazy loading fails
function LazyLoadError() {
    return (
        <div className="lazy-load-error">
            <h2>Failed to load page</h2>
            <p>Please check your internet connection and try again.</p>
            <button onClick={() => window.location.reload()}>
                Reload Page
            </button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <ErrorBoundary>
                {/* Navbar is eagerly loaded - always visible */}
                <Navbar />

                {/* Pages are lazy loaded with loading spinner */}
                <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary fallback={<LazyLoadError />}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/summary" element={<Summary />} />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
