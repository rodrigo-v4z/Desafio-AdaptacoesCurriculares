# Sistema de Adaptações Curriculares - Armazenamento Local

## Visão Geral

Este sistema foi migrado para usar **armazenamento local (localStorage)** ao invés de backend Supabase. Todos os dados são armazenados no navegador do usuário.

## Estrutura de Armazenamento

Os dados são armazenados no localStorage com as seguintes chaves:

- `adaptacao_users` - Lista de usuários do sistema
- `adaptacao_students` - Lista de estudantes cadastrados
- `adaptacao_adaptations` - Adaptações curriculares registradas
- `adaptacao_reports` - Relatos de acompanhamento dos professores
- `adaptacao_current_user` - Usuário atualmente autenticado
- `setupComplete` - Flag indicando se a configuração inicial foi concluída

## Usuários Pré-configurados

O sistema é inicializado com dois usuários de teste:

### Coordenador
- **Email:** coordenador@escola.com
- **Senha:** coord123
- **Permissões:** 
  - Cadastrar e gerenciar estudantes
  - Registrar adaptações curriculares
  - Visualizar todos os relatórios

### Professor
- **Email:** professor@escola.com
- **Senha:** prof123
- **Permissões:**
  - Visualizar estudantes com adaptações
  - Registrar relatos de acompanhamento
  - Visualizar relatórios dos estudantes

## Funcionalidades

### Para Coordenadores
1. Gerenciamento completo de estudantes (criar, editar, excluir)
2. Registro de adaptações curriculares com validação de campos obrigatórios
3. Visualização de relatórios completos de estudantes
4. Exportação/impressão de relatórios

### Para Professores
1. Visualização de estudantes com adaptações curriculares
2. Filtros por nome, curso e turma
3. Registro de relatos de acompanhamento
4. Categorização de resultados (positivo, neutro, negativo)
5. Visualização do histórico completo de cada estudante

## Resetar Dados

Existem duas formas de resetar os dados do sistema:

### 1. Pela Tela de Setup Inicial
Clique em "Resetar Dados" na tela de boas-vindas (antes de fazer login).

### 2. Pelo Header do Sistema
Quando logado, clique no botão "Resetar Dados" no header do sistema (ícone de banco de dados).

**Atenção:** Esta ação irá excluir todos os estudantes, adaptações e relatos. Os usuários padrão serão recriados automaticamente.

## Características Técnicas

### Persistência de Dados
- Todos os dados são persistidos no localStorage do navegador
- Os dados permanecem disponíveis mesmo após fechar o navegador
- Dados são específicos para cada navegador/dispositivo

### Limitações
- **Armazenamento:** O localStorage tem limite de ~5-10MB dependendo do navegador
- **Compartilhamento:** Dados não são compartilhados entre diferentes navegadores ou dispositivos
- **Backup:** Recomenda-se exportar relatórios importantes regularmente
- **Segurança:** As senhas são validadas de forma simples (não usar em produção)

### IDs Únicos
Cada registro (estudante, adaptação, relato) recebe um ID único gerado com:
```
timestamp-randomString
```

## Desenvolvimento

### Arquivos Principais

**Armazenamento:**
- `/lib/storage.ts` - Camada de armazenamento local com todas as operações CRUD

**API:**
- `/lib/api.ts` - Interface de API que usa a camada de armazenamento

**Autenticação:**
- `/contexts/AuthContext.tsx` - Contexto de autenticação usando localStorage

**Componentes:**
- `/components/SetupUsers.tsx` - Tela de configuração inicial
- `/components/LoginForm.tsx` - Formulário de login
- `/components/CoordinatorDashboard.tsx` - Dashboard do coordenador
- `/components/TeacherDashboard.tsx` - Dashboard do professor

## Migração para Produção

Para usar este sistema em produção com um backend real, você precisará:

1. Implementar um servidor backend (Node.js, Python, etc.)
2. Substituir as funções em `/lib/api.ts` para fazer chamadas HTTP reais
3. Implementar autenticação segura com JWT ou sessões
4. Adicionar validação de permissões no backend
5. Usar um banco de dados (PostgreSQL, MySQL, MongoDB, etc.)

## Suporte

Este é um sistema de demonstração/teste. Para questões ou melhorias, consulte a documentação completa dos requisitos funcionais.
