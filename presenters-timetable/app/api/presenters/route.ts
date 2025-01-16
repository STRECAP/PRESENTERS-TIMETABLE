import { NextResponse } from 'next/server'

let presenters = [
  { id: '1', name: 'John Doe', level: 2 },
  { id: '2', name: 'Jane Smith', level: 1 },
  // Add more initial presenters as needed
]

export async function GET() {
  return NextResponse.json(presenters)
}

export async function POST(request: Request) {
  const newPresenter = await request.json()
  presenters.push(newPresenter)
  return NextResponse.json(newPresenter, { status: 201 })
}

