import React from 'react';

export interface YieldWidgetProps {
  /**
   * Array of Cardano addresses to fetch yield data for
   */
  addresses?: string[];
  
  /**
   * Display currency for yield amounts
   * @default 'GBP'
   */
  currency?: 'GBP' | 'USD' | 'EUR';
  
  /**
   * Custom API endpoint
   * @default 'https://v2.api.liqwid.finance/graphql'
   */
  apiUrl?: string;
  
  /**
   * Show/hide widget header with title and currency selector
   * @default true
   */
  showHeader?: boolean;
}

/**
 * Liqwid Yield Widget Component
 * 
 * A React component that displays yield earnings data from Liqwid Finance.
 * Can be used with pre-filled addresses or as an input form for users.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <YieldWidget />
 * 
 * // With pre-filled address
 * <YieldWidget 
 *   addresses={['addr1q86q7ntzwr...']}
 *   currency="USD"
 * />
 * ```
 */
export declare const YieldWidget: React.FC<YieldWidgetProps>;

export default YieldWidget;

// Global window object for script tag usage
declare global {
  interface Window {
    LiqwidYieldWidget?: {
      render: (elementId: string, props?: YieldWidgetProps) => any;
      create: (config: {
        elementId: string;
        addresses?: string[];
        currency?: 'GBP' | 'USD' | 'EUR';
        showHeader?: boolean; 
      }) => any;
    };
  }
}