import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
  })

  return (
    <div className="home">
      <h1>Posts</h1>
      {posts.length === 0 && <p>No posts yet. Create one in the admin panel.</p>}
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          {post.content && <RichText data={post.content} />}
        </article>
      ))}
    </div>
  )
}
