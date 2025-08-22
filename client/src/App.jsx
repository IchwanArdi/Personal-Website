import { Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';

function App() {
  return (
    <AppProvider>
      <ScrollToTop /> {/* 🔥 taruh di sini */}
      <div className="min-h-screen bg-slate-950/90">
        <Navbar />
        <main className="bg-slate-950/90">
          <Outlet /> {/* 👉 halaman anak tampil di sini */}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
