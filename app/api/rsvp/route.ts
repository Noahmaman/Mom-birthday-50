import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type RsvpNotification = {
  name: string
  email?: string | null
  guests_count?: number
  attending: 'yes' | 'no' | 'maybe'
  allergies?: string | null
  comment?: string | null
  created_at?: string
}

const attendingLabels: Record<RsvpNotification['attending'], string> = {
  yes: 'Oui',
  no: 'Non',
  maybe: 'Peut-être',
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function sendRsvpNotification(rsvp: RsvpNotification) {
  const resendApiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  const from = process.env.EMAIL_FROM || 'Yael RSVP <onboarding@resend.dev>'

  if (!resendApiKey) return

  const lines = [
    `Nom: ${rsvp.name}`,
    rsvp.email ? `Email: ${rsvp.email}` : null,
    `Présence: ${attendingLabels[rsvp.attending]}`,
    `Invités: ${rsvp.guests_count ?? 1}`,
    rsvp.allergies ? `Préférences alimentaires: ${rsvp.allergies}` : null,
    rsvp.comment ? `Commentaire: ${rsvp.comment}` : null,
    rsvp.created_at ? `Date: ${new Date(rsvp.created_at).toLocaleString('fr-FR')}` : null,
  ].filter(Boolean)
  const safeName = escapeHtml(rsvp.name)
  const safeEmail = rsvp.email ? escapeHtml(rsvp.email) : null
  const safeAllergies = rsvp.allergies ? escapeHtml(rsvp.allergies) : null
  const safeComment = rsvp.comment ? escapeHtml(rsvp.comment) : null

  const recipients = [
    adminEmail
      ? {
          to: [adminEmail],
          subject: `Nouveau RSVP - ${rsvp.name}`,
          text: lines.join('\n'),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1E1812;">
              <h2>Nouveau RSVP pour l'anniversaire de Yael</h2>
              <p><strong>Nom:</strong> ${safeName}</p>
              ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ''}
              <p><strong>Présence:</strong> ${attendingLabels[rsvp.attending]}</p>
              <p><strong>Invités:</strong> ${rsvp.guests_count ?? 1}</p>
              ${safeAllergies ? `<p><strong>Préférences alimentaires:</strong> ${safeAllergies}</p>` : ''}
              ${safeComment ? `<p><strong>Commentaire:</strong> ${safeComment}</p>` : ''}
            </div>
          `,
        }
      : null,
    rsvp.email
      ? {
          to: [rsvp.email],
          subject: "On vous attend pour l'anniversaire de Yael",
          text: `Merci ${rsvp.name}, votre RSVP est bien enregistré.\n\nOn vous attend avec joie le 30 août 2026.\n\nPrésence: ${attendingLabels[rsvp.attending]}\nInvités: ${rsvp.guests_count ?? 1}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1E1812;">
              <h2>Merci ${safeName}</h2>
              <p>Votre RSVP pour l'anniversaire de Yael est bien enregistré.</p>
              <p><strong>On vous attend avec joie le 30 août 2026.</strong></p>
              <p>Présence: ${attendingLabels[rsvp.attending]}<br />Invités: ${rsvp.guests_count ?? 1}</p>
            </div>
          `,
        }
      : null,
  ].filter(Boolean) as { to: string[]; subject: string; text: string; html: string }[]

  await Promise.all(recipients.map(async (emailPayload) => {
    const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      ...emailPayload,
    }),
  })

  if (!res.ok) {
    const details = await res.text().catch(() => '')
    throw new Error(`Email notification failed: ${res.status} ${details}`)
  }
  }))
}

export async function GET() {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, guests_count, attending, allergies, comment } = body

  if (!name || !attending || !email) {
    return NextResponse.json(
      { error: 'Nom, email et présence requis' },
      { status: 400 }
    )
  }

  const emailValue = String(email).trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  if (!['yes', 'no', 'maybe'].includes(attending)) {
    return NextResponse.json(
      { error: 'Valeur de présence invalide' },
      { status: 400 }
    )
  }

  const row = {
    name: name.trim(),
    email: emailValue,
    guests_count: guests_count ?? 1,
    attending,
    allergies: allergies?.trim() || null,
    comment: comment?.trim() || null,
  }

  let { data, error } = await supabase.from('rsvps').insert([row]).select().single()

  if (error && error.message.toLowerCase().includes('email')) {
    const { email: _email, ...rowWithoutEmail } = row
    const fallback = await supabase.from('rsvps').insert([rowWithoutEmail]).select().single()
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await sendRsvpNotification({ ...data, email: emailValue }).catch((err) => {
    console.error(err)
  })

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 })
  }

  const { error } = await supabase.from('rsvps').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
