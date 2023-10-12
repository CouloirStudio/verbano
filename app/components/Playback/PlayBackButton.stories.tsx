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
    playbackState: {
      control: 'radio',
      options: ['playing', 'paused', 'idle'],
      description: 'State of the playback',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'idle' },
      },
    },
    togglePlayback: {
      action: 'togglePlayback',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Theme mode for the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'light' },
      },
    },
  },
} as Meta;

const Template: StoryFn<PlaybackButtonProps> = (initialArgs) => {
  const [playbackState, setPlaybackState] = useState(initialArgs.playbackState);

  // Listen for changes in initialArgs.playbackState and update the local state
  useEffect(() => {
    setPlaybackState(initialArgs.playbackState);
  }, [initialArgs.playbackState]);

  const handleToggle = () => {
    action('togglePlayback')();
    setPlaybackState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
  };

  return (
    <div className={initialArgs.theme}>
      <PlaybackButton
        {...initialArgs}
        playbackState={playbackState}
        togglePlayback={handleToggle}
      />
    </div>
  );
};

export const AllModes = Template.bind({});
AllModes.args = {
  playbackState: 'idle',
  theme: 'light',
};
AllModes.parameters = {
  docs: {
    storyDescription: 'The PlaybackButton component with theme modes.',
  },
};
