import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { LikeButton } from './LikeButton'
import './styles.css'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  const isCustomer = Boolean(user && user.collection === 'customers')

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
  })

  const { docs: baihoc } = await payload.find({
    collection: 'baihoc',
    sort: '-createdAt',
    depth: 0,
  })

  return (
    <div className="home">
      <header className="home-header">
        <Image src="/logo.png" alt="Site logo" width={1378} height={1142} priority className="home-logo" />
      </header>
      <nav className="home-nav">
        {user && user.collection === 'customers' ? (
          <Link href="/account">My Account</Link>
        ) : (
          <>
            <Link href="/login">Log In</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
      <h1>Bai hoc</h1>
      {baihoc.length === 0 && <p>No bai hoc yet. Create one in the admin panel.</p>}
      {baihoc.map((item) => (
        <article key={item.id} className="baihoc">
          <h2>{item.title}</h2>
          {item.subtitle && <p className="baihoc-subtitle">{item.subtitle}</p>}
          {item.content && <p className="baihoc-content">{item.content}</p>}
        </article>
      ))}

      <h1>Posts</h1>
      {posts.length === 0 && <p>No posts yet. Create one in the admin panel.</p>}
      {posts.map((post) => {
        const likes: number[] = Array.isArray(post.likes) ? (post.likes as number[]) : []
        return (
          <article key={post.id}>
            <h2>{post.title}</h2>
            {post.content && <RichText data={post.content} />}
            <LikeButton
              postId={post.id}
              initialCount={likes.length}
              initialLiked={isCustomer && likes.includes(user!.id as number)}
              isLoggedIn={isCustomer}
            />
          </article>
        )
      })}
    </div>
  )
}
