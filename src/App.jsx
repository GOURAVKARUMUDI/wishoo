import { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from './pages/Loading/Loading.jsx';
import Login from './pages/Login/Login.jsx';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import { ROUTES } from './utils/constants.js';
import { isBirthdayReached } from './config/birthdayConfig.js';


const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Letter = lazy(() => import('./pages/Letter/Letter.jsx'));
const Balloon = lazy(() => import('./pages/Balloon/Balloon.jsx'));
const Scratch = lazy(() => import('./pages/Scratch/Scratch.jsx'));
const Compliments = lazy(() => import('./pages/Compliments/Compliments.jsx'));
const Celebration = lazy(() => import('./pages/Celebration/Celebration.jsx'));
const Birthday = lazy(() => import('./pages/Birthday/Birthday.jsx'));
const BirthdayUnlock = lazy(() => import('./pages/BirthdayUnlock/BirthdayUnlock.jsx'));
const BirthdayExperience = lazy(() => import('./pages/BirthdayExperience/BirthdayExperience.jsx'));
const BirthdayAboutYou = lazy(() => import('./pages/BirthdayAboutYou/BirthdayAboutYou.jsx'));
const BirthdayPhotos = lazy(() => import('./pages/BirthdayPhotos/BirthdayPhotos.jsx'));
const BirthdayAboutTinku = lazy(() => import('./pages/BirthdayAboutTinku/BirthdayAboutTinku.jsx'));
const BirthdayGifts = lazy(() => import('./pages/BirthdayGifts/BirthdayGifts.jsx'));
const BirthdayFinal = lazy(() => import('./pages/BirthdayFinal/BirthdayFinal.jsx'));
const BirthdayWhatYouMean = lazy(() => import('./pages/BirthdayWhatYouMean/BirthdayWhatYouMean.jsx'));
const BirthdayThankYou = lazy(() => import('./pages/BirthdayThankYou/BirthdayThankYou.jsx'));

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
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('mahii-unlocked') === 'true');
  const [accessRole, setAccessRole] = useState(() => sessionStorage.getItem('wishoo-role') || 'mahii');

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  const handleUnlock = useCallback((data) => {
    setIsUnlocked(true);
    if (data?.role) {
      setAccessRole(data.role);
      sessionStorage.setItem('wishoo-role', data.role);
    }
  }, []);

  const birthdayReached = isBirthdayReached();
  const tinkuDev = accessRole === 'tinku-dev' || sessionStorage.getItem('wishoo-dev-skip') === 'true';


  useEffect(() => {
    if (!showLoading && isUnlocked && birthdayReached && location.pathname === '/') {
      navigate('/birthday', { replace: true });
    }
  }, [birthdayReached, isUnlocked, location.pathname, navigate, showLoading]);

  const currentRoute = ROUTES.find((r) => r.path === location.pathname);
  const currentIndex = currentRoute ? currentRoute.index : 0;
  const isBirthdayRoute = location.pathname.startsWith('/birthday');
  const showUI = !showLoading && isUnlocked && location.pathname !== '/' && !isBirthdayRoute;

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
            <Route path="/birthday/unlock" element={<BirthdayUnlock />} />
            <Route path="/birthday/experience" element={<BirthdayExperience />} />
            <Route path="/birthday/about-you" element={<BirthdayAboutYou />} />
            <Route path="/birthday/photos" element={<BirthdayPhotos />} />
            <Route path="/birthday/about-tinku" element={<BirthdayAboutTinku />} />
            <Route path="/birthday/what-you-mean-to-me" element={<BirthdayWhatYouMean />} />
            <Route path="/birthday/gifts" element={<BirthdayGifts />} />
            <Route path="/birthday/final" element={<BirthdayFinal />} />
            <Route path="/birthday/thank-you" element={<BirthdayThankYou />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
