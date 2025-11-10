import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {BsInfoSquareFill} from 'react-icons/bs'
import './LiqwidSDK.css';
import './WalletConnect.css';
import bgImage from './bg.avif';
import logoImage from './logowithtext.png';
import WalletConnect from './WalletConnect';
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { NetworkType } from "@cardano-foundation/cardano-connect-with-wallet-core";

const LiqwidSDK = ({ 
  addresses = [], 
  currency = 'USD', 
  apiUrl = 'https://v2.api.liqwid.finance/graphql',
  showHeader = true
}) => {
  const [yieldData, setYieldData] = useState(null);
  const [marketsData, setMarketsData] = useState(null);
  const [utxosData, setUtxosData] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [selectedCurrency, setSelectedCurrency] = useState(currency); 

  const [activeTab, setActiveTab] = useState('yield');
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false); 
  const network = NetworkType.MAINNET;
  
	const {
    connect,
		isConnected,
	  usedAddresses,
		disconnect
	} = useCardano({
	  limitNetwork: network,
	});
  
	const fetchUtxos = useCallback(async (addressList) => {
    if (!addressList) return; 

    try {
	const firstAddress = addressList[0];
	const response = await fetch(`https://cardano-mainnet.blockfrost.io/api/v0/addresses/${firstAddress}/utxos`, {
		method: 'GET',
	    headers: {
		  project_id: 'mainnetlBWPrTbaGzxaghUHKqQnlZ48FkUV07Pl',
		  accept: 'application/json'
	    }
	});

	// Handle 404 - address has no UTXOs
	if (response.status === 404) {
	  console.log(`No UTXOs found for address: ${firstAddress}`);
	  const results = [{
		address: firstAddress,
		utxos: []
	  }];
	  setUtxosData(results);
	  return results;
	}

	const utxos = await response.json();
	const results = [{
	  address: firstAddress,
	  utxos
	}];
      setUtxosData(results);
      return results;
    } catch (error) {
      console.error('Error fetching UTXOs:', error);
      return null;
    }
    }, []);

  const fetchYieldData = useCallback(async (addressList) => {
    if (!addressList || addressList.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-project": "itzdanny-liqwid-sdk"
        },
        body: JSON.stringify({
          operationName: 'GetYieldEarned',
          variables: {
            input: {
              addresses: addressList
            },
            currencyInput: {
              currency: selectedCurrency
            }
          },
          query: `query GetYieldEarned($input: YieldEarnedInput!, $currencyInput: InCurrencyInput) {
            historical {
              yieldEarned(input: $input) {
                totalYieldEarned(input: $currencyInput)
                markets {
                  id
                  amount
                  amountInCurrency(input: $currencyInput)
                  __typename
                }
                __typename
              }
              __typename
            }
          }`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setYieldData(data.data.historical.yieldEarned);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching yield data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, selectedCurrency]);

  const fetchMarketsData = useCallback(async () => {
    setLoading(true);
    setError(null);  

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-project": "itzdanny-liqwid-sdk"
        },
        body: JSON.stringify({
          operationName: 'GetMarketsState',
          variables: {
            input: {
              sorts: [
                "SUPPLY_IN_CURRENCY_DESC"
              ],
              filters: [],
              search: "",
              perPage: 100
            },
            currencyInput: {
              currency: selectedCurrency
            }
          },
          query: `query GetMarketsState($input: MarketsInput, $currencyInput: InCurrencyInput) {
            liqwid {
              data {
                markets(input: $input) {
                  results {
                    id
                    displayName
                    receiptAsset {
                      id
                      __typename
                    }
                    exchangeRate
                    supply
                    supplyInCurrency: supply(input: $currencyInput)
                    borrow
                    borrowInCurrency: borrow(input: $currencyInput)
                    liquidity
                    liquidityInCurrency: liquidity(input: $currencyInput)
                    supplyAPY
                    borrowAPY
                    lqSupplyAPY
                    utilization
                    delisting
                    frozen
                    private
                    batchExpired
                    batching
                    prime
                    collaterals {
                      id
                      market {
                        id
                        displayName
                        delisting
                        private
                        exchangeRate
                        asset {
                          id
                          priceInCurrency: price(input: $currencyInput)
                          __typename
                        }
                        __typename
                      }
                      asset {
                        id
                        displayName
                        logo
                        priceInCurrency: price(input: $currencyInput)
                        decimals
                        __typename
                      }
                      __typename
                    }
                    collateralInMarkets {
                      id
                      displayName
                      delisting
                      asset {
                        id
                        logo
                        __typename
                      }
                      __typename
                    }
                    asset {
                      id
                      decimals
                      logo
                      priceInCurrency: price(input: $currencyInput)
                      __typename
                    }
                    parameters {
                      id
                      supplyCap
                      borrowCap
                      minValue
                      minHealthFactor
                      maxCollateralCount
                      actionCount
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
          }`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Store markets data in state
      const marketsResults = data.data.liqwid.data.markets.results;
      setMarketsData(marketsResults); 
      return marketsResults;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching markets data:', err);
      return null;
    } finally { 
      setLoading(false);
    }
  }, [apiUrl, selectedCurrency]);

  // Process user assets by matching UTXOs with market data
  const processUserAssets = useCallback(() => {
    if (!utxosData || !marketsData) return;

    const assets = [];
    
    // Iterate through all UTXOs from all addresses
    utxosData.forEach(addressData => {
      addressData.utxos.forEach(utxo => {
        utxo.amount.forEach(amount => {
          // Skip ADA (lovelace) as it's not a receipt token
          if (amount.unit === 'lovelace') return;
          
          // Find matching market by comparing UTXO unit with receipt asset ID
          const matchedMarket = marketsData.find(market => 
            market.receiptAsset && market.receiptAsset.id === amount.unit
          );
          
          if (matchedMarket) {
            // Calculate the underlying asset amount using exchange rate
            const receiptTokenAmount = parseInt(amount.quantity);
            const exchangeRate = parseFloat(matchedMarket.exchangeRate);
            const underlyingAmount = receiptTokenAmount * exchangeRate;
            
            // Convert to human readable format using asset decimals
            const decimals = matchedMarket.asset.decimals || 6;
            const humanReadableAmount = underlyingAmount / Math.pow(10, decimals);
            
            // Calculate value in selected currency
            const assetPrice = matchedMarket.asset.priceInCurrency || 0;
            const valueInCurrency = humanReadableAmount * assetPrice;
            
            // Check if this asset already exists in our array (from multiple UTXOs)
            const existingAssetIndex = assets.findIndex(asset => 
              asset.marketId === matchedMarket.id && asset.address === addressData.address
            );
            
            if (existingAssetIndex >= 0) {
              // Add to existing asset
              assets[existingAssetIndex].receiptTokenAmount += receiptTokenAmount;
              assets[existingAssetIndex].underlyingAmount += humanReadableAmount;
              assets[existingAssetIndex].valueInCurrency += valueInCurrency;
            } else {
              // Create new asset entry
              assets.push({
                marketId: matchedMarket.id,
                marketDisplayName: matchedMarket.displayName,
                address: addressData.address,
                receiptTokenAmount,
                underlyingAmount: humanReadableAmount,
                valueInCurrency,
                exchangeRate,
                assetLogo: matchedMarket.asset.logo,
                assetPrice,
                decimals
              });
            }
          }
        });
      });
    });
    
    // Sort assets by value (descending)
    assets.sort((a, b) => b.valueInCurrency - a.valueInCurrency);
    
    setUserAssets(assets); 
  }, [utxosData, marketsData]);

  // Effect to handle initial data fetching when addresses are available or wallet connects
  useEffect(() => {
    const currentAddresses = addresses.length > 0 ? addresses : (isConnected ? usedAddresses : []);
    
    if (currentAddresses.length > 0) {
      // Limit to first 200 addresses to avoid API overload
      const limitedAddresses = currentAddresses.slice(0, 200);
      
      // Fetch all data when addresses are available or wallet connects
      fetchYieldData(limitedAddresses);
      fetchMarketsData();
      fetchUtxos(limitedAddresses);
    } else {
      // Clear data when no addresses available
      setYieldData(null);
      setMarketsData(null);
      setUtxosData(null);
      setUserAssets([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, usedAddresses.join(','), addresses.join(',')]);

  // Effect to re-fetch data when currency changes (only if we have addresses)
  useEffect(() => {
    const currentAddresses = addresses.length > 0 ? addresses : (isConnected ? usedAddresses : []);
    
    if (currentAddresses.length > 0) {
      const limitedAddresses = currentAddresses.slice(0, 200);
      fetchYieldData(limitedAddresses);
      fetchMarketsData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  // Process user assets when both UTXOs and markets data are available
  useEffect(() => {
    processUserAssets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utxosData, marketsData]);

  // Handle wallet connection
  const handleWalletConnect = useCallback(async () => {
    try {
      await connect();
      // Data fetching will be triggered by the useEffect that watches isConnected
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError('Failed to connect wallet');
    }
  }, [connect]);

  // Handle wallet disconnection
  const handleWalletDisconnect = useCallback(() => {
    disconnect();
    // Clear all data when disconnecting
    setYieldData(null);
    setMarketsData(null);
    setUtxosData(null);
    setUserAssets([]);
    setError(null);
    setLoading(false);
  }, [disconnect]); 

  const formatCurrency = (amount, currency) => {
    if (!amount) return '0';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };

  return (
    <div 
      className="liqwid-sdk"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat'
      }}
    >
      {showHeader && (
        <div className="widget-header">
          <img src={logoImage} alt="Liqwid Finance" className="powered-by-logo" width={160} height={60}/>
          <div className="header-controls">
		  {addresses.length === 0 && isConnected &&(<button 
            className="disconnect-button"
            onClick={handleWalletDisconnect}
          >
            Disconnect
          </button>)}
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="currency-select"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      )}

      {(addresses.length > 0 || isConnected) && (<div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'yield' ? 'active' : ''}`}
          onClick={() => setActiveTab('yield')}
        >
          Yield Earned
        </button>
        <button 
          className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage
        </button>
      </div>)}

      <div className="tab-content">
        {activeTab === 'yield' && (
          <div className="yield-tab">
            {addresses.length === 0 && !isConnected && (
              <div className="wallet-connect-section">
                <WalletConnect 
                  onConnect={handleWalletConnect}
                  onDisconnect={handleWalletDisconnect}
                /> 
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Fetching yield data...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <p className="error-message">Error: {error}</p>
              </div>
            )}

            {yieldData && !loading && (
                <div className="total-yield">
                  <h4>
                    Total Yield Earned
                    {yieldData.markets && yieldData.markets.length > 0 && (
                      <div className="tooltip-container">
                        <BsInfoSquareFill  
                          className="info-icon"
                          onClick={() => setIsMarketModalOpen(true)}
                          title="Click to view market breakdown"
                        />
                      </div>
                    )}
                  </h4>
                  <div className="yield-amount">
                    {formatCurrency(yieldData.totalYieldEarned, selectedCurrency)}
                  </div>
                </div>
            )} 
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="manage-tab">
            <div className="manage-content">
              {(!addresses.length && !isConnected) && (
                <div className="manage-placeholder"> 
                  <WalletConnect 
                    onConnect={handleWalletConnect}
                    onDisconnect={handleWalletDisconnect}
                  />
                </div>
              )}

              {(addresses.length > 0 || isConnected) && (
                <div className="user-assets-section">                  
                  {loading && (
                    <div className="loading-container">
                      <div className="spinner"></div>
                      <p>Loading your positions...</p>
                    </div>
                  )}

                  {!loading && userAssets.length === 0 && (
                    <div className="no-assets">
                      <p>No Liqwid positions found for the connected addresses.</p>
                      <small>Make sure you have supplied assets to Liqwid protocol.</small>
                    </div>
                  )}

                  {!loading && userAssets.length > 0 && (
                    <div className="assets-grid">
                      {userAssets.filter(asset => asset.valueInCurrency >= 0.01).map((asset, index) => (
                        <div key={`${asset.marketId}-${asset.address}-${index}`} className="asset-card">
                          <div className="asset-header">
                            <div className="asset-info">
                              <img 
                                src={asset.assetLogo || `https://public.liqwid.finance/v5/assets/${asset.marketId.toUpperCase()}.svg`} 
                                alt={asset.marketDisplayName}
                                className="asset-logo"
                                width={24}
                                height={24}
                                onError={(e) => {
                                  e.target.src = `https://public.liqwid.finance/v5/assets/${asset.marketId.toUpperCase()}.svg`;
                                }}
                              />
                              <div className="asset-details">
                                <h5>{asset.marketDisplayName}</h5>
                              </div>
                            </div>
                          </div>
                          
                          <div className="asset-amounts">
                            <div className="amount-row">
                              <span className="amount-label">Supplied:</span>
                              <span className="amount-value">
                                {asset.underlyingAmount.toLocaleString('en-US', { 
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 2 
                                })}
                              </span>
                            </div>
                            <div className="amount-row">
                              <span className="amount-label">Value:</span>
                              <span className="amount-value value-currency">
                                {formatCurrency(asset.valueInCurrency, selectedCurrency)}
                              </span>
                            </div>
                            <div className="amount-row small">
                              <span className="amount-label">Q tokens:</span>
                              <span className="amount-value">
                                {(asset.receiptTokenAmount / Math.pow(10, asset.decimals)).toLocaleString('en-US', { 
                                  maximumFractionDigits: 6 
                                })}
                              </span>
                            </div>
                          </div>

                          {addresses.length === 0 && isConnected & usedAddresses.length>0 &&(<div className="asset-actions">
                            <button className="action-button supply" disabled>
                              Supply
                            </button>
                            <button className="action-button withdraw" disabled>
                              Withdraw
                            </button>
                          </div>)}
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && userAssets.length > 0 && (
                    <div className="assets-summary">
                      <div className="summary-row">
                        <span>Total Portfolio Value:</span>
                        <span className="total-value">
                          {formatCurrency(
                            userAssets.reduce((sum, asset) => sum + asset.valueInCurrency, 0),
                            selectedCurrency
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Market Breakdown Modal */}
      {isMarketModalOpen && yieldData && yieldData.markets && 
        createPortal(
          <div className="wallet-modal-overlay market-breakdown-modal" onClick={() => setIsMarketModalOpen(false)}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="market-summary">
                  <div className="summary-item">
                    <span className="summary-label">Total Markets:</span>
                    <span className="summary-value">{yieldData.markets.filter(market => market.amountInCurrency >= 0.01).length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Yield:</span>
                    <span className="summary-value">
                      {formatCurrency(yieldData.totalYieldEarned, selectedCurrency)}
                    </span>
                  </div>
                </div>
                <div className="market-summary">
                  {yieldData.markets.filter(market => market.amountInCurrency > 0.01).map((market, index) => (
                    <div key={market.id || index} className="summary-item">
                      
                      <span className="summary-label"><img src={`https://public.liqwid.finance/v5/assets/${(market.id).toUpperCase()}.svg`} alt={market.id} width={20} height={20}/>&nbsp;{(market.id).toUpperCase()}</span>
                      <span className="summary-value">
                        {formatCurrency(market.amountInCurrency, selectedCurrency)}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="cancel-button"
                  onClick={() => setIsMarketModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }

      <div className="widget-footer">
        <a 
          href="https://x.com/itzdannyada" 
          target="_blank" 
          rel="noopener noreferrer"
          className="powered-by"
        >
          Built by $itzdanny
        </a>
      </div>
    </div>
  );
};

export default LiqwidSDK;