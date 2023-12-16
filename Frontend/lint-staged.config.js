module.exports = {
    'src/**/*.{ts,tsx}': () => 'npx tsc -p tsconfig.json --noEmit',
    'src/**/*.{js,jsx,ts,tsx}': ['npx eslint --fix', 'npx prettier --write'],
  };