import express from 'express';
import OpenAIService from '../services/OpenAIService';
import { Project, Summary } from '@/app/models';
import { INote } from '@/app/models/Note';

const router = express.Router();

/**
 * Endpoint to transcribe audio
 */
router.post('/summarize', async (req, res) => {
  try {
    const data = req.body;
    const templateId = data.templateId;
    const notes: INote[] = data.notes;

    const openAI = new OpenAIService();
    // Transcribe audio
    const summaryText = await openAI.generateSummary(notes, templateId);

    const summary = new Summary({
      summaryName: 'New Summary',
      summaryDescription: 'New Summary Description',
      content: summaryText,
      templateId: templateId,
      noteIds: notes.map((note) => note.id),
    });
    await summary.save();

    // find project that contains a note
    const project = await Project.findOne({ 'notes.note': notes[0].id });
    if (!project) {
      console.error(`No project found containing note ID ${notes[0].id}.`);
      return null;
    }

    // add summary to project
    project.summaries.push({
      summary: summary._id.toString(),
      position: project.summaries.length,
    });

    await project.save();

    // return the transcription
    res.json({ success: true, summary: summaryText });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
});

export default router;
