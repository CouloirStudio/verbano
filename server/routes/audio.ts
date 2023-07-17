import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  // fetch all audio files and transcriptions
});

router.post("/", (req: Request, res: Response) => {
  // start a new audio recording
});

router.put("/", (req: Request, res: Response) => {
  // stop an ongoing recording
});

router.delete("/", (req: Request, res: Response) => {
  // delete an existing audio file
});

export default router;
