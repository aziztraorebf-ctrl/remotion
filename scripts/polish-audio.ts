import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.AUPHONIC_API_KEY;
if (!API_KEY) {
  console.error("AUPHONIC_API_KEY is not set in .env");
  process.exit(1);
}

const BASE_URL = "https://auphonic.com/api";

interface PolishJob {
  name: string;
  inputPath: string;
  outputPath: string;
}

const jobs: PolishJob[] = [
  {
    name: "voice-idle",
    inputPath: "public/audio/voice/voice-idle.mp3",
    outputPath: "public/audio/voice/voice-idle.mp3",
  },
  {
    name: "voice-reaction",
    inputPath: "public/audio/voice/voice-reaction.mp3",
    outputPath: "public/audio/voice/voice-reaction.mp3",
  },
  {
    name: "voice-walking",
    inputPath: "public/audio/voice/voice-walking.mp3",
    outputPath: "public/audio/voice/voice-walking.mp3",
  },
  {
    name: "voice-waving",
    inputPath: "public/audio/voice/voice-waving.mp3",
    outputPath: "public/audio/voice/voice-waving.mp3",
  },
  {
    name: "voice-jumping",
    inputPath: "public/audio/voice/voice-jumping.mp3",
    outputPath: "public/audio/voice/voice-jumping.mp3",
  },
];

async function polishFile(job: PolishJob): Promise<void> {
  console.log(`[Polish] ${job.name} - Creating Auphonic production...`);

  // Step 1: Create production with settings
  const createResp = await fetch(`${BASE_URL}/productions.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Remotion - ${job.name}`,
      algorithms: {
        leveler: true,
        loudnesstarget: -16,
        denoise: true,
        filtering: true,
      },
      output_files: [{ format: "mp3", bitrate: "128" }],
    }),
  });

  if (!createResp.ok) {
    const errText = await createResp.text();
    throw new Error(
      `Create production failed for ${job.name}: HTTP ${createResp.status} - ${errText}`
    );
  }

  const createData = await createResp.json();
  const uuid = createData.data.uuid;
  console.log(`  Production created: ${uuid}`);

  // Step 2: Upload the audio file
  console.log(`  Uploading ${job.inputPath}...`);
  const fileBuffer = fs.readFileSync(job.inputPath);
  const blob = new Blob([fileBuffer], { type: "audio/mpeg" });

  const formData = new FormData();
  formData.append("input_file", blob, path.basename(job.inputPath));

  const uploadResp = await fetch(
    `${BASE_URL}/production/${uuid}/upload.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    }
  );

  if (!uploadResp.ok) {
    const errText = await uploadResp.text();
    throw new Error(
      `Upload failed for ${job.name}: HTTP ${uploadResp.status} - ${errText}`
    );
  }
  console.log(`  Upload complete`);

  // Step 3: Start processing
  const startResp = await fetch(`${BASE_URL}/production/${uuid}/start.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!startResp.ok) {
    const errText = await startResp.text();
    throw new Error(
      `Start failed for ${job.name}: HTTP ${startResp.status} - ${errText}`
    );
  }
  console.log(`  Processing started...`);

  // Step 4: Poll for completion
  let status = 0;
  let statusString = "Waiting";
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (status !== 3 && status !== 13 && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 5000));
    attempts++;

    const statusResp = await fetch(`${BASE_URL}/production/${uuid}.json`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!statusResp.ok) {
      console.log(`  Status check failed, retrying...`);
      continue;
    }

    const statusData = await statusResp.json();
    status = statusData.data.status;
    statusString = statusData.data.status_string;
    console.log(`  Status: ${statusString} (${status}) [${attempts * 5}s]`);

    // status 3 = Done, 13 = Error
    if (status === 3) {
      // Step 5: Download the polished file
      const outputFiles = statusData.data.output_files || [];
      if (outputFiles.length === 0) {
        throw new Error(`No output files for ${job.name}`);
      }

      const downloadUrl = outputFiles[0].download_url;
      console.log(`  Downloading polished audio...`);

      const audioResp = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });

      if (!audioResp.ok) {
        throw new Error(
          `Download failed for ${job.name}: HTTP ${audioResp.status}`
        );
      }

      const audioBuffer = Buffer.from(await audioResp.arrayBuffer());
      const dir = path.dirname(job.outputPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(job.outputPath, audioBuffer);
      console.log(
        `  -> Saved: ${job.outputPath} (${audioBuffer.length} bytes)`
      );
      return;
    }

    if (status === 13) {
      throw new Error(`Auphonic processing error for ${job.name}`);
    }
  }

  if (attempts >= maxAttempts) {
    throw new Error(`Timeout waiting for ${job.name} to finish processing`);
  }
}

async function main(): Promise<void> {
  console.log("=== Auphonic Polish Pipeline ===");
  console.log(`Files to polish: ${jobs.length}`);
  console.log("");

  for (const job of jobs) {
    try {
      await polishFile(job);
    } catch (err) {
      console.error(`FAILED: ${job.name} - ${(err as Error).message}`);
      console.log("  Keeping original file, continuing...");
    }
    console.log("");
  }

  console.log("=== Pipeline complete! ===");
}

main().catch((err) => {
  console.error("Pipeline failed:", err.message);
  process.exit(1);
});
