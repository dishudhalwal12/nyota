const servicesData = [
  {
    id: "full-growth",
    name: "Full Growth Audit",
    category: "growth",
    price: 2999,
    description: "Deep-dive analysis of marketing, branding, tech, and operations with an actionable growth plan.",
    class: "card-laavan", // Reused beautiful gradients
    badge: "Most Popular",
    tag: "Comprehensive Audit"
  },
  {
    id: "marketing-audit",
    name: "Marketing Audit",
    category: "marketing",
    price: 1499,
    description: "Review of campaign strategies, content direction, social media footprint, and reach optimizations.",
    class: "card-mandap",
    badge: "",
    tag: "Pillar Specific"
  },
  {
    id: "tech-audit",
    name: "Tech & Speed Audit",
    category: "tech",
    price: 1999,
    description: "Code health analysis, performance diagnostics, conversion paths, and site speed optimizations.",
    class: "card-route",
    badge: "New",
    tag: "Pillar Specific"
  },
  {
    id: "branding-audit",
    name: "Branding Audit",
    category: "branding",
    price: 1499,
    description: "Assess brand identity, visual consistency, voice, tone, and market positioning.",
    class: "card-nikah",
    badge: "",
    tag: "Pillar Specific"
  },
  {
    id: "operations-audit",
    name: "Operations Audit",
    category: "operations",
    price: 1499,
    description: "Delivery channels review, automation toolchains, CRM integration, and distribution support.",
    class: "card-thirumanam",
    badge: "",
    tag: "Pillar Specific"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = servicesData;
}
