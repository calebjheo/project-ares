import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

function App() {
  if (PUBLISHABLE_KEY === 'pk_test_placeholder' || !PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans text-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Missing Clerk Publishable Key</h1>
        <p className="text-gray-400 max-w-md">
          The application requires a valid Clerk Publishable Key to run. Please add 
          <code className="bg-slate-800 px-2 py-1 rounded mx-1 text-blue-400">VITE_CLERK_PUBLISHABLE_KEY</code> 
          to your <code className="bg-slate-800 px-2 py-1 rounded mx-1">frontend/.env.development</code> or production environment variables and restart the server.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            } 
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
