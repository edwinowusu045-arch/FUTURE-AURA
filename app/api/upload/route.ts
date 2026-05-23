import { NextResponse } from 'next/server';
import { fileUploadSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 });
  }

  const metadata = {
    rows: 0,
    columns: 0,
    type: file.type || 'application/octet-stream'
  };

  try {
    const validated = fileUploadSchema.parse({
      filename: file.name,
      contentType: file.type,
      size: file.size
    });

    const text = await file.text();

    if (validated.contentType.includes('csv') || validated.filename.endsWith('.csv')) {
      metadata.rows = text.trim().split(/\r?\n/).length - 1;
      metadata.columns = text.trim().split(/\r?\n/)[0]?.split(',').length || 0;
    } else if (validated.contentType.includes('json') || validated.filename.endsWith('.json')) {
      const payload = JSON.parse(text);
      metadata.rows = Array.isArray(payload) ? payload.length : 1;
      metadata.columns = Array.isArray(payload) && payload[0] ? Object.keys(payload[0]).length : 0;
    }

    const tenant = await prisma.tenant.findUnique({ where: { slug: 'future-aura' } });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found.' }, { status: 500 });
    }

    const upload = await prisma.businessFile.create({
      data: {
        tenantId: tenant.id,
        filename: validated.filename,
        contentType: validated.contentType,
        size: validated.size,
        status: 'PROCESSED',
        metadata
      }
    });

    return NextResponse.json({ message: 'Upload accepted.', uploadId: upload.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid file upload or parsing error.' }, { status: 400 });
  }
}
