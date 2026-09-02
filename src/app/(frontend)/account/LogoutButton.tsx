'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/customers/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/')
    router.refresh()
  }

  return <button onClick={handleLogout}>Log Out</button>
}
