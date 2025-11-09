import './App.css';
import YieldWidget from './widget/YieldWidget';

function App() {

  // const exampleAddresses = [
  //   'addr1q86q7ntzwrzx7j7rynwmaque5rlyvw6e3e4tmas8dw87qwh3k9scpg9uzp5k2w67ug04vwt8qqj74ehmlp65ry2m4xcszztsps'
  // ];

  return (
    <div className="App" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>Liqwid Yield Widget Demo</h1>
          <p>A plug-and-play widget for displaying Liqwid Finance yield data</p>
        </header>

        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Widget with pre-filled address
          <div>
            <h3>With Pre-filled Address</h3>
            <YieldWidget
              addresses={exampleAddresses}
              currency="GBP"
            />
          </div> */}

          {/* Widget without address (user input) */}
          <div>
            {/* <h3>User Input Mode</h3> */}
            <YieldWidget
              currency="USD"
            />
          </div>
        </div>

        <div style={{ marginTop: '60px', padding: '20px', background: 'white', borderRadius: '12px' }}>
          <h2>Integration Examples</h2>
          
          <h3>1. React/JSX Integration</h3>
          <pre style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
{`import { YieldWidget } from 'liqwid-yield-sdk';

// Basic usage
<YieldWidget />

// With configuration
<YieldWidget
  addresses={['addr1q86q7ntzwr...']}
  currency="GBP"
  showHeader={true}
/>`}
          </pre>

          <h3>2. HTML + Script Tag Integration</h3>
          <pre style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
{`<!-- Include React and the widget script -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="./dist/liqwid-yield-widget.umd.js"></script>

<!-- Create container -->
<div id="liqwid-widget"></div>

<script>
  // Render widget
  LiqwidYieldWidget.create({
    elementId: 'liqwid-widget',
    addresses: ['addr1q86q7ntzwr...'],
    currency: 'GBP',
    theme: 'light'
  });
</script>`}
          </pre>

          <h3>3. Configuration Options</h3>
          <ul style={{ textAlign: 'left' }}>
            <li><strong>addresses</strong>: Array of Cardano addresses to fetch data for</li>
            <li><strong>currency</strong>: Display currency ('GBP', 'USD', 'EUR', 'ADA')</li>
            <li><strong>showHeader</strong>: Show/hide widget header (boolean)</li>
            <li><strong>apiUrl</strong>: Custom API endpoint (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
