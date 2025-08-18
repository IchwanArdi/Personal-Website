import { Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950/90">
        <Navbar />
        <main className="">
          <Outlet /> {/* 👉 ini tempat halaman anak tampil */}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
