import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  tabsContainer: {
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between',
  },
  tabItem: {
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    width: '50%',
    padding: '3px 5px',
    margin: '6px',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    '&.Mui-selected': {
      backgroundColor: '#68BBCA',
      borderRadius: '15px',
    },
  },
}));

export default useStyles;
