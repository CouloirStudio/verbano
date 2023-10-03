import React, { useEffect, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PlaybackButton, { PlaybackButtonProps } from './PlaybackButton';

export default {
  title: 'Playback/PlaybackButton',
  component: PlaybackButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A button component used to start or pause playback.',
      },
    },
  },
  argTypes: {
    isRecording: {
      control: 'boolean',
      description: 'Whether the button is currently playing or not',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    toggleRecording: {
      action: 'togglePlayback', // It will log 'toggleRecording' when the button is clicked.
    },
  },
} as Meta;

const Template: StoryFn<PlaybackButtonProps> = (initialArgs) => {
  const [isPlaying, setIsPlaying] = useState(initialArgs.isPlaying);

  // Listen for changes in initialArgs.isRecording and update the local state
  useEffect(() => {
    setIsPlaying(initialArgs.isPlaying);
  }, [initialArgs.isPlaying]);

  const handleToggle = () => {
    action('toggleRecording')();
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className={initialArgs.theme}>
      <PlaybackButton
        {...initialArgs}
        isPlaying={isPlaying}
        togglePlayback={handleToggle}
      />
    </div>
  );
};

export const AllModes = Template.bind({});
AllModes.args = {
  isPlaying: false,
  theme: 'light', // or 'dark'
};
AllModes.parameters = {
  docs: {
    storyDescription: 'The PlaybackButton component with theme modes.',
  },
};
