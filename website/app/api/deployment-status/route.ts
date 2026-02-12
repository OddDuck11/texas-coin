import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const statusFile = path.join(process.cwd(), '..', 'deployment-status.json');

    // Check if file exists
    if (!fs.existsSync(statusFile)) {
      return NextResponse.json(
        {
          step: 0,
          message: 'No deployment in progress',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }

    const statusData = fs.readFileSync(statusFile, 'utf-8');
    const status = JSON.parse(statusData);

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('Error reading deployment status:', error);
    return NextResponse.json(
      { error: 'Failed to read deployment status' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
