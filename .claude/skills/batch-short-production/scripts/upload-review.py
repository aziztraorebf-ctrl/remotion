"""
Batch Short Production — Phase 7: Upload Review Gallery
Uploads assets to Vercel Blob and creates an HTML gallery for mobile review.

Usage:
    python upload-review.py --title "Thiaroye Review" --files clip1.mp4 clip2.mp4 frame1.jpg --folder review/thiaroye
    python upload-review.py --file single-render.mp4 --folder renders/thiaroye

This is a thin wrapper around the existing scripts/upload-to-blob.py script.
"""

import argparse
import subprocess
import sys
import pathlib


UPLOAD_SCRIPT = pathlib.Path(__file__).parent.parent.parent.parent.parent / "scripts" / "upload-to-blob.py"


def main():
    parser = argparse.ArgumentParser(description="Upload assets for mobile review")
    parser.add_argument("--title", default="Review", help="Gallery page title")
    parser.add_argument("--files", nargs="*", help="Files to upload as gallery")
    parser.add_argument("--file", help="Single file to upload")
    parser.add_argument("--folder", required=True, help="Blob folder path")
    args = parser.parse_args()

    if not UPLOAD_SCRIPT.exists():
        print(f"ERROR: Upload script not found at {UPLOAD_SCRIPT}")
        print("Expected: scripts/upload-to-blob.py in the project root")
        sys.exit(1)

    if args.files:
        # Gallery mode
        for f in args.files:
            if not pathlib.Path(f).exists():
                print(f"ERROR: File not found: {f}")
                sys.exit(1)

        cmd = [
            sys.executable, str(UPLOAD_SCRIPT),
            "--gallery", args.title,
            *args.files,
            "--folder", args.folder,
        ]
    elif args.file:
        # Single file mode
        if not pathlib.Path(args.file).exists():
            print(f"ERROR: File not found: {args.file}")
            sys.exit(1)

        cmd = [
            sys.executable, str(UPLOAD_SCRIPT),
            args.file,
            "--folder", args.folder,
        ]
    else:
        print("ERROR: Provide either --files or --file")
        sys.exit(1)

    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=False)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
