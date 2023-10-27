import { useState } from 'react';
import { useMutation } from '@apollo/client';
import DeleteNote from '@/app/graphql/mutations/DeleteNote';
import { useProjectContext } from '@/app/contexts/ProjectContext';

export const useNoteContextMenu = () => {
  const context = useProjectContext();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [rightClickedNoteId, setRightClickedNoteId] = useState<string | null>(
    null,
  );
  const [deleteNote, { loading, error }] = useMutation(DeleteNote);

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

  const handleDelete = async () => {
    try {
      const response = await deleteNote({
        variables: { id: rightClickedNoteId },
      });

      if (response.data.deleteNote) {
        console.log('Note successfully deleted!');
      } else {
        console.error('Failed to delete the note.');
      }

      handleClose();
      context.refetchData();
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
