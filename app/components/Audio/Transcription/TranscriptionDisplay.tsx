import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './transcription.module.scss';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { useNoteContext } from '@/app/contexts/NoteContext';
import ScrollView from '@/app/components/UI/ScrollView';
import Footer from '@/app/components/Layout/Footer';
import { useLazyQuery } from '@apollo/client';
import GetTranscription from '@/app/graphql/queries/GetTranscription.graphql';
import GetSingleSummary from '@/app/graphql/queries/GetSummary.graphql';
import TranscriptionSegment from './TranscriptionSegment';
import MuiMarkdown from 'mui-markdown';
import {
  Card,
  CardContent,
  CardHeader,
  Fade,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
} from '@mui/material';
import { AutoSizer, List, ListRowRenderer } from 'react-virtualized';

import RecordingSVG from '@/app/components/UI/SVGs/RecordingSVG';
import TranscriptionSVG from '@/app/components/UI/SVGs/TranscriptionSVG';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IoCopyOutline } from 'react-icons/io5';

class TranscriptionParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptionParseError';
  }
}

interface TranscriptionSegmentData {
  id: number;
  end: number;
  start: number;
  text: string;
  tokens: number[];
  avgLogProb: number;
  temperature: number;
  noSpeechProb: number;
  compressionRatio: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

/**
 * `TranscriptionDisplay` is a component that renders the transcription of a selected note.
 * It fetches the transcription data via a GraphQL query and displays it segment by segment.
 */
const TranscriptionDisplay: React.FC = () => {
  const { selectedNote } = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const { transcription, setTranscription } = useNoteContext();
  const { summary, setSummary } = useNoteContext();
  const [tabValue, setTabValue] = useState(-1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [getTranscript, { data, loading, error }] = useLazyQuery<{
    getTranscription: string;
  }>(GetTranscription);
  const [getSummary, { data: summaryData }] = useLazyQuery<{
    getSingleSummary: string;
  }>(GetSingleSummary);

  useEffect(() => {
    if (!selectedNote?.id) return;

    setTranscription('');
    getTranscript({ variables: { id: selectedNote.id } });
    getSummary({ variables: { id: selectedNote.id } });

    if (data && data.getTranscription) {
      try {
        const transcriptionData: TranscriptionSegmentData[] = JSON.parse(
          data.getTranscription,
        );
        setTranscription(JSON.stringify(transcriptionData, null, 2));
      } catch (error: unknown) {
        setIsError(true);
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof TranscriptionParseError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = 'An unexpected error occurred: ' + error.message;
        }
        setErrorMessage(errorMessage);
      }
    } else {
      setTranscription('');
    }

    if (summaryData && summaryData.getSingleSummary) {
      try {
        setSummary(summaryData.getSingleSummary);
      } catch (error: unknown) {
        setIsError(true);
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof TranscriptionParseError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = 'An unexpected error occurred: ' + error.message;
        }
        setErrorMessage(errorMessage);
      }
    } else {
      setSummary('');
    }
  }, [
    selectedNote?.id,
    getTranscript,
    getSummary,
    loading,
    error,
    data,
    summaryData,
    setIsError,
    setErrorMessage,
    setTranscription,
  ]);

  useEffect(() => {}, [transcription]);

  useEffect(() => {
    setTabValue(0);
  }, [selectedNote]);

  // Parse and render transcription segments
  const renderTranscription = (transcriptionJson: string) => {
    try {
      const parsedData: { segments: TranscriptionSegmentData[] } =
        JSON.parse(transcriptionJson);
      const segments = parsedData.segments;

      const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
        const segment = segments[index];

        return (
          <div key={key} style={style}>
            <TranscriptionSegment segment={segment} />
          </div>
        );
      };

      return (
        <div style={{ width: '100%', height: '100%', minHeight: '800px' }}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={segments.length}
                rowHeight={100}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        </div>
      );
    } catch (e) {
      return (
        <Typography variant="body2">
          Failed to load Replicate format. Try retranscribing. Current data:{' '}
          {transcriptionJson}
        </Typography>
      );
    }
  };

  const renderSummary = (summaryJson: string) => {
    return (
      <>
        <MuiMarkdown>{summaryJson}</MuiMarkdown>
      </>
    );
  };

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transcription);
    } catch (err) {
      // maybe perms issue or something, idk
    }
  }, [transcription]);

  return (
    <Box className={styles.transcription}>
      {selectedNote?.audioLocation && (
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Transcription tabs"
          sx={{ marginLeft: '16px' }}
        >
          <Tab label="Transcription" disabled={!transcription} />
          <Tab label="Summary" disabled={!summary} />
        </Tabs>
      )}

      <ScrollView>
        <TabPanel value={tabValue} index={0}>
          {selectedNote?.transcription && (
            <Card variant={'outlined'} sx={{ position: 'relative' }}>
              <Tooltip title="Copy to clipboard">
                <IconButton
                  onClick={copyToClipboard}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    m: 2,
                    zIndex: 2,
                  }}
                >
                  <IoCopyOutline />
                </IconButton>
              </Tooltip>
              <CardHeader
                title={<Typography variant={'h3'}>Transcription</Typography>}
                subheader={
                  <Typography>
                    Formatted transcript of your audio message
                  </Typography>
                }
              />
              <CardContent>
                {loading ? (
                  <Box>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </Box>
                ) : transcription ? (
                  renderTranscription(transcription)
                ) : null}
              </CardContent>
            </Card>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Card variant={'outlined'}>
            <CardHeader
              title={<Typography variant={'h3'}>Summary</Typography>}
              subheader={
                <Typography>The summary of your transcript</Typography>
              }
            />
            <CardContent>{summary ? renderSummary(summary) : null}</CardContent>
          </Card>
        </TabPanel>
        {!transcription && !summary && !selectedNote?.audioLocation && (
          <Fade in={true} timeout={300}>
            <Stack
              direction={'column'}
              justifyContent={'center'}
              flexGrow={1}
              height={'80%'}
              alignItems={'center'}
              spacing={3}
            >
              <Typography variant={'h4'} color="text.primary">
                Capture your thoughts and ideas <br /> through an audio note
              </Typography>
              <RecordingSVG />
            </Stack>
          </Fade>
        )}
        {!transcription && !summary && selectedNote?.audioLocation && (
          <Fade in={true} timeout={300}>
            <Stack
              direction={'column'}
              justifyContent={'center'}
              flexGrow={1}
              height={'80%'}
              alignItems={'center'}
              spacing={3}
            >
              <Typography variant={'h4'} color="textPrimary">
                Transcribe or listen to your audio note
              </Typography>
              <TranscriptionSVG />
            </Stack>
          </Fade>
        )}
      </ScrollView>
      <Footer
        footerText={
          transcription ? ` ${transcription}` : 'No transcription available'
        }
      />
    </Box>
  );
};

export default TranscriptionDisplay;
