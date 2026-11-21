const {
  SKILL_DATABASE,
  getCanonicalSkillName,
  isSkillEquivalent,
  resolveSkillSynonym,
} = require('../ai/skillDictionary');

// Get all supported skills dictionary
const getSkillsDictionary = async (req, res) => {
  try {
    const grouped = {};
    for (const skill of SKILL_DATABASE) {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push({
        canonical: skill.canonical,
        synonyms: skill.synonyms,
        related: skill.related,
        description: skill.description,
      });
    }

    res.json({
      success: true,
      totalSkills: SKILL_DATABASE.length,
      categories: grouped,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch skill dictionary' });
  }
};

// Check if two skills are synonyms
const checkSynonym = async (req, res) => {
  try {
    const { skillA, skillB } = req.body;
    if (!skillA || !skillB) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both skillA and skillB to test synonym equivalence.',
      });
    }

    const canonicalA = getCanonicalSkillName(skillA);
    const canonicalB = getCanonicalSkillName(skillB);
    const isEquivalent = isSkillEquivalent(skillA, skillB);

    res.json({
      success: true,
      inputA: skillA,
      canonicalA,
      inputB: skillB,
      canonicalB,
      isEquivalent,
      explanation: isEquivalent
        ? `"${skillA}" and "${skillB}" both resolve to the canonical skill "${canonicalA}".`
        : `"${skillA}" (resolves to ${canonicalA}) and "${skillB}" (resolves to ${canonicalB}) represent distinct skill competencies.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Synonym check failed' });
  }
};

module.exports = {
  getSkillsDictionary,
  checkSynonym,
};
