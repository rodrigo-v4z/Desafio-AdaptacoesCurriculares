// Script para criar usuários de teste
// Execute este arquivo uma vez para configurar as credenciais de teste

const API_BASE = 'https://tdrxscmvuaelmpajahie.supabase.co/functions/v1/make-server-2a0842b8';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcnhzY212dWFlbG1wYWphaGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzgwODYsImV4cCI6MjA3OTExNDA4Nn0.GB5oZ0hugPaHsEp8VnxPb9ee_ReYIC8dNsP9nLofX5g';

async function createUser(email: string, password: string, name: string, role: 'coordenador' | 'professor') {
  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({ email, password, name, role })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Usuário criado: ${email} (${role})`);
      return true;
    } else {
      console.log(`❌ Erro ao criar ${email}: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro na requisição: ${error}`);
    return false;
  }
}

export async function createTestUsers() {
  console.log('🚀 Criando usuários de teste...\n');

  await createUser(
    'coordenador@escola.com',
    'coord123',
    'Maria Silva',
    'coordenador'
  );

  await createUser(
    'professor@escola.com',
    'prof123',
    'João Santos',
    'professor'
  );

  console.log('\n📋 Credenciais de teste criadas:');
  console.log('\n👤 COORDENADOR:');
  console.log('   Email: coordenador@escola.com');
  console.log('   Senha: coord123');
  console.log('\n👤 PROFESSOR:');
  console.log('   Email: professor@escola.com');
  console.log('   Senha: prof123');
}

// Auto-executar quando importado
if (typeof window !== 'undefined') {
  createTestUsers();
}
