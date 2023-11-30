import { useState } from 'react';
import { useMutation } from '@apollo/client';
import DeleteNote from '@/app/graphql/mutations/DeleteNote';
import { useProjectContext } from '@/app/contexts/ProjectContext';

/**
 * Custom hook for handling the Note context menu.
 */
export const useNoteContextMenu = () => {
  const { refetchData, setSelectedNote } = useProjectContext();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [rightClickedNoteId, setRightClickedNoteId] = useState<string | null>(
    null,
  );
  const [deleteNote, { loading, error }] = useMutation(DeleteNote);

  /**
   * Handles the interaction with the context menu.
   * @param event react mouse event
   * @param noteId the id of the note
   */
  const handleContextMenu = (event: React.MouseEvent, noteId: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
    setRightClickedNoteId(noteId);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  /**
   * Handles the deletion of the note
   */
  const handleDelete = async () => {
    try {
      const response = await deleteNote({
        variables: { id: rightClickedNoteId },
      });

      if (!response.data.deleteNote) {
        console.error('Failed to delete the note.');
      }

      handleClose();
      setSelectedNote(null);
      refetchData();
    } catch (err: any) {
      console.error('Error while deleting the note:', err.message);
    }
  };

  return {
    contextMenu,
    handleContextMenu,
    handleClose,
    handleDelete,
    setRightClickedNoteId,
    loading,
    error,
  };
};
