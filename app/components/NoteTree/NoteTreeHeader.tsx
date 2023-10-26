import React, { useState } from 'react';
import CreateNoteButton from '@/app/components/NoteTree/CreateNoteButton';
import { PiNotePencil } from 'react-icons/pi';
import SearchBar from './SearchBar';
import styles from './noteTree.module.scss';

function NoteTreeHeader() {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <div className={styles.noteTreeHeader}>
      {!searchActive && <CreateNoteButton />}
      <SearchBar
        searchActive={searchActive}
        setSearchActive={setSearchActive}
      />
    </div>
  );
}

export default NoteTreeHeader;
