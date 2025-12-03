import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SetupUsers } from './components/SetupUsers';
import { Toaster } from './components/ui/sonner';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Info, X } from 'lucide-react';
import { Button } from './components/ui/button';

function AppContent() {
  const { user, loading } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(() => {
    return localStorage.getItem('infoBannerDismissed') !== 'true';
  });

  // Check setup status after auth is loaded
  useEffect(() => {
    if (!loading && !user) {
      const setupComplete = localStorage.getItem('setupComplete') === 'true';
      setShowSetup(!setupComplete);
    }
  }, [loading, user]);

  const dismissInfoBanner = () => {
    localStorage.setItem('infoBannerDismissed', 'true');
    setShowInfoBanner(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (showSetup && !user) {
    return (
      <div>
        <SetupUsers />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              localStorage.setItem('setupComplete', 'true');
              setShowSetup(false);
            }}
            className="text-sm text-blue-600 hover:underline bg-white px-4 py-2 rounded-lg shadow-lg border border-blue-200"
          >
            Já tenho uma conta
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      {showInfoBanner && (
        <div className="bg-blue-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Info className="size-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Sistema usando Armazenamento Local</p>
                <p className="text-blue-100">
                  Todos os dados são salvos no seu navegador. Para persistir os dados em produção, 
                  considere implementar um backend. <a href="/ARMAZENAMENTO_LOCAL.md" target="_blank" className="underline hover:text-white">Saiba mais</a>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissInfoBanner}
              className="text-white hover:text-white hover:bg-blue-700 flex-shrink-0"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
      
      <Layout>
        {user.role === 'coordenador' ? (
          <CoordinatorDashboard />
        ) : (
          <TeacherDashboard />
        )}
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}