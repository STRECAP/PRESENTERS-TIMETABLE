import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  presenters = presenters.filter(p => p.id !== id)
  return NextResponse.json({ message: 'Presenter deleted' }, { status: 200 })
}

