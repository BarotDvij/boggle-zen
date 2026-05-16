/**
 * Hot Words — high-value short words worth memorising for Boggle.
 * Sorted by: (score) desc, then length asc, then alpha.
 */
export interface HotWord {
  word: string;
  hint: string;
}

export const HOT_WORDS: HotWord[] = [
  // 2-letter scoring words (allowed in some variants — shown as flashcards only)
  { word: "QI", hint: "Life force (Chinese medicine)" },
  { word: "ZA", hint: "Informal for pizza" },
  { word: "XU", hint: "Vietnamese monetary unit" },
  { word: "AE", hint: "Scottish/dialectal: one" },
  { word: "OE", hint: "A whirlwind off the Faroe Islands" },
  { word: "AA", hint: "A type of rough lava" },
  // 3-letter gems
  { word: "QAT", hint: "A shrub chewed as stimulant" },
  { word: "ZAX", hint: "A tool for cutting roof slates" },
  { word: "ZEK", hint: "Soviet labour camp prisoner" },
  { word: "ZIT", hint: "A pimple (informal)" },
  { word: "WIZ", hint: "A person with remarkable skill" },
  { word: "POX", hint: "A disease causing pimples" },
  { word: "OXO", hint: "A design of alternating Os and Xs" },
  { word: "MIX", hint: "To combine" },
  { word: "JAX", hint: "Jacks (game)" },
  { word: "PHO", hint: "Vietnamese noodle soup" },
  { word: "FEZ", hint: "A flat-topped hat" },
  { word: "EWE", hint: "A female sheep" },
  { word: "OWT", hint: "British dialect for anything" },
  { word: "AWE", hint: "Profound wonder" },
  // Useful Q-without-U words
  { word: "QOPH", hint: "Hebrew letter" },
  { word: "QANAT", hint: "An underground irrigation channel" },
  { word: "QINTAR", hint: "Albanian monetary unit" },
  // High-value longer words
  { word: "QUIZ", hint: "A test of knowledge" },
  { word: "FUZZ", hint: "Light fibres or hair" },
  { word: "JAZZ", hint: "A style of music" },
  { word: "FIZZ", hint: "To make a hissing sound" },
  { word: "BUZZ", hint: "A continuous humming sound" },
  { word: "COZY", hint: "Warm and comfortable" },
  { word: "HAZY", hint: "Covered in haze" },
  { word: "ZYGA", hint: "Plural of zygon (brain anatomy)" },
];
