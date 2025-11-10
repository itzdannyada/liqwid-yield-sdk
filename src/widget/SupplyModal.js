import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom'; 
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { NetworkType } from "@cardano-foundation/cardano-connect-with-wallet-core";

const SupplyModal = ({ 
  isOpen, 
  onClose, 
  asset, 
  addresses = [],
  apiUrl,
  onSuccess,
  onError,
  marketsData = []
}) => {
    const network = NetworkType.MAINNET; 
    const wallet = localStorage.getItem("cf-last-connected-wallet")?.toUpperCase() || 'ETERNL';
    
    const { 
        isConnected, 
    } = useCardano({
      limitNetwork: network,
    });
    
    const [amount, setAmount] = useState('');
    const [changeAddress, setChangeAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [calculation, setCalculation] = useState(null);
    const [calculationLoading, setCalculationLoading] = useState(false);
    const [utxos, setUtxos] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(asset || null); 

    // Update selected asset when asset prop changes
    useEffect(() => {
        setSelectedAsset(asset || null);
    }, [asset]);

    // Fetch UTXOs when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchUtxos();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isConnected, addresses]);

    const fetchUtxos = useCallback(async () => { 
        setUtxos([]);

        try {
            // First try to get UTXOs from connected wallet
            if (isConnected) {
                const walletName = localStorage.getItem("cf-last-connected-wallet");
                
                if (walletName && window.cardano && window.cardano[walletName.toLowerCase()]) {
                    
                    try {
                        const api = await window.cardano[walletName.toLowerCase()].enable();
                        const utxosCbor = await api.getUtxos();
                        
                        if (!utxosCbor || utxosCbor.length === 0) {
                            setUtxos([]);
                            return;
                        }

                        setUtxos(utxosCbor);
                        return;
                        
                    } catch (walletError) {
                        console.warn('Failed to get UTXOs from wallet:', walletError);
                    }
                }
            }

            // Fallback: try to get UTXOs from Blockfrost if addresses are provided
            if (addresses && addresses.length > 0) {
                const firstAddress = addresses[0];
                
                const response = await fetch(`https://cardano-mainnet.blockfrost.io/api/v0/addresses/${firstAddress}/utxos`, {
                    method: 'GET',
                    headers: {
                        project_id: 'mainnetlBWPrTbaGzxaghUHKqQnlZ48FkUV07Pl',
                        accept: 'application/json'
                    }
                });

                if (response.status === 404) {
                    setUtxos([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blockfrostUtxos = await response.json();
                setUtxos(blockfrostUtxos);
                return;
            } 
            
        } catch (error) {
            console.error('Error fetching UTXOs:', error); 
        } finally { 
        }
    }, [isConnected, addresses]);  

    // Validate UTXO structure - handles both wallet CBOR UTXOs and Blockfrost UTXOs
    const validateUtxos = (utxos) => {
        if (!Array.isArray(utxos) || utxos.length === 0) {
            throw new Error('No UTXOs provided');
        }

        return utxos.map((utxo, index) => {
            // Handle CBOR format from wallet (Eternl CIP-30)
            if (typeof utxo === 'string' && utxo.length > 50 && !utxo.includes(':')) {
                // This is a CBOR hex string from the wallet
                return utxo;
            }
            
            // Handle string format (tx_hash:output_index)
            if (typeof utxo === 'string' && utxo.includes(':')) {
                return utxo;
            }
            
            // Handle object format with CBOR (from wallet API)
            if (typeof utxo === 'object' && utxo.cbor) {
                return utxo.cbor;
            }
            
            // Handle object format from Blockfrost
            if (typeof utxo === 'object' && utxo.tx_hash && typeof utxo.output_index === 'number') {
                return `${utxo.tx_hash}:${utxo.output_index}`;
            }
            
            throw new Error(`Invalid UTXO structure at index ${index}. Expected CBOR string, "tx_hash:output_index" string, or object with tx_hash and output_index`);
        });
    };

    // Calculate supply fees and limits
    const calculateSupply = useCallback(async (supplyAmount) => {
        if (!supplyAmount || parseFloat(supplyAmount) <= 0 || !selectedAsset) return;

        setCalculationLoading(true);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-app-source": "itzdanny-liqwid-sdk"
                },
                body: JSON.stringify({
                    operationName: 'GetSupplyCalculation',
                    variables: {
                        input: {
                            amount: parseFloat(supplyAmount),
                            marketId: selectedAsset.marketId || selectedAsset.id,
                            wallet: wallet
                        }
                    },
                    query: `query GetSupplyCalculation($input: SupplyCalculationInput!) {
                        liqwid {
                            calculations {
                                supply(input: $input) {
                                    batchingFee
                                    walletFee
                                    supplyCap
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

            const calculationResult = data.data.liqwid.calculations.supply;
            setCalculation(calculationResult);
            
        } catch (err) {
            console.warn('Failed to calculate supply fees:', err);
            // Don't show calculation errors to user, just log them
        } finally {
            setCalculationLoading(false);
        }
    }, [apiUrl, selectedAsset, wallet]);

    // Debounced calculation effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (amount && parseFloat(amount) > 0) {
                calculateSupply(amount);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [amount, calculateSupply]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedAsset) {
            setError('Please select an asset to supply');
            return;
        }
        
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        // Check supply cap if available
        if (calculation && calculation.supplyCap && parseFloat(amount) > calculation.supplyCap) {
            setError(`Amount exceeds supply cap of ${calculation.supplyCap.toLocaleString()}`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Validate and format UTXOs
            const formattedUtxos = validateUtxos(utxos);
            
            // Validate addresses
            if (!addresses || addresses.length === 0) {
                throw new Error('No addresses provided');
            }

            const primaryAddress = addresses[0];
            
            // Convert amount to smallest unit (lovelace/microunits)
            const supplyAmount = parseFloat(amount * 1000000);
            
            const supplyInput = {
                marketId: selectedAsset.marketId || selectedAsset.id,
                amount: supplyAmount,
                address: primaryAddress,
                changeAddress: changeAddress || primaryAddress,
                otherAddresses: addresses.slice(1),
                utxos: formattedUtxos
            };


            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-app-source": "itzdanny-liqwid-sdk"
                },
                body: JSON.stringify({
                    operationName: 'GetSupplyTransaction',
                    variables: {
                        input: supplyInput
                    },
                    query: `query GetSupplyTransaction($input: SupplyTransactionInput!) {
                        liqwid {
                            transactions {
                                supply(input: $input) {
                                    cbor
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

            // Get the CBOR transaction from the API response
            const transactionResult = data.data.liqwid.transactions.supply;
            
            if (!transactionResult || !transactionResult.cbor) {
                throw new Error('Invalid response: missing CBOR data');
            }

            // Sign the transaction using the connected wallet
            if (isConnected) {
                const walletName = localStorage.getItem("cf-last-connected-wallet");
                
                if (walletName && window.cardano && window.cardano[walletName.toLowerCase()]) {
                    try {
                        const api = await window.cardano[walletName.toLowerCase()].enable();
                        
                        // Sign the transaction CBOR
                        const witnessSet = await api.signTx(transactionResult.cbor, true);
                        
                        // Submit the signed transaction to Liqwid API
                        const submitResponse = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                "x-app-source": "itzdanny-liqwid-sdk"
                            },
                            body: JSON.stringify({
                                operationName: 'SubmitTransaction',
                                variables: {
                                    input: {
                                        transaction: transactionResult.cbor,
                                        signature: witnessSet
                                    }
                                },
                                query: `mutation SubmitTransaction($input: SubmitTransactionInput!) {
                                    submitTransaction(input: $input)
                                }`
                            }),
                        });

                        if (!submitResponse.ok) {
                            throw new Error(`Submit HTTP error! status: ${submitResponse.status}`);
                        }

                        const submitData = await submitResponse.json();
                        
                        if (submitData.errors) {
                            throw new Error(`Submit error: ${submitData.errors[0].message}`);
                        }

                        const txHash = submitData.data?.submitTransaction;
                        onSuccess && onSuccess({
                            success: true,
                            message: 'Supply transaction signed and submitted successfully',
                            txHash: txHash,
                            witnessSet: witnessSet,
                            cbor: transactionResult.cbor,
                            fees: calculation ? {
                                batchingFee: calculation.batchingFee,
                                walletFee: calculation.walletFee
                            } : null
                        });
                        
                    } catch (walletError) {
                        console.error('Wallet signing/submission error:', walletError);
                        throw new Error(`Failed to sign/submit transaction: ${walletError.message}`);
                    }
                } else {
                    throw new Error('Wallet not available for signing');
                }
            } else {
                // If not connected to wallet, just return the CBOR for manual handling
                onSuccess && onSuccess({
                    success: true,
                    message: 'Supply transaction created (requires manual signing)',
                    cbor: transactionResult.cbor,
                    requiresManualSigning: true,
                    fees: calculation ? {
                        batchingFee: calculation.batchingFee,
                        walletFee: calculation.walletFee
                    } : null
                });
            }
            
            onClose();
            
        } catch (err) {
            const errorMessage = err.message || 'Failed to process supply';
            setError(errorMessage);
            onError && onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setAmount('');
            setChangeAddress('');
            setError(null);
            if (!asset) {
                setSelectedAsset(null);
            }
            onClose();
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and decimal points
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            setError(null);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="wallet-modal-overlay supply-modal" onClick={handleClose}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}> 
                {/* Header */}
                <div className="modal-header">
                    <div className="asset-info">
                    {selectedAsset && (
                        <>
                        <img 
                            src={selectedAsset.assetLogo || selectedAsset.asset?.logo || `https://public.liqwid.finance/v5/assets/${(selectedAsset.marketId || selectedAsset.id).toUpperCase()}.svg`} 
                            alt={selectedAsset.marketDisplayName || selectedAsset.displayName}
                            className="asset-logo"
                            width={32}
                            height={32}
                        />
                        <div>
                            <h3>Supply {selectedAsset.marketDisplayName || selectedAsset.displayName}</h3>
                        </div>
                        </>
                    )}
                    {!selectedAsset && (
                        <div className="no-asset-selected">
                            <div className="supply-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div>
                                <h3>Supply Assets</h3>
                                <span className="supply-subtitle">Choose from {marketsData.filter(market => !market.delisting && !market.frozen && !market.private).length} available markets</span>
                            </div>
                        </div>
                    )}
                    </div>
                    <button className="close-button" onClick={handleClose} disabled={loading}>
                    ×
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {/* Asset Selection - only show if no asset was pre-selected */}
                        {!asset && (
                            <>
                            <select
                                value={selectedAsset ? (selectedAsset.marketId || selectedAsset.id) : ''}
                                onChange={(e) => {
                                    const marketId = e.target.value;
                                    const market = marketsData.find(m => m.id === marketId);
                                    setSelectedAsset(market);
                                    setAmount(''); // Reset amount when changing asset
                                    setCalculation(null); // Reset calculation
                                }}
                                className="asset-select"
                                disabled={loading}
                                required
                            >
                                <option value="">Choose an asset to supply...</option>
                                {marketsData
                                    .filter(market => !market.delisting && !market.frozen && !market.private)
                                    .sort((a, b) => b.supplyAPY - a.supplyAPY) // Sort by highest APY first
                                    .map(market => (
                                        <option key={market.id} value={market.id}>
                                            {market.displayName}
                                        </option>
                                    ))
                                }
                            </select>
                            {selectedAsset && (
                                <div className="selected-asset-preview">
                                    <img 
                                        src={selectedAsset.asset?.logo || `https://public.liqwid.finance/v5/assets/${selectedAsset.id.toUpperCase()}.svg`} 
                                        alt={selectedAsset.displayName}
                                        className="preview-asset-logo"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="preview-asset-name">{selectedAsset.displayName}</span>
                                    <span className="preview-asset-apy">{(selectedAsset.supplyAPY * 100).toFixed(2)}% APY</span>
                                    <span className="preview-asset-apy">{(selectedAsset.supplyInCurrency / 1000000).toFixed(1)}M TVL</span>
                                </div>
                            )}
                            </>
                        )}

                        {/* Amount Input */}
                        <div className="input-group">
                            <label className="input-label">
                                Supply Amount 
                            </label>
                            <div className="amount-input-container">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder={"0.00"}
                                    className="amount-input"
                                    disabled={loading || !selectedAsset}
                                    required
                                />
                            </div>
                            <div className="input-hint">
                                
                                {/* Fee Information */}
                                {calculation && amount && parseFloat(amount) > 0 && selectedAsset && (
                                    <div className="asset-card">
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Transaction Fees:</div>
                                        <div>Batching Fee: {calculation.batchingFee?.toFixed(6) || '0'} ADA</div>
                                        {calculation.walletFee > 0 && (
                                            <div>Wallet Fee: {calculation.walletFee?.toFixed(6) || '0'} {(selectedAsset.marketId || selectedAsset.id).toUpperCase()}</div>
                                        )}
                                        {calculation.supplyCap && (
                                            <div style={{ color: '#666', marginTop: '4px' }}>
                                                Supply Cap: {calculation.supplyCap.toLocaleString()} {(selectedAsset.marketId || selectedAsset.id).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {calculationLoading && amount && parseFloat(amount) > 0 && (
                                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#666' }}>
                                        Calculating fees...
                                    </div>
                                )}
                            </div>
                        </div> 

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="confirm-button supply-confirm"
                                disabled={loading || !amount || parseFloat(amount) <= 0 || !selectedAsset}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner small"></div>
                                        Processing...
                                    </>
                                ) : !selectedAsset ? (
                                    'Select Asset First'
                                ) : !amount || parseFloat(amount) <= 0 ? (
                                    'Enter Amount'
                                ) : (
                                    `Supply ${selectedAsset.displayName}`
                                )}
                            </button>
                        </div>
                    </form>
                </div> 
            </div>
        </div>,
        document.body
    );
};

export default SupplyModal;