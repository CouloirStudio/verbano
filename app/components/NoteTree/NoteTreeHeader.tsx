import React from 'react';
import CreateNoteButton from '@/app/components/NoteTree/CreateNoteButton';
import { PiNotePencil } from 'react-icons/pi';
import { IoSearchOutline } from 'react-icons/io5';

const styles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.6rem',
  color: '#4d99a8',
};

function NoteTreeHeader() {
  return (
    <div style={styles}>
      <CreateNoteButton />
      <PiNotePencil />
      <IoSearchOutline />
    </div>
  );
}

export default NoteTreeHeader;
