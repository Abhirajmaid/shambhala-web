export const commonFields = [
  { name: 'order', type: 'number', defaultValue: 0 },
  { name: 'published', type: 'boolean', defaultValue: true },
];

export const collectionConfigs = {
  settings: {
    title: 'Site Settings', collectionName: 'settings', singletonId: 'main', fields: [
      { name: 'siteName', defaultValue: 'Shambhala Home' }, { name: 'logoUrl' }, { name: 'phone' }, { name: 'email' },
      { name: 'socials', type: 'json', defaultValue: { instagram: '', facebook: '', youtube: '', pinterest: '' } },
      { name: 'seoDefaults', type: 'json', defaultValue: { title: 'Shambhala Home', description: '', ogImageUrl: '' } },
    ],
  },
  home: {
    title: 'Home Content', collectionName: 'home', singletonId: 'main', fields: [
      { name: 'heroHeadline' }, { name: 'heroSubtext', type: 'textarea' }, { name: 'heroImageUrl' }, { name: 'brochureUrl' },
      { name: 'offerings', type: 'json', defaultValue: [] }, { name: 'whyShambhalaPoints', type: 'json', defaultValue: [] }, { name: 'processSteps', type: 'json', defaultValue: [] },
    ],
  },
  about: { title: 'About Page', collectionName: 'pages', singletonId: 'about', fields: [{ name: 'title', defaultValue: 'About Shambhala' }, { name: 'description', type: 'textarea' }, { name: 'content', type: 'json', defaultValue: {} }] },
  products: { title: 'Products', collectionName: 'products', fields: [{ name: 'name' }, { name: 'slug' }, { name: 'category' }, { name: 'description', type: 'textarea' }, { name: 'features', type: 'array' }, { name: 'images', type: 'array' }, ...commonFields] },
  projects: { title: 'Projects', collectionName: 'projects', fields: [{ name: 'clientName' }, { name: 'slug' }, { name: 'location' }, { name: 'propertyType' }, { name: 'testimonialQuote', type: 'textarea' }, { name: 'category' }, { name: 'images', type: 'array' }, ...commonFields] },
  blog: { title: 'Blog Posts', collectionName: 'blogPosts', fields: [{ name: 'title' }, { name: 'slug' }, { name: 'excerpt', type: 'textarea' }, { name: 'coverImageUrl' }, { name: 'author' }, { name: 'tags', type: 'array' }, { name: 'contentJson', type: 'json', defaultValue: {} }, ...commonFields] },
  careers: { title: 'Jobs', collectionName: 'jobs', fields: [{ name: 'title' }, { name: 'location' }, { name: 'type', defaultValue: 'full-time' }, { name: 'description', type: 'textarea' }, { name: 'requirements', type: 'array' }, ...commonFields] },
  testimonials: { title: 'Testimonials', collectionName: 'testimonials', fields: [{ name: 'customerName' }, { name: 'location' }, { name: 'quote', type: 'textarea' }, { name: 'imageUrl' }, { name: 'order', type: 'number', defaultValue: 0 }] },
  team: { title: 'Team', collectionName: 'team', fields: [{ name: 'name' }, { name: 'role' }, { name: 'bio', type: 'textarea' }, { name: 'imageUrl' }, { name: 'order', type: 'number', defaultValue: 0 }] },
  brandPartners: { title: 'Brand Partners', collectionName: 'brandPartners', fields: [{ name: 'name' }, { name: 'logoUrl' }, { name: 'order', type: 'number', defaultValue: 0 }] },
  showrooms: { title: 'Showrooms', collectionName: 'showrooms', fields: [{ name: 'city' }, { name: 'address', type: 'textarea' }, { name: 'mapLink' }, { name: 'phone' }, { name: 'isUpcoming', type: 'boolean', defaultValue: false }, { name: 'order', type: 'number', defaultValue: 0 }] },
};
