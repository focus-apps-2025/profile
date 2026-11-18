import { useEffect } from 'react';

interface DynamicMetaProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const DynamicMeta: React.FC<DynamicMetaProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
}) => {
  useEffect(() => {
    // Set document title
    document.title = title ? `${title} | FOCUS Engineering` : 'FOCUS Engineering — Portfolio Platform';

    // Set meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // Set Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Set Open Graph Description
    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', description);
    }

    // Set Open Graph Image
    if (ogImage) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement('meta');
        ogImg.setAttribute('property', 'og:image');
        document.head.appendChild(ogImg);
      }
      ogImg.setAttribute('content', ogImage);
    }

    // Set Canonical link
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }
  }, [title, description, canonicalUrl, ogImage]);

  return null;
};
