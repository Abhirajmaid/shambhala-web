/**
 * @typedef {Object} SiteSettings
 * @property {string} siteName
 * @property {string} logoUrl
 * @property {string} phone
 * @property {string} email
 * @property {{instagram:string, facebook:string, youtube:string, pinterest:string}} socials
 * @property {{title:string, description:string, ogImageUrl:string}} seoDefaults
 */

/**
 * @typedef {Object} HomeContent
 * @property {string} heroHeadline
 * @property {string} heroSubtext
 * @property {string} heroImageUrl
 * @property {string} brochureUrl
 * @property {Array<{title:string, description:string, imageUrl:string, productSlug:string}>} offerings
 * @property {Array<{title:string, description:string}>} whyShambhalaPoints
 * @property {Array<{step:number, title:string, description:string}>} processSteps
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {'kitchen'|'wardrobe'|'bed'|'storage'} category
 * @property {string} description
 * @property {string[]} features
 * @property {string[]} images
 * @property {number} order
 * @property {boolean} published
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} slug
 * @property {string} clientName
 * @property {string} location
 * @property {string} propertyType
 * @property {string} testimonialQuote
 * @property {string[]} images
 * @property {'kitchen'|'wardrobe'|'bed'|'full-home'} category
 * @property {boolean} published
 */

/**
 * @typedef {Object} GalleryImage
 * @property {string} url
 * @property {string} publicId
 * @property {number} order
 * @property {string} [caption]
 */

/**
 * @typedef {Object} GalleryFolder
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [coverImageUrl]
 * @property {string} [linkedProjectId]
 * @property {GalleryImage[]} images
 * @property {number} order
 * @property {boolean} published
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} customerName
 * @property {string} location
 * @property {string} quote
 * @property {string} imageUrl
 * @property {number} order
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {object} contentJson
 * @property {string} coverImageUrl
 * @property {string} author
 * @property {string[]} tags
 * @property {Date} publishedAt
 * @property {boolean} published
 */

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {'full-time'|'internship'} type
 * @property {string} description
 * @property {string[]} requirements
 * @property {boolean} published
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} bio
 * @property {string} imageUrl
 * @property {number} order
 */

/**
 * @typedef {Object} BrandPartner
 * @property {string} id
 * @property {string} name
 * @property {string} logoUrl
 * @property {number} order
 */

/**
 * @typedef {Object} Showroom
 * @property {string} id
 * @property {string} city
 * @property {string} address
 * @property {string} mapLink
 * @property {string} phone
 * @property {boolean} isUpcoming
 */

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {'callback'|'franchise'|'brochure'|'job-application'|'contact'} type
 * @property {string} fullName
 * @property {string} phone
 * @property {string} [email]
 * @property {string} [city]
 * @property {string} [requirement]
 * @property {string} [currentOccupation]
 * @property {string} [preferredLocation]
 * @property {string} [jobId]
 * @property {string} [resumeUrl]
 * @property {'new'|'contacted'|'converted'|'closed'} status
 * @property {string} source
 * @property {Date} createdAt
 */

export {};
