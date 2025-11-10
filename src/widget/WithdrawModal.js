import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom'; 
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { NetworkType } from "@cardano-foundation/cardano-connect-with-wallet-core";

const WithdrawModal = ({ 
  isOpen, 
  onClose, 
  asset, 
  addresses = [],
  apiUrl,
  onSuccess,
  onError
}) => {
    const network = NetworkType.MAINNET; 
    const wallet = localStorage.getItem("cf-last-connected-wallet").toUpperCase();
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

                        // Store CBOR UTXOs directly
                        setUtxos(utxosCbor);
                        return;
                        
                    } catch (walletError) {
                        console.warn('Failed to get UTXOs from wallet:', walletError);                    }
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

    // Calculate withdrawal fees and limits
    const calculateWithdrawal = useCallback(async (withdrawAmount) => {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;

        setCalculationLoading(true);
        try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "x-app-source": "itzdanny-liqwid-sdk"
            },
            body: JSON.stringify({
            operationName: 'GetWithdrawCalculation',
            variables: {
                input: {
                amount: parseFloat(withdrawAmount),
                marketId: asset.marketId,
                wallet: wallet
                }
            },
            query: `query GetWithdrawCalculation($input: WithdrawCalculationInput!) {
                liqwid {
                calculations {
                    withdraw(input: $input) {
                    batchingFee
                    walletFee
                    withdrawCap
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

        const calculationResult = data.data.liqwid.calculations.withdraw;
        setCalculation(calculationResult);
        
        } catch (err) {
        console.warn('Failed to calculate withdrawal fees:', err);
        // Don't show calculation errors to user, just log them
        } finally {
        setCalculationLoading(false);
        }
    }, [apiUrl, asset.marketId, wallet]);

    // Debounced calculation effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
        if (amount && parseFloat(amount) > 0) {
            calculateWithdrawal(amount);
        }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [amount, calculateWithdrawal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
        }

        if (parseFloat(amount) > asset.underlyingAmount) {
        setError('Amount exceeds available balance');
        return;
        }

        // Check withdrawal cap if available
        if (calculation && calculation.withdrawCap && parseFloat(amount) > calculation.withdrawCap) {
        setError(`Amount exceeds withdrawal cap of ${calculation.withdrawCap.toLocaleString()}`);
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
        
        // Convert amount to floating point (API expects float, not smallest unit)
        const withdrawAmount = parseFloat(amount*1000000);
        
        const withdrawInput = {
            marketId: asset.marketId,
            amount: withdrawAmount,
            address: primaryAddress,
            changeAddress: changeAddress || primaryAddress, // Use primary address if not provided
            otherAddresses: addresses.slice(1), // All addresses except the first one
            utxos: formattedUtxos,
            wallet: wallet
        };

        // Add custom output destination if specified
        if (changeAddress && changeAddress !== primaryAddress) {
            withdrawInput.withdrawnUnderlyingDestination = {
            address: changeAddress
            };
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "x-app-source": "itzdanny-liqwid-sdk"
            },
            body: JSON.stringify({
            operationName: 'GetWithdrawTransaction',
            variables: {
                input: withdrawInput
            },
            query: `query GetWithdrawTransaction($input: WithdrawTransactionInput!) {
                liqwid {
                transactions {
                    withdraw(input: $input) {
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
        const transactionResult = data.data.liqwid.transactions.withdraw;
        
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
                        message: 'Withdrawal transaction signed and submitted successfully',
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
                message: 'Withdrawal transaction created (requires manual signing)',
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
        const errorMessage = err.message || 'Failed to process withdrawal';
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
        onClose();
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and decimal points, limit to 6 decimal places
        if (value === '' || /^\d*\.?\d{0,6}$/.test(value)) {
        setAmount(value);
        setError(null);
        }
    };

    const setMaxAmount = () => {
        setAmount(asset.underlyingAmount.toFixed(6));
        setError(null);
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={handleClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
                <div className="asset-info">
                <img 
                    src={asset.assetLogo || `https://public.liqwid.finance/v5/assets/${asset.marketId.toUpperCase()}.svg`} 
                    alt={asset.marketDisplayName}
                    className="asset-logo"
                    width={32}
                    height={32}
                />
                <div>
                    <h3>Withdraw {asset.marketDisplayName}</h3>
                    <p className="available-balance">
                    Available: {asset.underlyingAmount.toLocaleString('en-US', { 
                        maximumFractionDigits: 6,
                        minimumFractionDigits: 2 
                    })}
                    </p>
                </div>
                </div>
                <button className="close-button" onClick={handleClose} disabled={loading}>
                ×
                </button>
            </div>

            {/* Body */}
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                {/* Amount Input */}
                <div className="input-group">
                    <label className="input-label">Withdraw Amount</label>
                    <div className="amount-input-container">
                    <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        className="amount-input"
                        disabled={loading}
                        required
                    />
                    <button
                        type="button"
                        className="max-button"
                        onClick={setMaxAmount}
                        disabled={loading}
                    >
                        MAX
                    </button>
                    </div>
                    <div className="input-hint">
                    You will receive approximately {amount ? 
                        parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 6 }) : 
                        '0'
                    } {asset.marketId.toUpperCase()}
                    
                    {/* Fee Information */}
                    {calculation && amount && parseFloat(amount) > 0 && (
                        <div class='asset-card'>
                        <div>Transaction Fees:</div>
                        <div>Batching Fee: {calculation.batchingFee?.toFixed(6) || '0'} ADA</div>
                        {calculation.walletFee > 0 && (
                            <div>Wallet Fee: {calculation.walletFee?.toFixed(6) || '0'} {asset.marketId.toUpperCase()}</div>
                        )}
                        {calculation.withdrawCap && (
                            <div>
                            Withdrawal Cap: {calculation.withdrawCap.toLocaleString()} {asset.marketId.toUpperCase()}
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
                    className="confirm-button withdraw"
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    >
                    {loading ? (
                        <>
                        <div className="spinner small"></div>
                        Processing...
                        </>
                    ) : (
                        'Withdraw'
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

export default WithdrawModal;
