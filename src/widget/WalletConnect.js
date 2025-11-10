import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { NetworkType } from "@cardano-foundation/cardano-connect-with-wallet-core";

const WalletConnect = ({ onConnect, onDisconnect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const network = NetworkType.MAINNET; // You can make this configurable

  const {
    isConnected,
    stakeAddress, 
    disconnect,
    accountBalance,
    connect,
    installedExtensions,
  } = useCardano({
    limitNetwork: network,
  });



  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="connected-wallet">
          <div className="wallet-info">
            <div className="wallet-address">
              <span className="label">Address:</span>
              <span className="address">
                {stakeAddress?.slice(0, 10)}
                {"..."}
                {stakeAddress?.slice(stakeAddress.length - 6)}
              </span>
            </div>
            <div className="wallet-balance">
              <span className="label">Balance:</span>
              <span className="balance">{accountBalance} ₳</span>
            </div>
          </div>
          <button 
            className="disconnect-button"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="connect-section">
          <button
            className="connect-button"
            onClick={() => setIsModalOpen(true)}
          >
            Connect Wallet
          </button>
        </div>
      )}

      {isModalOpen && !isConnected && 
        createPortal(
          <div className="wallet-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Select Wallet</h3>
                <button 
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                {installedExtensions.length > 0 ? (
                  <div className="wallet-options">
                    {installedExtensions.map((provider) => (
                      <button
                        key={provider}
                        className="wallet-option"
                        onClick={() => {
                          connect(provider);
                          setIsModalOpen(false);
                        }}
                      >
                        <span className="wallet-name">
                          {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-wallets">
                    <p>No Cardano wallets detected.</p>
                    <p>Please install a Cardano wallet extension like Nami, Eternl, or Flint.</p>
                  </div>
                )}
                <button
                  className="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default WalletConnect;