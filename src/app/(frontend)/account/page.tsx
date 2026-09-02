import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { LogoutButton } from './LogoutButton'

export default async function AccountPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user || user.collection !== 'customers') {
    redirect('/login')
  }

  return (
    <div className="auth">
      <h1>My Account</h1>
      <p>Email: {user.email}</p>
      {'name' in user && user.name ? <p>Name: {user.name}</p> : null}
      <LogoutButton />
    </div>
  )
}
