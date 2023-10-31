import React, {useState} from 'react';
import CreateNoteButton from '@/app/components/Notes/NoteTree/CreateNoteButton';
import SearchBar from './SearchBar';
import styles from './noteTree.module.scss';
import Typography from '@mui/material/Typography';
import {IconButton, Tooltip} from '@mui/material';
import {AiOutlineMore} from 'react-icons/ai';
import {IoClose} from 'react-icons/io5';

/**
 * The header for the NoteTree component
 * @param selectedNotes - The currently selected notes string[]
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
          <Tooltip title={'Cancel Selection'}>
            <IconButton
              className={styles.closeButton}
              onClick={clearSelectedNotes}
            >
              <IoClose />
            </IconButton>
          </Tooltip>

          <Typography>{selectedNotes.length} notes selected</Typography>
          <Tooltip title={'More...'}>
            <IconButton>
              <AiOutlineMore />
            </IconButton>
          </Tooltip>
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
