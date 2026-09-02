'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: {
  postId: number
  initialLiked: boolean
  initialCount: number
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [submitting, setSubmitting] = useState(false)

  async function handleClick() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    setSubmitting(true)
    const nextLiked = !liked
    const res = await fetch(`/api/posts/${postId}/${nextLiked ? 'like' : 'unlike'}`, {
      method: 'POST',
      credentials: 'include',
    })
    setSubmitting(false)

    if (!res.ok) return

    const data = await res.json()
    setLiked(data.liked)
    setCount(data.likeCount)
  }

  return (
    <button type="button" className="like-button" onClick={handleClick} disabled={submitting}>
      {liked ? '♥' : '♡'} {count}
    </button>
  )
}
