// components/SEO.jsx
import { Helmet } from 'react-helmet-async';
import { generatePageMeta, PAGE_METAS } from '../utils/metaHelpers';

const SEO = ({ pageKey, customMeta = {}, children }) => {
  // Ambil meta default berdasarkan pageKey atau gunakan custom meta
  const baseMeta = pageKey ? PAGE_METAS[pageKey] : {};
  const finalMeta = { ...baseMeta, ...customMeta };

  // Generate meta tags
  const { title, meta } = generatePageMeta(finalMeta);

  return (
    <Helmet>
      <title>{title}</title>
      {meta.map((tag, index) => {
        if (tag.property) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        }
        return <meta key={index} name={tag.name} content={tag.content} />;
      })}
      {children}
    </Helmet>
  );
};

export default SEO;
