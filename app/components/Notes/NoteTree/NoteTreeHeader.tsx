import React, {useState} from 'react';
import CreateNoteButton from '@/app/components/Notes/NoteTree/CreateNoteButton';
import SearchBar from './SearchBar';
import styles from './noteTree.module.scss';
import Typography from '@mui/material/Typography';
import {AiOutlineMore} from 'react-icons/ai';
import {IoClose} from 'react-icons/io5';
import TooltipIconButton from '@/app/components/UI/TooltipIconButton';

/**
 * The header for the NoteTree component
 * @param selectedNotes - The currently selected notes string[]
 * @param clearSelectedNotes - A function to clear the selected notes
 * @constructor
 */
function NoteTreeHeader({
  selectedNotes,
  clearSelectedNotes,
}: {
  selectedNotes: string[];
  clearSelectedNotes: () => void;
}) {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <div className={styles.noteTreeHeader}>
      {selectedNotes.length > 1 ? (
        <>
          <TooltipIconButton
            className={styles.closeButton}
            title={'Cancel Selection'}
            icon={<IoClose />}
            onClick={clearSelectedNotes}
          />

          <Typography>{selectedNotes.length} notes selected</Typography>
          <TooltipIconButton title={'More...'} icon={<AiOutlineMore />} />
        </>
      ) : (
        <>
          {!searchActive && <CreateNoteButton />}
          <SearchBar
            searchActive={searchActive}
            setSearchActive={setSearchActive}
          />{' '}
        </>
      )}
    </div>
  );
}

export default NoteTreeHeader;
