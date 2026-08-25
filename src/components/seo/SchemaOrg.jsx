import React from 'react';
import { Helmet } from 'react-helmet';

const SchemaOrg = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AutoUp",
    "url": "https://autoup.lt",
    "logo": "https://horizons-cdn.hostinger.com/f533b165-5105-4cde-bbbe-298474d58916/48524bc4a03dbd4767bc838852e3a00c.png",
    "description": "Profesionalus padangų montavimas, balansavimas ir remontas.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+370 600 00000",
      "contactType": "customer service",
      "areaServed": "LT",
      "availableLanguage": ["Lithuanian", "English"]
    },
    "sameAs": [
      "https://facebook.com/autoup",
      "https://instagram.com/autoup"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SchemaOrg;