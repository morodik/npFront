# vault-auth

Клиентская часть passwordless-аутентификации на Ed25519.

## Старт

```bash
npm install
cp .env.example .env.local   # укажи URL бэкенда
npm run dev
```

## Структура

```
src/
├── lib/
│   ├── crypto.js      # Ed25519: генерация ключей, подпись (@noble/ed25519)
│   ├── api.js         # fetch-обёртки для всех эндпоинтов
│   ├── storage.js     # сохранение/загрузка приватного ключа из localStorage
│   └── useLogger.js   # хук для лога статусов
├── components/
│   └── StatusLog.jsx  # компонент лога
├── pages/
│   ├── AuthPage.jsx   # страница входа/регистрации
│   └── Dashboard.jsx  # страница после успешного входа
├── App.jsx            # роутинг между страницами
├── main.jsx
└── index.css          # CSS-переменные, глобальные стили
```

## API-контракт

### Регистрация
```
POST /auth/register
{ login: string, publicKey: string }   // publicKey — hex, 32 байта

→ { login: string }
```

### Вход — шаг 1: получить challenge
```
POST /auth/challenge
{ login: string }

→ { challenge: string }   // hex, 32 байта
```

### Вход — шаг 2: отправить подпись
```
POST /auth/login
{ login: string, signature: string }   // signature — hex, 64 байта

→ { ... }   // всё что вернёт бэк
```

## Ключи

- **Приватный ключ** хранится в `localStorage` под ключом `vault_privkey_<login>`
- **Публичный ключ** хранится только на сервере
- Алгоритм: Ed25519 через [@noble/ed25519](https://github.com/paulmillr/noble-ed25519)
