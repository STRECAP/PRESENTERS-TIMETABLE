import { NextResponse } from 'next/server'

let schedule = {}

export async function GET() {
  return NextResponse.json(schedule)
}

export async function POST(request: Request) {
  const newSchedule = await request.json()
  schedule = newSchedule
  return NextResponse.json(schedule, { status: 200 })
}

