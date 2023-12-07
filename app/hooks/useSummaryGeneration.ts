// useGenerateSummary.ts
import { useCallback } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { useNoteContext } from '@/app/contexts/NoteContext';
import { useProgress } from '@/app/contexts/ProgressContext';
import { summarize } from '@/app/api/summarize';

export const useGenerateSummary = (BASE_URL: string) => {
  const { selectedNote } = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const { setSummary } = useNoteContext();
  const { updateProgress, removeTask } = useProgress();

  return useCallback(
    async (prompt?: string) => {
      const selectedNotes = [selectedNote]; // Assuming multiple notes can be selected
      const combinedIds = selectedNotes.map((note) => note?.id).join(',');

      try {
        if (selectedNotes.length > 0) {
          updateProgress(
            selectedNote?.noteName || 'Notes',
            combinedIds,
            'Summary',
            0.0,
            0,
          );

          const summary = await summarize(selectedNotes, prompt, BASE_URL);

          updateProgress(
            selectedNote?.noteName || 'Notes',
            combinedIds,
            'Summary',
            1.0,
            0,
          );
          setSummary(summary);
        } else {
          setIsError(true);
          setErrorMessage('No notes selected.');
          removeTask(combinedIds, 'Summary');
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
        removeTask(combinedIds, 'Summary');
        if (error instanceof Error) setErrorMessage(error.message);
      }
    },
    [
      BASE_URL,
      selectedNote,
      updateProgress,
      removeTask,
      setSummary,
      setIsError,
      setErrorMessage,
    ],
  );
};
