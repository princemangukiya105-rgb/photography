import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlotsForService } from '@/lib/data/repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');
    const packageId = searchParams.get('packageId');

    if (!serviceId || !date) {
      return NextResponse.json(
        { error: 'serviceId and date parameters are required' },
        { status: 400 }
      );
    }

    // Basic date pattern validation YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Date must be formatted as YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlotsForService(serviceId, date, packageId);
    return NextResponse.json({ slots });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to compute availability';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
