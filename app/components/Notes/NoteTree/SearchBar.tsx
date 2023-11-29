import React from 'react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { IoClose, IoSearchOutline } from 'react-icons/io5';
import styles from './noteTree.module.scss';

type SearchBarProps = {
  setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchActive: boolean;
};

/**
 * SearchBar is a functional component that allows the user to search through items in the note or summary tree.
 * @param setSearchActive sets the searchActive boolean
 * @param searchActive a boolean that represents if the search element is active
 */
const SearchBar: React.FC<SearchBarProps> = ({
  setSearchActive,
  searchActive,
}) => {
  return searchActive ? (
    <div className={styles.searchContainer}>
      <IconButton className={styles.searchIcon}>
        <IoSearchOutline />
      </IconButton>
      <InputBase
        placeholder="Search…"
        className={styles.inputInput}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton
        className={styles.closeButton}
        onClick={() => setSearchActive(false)}
      >
        <IoClose />
      </IconButton>
    </div>
  ) : (
    <IconButton
      onClick={() => setSearchActive(true)}
      className={styles.searchIcon}
    >
      <IoSearchOutline />
    </IconButton>
  );
};

export default SearchBar;
