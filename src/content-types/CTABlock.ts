import { contentType } from "@optimizely/cms-sdk";

export const CTABlock = contentType({
  key: "CTABlock",
  baseType: "_component",
  displayName: "Call to Action Block",
  compositionBehaviors: ["sectionEnabled"],
  properties: {
    heading: { type: "string" },
    body: { type: "richText" },
    primaryButtonText: { type: "string" },
    primaryButtonLink: { type: "url" },
    secondaryButtonText: { type: "string" },
    secondaryButtonLink: { type: "url" },
  },
});
