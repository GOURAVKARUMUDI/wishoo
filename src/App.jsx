import { useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from './pages/Loading/Loading.jsx';
import Login from './pages/Login/Login.jsx';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import { ROUTES } from './utils/constants.js';

const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Letter = lazy(() => import('./pages/Letter/Letter.jsx'));
const Balloon = lazy(() => import('./pages/Balloon/Balloon.jsx'));
const Scratch = lazy(() => import('./pages/Scratch/Scratch.jsx'));
const Compliments = lazy(() => import('./pages/Compliments/Compliments.jsx'));
const Celebration = lazy(() => import('./pages/Celebration/Celebration.jsx'));
const Birthday = lazy(() => import('./pages/Birthday/Birthday.jsx'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        display: 'flex',
        gap: '6px',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: `pulse 1.6s ease-in-out ${i * 0.25}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('mahii-unlocked') === 'true';
  });

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  const currentRoute = ROUTES.find((r) => r.path === location.pathname);
  const currentIndex = currentRoute ? currentRoute.index : 0;
  const showUI = !showLoading && isUnlocked && location.pathname !== '/';

  // Step 1: Mandatory Loading Screen
  if (showLoading) {
    return (
      <div className="app-container">
        <Loading onComplete={handleLoadingComplete} />
      </div>
    );
  }

  // Step 2: Mandatory Password Access Gate
  if (!isUnlocked) {
    return (
      <div className="app-container">
        <Login onUnlock={handleUnlock} />
      </div>
    );
  }

  // Step 3: Unlocked Journey Experience
  return (
    <div className="app-container">
      {showUI && <ProgressBar currentIndex={currentIndex} />}

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/letter" element={<Letter />} />
            <Route path="/balloons" element={<Balloon />} />
            <Route path="/scratch" element={<Scratch />} />
            <Route path="/compliments" element={<Compliments />} />
            <Route path="/celebration" element={<Celebration />} />
            <Route path="/birthday" element={<Birthday />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
