import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use dynamic import for CommonJS modules
const pdfParse = (await import('pdf-parse')).default;
const imageSize = (await import('image-size')) as any;

export const runtime = 'node';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, contentType, data, name } = body as {
      filename: string;
      contentType: string;
      data: string; // base64
      name?: string;
    };

    if (!data || !filename) {
      return NextResponse.json({ error: 'Missing file data' }, { status: 400 });
    }

    const buffer = Buffer.from(data, 'base64');

    const tmpDir = path.join(process.cwd(), 'tmp-uploads');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tmpPath = path.join(tmpDir, `${Date.now()}-${filename}`);
    fs.writeFileSync(tmpPath, buffer);

    const result: any = {
      filename,
      size: buffer.length,
      name: name || filename.replace(/\.[^/.]+$/, ''),
      contentType: contentType || 'application/octet-stream',
    };

    if (filename.toLowerCase().endsWith('.pdf') || result.contentType === 'application/pdf') {
      const data = await pdfParse(buffer as any);
      result.type = 'pdf';
      result.pages = data.numpages;
      result.textSnippet = String(data.text || '').slice(0, 2000);
    } else if (/^image\//.test(result.contentType) || /\.(png|jpe?g|webp|gif|bmp)$/i.test(filename)) {
      try {
        const dimensions = imageSize.default ? imageSize.default(buffer) : imageSize(buffer);
        result.type = 'image';
        result.dimensions = dimensions;
      } catch (e) {
        result.type = 'image';
        result.dimensions = null;
      }
    }

    // Keep a minimal dataset-like response to integrate with the frontend
    const dataset = {
      id: `ds_${Date.now()}`,
      name: result.name,
      fileName: result.filename,
      rowCount: result.pages || 0,
      createdAt: new Date().toISOString(),
      analyses: [],
      extras: result,
    };

    return NextResponse.json(dataset);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Upload failed' }, { status: 500 });
  }
}
