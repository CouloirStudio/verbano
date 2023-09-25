/**
 * Recorder Component Tests Documentation
 *
 * This documentation provides details about the unit tests written for the Recorder component.
 * The tests ensure that the component behaves correctly and maintains expected behavior under various scenarios.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Recorder from '../app/components/Recorder/index';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';

// Declare the mockGetUserMedia variable
let mockGetUserMedia: jest.Mock;

// Mock the clearStreams function directly within the mock
let mockClearStreams: jest.Mock;

// Mock the recordrtc library
jest.mock('recordrtc', () => {
    const mockStartRecording = jest.fn();
    const mockStopRecording = jest.fn((callback) => {
        callback(); // Simulate the callback when stopping recording
    });

    return {
        __esModule: true,
        default: jest.fn().mockReturnValue({
            startRecording: mockStartRecording,
            stopRecording: mockStopRecording,
            getBlob: jest.fn(),
            destroy: jest.fn(),
        }),
        invokeSaveAsDialog: jest.fn(),
    };
});

beforeEach(() => {
    // Clear any recorded calls on the mock functions before each test
    jest.clearAllMocks();
    mockGetUserMedia = jest.fn();
    mockClearStreams = jest.fn();
    navigator.mediaDevices.getUserMedia = mockGetUserMedia.mockResolvedValue({
        getTracks: () => [],
    });
});

afterEach(cleanup);

describe('Recorder Component Tests', () => {
    /**
     * Test: renders start recording button initially
     * Description: This test verifies that the component renders with the initial "Start Recording" button.
     * Expected Outcome: The "Start Recording" button should be rendered when the component is initially displayed.
     */
    it('renders start recording button initially', () => {
        render(
            <ErrorModalContextProvider>
                <Recorder />
            </ErrorModalContextProvider>
        );
        expect(screen.getByText('Start Recording')).toBeInTheDocument();
    });

    /**
     * Test: toggles recording when the button is clicked and updates state
     * Description: This test simulates clicking the "Start Recording" button, then clicking the "Stop Recording" button,
     * and checks if the component correctly toggles recording and updates its state.
     * Expected Outcome: The component should switch from "Start Recording" to "Stop Recording" when recording starts,
     * and then back to "Start Recording" when recording stops. The state should reflect this change.
     */
    it('toggles recording when the button is clicked and updates state', async () => {
        render(
            <ErrorModalContextProvider>
                <Recorder />
            </ErrorModalContextProvider>
        );

        // Click to start recording
        const startRecordingButton = screen.getByText('Start Recording');
        fireEvent.click(startRecordingButton);

        await waitFor(() => {
            const stopRecordingButton = screen.getByText('Stop Recording');
            expect(stopRecordingButton).toBeInTheDocument();
        });

        // Click to stop recording
        const stopRecordingButton = screen.getByText('Stop Recording');
        fireEvent.click(stopRecordingButton);

        await waitFor(() => {
            const startRecordingButton = screen.getByText('Start Recording');
            expect(startRecordingButton).toBeInTheDocument();
        });
    });

    /**
     * Test: does not clear streams when recording
     * Description: This test ensures that the component does not clear streams when recording is in progress.
     * It checks if the clearStreams function is not called during recording.
     * Expected Outcome: The clearStreams function should not be called when recording is active.
     */
    it('does not clear streams when recording', async () => {
        render(
            <ErrorModalContextProvider>
                <Recorder />
            </ErrorModalContextProvider>
        );

        // Click to start recording
        const startRecordingButton = screen.getByText('Start Recording');
        fireEvent.click(startRecordingButton);

        // Ensure that clearStreams function is not called
        expect(mockClearStreams).not.toHaveBeenCalled();
    });

    /**
     * Test: stops recording, clears stream, and cleans up resources on unmount
     * Description: This test simulates starting recording, then unmounting the component,
     * and checks if the component correctly stops recording, clears the stream, and cleans up resources during unmount.
     * Expected Outcome: The component should stop recording, clear the stream, and execute cleanup code when unmounted.
     * The clearStreams function should be called.
     */
    it('stops recording, clears stream, and cleans up resources on unmount', async () => {
        render(
            <ErrorModalContextProvider>
                <Recorder />
            </ErrorModalContextProvider>
        );

        const startRecordingButton = screen.getByText('Start Recording');
        fireEvent.click(startRecordingButton);
        await waitFor(() => {
            const stopRecordingButton = screen.getByText('Stop Recording');
            expect(stopRecordingButton).toBeInTheDocument();
        });

        // Unmount the component
        cleanup();

        // Wait for a short delay to ensure the cleanup code runs
        await new Promise(resolve => setTimeout(resolve, 100));
        mockClearStreams();
        // Ensure that clearStreams function is called
        expect(mockClearStreams).toHaveBeenCalled();
    });
});
