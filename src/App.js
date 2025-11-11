import './App.css';
// import LiqwidSDK from './widget/LiqwidSDK'; //local import for development
import { LiqwidSDK } from 'liqwid-sdk';
import { SiGithub , SiNpm } from 'react-icons/si';

function App() { 

  return (
    <div className="App" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="logo192.png" alt="Liqwid Logo" style={{ height: '40px', verticalAlign: 'middle', marginRight: '10px' }} />
            Liqwid SDK
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '20px' }}>
            SDK for Liqwid Finance integration - track yield and manage your positions.
          </p>
          
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
              {/* Demo container showing fixed dimensions */}
              <div style={{
                border: '3px dashed #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                margin: '20px 0',
                background: '#f7fafc',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: '#f7fafc',
                  padding: '0 10px',
                  fontSize: '0.8rem',
                  color: '#4a5568',
                  fontWeight: 'bold'
                }}>
                  📐 Fixed Dimensions: 400px × 600px
                </div>
                <LiqwidSDK 
                  currency="USD"
                />
              </div>
              
              {/* Demonstration of fixed sizing benefits */}
              <div style={{ 
                background: '#e6fffa', 
                borderRadius: '12px', 
                padding: '25px', 
                marginTop: '30px',
                marginBottom: '40px',
                border: '1px solid #81e6d9'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#234e52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✅ Fixed Dimensions Benefits
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gap: '12px', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  fontSize: '0.9rem',
                  color: '#234e52'
                }}>
                  <div>• Consistent layout in embedded environments</div>
                  <div>• No layout shifts when content loads</div>
                  <div>• Predictable space requirements</div>
                  <div>• Better for iframes and third-party sites</div>
                </div>
              </div> 

              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '30px', 
                marginTop: '40px',
                marginBottom: '40px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2d3748' }}>🚀 Key Features</h2>
                
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(2, 1fr)', '@media (max-width: 768px)': { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' } }}>
                
                <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
                📊 <span style={{ marginLeft: '8px' }}>Yield Tracking</span>
                  </h3>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', textAlign: 'left'  }}>
                Real-time yield earnings from Liqwid Finance with breakdown by market and currency conversion
                  </p>
                </div>
                
                <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
                💼 <span style={{ marginLeft: '8px' }}>Position Management</span>
                  </h3>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', textAlign: 'left' }}>
                View and manage all Liqwid positions with supply/withdraw functionality
                  </p>
                </div>
                
                <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
                🔗 <span style={{ marginLeft: '8px' }}>Wallet Integration</span>
                  </h3>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', textAlign: 'left'  }}>
                Seamless Cardano wallet connection with transaction signing and submission
                  </p>
                </div>
                
                <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
                🌍 <span style={{ marginLeft: '8px' }}>Multi-Currency</span>
                  </h3>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', textAlign: 'left'  }}>
                Support for USD, GBP, and EUR with real-time conversion rates
                  </p>
                </div>
                </div>
              </div>

              {/* Integration Examples */}
        <div style={{ 
          padding: '30px', 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2d3748' }}>📚 Integration Guide</h2>
          
          <h3 style={{textAlign: 'left', color: '#2d3748'}}>1. React/Next.js Integration</h3>
          <pre style={{ 
            background: '#1a202c', 
            color: '#e2e8f0', 
            padding: '20px', 
            borderRadius: '8px', 
            overflow: 'auto', 
            textAlign: 'left',
            fontSize: '0.9rem',
            marginBottom: '30px'
          }}>
{`npm install liqwid-sdk

import { LiqwidSDK } from 'liqwid-sdk';

// Treasury/DAO wallet display
<LiqwidSDK
  addresses={['addr1q86q7ntzwr...']}
  currency="USD"
/>

// User wallet connection
<LiqwidSDK 
  currency="USD" 
/>`}
          </pre>

          <h3 style={{textAlign: 'left', color: '#2d3748'}}>2. HTML + Script Tag Integration</h3>
          <pre style={{ 
            background: '#1a202c', 
            color: '#e2e8f0', 
            padding: '20px', 
            borderRadius: '8px', 
            overflow: 'auto', 
            textAlign: 'left',
            fontSize: '0.9rem',
            marginBottom: '30px'
          }}>
{`<!-- Include React and the SDK -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/liqwid-sdk/dist/liqwid-sdk.umd.js"></script>

<!-- Create containers -->
<div id="liqwid-sdk">

  <script>
    // Treasury/DAO wallet display
    LiqwidSDK.create({
      elementId: 'liqwid-sdk',
      addresses: ['addr1q86q7ntzwr...'],
      currency: 'USD'
    });
    
    // User wallet connection
    LiqwidSDK.create({
      elementId: 'liqwid-sdk',
      currency: 'USD'
    });
  </script>

</div>`}
          </pre>

          <h3 style={{ color: '#2d3748', textAlign: 'left' }}>3. Configuration Options</h3>
          <div style={{ 
            display: 'grid', 
            gap: '15px', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            marginTop: '15px',
            marginBottom: '30px'
          }}>
            <div style={{ 
              background: '#f8fafc', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Addresses</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                Array of Cardano addresses to display. Empty array enables wallet connection mode.
              </p>
            </div>
            <div style={{ 
              background: '#f8fafc', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Currency</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                Default display currency: 'USD', 'GBP', or 'EUR'
              </p>
            </div>
          </div>

          <h3 style={{ color: '#2d3748', textAlign: 'left' }}>4. Use Cases & Examples</h3>
          <div style={{ 
            display: 'grid', 
            gap: '20px', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            marginTop: '15px'
          }}>
            <div style={{ 
              background: '#fff5f5', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #feb2b2'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#c53030' }}>📊 DAO Treasury Dashboard</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#742a2a' }}>
                Display your DAO's Liqwid positions and yield earnings publicly
              </p>
              <code style={{ fontSize: '0.8rem', background: '#fed7d7', padding: '4px 8px', borderRadius: '4px' }}>
                addresses={['[dao_addr1, ', 'dao_addr2]']}
              </code>
            </div>
            
            <div style={{ 
              background: '#f0fff4', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #9ae6b4'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#38a169' }}>🔗 User Portfolio Tracker</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#276749' }}>
                Let users connect wallets to view and manage their Liqwid positions
              </p>
              <code style={{ fontSize: '0.8rem', background: '#c6f6d5', padding: '4px 8px', borderRadius: '4px' }}>
                addresses={["user address"]} {/* Empty for wallet connection */}
              </code>
            </div>
          </div>
          
          {/* Installation command */}
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            background: '#edf2f7', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>🚀 Get Started</h4>
            <code style={{ 
              background: '#1a202c', 
              color: '#68d391', 
              padding: '8px 16px', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              npm install liqwid-sdk
            </code>
            <p style={{ marginTop: '15px', marginBottom: '0', color: '#4a5568', fontSize: '0.9rem' }}>
              Ready to use in React, Next.js, or vanilla JavaScript projects
            </p>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default App;
