class RecordingModel {
    constructor(public recordingID: number, public audioData: Blob, public audioInputDevice: any) {}
  
    startRecording() {
      // Logic for starting the recording here
    }
  
    stopRecording() {
      // Logic for stopping the recording here
    }
  
    saveRecording() {
      // Logic for saving the recording here
    }
  }

  export default RecordingModel;