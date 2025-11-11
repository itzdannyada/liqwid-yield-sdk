## 💧 Liqwid SDK

A plug-and-play React SDK for displaying [Liqwid Finance](https://liqwid.finance) yield earnings data. Easily embed yield tracking functionality into any website or React application.

Live demo available at: https://liqwid-sdk-demo.vercel.app/

[![npm version](https://badge.fury.io/js/liqwid-sdk.svg)](https://www.npmjs.com/package/liqwid-sdk) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Beautiful UI**: Custom-designed SDK with Liqwid Finance branding
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔌 **Easy Integration**: Use as React component or vanilla JavaScript
- 💰 **Multi-Currency**: Support for GBP, USD, EUR
- ⚡ **Real-time Data**: Fetches live yield data from Liqwid Finance API
- 🎯 **Configurable**: Extensive customization options
- 📦 **Lightweight**: Minimal bundle size with optimized dependencies

## 🏗️ Installation

### NPM/Yarn (React Projects)

```bash
npm install liqwid-sdk
```

### CDN (HTML/Vanilla JS)

```html
<!-- React Dependencies -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Liqwid SDK -->
<script src="https://unpkg.com/liqwid-sdk/dist/liqwid-sdk.umd.js"></script>
```

## 🚀 Quick Start

### React Component

```tsx
import React from 'react';
import { LiqwidSDK } from 'liqwid-sdk';

function App() {
  return (
    <div>
      <h1>My DeFi Dashboard</h1>
      
      {/* Basic SDK - user enters their address */}
      <LiqwidSDK currency="USD" />
      
      {/* Pre-filled SDK */}
      <LiqwidSDK
        addresses={['address1','address2?']}
        currency="GBP" 
      />
    </div>
  );
}
```

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- SDK container -->
  <div id="liqwid-sdk"></div>

  <!-- Scripts -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/liqwid-sdk/dist/liqwid-sdk.umd.js"></script>
  
  <script>
    // Initialize the SDK
    LiqwidSDK.create({
      elementId: 'liqwid-sdk',
      currency: 'USD'
    });
  </script>
</body>
</html>
```

## ⚙️ Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `addresses` | `string[]` | `[]` | Array of Cardano addresses to fetch yield data for |
| `currency` | `'GBP' \| 'USD' \| 'EUR'` | `'GBP'` | Display currency for yield amounts |

## 📖 Examples

### Next.js Integration

```tsx
// components/LiqwidSDK.tsx
import dynamic from 'next/dynamic';

const LiqwidSDK = dynamic(() => import('liqwid-sdk'), {
  ssr: false,
  loading: () => <p>Loading Liqwid SDK...</p>
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Portfolio Dashboard</h1>
      <LiqwidSDK currency="USD" />
    </div>
  );
}
```

### WordPress Integration

Add this to your theme or use a code injection plugin:

```html
<!-- Add to your post/page -->
<div id="liqwid-sdk" style="margin: 20px 0;"></div>

<script>
  // Load dependencies if not already loaded
  if (!window.React) {
    document.head.appendChild(Object.assign(document.createElement('script'), {
      src: 'https://unpkg.com/react@18/umd/react.production.min.js',
      crossOrigin: 'anonymous'
    }));
  }
  
  if (!window.ReactDOM) {
    document.head.appendChild(Object.assign(document.createElement('script'), {
      src: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
      crossOrigin: 'anonymous'
    }));
  }
  
  // Load SDK
  document.head.appendChild(Object.assign(document.createElement('script'), {
    src: 'https://unpkg.com/liqwid-sdk/dist/liqwid-sdk.umd.js',
    onload: () => {
      LiqwidSDK.create({
        elementId: 'liqwid-sdk',
        currency: 'USD'
      });
    }
  }));
</script>
```

### Vue.js Integration

```vue
<template>
  <div ref="sdkContainer" id="liqwid-sdk"></div>
</template>

<script>
export default {
  name: 'LiqwidSDK',
  async mounted() {
    // Dynamically import the SDK
    const { LiqwidSDK } = await import('liqwid-sdk/dist/liqwid-sdk.umd.js');
    
    LiqwidSDK.create({
      elementId: 'liqwid-sdk',
      currency: 'EUR'
    });
  }
}
</script>
```

## 🎨 Customization

The SDK uses CSS custom properties for easy theming:

```css
.liqwid-sdk {
  --sdk-max-width: 400px;
  --sdk-border-radius: 12px;
  --sdk-primary-color: #667eea;
  --sdk-text-color: white;
}
```

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/yourusername/liqwid-sdk.git
cd liqwid-sdk

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📊 API Reference

The SDK integrates with the Liqwid Finance GraphQL API:

**Endpoint**: `https://v2.api.liqwid.finance/graphql`

**Query**: `GetYieldEarned`

```graphql
query GetYieldEarned($input: YieldEarnedInput!, $currencyInput: InCurrencyInput) {
  historical {
    yieldEarned(input: $input) {
      totalYieldEarned(input: $currencyInput)
      markets {
        id
        amount
        amountInCurrency(input: $currencyInput)
      }
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](https://github.com/yourusername/liqwid-sdk)
- 🐛 [Bug Reports](https://github.com/yourusername/liqwid-sdk/issues)
- 💬 [Twitter](https://x.com/itzdannyada)
- 🌐 [Liqwid Finance](https://liqwid.finance)

## 🏷️ Changelog

### v0.1.0
- Initial release
- React component and vanilla JS support
- Multi-currency display
- Responsive design
- Real-time data fetching

---

Built with ❤️ by [@itzdanny](https://x.com/itzdannyada) for the Cardano ecosystem
