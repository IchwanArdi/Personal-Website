import { Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';
import { useApp } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { isDarkMode } = useApp();
  return (
    <div className={` ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <main className={` ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
