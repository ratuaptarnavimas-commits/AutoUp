import React from 'react';
import { Helmet } from 'react-helmet';

const SchemaOrg = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "AutoUp",
    "url": "https://autoup.lt",
    "logo": "https://autoup.lt/images/logo.png",
    "description": "AutoUp autoservisas Garliavoje: važiuoklės remontas, padangų montavimas, stabdžių remontas, diagnostika ir alyvos keitimas.",
    "telephone": "+37065118482",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Liepų g. 40-51",
      "addressLocality": "Garliava",
      "addressRegion": "Kauno r.",
      "postalCode": "53214",
      "addressCountry": "LT"
    },
    "areaServed": ["Garliava", "Kaunas", "Kauno rajonas"],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+37065118482",
      "contactType": "customer service",
      "areaServed": "LT",
      "availableLanguage": ["Lithuanian", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/",
      "https://www.instagram.com/"
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