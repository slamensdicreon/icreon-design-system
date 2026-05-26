import { contentType } from "@optimizely/cms-sdk";

export const TextBlock = contentType({
  key: "TextBlock",
  baseType: "_component",
  displayName: "Text Block",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  properties: {
    heading: { type: "string" },
    body: { type: "richText" },
  },
});
