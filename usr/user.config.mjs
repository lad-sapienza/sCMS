/**
 * User Configuration File
 * 
 * This file allows you to override core settings and customize your site.
 * Edit this file to configure your site's metadata, integrations, and more.
 * 
 * The settings here will be merged with the core configuration in astro.config.mjs
 */

export const userConfig = {
  // Site URL (required for sitemap and canonical URLs)
  site: 'https://yourdomain.com',
  
  // Base path (if deploying to a subdirectory)
  // base: '/my-site',
  
  // Additional integrations (will be merged with core integrations)
  integrations: [
    // Add your custom integrations here
  ],
  
  // Custom Vite configuration
  vite: {
    // Your custom Vite config
  },
  
  // Markdown configuration overrides
  markdown: {
    // Your custom markdown config
  },
};

/**
 * Site Metadata
 * 
 * These values are used throughout the site for SEO, social media cards,
 * and general site information.
 */
export const siteMetadata = {
  title: 's:CMS',
  titleTemplate: '%s | s:CMS',
  description: 'Static Content Management System developed by LAD: Laboratorio di Archeologia Digitale alla Sapienza',
  author: 'Julian Bogdani <julian.bogdani@uniroma1.it>',
  siteName: 'LAD: Laboratorio di Archeologia Digitale alla Sapienza',
  defaultImage: '/images/scms-lad.png',
  twitter: '@JulianBogdani',
};

/**
 * Directus Configuration
 * 
 * Configure Directus connection for fetching data from your Directus instance.
 * Used by DataTb component for Directus sources.
 */
export const directusConfig = {
  // Directus instance URL
  url: import.meta.env.PUBLIC_DIRECTUS_URL || 'https://your-directus-instance.com',
  
  // Static token for authentication
  // Generate a token in Directus admin panel under Settings > Access Tokens
  token: import.meta.env.PUBLIC_DIRECTUS_TOKEN || '',
  
  // Optional: Custom configuration
  // maxRetries: 3,
  // timeout: 30000,
};
