/**
 * Dycom brand tokens, sourced from dycomind.com's own stylesheet and the
 * official "Family of Companies" map bundle.
 *   - Primary blue  #005cb9  (the Dycom wordmark / map markers)
 *   - Green accent  #84bd00
 *   - Orange accent #f28c28
 *   - Soft blue     #d7e2ff  (marker hover state)
 */
export const brand = {
  blue: "#005cb9",
  blueDark: "#00427f",
  green: "#84bd00",
  orange: "#f28c28",
  softBlue: "#d7e2ff",
  ink: "#0d1b2a",
  slate: "#5a5a5a",
} as const;

export const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

export function stateName(code: string): string {
  return US_STATE_NAMES[code] ?? code;
}
