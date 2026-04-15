import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component — Handles dynamic meta tags for every page.
 * @param {string} title — The title of the page.
 * @param {string} description — The description of the page.
 * @param {string} name — The name of the organization (Togertherwerise).
 * @param {string} type — The type of content (website, article, etc.).
 * @param {string} image — The preview image URL for social sharing.
 * @param {string} path — The canonical URL path of the current page.
 */
const SEO = ({ 
  title, 
  description = "Togertherwerise — Empowering communities from village to global. Join us in transforming lives through donations, volunteering, and partnerships.", 
  name = "Togertherwerise", 
  type = "website",
  image = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=630&fit=crop&q=80", // Default OG image
  path = ""
}) => {
  const siteUrl = window.location.origin;
  const fullTitle = `${title} | ${name}`;
  const canonicalUrl = `${siteUrl}${path}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Facebook / Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Accessibility / Search */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
