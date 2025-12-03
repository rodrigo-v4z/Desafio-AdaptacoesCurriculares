import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Users, RefreshCw } from 'lucide-react';

export function SetupUsers() {
  function handleContinue() {
    localStorage.setItem('setupComplete', 'true');
    window.location.reload();
  }

  function handleResetData() {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      // Clear all application data
      const keysToRemove = [
        'adaptacao_users',
        'adaptacao_students',
        'adaptacao_adaptations',
        'adaptacao_reports',
        'adaptacao_current_user',
        'setupComplete',
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Users className="size-8 text-white" />
            </div>
          </div>
          <CardTitle>Bem-vindo ao Sistema de Adaptações Curriculares</CardTitle>
          <CardDescription>
            Usuários de teste já estão configurados e prontos para uso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              O sistema possui dois usuários pré-configurados para facilitar os testes.
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="text-blue-900 flex items-center gap-2">
              👤 Coordenador
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-mono bg-white px-3 py-2 rounded border">
                coordenador@escola.com
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Senha:</p>
              <p className="font-mono bg-white px-3 py-2 rounded border">
                coord123
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
            <h3 className="text-purple-900 flex items-center gap-2">
              👤 Professor
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-mono bg-white px-3 py-2 rounded border">
                professor@escola.com
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Senha:</p>
              <p className="font-mono bg-white px-3 py-2 rounded border">
                prof123
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button onClick={handleContinue} size="lg">
              Continuar para o Login
            </Button>
          </div>

          <div className="text-center pt-2 border-t mt-4">
            <p className="text-sm text-gray-500 mb-2 mt-4">
              Para resetar todos os dados do sistema:
            </p>
            <Button 
              onClick={handleResetData} 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <RefreshCw className="size-4 mr-2" />
              Resetar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}