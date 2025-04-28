
import { useEffect } from 'react';

// Custom event system for water consumption tracking

type WaterConsumptionEventDetail = {
  area: 'kitchen' | 'bathroom' | 'washing' | 'other';
  liters: number;
  userId: string;
};

export type WaterConsumptionEvent = CustomEvent<WaterConsumptionEventDetail>;

/**
 * Creates and dispatches a water consumption event
 */
export function emitWaterConsumed(detail: WaterConsumptionEventDetail): void {
  const event = new CustomEvent<WaterConsumptionEventDetail>('waterConsumed', { 
    detail,
    bubbles: true 
  });
  document.dispatchEvent(event);
  console.log('Water consumption event emitted:', detail);
}

/**
 * Adds a listener for water consumption events
 */
export function addWaterConsumedListener(
  callback: (event: WaterConsumptionEvent) => void
): () => void {
  const handler = (event: Event): void => {
    callback(event as WaterConsumptionEvent);
  };
  
  document.addEventListener('waterConsumed', handler);
  
  // Return a function to remove the listener
  return (): void => {
    document.removeEventListener('waterConsumed', handler);
  };
}

/**
 * Hook to listen for water consumption events
 */
export function useWaterConsumedListener(
  callback: (event: WaterConsumptionEvent) => void
): void {
  useEffect(() => {
    const removeListener = addWaterConsumedListener(callback);
    return removeListener;
  }, [callback]);
}
