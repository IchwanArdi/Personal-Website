import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';

// Main App Component
function App() {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content Area - Add your pages/content here */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl font-bold">Welcome to My Website</h1>
          <p className="text-slate-400 max-w-md">This is a placeholder for your main content. Add your components here.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
