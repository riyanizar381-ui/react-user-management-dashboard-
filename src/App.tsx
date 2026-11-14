
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import UserList from './components/UserList';
import { ThemeProvider } from './context/ThemeContext';

const UserDetails = lazy(() => import('./components/UserDetails'));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex justify-center items-center bg-purple-50">
              <p className="text-lg font-semibold text-purple-700">
                Loading page...
              </p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
