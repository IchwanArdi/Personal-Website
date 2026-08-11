import { useEffect, useMemo } from 'react';
import { generatePageMeta, PAGE_METAS } from '../utils/metaHelpers';

const SEO = ({ pageKey, customMeta = {}, children }) => {
  const baseMeta = pageKey ? PAGE_METAS[pageKey] : {};
  const finalMeta = { ...baseMeta, ...customMeta };

  const { title, meta } = useMemo(() => generatePageMeta(finalMeta), [finalMeta]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = title;

    const existingTags = [...document.head.querySelectorAll('meta[data-seo="custom"]')];
    existingTags.forEach((tag) => tag.remove());

    meta.forEach((tag) => {
      const element = document.createElement('meta');
      element.setAttribute('data-seo', 'custom');

      if (tag.property) {
        element.setAttribute('property', tag.property);
      }
      if (tag.name) {
        element.setAttribute('name', tag.name);
      }
      if (tag.content) {
        element.setAttribute('content', tag.content);
      }

      document.head.appendChild(element);
    });

    return () => {
      const cleanupTags = [...document.head.querySelectorAll('meta[data-seo="custom"]')];
      cleanupTags.forEach((tag) => tag.remove());
    };
  }, [meta, title]);

  return <>{children}</>;
};

export default SEO;
