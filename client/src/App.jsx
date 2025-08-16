import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-900">
        <Navbar />

        {/* Content lainnya */}
        <main className="flex justify-center">
          {/* Komponen halaman lainnya */}
          <div className="text-center text-white space-y-4 ">
            <h1 className="text-4xl font-bold">Welcome to My Website</h1>
            <p className="text-slate-400 max-w-md">This is a placeholder for your main content. Add your components here.</p>
          </div>
        </main>

        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
