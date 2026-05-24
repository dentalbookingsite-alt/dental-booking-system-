# ODBS Next.js TypeScript Fixes (BlackboxAI)

## Plan checkpoints
- [ ] Add missing dev dependency: @types/react-dom (if required)
- [ ] Update tsconfig.json for Next.js + React + node typings (process.env)
- [ ] Fix app/layout.tsx: import ReactNode type to avoid `React` namespace errors
- [x] Clean install (npm ci) and ensure lockfile is consistent
- [x] Run `npm run build` to confirm zero TS/JSX errors
- [x] Confirm Vercel compatibility (production build)


