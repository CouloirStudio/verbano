import React, { useState, useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RecordButton, { RecordButtonProps } from './RecordButton';

export default {
  title: 'Recorder/RecordButton',
  component: RecordButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A button component used to start or stop recording.',
      },
    },
  },
  argTypes: {
    isRecording: {
      control: 'boolean',
      description: 'Whether the button is currently recording or not',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    toggleRecording: {
      action: 'toggleRecording', // It will log 'toggleRecording' when the button is clicked.
    },
  },
} as Meta;

const Template: StoryFn<RecordButtonProps> = (initialArgs) => {
  const [isRecording, setIsRecording] = useState(initialArgs.isRecording);

  // Listen for changes in initialArgs.isRecording and update the local state
  useEffect(() => {
    setIsRecording(initialArgs.isRecording);
  }, [initialArgs.isRecording]);

  const handleToggle = () => {
    action('toggleRecording')();
    setIsRecording((prev) => !prev);
  };

  return (
    <div className={initialArgs.theme}>
      <RecordButton
        {...initialArgs}
        isRecording={isRecording}
        toggleRecording={handleToggle}
      />
    </div>
  );
};

export const AllModes = Template.bind({});
AllModes.args = {
  isRecording: false,
  theme: 'light', // or 'dark'
};
AllModes.parameters = {
  docs: {
    storyDescription: 'The RecordButton component with theme modes.',
  },
};
