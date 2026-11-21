const natural = require('natural');
const { SKILL_DATABASE, SYNONYM_LOOKUP_MAP, getCanonicalSkillName } = require('./skillDictionary');

/**
 * Splits document text into clean individual sentences while preserving
 * technical abbreviations (e.g., Node.js, React.js, Next.js, i.e., e.g., v1.0).
 */
function splitIntoSentences(text) {
  if (!text) return [];

  // Protect technical periods temporarily with placeholder
  const protectedText = text
    .replace(/(Node|React|Next|Vue|Angular|Express|Nest)\.js/gi, '$1_DOT_JS')
    .replace(/\.NET/gi, '_DOT_NET')
    .replace(/\b(e\.g\.|i\.e\.|vs\.|etc\.)/gi, (m) => m.replace(/\./g, '_DOT_'))
    .replace(/(\d+)\.(\d+)/g, '$1_DECIMAL_$2');

  // Split on sentence terminators or bullet points / newlines
  const rawSentences = protectedText.split(/(?<=[.!?])\s+|\n+/);

  const sentences = [];
  for (let i = 0; i < rawSentences.length; i++) {
    let s = rawSentences[i].trim();
    if (!s) continue;

    // Restore protected characters
    s = s
      .replace(/_DOT_JS/g, '.js')
      .replace(/_DOT_NET/g, '.NET')
      .replace(/_DOT_/g, '.')
      .replace(/_DECIMAL_/g, '.');

    // Remove leading bullets or list numbers
    s = s.replace(/^[•\-\*\d\.\)\s]+/, '').trim();

    if (s.length > 5) {
      sentences.push({
        text: s,
        index: i,
      });
    }
  }

  return sentences;
}

/**
 * Determines importance level based on contextual sentence markers.
 */
function determineImportance(sentenceText) {
  const lower = sentenceText.toLowerCase();

  const requiredMarkers = [
    'required', 'must have', 'must possess', 'minimum', 'essential',
    'needed', 'mandatory', 'requirements:', 'qualifications:', 'core requirement',
    'strong proficiency in', 'demonstrated experience with'
  ];

  const preferredMarkers = [
    'preferred', 'nice to have', 'plus', 'bonus', 'desired', 'ideal',
    'advantageous', 'good to have', 'helpful', 'considered a plus',
    'preferred qualifications'
  ];

  if (requiredMarkers.some(marker => lower.includes(marker))) {
    return 'required';
  }
  if (preferredMarkers.some(marker => lower.includes(marker))) {
    return 'preferred';
  }
  return 'required'; // In job specs, unlabelled technical skills usually default to core requirements
}

/**
 * Escapes regex special characters while preserving C++, C#, .NET, CI/CD, etc.
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a regex pattern for a skill alias ensuring clean word boundaries.
 */
function createSkillRegex(alias) {
  const escaped = escapeRegex(alias);
  // If alias ends with +, #, etc. word boundary \b won't match after non-word char
  const startsWithWord = /^\w/.test(alias);
  const endsWithWord = /\w$/.test(alias);

  const prefix = startsWithWord ? '\\b' : '(?:^|\\s)';
  const suffix = endsWithWord ? '\\b' : '(?=\\s|$|[.,;!])';

  return new RegExp(`${prefix}${escaped}${suffix}`, 'i');
}

/**
 * Extracts skills from text using multi-pass dictionary matching and NLP validation.
 * @param {string} text - Raw document text
 * @param {'resume'|'job_description'} documentType
 */
function extractSkillsFromText(text, documentType = 'job_description') {
  if (!text || typeof text !== 'string') {
    return {
      extractedSkills: [],
      skillsByCanonical: {},
      sentences: [],
      experienceRequirements: [],
    };
  }

  const sentences = splitIntoSentences(text);
  const detectedSkills = new Map(); // canonical -> ExtractedSkillObject

  // Pre-compiled regex patterns for all dictionary entries
  for (const entry of SKILL_DATABASE) {
    const candidates = [entry.canonical, ...entry.synonyms];

    for (const candidate of candidates) {
      const regex = createSkillRegex(candidate);

      for (const sent of sentences) {
        const match = sent.text.match(regex);
        if (match) {
          const matchedString = match[0].trim();
          const canonical = entry.canonical;
          const importance = documentType === 'job_description'
            ? determineImportance(sent.text)
            : 'optional';

          // High confidence for exact or recognized synonym matches
          const confidence = candidate.toLowerCase() === canonical.toLowerCase() ? 98 : 94;

          if (!detectedSkills.has(canonical)) {
            detectedSkills.set(canonical, {
              canonicalName: canonical,
              originalExtractedName: matchedString,
              category: entry.category,
              importance,
              confidenceScore: confidence,
              evidenceSentence: sent.text,
              sourceLineNumber: sent.index + 1,
              documentType,
            });
          } else {
            // If already detected, upgrade importance if a stronger requirement appears
            const existing = detectedSkills.get(canonical);
            if (importance === 'required' && existing.importance !== 'required') {
              existing.importance = 'required';
              existing.evidenceSentence = sent.text; // Store the required evidence
            }
          }
          break; // Avoid duplicate searches for same candidate once found in sentence
        }
      }
    }
  }

  // Experience requirement extraction (e.g., "5+ years of software experience")
  const expRegex = /(\d{1,2})\+?\s*(?:to|-)?\s*(\d{1,2})?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+[a-zA-Z\s]{0,25})?(?:experience|exp)?/gi;
  const experienceRequirements = [];

  for (const sent of sentences) {
    let match;
    while ((match = expRegex.exec(sent.text)) !== null) {
      const fullMatch = match[0].trim();
      if (fullMatch.length > 5 && !experienceRequirements.some(e => e.sentence === sent.text)) {
        experienceRequirements.push({
          mention: fullMatch,
          years: parseInt(match[1], 10),
          sentence: sent.text,
        });
      }
    }
  }

  const extractedSkillsList = Array.from(detectedSkills.values());
  const skillsByCanonical = {};
  for (const skill of extractedSkillsList) {
    skillsByCanonical[skill.canonicalName] = skill;
  }

  return {
    extractedSkills: extractedSkillsList,
    skillsByCanonical,
    sentences,
    experienceRequirements,
  };
}

module.exports = {
  splitIntoSentences,
  determineImportance,
  extractSkillsFromText,
};
