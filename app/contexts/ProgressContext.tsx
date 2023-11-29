import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { MdExpandLess } from 'react-icons/md';
import { useTheme } from '@mui/material/styles';
import { IoSparklesOutline } from 'react-icons/io5';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

type ProgressType = 'Transcription' | 'Summary';

interface TaskDetail {
  noteName: string;
  progress: number;
  estimatedSecondsLeft?: number;
}

interface Task {
  [key: string]: { [type in ProgressType]?: TaskDetail };
}

interface ProgressContextProps {
  tasks: Task;
  updateProgress: (
    noteName: string,
    noteId: string,
    actionType: ProgressType,
    progress: number,
    estimatedSecondsLeft?: number,
  ) => void;
  removeTask: (noteId: string, actionType: ProgressType) => void;
}

const ProgressContext = createContext<ProgressContextProps | undefined>(
  undefined,
);

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task>({});

  const updateProgress = (
    noteName: string,
    noteId: string,
    actionType: ProgressType,
    progress: number,
    estimatedSecondsLeft?: number,
  ) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [noteId]: {
        ...prevTasks[noteId],
        [actionType]: {
          noteName,
          progress,
          estimatedSecondsLeft,
        },
      },
    }));
  };

  const removeTask = (noteId: string, actionType: ProgressType) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      if (updatedTasks[noteId]) {
        delete updatedTasks[noteId][actionType];
        if (Object.keys(updatedTasks[noteId]).length === 0) {
          delete updatedTasks[noteId];
        }
      }
      return updatedTasks;
    });
  };

  return (
    <ProgressContext.Provider value={{ tasks, updateProgress, removeTask }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextProps => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

const ProgressBox: React.FC = () => {
  const { tasks, removeTask } = useProgress();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
      .filter(Boolean)
      .join(':');
  };

  const label = (action: string) => {
    if (action === 'Transcription') {
      return 'Transcribing';
    }
    return 'Summarising';
  };

  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastTaskCount, setLastTaskCount] = useState(0);

  useEffect(() => {
    if (Object.keys(tasks).length > lastTaskCount) {
      setIsExpanded(true);
    }
    setLastTaskCount(Object.keys(tasks).length);
  }, [tasks]);

  const handleAccordionChange = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      position="fixed"
      bottom={50}
      right={30}
      width="400px"
      bgcolor="background.paper"
      boxShadow={3}
      zIndex={1000}
    >
      {tasks && Object.entries(tasks).length > 0 && (
        <Accordion expanded={isExpanded}>
          <AccordionSummary
            expandIcon={<MdExpandLess />}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
            }}
            onClick={handleAccordionChange}
          >
            <Typography variant={'h6'}>
              <IoSparklesOutline />
              AI Operations
            </Typography>
          </AccordionSummary>
          <Stack p={2} direction={'column'} spacing={2}>
            {Object.entries(tasks).map(([noteId, actions]) =>
              Object.entries(actions).map(([actionType, task]) => (
                <Box key={`${noteId}-${actionType}`}>
                  <Stack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    direction={'column'}
                    spacing={1}
                  >
                    <Stack
                      alignItems={'center'}
                      justifyContent={'space-between'}
                      direction={'row'}
                      sx={{ width: '100%' }}
                    >
                      <Typography variant="body2" noWrap>
                        {label(actionType)} {task.noteName}
                      </Typography>
                      {task?.estimatedSecondsLeft !== undefined ? (
                        task.progress == 1 ? (
                          <IoIosCheckmarkCircleOutline
                            size={'2rem'}
                            color={theme.palette.secondary.main}
                          />
                        ) : (
                          <>
                            {task?.estimatedSecondsLeft > 0 ? (
                              <Chip
                                label={
                                  task?.estimatedSecondsLeft
                                    ? `Time left: ${formatTime(
                                        task?.estimatedSecondsLeft,
                                      )}`
                                    : ''
                                }
                              />
                            ) : (
                              <Chip label={'Preparing...'} color={'info'} />
                            )}
                          </>
                        )
                      ) : (
                        <CircularProgress size="2rem" />
                      )}
                    </Stack>
                    <LinearProgress
                      variant={'determinate'}
                      sx={{ width: '100%' }}
                      value={(task?.progress ?? 0) * 100}
                      color={task?.progress == 1 ? 'success' : 'primary'}
                    />
                  </Stack>
                </Box>
              )),
            )}
          </Stack>
        </Accordion>
      )}
    </Box>
  );
};

export default ProgressBox;
