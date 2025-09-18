import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file uploaded. Please select a CSV file to upload.' 
      }, { status: 400 });
    }

    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid file type. Please upload a CSV file.' 
      }, { status: 400 });
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false,
        error: 'File too large. Please upload a file smaller than 10MB.' 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Run Python ML script
    const pythonScriptPath = path.join(process.cwd(), 'ml_model_simple.py');
    
    try {
      const { stdout, stderr } = await execAsync(`python "${pythonScriptPath}" "${filePath}"`);
      
      if (stderr) {
        console.error('Python script error:', stderr);
        return NextResponse.json({ 
          success: false,
          error: 'ML processing failed. Please check your CSV file format.' 
        }, { status: 500 });
      }

      // Parse the JSON result from Python script
      const result = JSON.parse(stdout);
      
      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.warn('Could not clean up uploaded file:', cleanupError);
      }

      return NextResponse.json(result);
    } catch (execError) {
      console.error('Execution error:', execError);
      
      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.warn('Could not clean up uploaded file:', cleanupError);
      }
      
      return NextResponse.json({ 
        success: false,
        error: 'Failed to process the file. Please ensure Python is installed and the file format is correct.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing ML:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error. Please try again.' 
    }, { status: 500 });
  }
}