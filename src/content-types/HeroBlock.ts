import { contentType } from "@optimizely/cms-sdk";

export const HeroBlock = contentType({
  key: "HeroBlock",
  baseType: "_component",
  displayName: "Hero Block",
  compositionBehaviors: ["sectionEnabled"],
  properties: {
    heading: { type: "string" },
    subheading: { type: "string" },
    ctaText: { type: "string" },
    ctaLink: { type: "url" },
    backgroundImage: { type: "contentReference" },
  },
});
