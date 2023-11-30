import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
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
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from 'react-icons/io';

type ProgressType = 'Transcription' | 'Summary';

/**
 * Defines the shape of the TaskDetail, which is the value of a task in the tasks object.
 */
interface TaskDetail {
  noteName: string;
  progress: number;
  estimatedSecondsLeft?: number;
}

interface Task {
  [key: string]: { [type in ProgressType]?: TaskDetail };
}

/**
 * Defines the shape of the ProgressContext.
 */
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

/**
 * Provides the ProgressContext to child components.
 * @param children The child components to render.
 * @constructor The ProgressProvider component.
 */
export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });

  const progressIntervalsRef = useRef<{ [noteId: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    // On load, restart polling for any ongoing tasks
    Object.entries(tasks).forEach(([noteId, taskDetails]) => {
      if (taskDetails.Transcription && taskDetails.Transcription.progress < 1) {
        startPolling(noteId, taskDetails.Transcription.noteName);
      }
    });

    return () => {
      // Cleanup: clear all intervals when unmounting
      Object.values(progressIntervalsRef.current).forEach(clearInterval);
    };
  }, [tasks]);

  const BASE_URL = 'https://localhost:3000';

  /**
   * Starts polling for the progress of a transcription task.
   * @param noteId The ID of the note to poll for.
   * @param noteName The name of the note to poll for.
   */
  const startPolling = (noteId: string, noteName: string) => {
    const checkProgress = () => {
      fetch(`${BASE_URL}/transcription/progress/${noteId}`)
        .then((response) => {
          if (!response.ok) {
            removeTask(noteId, 'Transcription');
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.progress === 1) {
            clearInterval(progressIntervalsRef.current[noteId]);
          }

          updateProgress(
            noteName,
            noteId,
            'Transcription',
            data.progress,
            data.estimatedSecondsLeft,
          );
        })
        .catch((error) => {
          console.error('Error fetching transcription progress:', error);
        });
    };

    // Clear any existing interval for this noteId
    if (progressIntervalsRef.current[noteId]) {
      clearInterval(progressIntervalsRef.current[noteId]);
    }

    // Start a new polling interval
    progressIntervalsRef.current[noteId] = setInterval(checkProgress, 1000);
  };

  /**
   * Stops polling for the progress of a transcription task.
   * @param noteId The ID of the note to stop polling for.
   */
  const stopPolling = (noteId: string) => {
    if (progressIntervalsRef.current[noteId]) {
      clearInterval(progressIntervalsRef.current[noteId]);
      delete progressIntervalsRef.current[noteId];
    }
  };

  /**
   * Updates the progress of a task.
   * @param noteName The name of the note to update progress for.
   * @param noteId The ID of the note to update progress for.
   * @param actionType The type of action to update progress for. Either 'Transcription' or 'Summary'.
   * @param progress The progress of the task.
   * @param estimatedSecondsLeft The estimated seconds left for the task.
   */
  const updateProgress = (
    noteName: string,
    noteId: string,
    actionType: ProgressType,
    progress: number,
    estimatedSecondsLeft?: number,
  ) => {
    setTasks((prevTasks) => {
      const updatedTasks = {
        ...prevTasks,
        [noteId]: {
          ...prevTasks[noteId],
          [actionType]: {
            noteName,
            progress,
            estimatedSecondsLeft,
          },
        },
      };

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      return updatedTasks;
    });

    if (progress === 1) {
      stopPolling(noteId);
    }
  };

  /**
   * Removes a task from the tasks object.
   * @param noteId The ID of the note to remove the task for.
   * @param actionType The type of action to remove the task for. Either 'Transcription' or 'Summary'.
   */
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

    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  return (
    <ProgressContext.Provider value={{ tasks, updateProgress, removeTask }}>
      {children}
    </ProgressContext.Provider>
  );
};

/**
 * A hook to use the ProgressContext.
 * @returns The ProgressContext.
 */
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
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(tasks).length > lastTaskCount) {
      setIsExpanded(true);
    }
    setLastTaskCount(Object.keys(tasks).length);
  }, [tasks]);

  const handleAccordionChange = () => {
    setIsExpanded(!isExpanded);
  };

  const renderStatusChip = (task: TaskDetail) => {
    if (task.progress < 1) {
      if (task.estimatedSecondsLeft !== undefined) {
        return task.estimatedSecondsLeft > 0 ? (
          <Chip label={`Time left: ${formatTime(task.estimatedSecondsLeft)}`} />
        ) : (
          <Chip label={'Preparing...'} color={'info'} />
        );
      }
    }
    return null;
  };

  const renderTaskIcon = (
    noteId: string,
    actionType: ProgressType,
    task: TaskDetail,
  ) => {
    const taskId = `${noteId}-${actionType}`;
    const isTaskComplete = task.progress === 1;
    const isHovering = hoveredTask === taskId;

    if (isTaskComplete) {
      return isHovering ? (
        <IoIosCloseCircleOutline
          size={'2rem'}
          color={theme.palette.primary.dark}
          onClick={() => removeTask(noteId, actionType)}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <IoIosCheckmarkCircleOutline
          size={'2rem'}
          color={theme.palette.secondary.main}
        />
      );
    }

    if (task.estimatedSecondsLeft && task.estimatedSecondsLeft == 0) {
      return <CircularProgress size="2rem" />;
    }
  };

  const emptyTasks = Object.entries(tasks).length === 0;

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
      {!emptyTasks && (
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
                      onMouseEnter={() =>
                        setHoveredTask(`${noteId}-${actionType}`)
                      }
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      <Typography variant="body2" noWrap>
                        {label(actionType)} {task.noteName}
                      </Typography>
                      {renderStatusChip(task)}
                      {renderTaskIcon(noteId, actionType as ProgressType, task)}
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
