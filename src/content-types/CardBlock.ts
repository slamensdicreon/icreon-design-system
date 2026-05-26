import { contentType } from "@optimizely/cms-sdk";

export const CardBlock = contentType({
  key: "CardBlock",
  baseType: "_component",
  displayName: "Card Block",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    image: { type: "contentReference" },
    linkText: { type: "string" },
    linkUrl: { type: "url" },
  },
});
