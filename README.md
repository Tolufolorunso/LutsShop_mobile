# lutshop_mobile

A mobile shopping app built with Expo and Expo Router.

## Commands

- Dev server: `npx expo start`
- Android: `npx expo start --android`
- iOS: `npx expo start --ios`
- Web: `npx expo start --web`
- Lint: `npm run lint`

## Run on a physical device (Expo Go)

1. **Prerequisites** — phone and dev machine on the same Wi-Fi; the LUTShop backend running on `0.0.0.0:3000`; `EXPO_PUBLIC_API_BASE_URL` in `.env` set to the machine's LAN IP (e.g. `http://192.168.1.240:3000`).
2. **Start** — `npx expo start`, then scan the QR code with the Expo Go app (Android: scan in-app; iOS: scan with the Camera app).
3. **Firewall** — Windows may block inbound port 3000; allow Node.js through Windows Defender Firewall when prompted, or add an inbound rule for TCP 3000.
4. **Isolated Wi-Fi fallback** — if client-to-client traffic is blocked (common on hotel/office networks), run `npx expo start --tunnel` and set `EXPO_PUBLIC_API_BASE_URL` to a publicly reachable backend URL.

## Stack

- Expo ~57 with Expo Router ~57
- React Native 0.86 / React 19
- TypeScript (strict mode)
- File-based routing via `src/app/`
