import uiConfig from '@the-web-app/ui/config'

export default {
  presets: [uiConfig],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}',
  ],
}
