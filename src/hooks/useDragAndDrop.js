import { useState, useCallback } from 'react';

/**
 * Custom hook for drag and drop operations
 * @param {Object} options - Options for drag and drop
 * @returns {Object} - Drag and drop state and handlers
 */
export const useDragAndDrop = ({ onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handles the dragover event
   * @param {Event} e - The dragover event
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handles the dragenter event
   * @param {Event} e - The dragenter event
   */
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handles the dragleave event
   * @param {Event} e - The dragleave event
   */
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Handles the drop event
   * @param {Event} e - The drop event
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files?.length) {
      const file = e.dataTransfer.files[0];
      onDrop(file);
    }
  }, [onDrop]);

  // Bundle all props for easier use
  const dragProps = {
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  };

  return {
    isDragging,
    dragProps
  };
};
