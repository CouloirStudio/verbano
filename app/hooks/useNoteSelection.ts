import { useNoteListContext } from '@/app/contexts/NoteListContext';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useCallback } from 'react';

const useNoteSelection = (id: string) => {
  const { selectedNotes, setSelectedNotes } = useNoteListContext();
  const context = useProjectContext();

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (selectedNotes.includes(id)) {
          setSelectedNotes(selectedNotes.filter((noteId) => noteId !== id));
        } else {
          setSelectedNotes([...selectedNotes, id]);
        }
      } else {
        setSelectedNotes([id]);

        const activeNote = context.selectedProject?.notes.find(
          (n) => n.note.id === id,
        )?.note;
        if (activeNote) {
          context.setSelectedNote?.(activeNote);
        }
      }
    },
    [id, selectedNotes, setSelectedNotes, context],
  );

  return { handleClick, isSelected: selectedNotes.includes(id) };
};

export default useNoteSelection;
