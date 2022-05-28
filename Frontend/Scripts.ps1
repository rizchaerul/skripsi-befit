# Install dependencies.
npm install @hookform/resolvers @mantine/core @mantine/hooks @mantine/rte bootstrap jodit-react joi next next-auth next-pwa react react-bootstrap react-chartjs-2 react-dom react-hook-form react-icons sass sweetalert2 swiper swr
npm install --save-dev @types/node @types/react @typescript-eslint/eslint-plugin @typescript-eslint/parser concurrently eslint eslint-config-next eslint-config-prettier onchange prettier typescript

# Generate vapid keys.
npx web-push generate-vapid-keys
