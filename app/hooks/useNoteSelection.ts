import { useNoteListContext } from "@/app/contexts/NoteListContext";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { useCallback, useEffect } from "react";

/**
 * A custom hook to handle selecting notes.
 * @param id of the first note selected
 */
const useNoteSelection = (id: string) => {
  const { selectedNotes, setSelectedNotes } = useNoteListContext();
  const context = useProjectContext();

  useEffect(() => {
    const handleGlobalKeyDown = (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault(); // Prevent the default "select all" behavior
        if (selectedNotes.length > 0) {
          // Check if there's a selected note
          setSelectedNotes(
            context.selectedProject?.notes.map((n) => n.note.id) || [],
          );
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [context, setSelectedNotes, selectedNotes]);

  /**
   * Handles when a note is selected by being clicked.
   */
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (selectedNotes.includes(id)) {
          setSelectedNotes(selectedNotes.filter((noteId) => noteId !== id));
        } else {
          setSelectedNotes([...selectedNotes, id]);
        }
      } else if (event.shiftKey) {
        // shift key
        if (selectedNotes.length === 0) {
          setSelectedNotes([id]);
        } else {
          const firstSelectedNote = selectedNotes[0];
          const firstSelectedNotePosition = context.selectedProject?.notes.find(
            (n) => n.note.id === firstSelectedNote,
          )?.position;
          const currentNotePosition = context.selectedProject?.notes.find(
            (n) => n.note.id === id,
          )?.position;

          if (
            firstSelectedNotePosition !== undefined &&
            currentNotePosition !== undefined
          ) {
            const newSelectedNotes = context.selectedProject?.notes
              .filter(
                (n) =>
                  n.position >=
                    Math.min(firstSelectedNotePosition, currentNotePosition) &&
                  n.position <=
                    Math.max(firstSelectedNotePosition, currentNotePosition),
              )
              .map((n) => n.note.id);

            if (newSelectedNotes) {
              setSelectedNotes(newSelectedNotes);
            }
          }
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

  return {
    handleClick,
    isSelected: selectedNotes.includes(id),
  };
};

export default useNoteSelection;
