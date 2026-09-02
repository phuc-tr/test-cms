import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    group: 'App Users',
  },
  auth: {
    tokenExpiration: 7200,
  },
  access: {
    // Anyone can register
    create: () => true,
    // Admin users (the `users` collection) can manage all customers;
    // a logged-in customer can only read/update/delete their own record
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },
    // Only admin users can see this collection in the admin panel;
    // customers authenticate via the frontend, never via /admin
    admin: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
