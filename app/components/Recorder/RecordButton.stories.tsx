import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react'; // Using StoryFn as suggested
import { action } from '@storybook/addon-actions';
import RecordButton, { RecordButtonProps } from './RecordButton';

export default {
  title: 'Recorder/RecordButton',
  component: RecordButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A button component used to start or stop recording.'
      }
    }
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
      action: 'clicked',
      description: 'Function to toggle the recording state',
      table: {
        type: { summary: 'function' },
      },
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the story container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'transparent' },
      },
    }
  }
} as Meta;

const Template: StoryFn<RecordButtonProps> = (initialArgs) => {
  const [isRecording, setIsRecording] = useState(initialArgs.isRecording);
  
  const handleToggle = () => {
    action('toggleRecording')();
    setIsRecording(prev => !prev);
  };

  return (
    <div style={{ backgroundColor: initialArgs.backgroundColor || 'transparent' }}>
      <RecordButton {...initialArgs} isRecording={isRecording} toggleRecording={handleToggle} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  isRecording: false,
  backgroundColor: 'transparent',
};
Default.parameters = {
  docs: {
    storyDescription: 'A default state for the RecordButton component.',
  }
}

export const Recording = Template.bind({});
Recording.args = {
  isRecording: true,
  backgroundColor: 'transparent',
};
Recording.parameters = {
  docs: {
    storyDescription: 'The RecordButton component when it is actively recording.',
  }
}
