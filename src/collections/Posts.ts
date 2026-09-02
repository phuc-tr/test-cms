import type { CollectionConfig, PayloadRequest } from 'payload'
import { APIError } from 'payload'

const isAdmin = (req: PayloadRequest) => req.user?.collection === 'users'

async function setLiked(req: PayloadRequest, postId: string, liked: boolean) {
  if (!req.user || req.user.collection !== 'customers') {
    throw new APIError('You must be logged in as a customer to like posts.', 401)
  }
  const customerId = req.user.id

  const post = await req.payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
    req,
  })

  const currentLikes = (
    Array.isArray(post.likes) ? post.likes : []
  ).map((entry) => (typeof entry === 'number' ? entry : entry.id))
  const nextLikes = liked
    ? Array.from(new Set([...currentLikes, customerId]))
    : currentLikes.filter((id) => id !== customerId)

  await req.payload.update({
    collection: 'posts',
    id: postId,
    data: { likes: nextLikes },
    overrideAccess: true,
    req,
  })

  return Response.json({ liked, likeCount: nextLikes.length })
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }) => isAdmin(req),
    update: ({ req }) => isAdmin(req),
    delete: ({ req }) => isAdmin(req),
  },
  endpoints: [
    {
      path: '/:id/like',
      method: 'post',
      handler: async (req) => setLiked(req, req.routeParams?.id as string, true),
    },
    {
      path: '/:id/unlike',
      method: 'post',
      handler: async (req) => setLiked(req, req.routeParams?.id as string, false),
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'customers',
      hasMany: true,
      hidden: true,
      defaultValue: [],
    },
  ],
}
