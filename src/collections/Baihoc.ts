import type { CollectionConfig, PayloadRequest } from 'payload'

const isAdmin = (req: PayloadRequest) => req.user?.collection === 'users'

export const Baihoc: CollectionConfig = {
  slug: 'baihoc',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }) => isAdmin(req),
    update: ({ req }) => isAdmin(req),
    delete: ({ req }) => isAdmin(req),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
    },
  ],
}
