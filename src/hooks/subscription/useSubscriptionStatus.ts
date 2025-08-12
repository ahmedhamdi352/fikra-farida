import { useMemo } from 'react';

interface SubscriptionStatusProps {
  subscriptionType?: number;
  subscriptionEndDate?: string | null; // ISO date string
}

/**
 * Custom hook to check if a subscription is valid
 * @param subscriptionType - The type of subscription (2 for premium)
 * @param subscriptionEndDate - The end date of the subscription in ISO format
 * @returns {boolean} - True if subscription is valid (type is 2 and not expired), false otherwise
 */
export const useSubscriptionStatus = ({
  subscriptionType,
  subscriptionEndDate,
}: SubscriptionStatusProps): boolean => {
  return useMemo(() => {
    // If no subscription type or not premium (type 2), return false
    if (subscriptionType !== 2) return false;

    // If no end date, treat as expired
    if (!subscriptionEndDate) return false;

    try {
      const endDate = new Date(subscriptionEndDate);
      const now = new Date();
      
      // Check if the subscription end date is in the future
      return endDate > now;
    } catch (error) {
      console.error('Error parsing subscription end date:', error);
      return false;
    }
  }, [subscriptionType, subscriptionEndDate]);
};

export default useSubscriptionStatus;
