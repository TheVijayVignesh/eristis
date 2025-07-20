import { useState, useEffect, useCallback } from 'react';

const GUEST_DEBATES_KEY = 'windsurf_guest_debates';

/**
 * Custom hook to manage guest debates in local storage
 * @returns {Object} - Object containing guestDebates array and methods to manage them
 */
const useGuestDebates = () => {
  const [guestDebates, setGuestDebatesState] = useState(() => {
    try {
      const saved = localStorage.getItem(GUEST_DEBATES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse guest debates:', error);
      return [];
    }
  });

  // Save guest debates to local storage when they change
  useEffect(() => {
    try {
      localStorage.setItem(GUEST_DEBATES_KEY, JSON.stringify(guestDebates));
    } catch (error) {
      console.error('Failed to save guest debates:', error);
    }
  }, [guestDebates]);

  /**
   * Add a new debate to guest storage
   * @param {Object} debate - The debate object to add
   */
  const addGuestDebate = useCallback((debate) => {
    setGuestDebatesState(prevDebates => {
      const newDebate = {
        ...debate,
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        isGuest: true
      };
      
      // Keep only the most recent 10 debates to prevent local storage overflow
      const updatedDebates = [...prevDebates, newDebate].slice(-10);
      return updatedDebates;
    });
  }, []);

  /**
   * Update an existing guest debate
   * @param {string} debateId - The ID of the debate to update
   * @param {Object} updates - The updates to apply to the debate
   */
  const updateGuestDebate = useCallback((debateId, updates) => {
    setGuestDebatesState(prevDebates => 
      prevDebates.map(debate => 
        debate.id === debateId ? { ...debate, ...updates, updatedAt: new Date().toISOString() } : debate
      )
    );
  }, []);

  /**
   * Remove a guest debate
   * @param {string} debateId - The ID of the debate to remove
   */
  const removeGuestDebate = useCallback((debateId) => {
    setGuestDebatesState(prevDebates => 
      prevDebates.filter(debate => debate.id !== debateId)
    );
  }, []);

  /**
   * Clear all guest debates
   */
  const clearGuestDebates = useCallback(() => {
    setGuestDebatesState([]);
  }, []);

  /**
   * Get a single guest debate by ID
   * @param {string} debateId - The ID of the debate to retrieve
   * @returns {Object|undefined} - The found debate or undefined
   */
  const getGuestDebate = useCallback((debateId) => {
    return guestDebates.find(debate => debate.id === debateId);
  }, [guestDebates]);

  return {
    guestDebates,
    addGuestDebate,
    updateGuestDebate,
    removeGuestDebate,
    clearGuestDebates,
    getGuestDebate
  };
};

export default useGuestDebates;
