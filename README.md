# APP Barbearia — Frontend

Next.js + React + TypeScript. API Spring Boot em `barbearia_api` (`http://localhost:8080`).

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run test
npm run build
npm run lint
```

## Autenticação e perfis

| Quem | Como obter acesso |
|------|-------------------|
| **Cliente** | `/registro` (cadastro público) |
| **Barbeiro / Recepção** | Admin cria em `/dashboard/admin/barbeiros` → `POST /admin/usuarios` |
| **Admin** | Seed na API na 1ª subida (`streetbarberold@gmail.com` + senha em `application-local.properties` do backend) |

| Rota | Descrição |
|------|-----------|
| `/login` | Login |
| `/registro` | Cadastro **somente cliente** |
| `/dashboard/admin/barbeiros` | Equipe (criar barbeiro ou recepcionista com login) |

O JWT traz apenas o e-mail; o perfil é resolvido pelos endpoints `/me` e rotas autorizadas.

## Pagamentos e avaliações

| Recurso | Quem | Onde no app |
|---------|------|-------------|
| Registrar / confirmar pagamento | Admin, recepção | Detalhes do agendamento |
| Avaliar atendimento (1–5) | Cliente | Detalhes — após status **Concluído** |
| Média do barbeiro | Todos | Formulário de agendamento (ao escolher barbeiro) |

## API (dev)

1. Backend com perfil local (senha do admin): `mvn spring-boot:run -Dspring-boot.run.profiles=local` em `barbearia_api`
2. Frontend: `npm run dev`
3. Proxy: `/api-backend` → `localhost:8080` (`.env.local`)
