import './App.css';
// import LiqwidSDK from './widget/LiqwidSDK'; //local import for development
import { LiqwidSDK } from 'liqwid-sdk';
import { SiGithub , SiNpm } from 'react-icons/si';

function App() { 

  return (
    <div className="App" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src="logo192.png" alt="Liqwid Logo" style={{ height: '40px', verticalAlign: 'middle', marginRight: '10px' }} />Liqwid SDK</h1>
          <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '20px' }}>A plug-and-play SDK for displaying Liqwid Finance yield data</p>
          
          {/* GitHub and npm links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <a 
              href="https://github.com/itzdannyada/liqwid-sdk/tree/master/src/widget" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 24px', 
                background: '#24292e', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <SiGithub size={20} />
              GitHub
            </a>
            <a 
              href="https://www.npmjs.com/package/liqwid-sdk" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 24px', 
                background: '#cb3837', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <SiNpm size={20} />
              npm
            </a>
          </div> 
        </header>

        {/* Live Demo Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '30px', 
          marginBottom: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2d3748' }}>Live Demo</h2>
          
          {/* SDK Component */}
          <div style={{ marginBottom: '30px' }}>
            <LiqwidSDK
              currency="USD"
            />
          </div>

          {/* Usage explanation */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: '20px',
            marginTop: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#4a5568' }}>Use Cases</h3>
            <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>📊 Static Address Display</h4>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                  Show a project wallet's supplied assets earning yield in Liqwid
                </p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>🔗 Wallet Connection</h4>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                  Let users connect their wallet to see their own yield data (like the demo above)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '30px', 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2d3748' }}>Integration Examples</h2>
          
          <h3 style={{textAlign: 'left', color: '#2d3748'}}>1. React/JSX Integration</h3>
          <pre style={{ 
            background: '#1a202c', 
            color: '#e2e8f0', 
            padding: '20px', 
            borderRadius: '8px', 
            overflow: 'auto', 
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
{`npm install liqwid-sdk

import { LiqwidSDK } from 'liqwid-sdk';

// Static address (project/dao wallet)
<LiqwidSDK
  addresses={['addr1q86q7ntzwr...']}
  currency="USD"
/>

// Wallet connection (no addresses)
<LiqwidSDK currency="USD" />`}
          </pre>

          <h3 style={{textAlign: 'left', color: '#2d3748'}}>2. HTML + Script Tag Integration</h3>
          <pre style={{ 
            background: '#1a202c', 
            color: '#e2e8f0', 
            padding: '20px', 
            borderRadius: '8px', 
            overflow: 'auto', 
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
{`<!-- Include React and the SDK script -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/liqwid-sdk/dist/liqwid-sdk.umd.js"></script>

<!-- Create container -->
<div id="liqwid-sdk"></div>

<script>
  // Static project wallet
  LiqwidSDK.create({
    elementId: 'liqwid-sdk',
    addresses: ['addr1q86q7ntzwr...'],
    currency: 'USD'
  });
  
  // Or with wallet connection
  LiqwidSDK.create({
    elementId: 'liqwid-sdk',
    currency: 'USD'
  });
</script>`}
          </pre>

          <h3 style={{ color: '#2d3748', textAlign: 'left' }}>3. Configuration Options</h3>
          <div style={{ 
            display: 'grid', 
            gap: '15px', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            marginTop: '15px'
          }}>
            <div style={{ 
              background: '#f8fafc', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>addresses</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                Array of Cardano addresses. Leave empty to show wallet connect option.
              </p>
            </div>
            <div style={{ 
              background: '#f8fafc', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>currency</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                Default display currency: 'USD', 'GBP', or 'EUR'
              </p>
            </div>
          </div>
          
          {/* Installation command */}
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            background: '#edf2f7', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>Quick Install</h4>
            <code style={{ 
              background: '#1a202c', 
              color: '#68d391', 
              padding: '8px 16px', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              npm install liqwid-sdk
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
