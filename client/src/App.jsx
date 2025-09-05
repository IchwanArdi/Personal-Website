import { Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';

function App() {
  return (
    <AppProvider>
      <ScrollToTop /> {/* 🔥 taruh di sini */}
      <div className="bg-black">
        <Navbar />
        <main className="bg-black">
          <Outlet /> {/* 👉 halaman anak tampil di sini */}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
