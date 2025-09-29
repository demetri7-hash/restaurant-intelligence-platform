import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Database connection test endpoint - placeholder for deployment'
  })
}