/**
 * Utility functions for handling guest data when a user logs in or signs up
 */

/**
 * Saves guest debates to the user's account
 * @param {Array} guestDebates - Array of guest debates to save
 * @param {Function} apiCall - Function to make the API call to save the debates
 * @returns {Promise<boolean>} - True if saved successfully, false otherwise
 */
export const saveGuestDebates = async (guestDebates, apiCall) => {
  if (!guestDebates || guestDebates.length === 0) {
    return true; // Nothing to save
  }

  try {
    await apiCall(guestDebates);
    return true;
  } catch (error) {
    console.error('Failed to save guest debates:', error);
    return false;
  }
};

/**
 * Gets the appropriate message to display based on the number of guest debates
 * @param {number} count - Number of guest debates
 * @returns {string} - The message to display
 */
export const getGuestDebatesMessage = (count) => {
  if (count === 0) return '';
  if (count === 1) return 'You have 1 debate in guest mode. Save it to your account?';
  return `You have ${count} debates in guest mode. Save them to your account?`;
};

/**
 * Transforms guest debate data to match the server's expected format
 * @param {Object} guestDebate - The guest debate to transform
 * @returns {Object} - The transformed debate
 */
export const transformGuestDebateForServer = (guestDebate) => {
  // Remove any guest-specific properties and add timestamps
  const { id: _id, isGuest: _isGuest, ...debate } = guestDebate;
  return {
    ...debate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
