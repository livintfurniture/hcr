/**
 * ============================================================================
 *  WORLDS TOURS AND TRAVELS — SITE CONFIGURATION
 * ============================================================================
 *  Change every value in this file to re-brand or update contact details
 *  across the ENTIRE website. Every page reads from window.SITE_CONFIG —
 *  nothing else needs to be edited.
 *
 *  ⚠️ REPLACE THE PLACEHOLDER PHONE / WHATSAPP / EMAIL / ADDRESS BELOW
 *     WITH YOUR REAL BUSINESS DETAILS BEFORE GOING LIVE.
 * ============================================================================
 */
window.SITE_CONFIG = {
  // ---------------------------------------------------------------------
  // Core identity
  // ---------------------------------------------------------------------
  businessName: "HCR Hyderabad Cab Rentals",
  logo: "images/logo-hcr-web.png",

  // ---------------------------------------------------------------------
  // Contact details — used for tel:, mailto:, wa.me links & schema
  // ---------------------------------------------------------------------
  phoneDisplay: "+91 95800 12345",
  phoneRaw: "+919580012345",
  whatsappNumber: "919580012345", // digits only, country code, no + or spaces
  email: "info@worldstoursandtravels.com",

  address: {
    line1: "P.No: 72/P & 73/P, Raghavendra Colony",
    line2: "Suchitra, Quthbullapur",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500055",
    country: "India",
    full: "P.No: 72/P & 73/P, Raghavendra Colony, Suchitra, Quthbullapur, Hyderabad, Telangana 500055, India"
  },

  // Google Maps — replace with your own "Embed a map" src URL from Google Maps
  googleMapsEmbed: "https://www.google.com/maps?q=P.No%3A%2072%2FP%20%26%2073%2FP%2C%20Raghavendra%20Colony%2C%20Suchitra%2C%20Quthbullapur%2C%20Hyderabad%2C%20Telangana%20500055%2C%20India&output=embed",
  googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=P.No%3A%2072%2FP%20%26%2073%2FP%2C%20Raghavendra%20Colony%2C%20Suchitra%2C%20Quthbullapur%2C%20Hyderabad%2C%20Telangana%20500055%2C%20India",

  businessHours: {
    weekdays: "Monday – Saturday: 6:00 AM – 11:00 PM",
    sunday: "Sunday: 7:00 AM – 10:00 PM",
    note: "24×7 Emergency & Airport Transfer Service Available"
  },

  // ---------------------------------------------------------------------
  // Social links — leave blank string to hide an icon in the footer
  // ---------------------------------------------------------------------
  social: {
    facebook: "https://facebook.com/worldstoursandtravels",
    instagram: "https://www.instagram.com/worldtoursandtravels1/",
    twitter: "https://x.com/WorldTours11",
    youtube: "https://youtube.com/@worldstoursandtravels",
    linkedin: "https://www.linkedin.com/in/world-tours-and-travels-ab6a88374/"
  },

  // ---------------------------------------------------------------------
  // Analytics & Google Ads — leave blank to disable. Nothing loads until set.
  //   ga4Id  : Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX"
  //   adsId  : Google Ads account tag,           e.g. "AW-XXXXXXXXXX"
  //   adsConversions: full conversion "send_to" values from Google Ads,
  //                   e.g. "AW-XXXXXXXXXX/AbC-D_efG-h12_34-5"
  // ---------------------------------------------------------------------
  analytics: {
    ga4Id: "",
    adsId: "",
    adsConversions: {
      call: "",
      whatsapp: "",
      form: ""
    }
  }
};
