## 💧 Liqwid Yield SDK

A plug-and-play React widget for displaying [Liqwid Finance](https://liqwid.finance) yield earnings data. Easily embed yield tracking functionality into any website or React application.

[![npm version](https://badge.fury.io/js/liqwid-yield-sdk.svg)](https://www.npmjs.com/package/liqwid-yield-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Beautiful UI**: Custom-designed widget with Liqwid Finance branding
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔌 **Easy Integration**: Use as React component or vanilla JavaScript
- 💰 **Multi-Currency**: Support for GBP, USD, EUR
- ⚡ **Real-time Data**: Fetches live yield data from Liqwid Finance API
- 🎯 **Configurable**: Extensive customization options
- 📦 **Lightweight**: Minimal bundle size with optimized dependencies

## 🏗️ Installation

### NPM/Yarn (React Projects)

```bash
npm install liqwid-yield-sdk
# or
yarn add liqwid-yield-sdk
```

### CDN (HTML/Vanilla JS)

```html
<!-- React Dependencies -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Liqwid Yield Widget -->
<script src="https://unpkg.com/liqwid-yield-sdk/dist/liqwid-yield-widget.umd.js"></script>
```

## 🚀 Quick Start

### React Component

```tsx
import React from 'react';
import { YieldWidget } from 'liqwid-yield-sdk';

function App() {
  return (
    <div>
      <h1>My DeFi Dashboard</h1>
      
      {/* Basic widget - user enters their address */}
      <YieldWidget currency="USD" />
      
      {/* Pre-filled widget */}
      <YieldWidget
        addresses={['address1','address2?']}
        currency="GBP"
        showHeader={true}
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
  <!-- Widget container -->
  <div id="yield-widget"></div>

  <!-- Scripts -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/liqwid-yield-sdk/dist/liqwid-yield-widget.umd.js"></script>
  
  <script>
    // Initialize the widget
    LiqwidYieldWidget.create({
      elementId: 'yield-widget',
      currency: 'USD',
      showHeader: true
    });
  </script>
</body>
</html>
```

## ⚙️ Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `addresses` | `string[]` | `[]` | Array of Cardano addresses to fetch yield data for |
| `currency` | `'GBP' \| 'USD' \| 'EUR' \| 'ADA'` | `'GBP'` | Display currency for yield amounts |
| `showHeader` | `boolean` | `true` | Show/hide widget header with currency selector 

## 📖 Examples

### Next.js Integration

```tsx
// components/YieldWidget.tsx
import dynamic from 'next/dynamic';

const YieldWidget = dynamic(() => import('liqwid-yield-sdk'), {
  ssr: false,
  loading: () => <p>Loading yield widget...</p>
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Portfolio Dashboard</h1>
      <YieldWidget currency="USD" />
    </div>
  );
}
```

### WordPress Integration

Add this to your theme or use a code injection plugin:

```html
<!-- Add to your post/page -->
<div id="liqwid-widget" style="margin: 20px 0;"></div>

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
  
  // Load widget
  document.head.appendChild(Object.assign(document.createElement('script'), {
    src: 'https://unpkg.com/liqwid-yield-sdk/dist/liqwid-yield-widget.umd.js',
    onload: () => {
      LiqwidYieldWidget.create({
        elementId: 'liqwid-widget',
        currency: 'USD'
      });
    }
  }));
</script>
```

### Vue.js Integration

```vue
<template>
  <div ref="widgetContainer" id="yield-widget"></div>
</template>

<script>
export default {
  name: 'YieldWidget',
  async mounted() {
    // Dynamically import the widget
    const { LiqwidYieldWidget } = await import('liqwid-yield-sdk/dist/liqwid-yield-widget.umd.js');
    
    LiqwidYieldWidget.create({
      elementId: 'yield-widget',
      currency: 'EUR'
    });
  }
}
</script>
```

## 🎨 Customization

The widget uses CSS custom properties for easy theming:

```css
.liqwid-yield-widget {
  --widget-max-width: 400px;
  --widget-border-radius: 12px;
  --widget-primary-color: #667eea;
  --widget-text-color: white;
}
```

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/yourusername/liqwid-yield-sdk.git
cd liqwid-yield-sdk

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

The widget integrates with the Liqwid Finance GraphQL API:

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

- 📚 [Documentation](https://github.com/yourusername/liqwid-yield-sdk)
- 🐛 [Bug Reports](https://github.com/yourusername/liqwid-yield-sdk/issues)
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