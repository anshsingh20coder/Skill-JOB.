const { LearningPlanStore } = require('../models/dataStore');

async function getLearningPlan(req, res) {
  try {
    const { id } = req.params;
    let plan = await LearningPlanStore.findById(id);
    if (!plan) {
      // Check if ID is analysisId
      plan = await LearningPlanStore.findOne({ analysisId: id });
    }
    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }
    return res.json({ learningPlan: plan });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch learning plan' });
  }
}

async function updateDayProgress(req, res) {
  try {
    const { id } = req.params;
    const { day, completed } = req.body;

    let plan = await LearningPlanStore.findById(id);
    if (!plan) {
      plan = await LearningPlanStore.findOne({ analysisId: id });
    }
    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    const updatedDays = plan.days.map(d => {
      if (d.day === Number(day)) {
        return { ...d, completed: Boolean(completed) };
      }
      return d;
    });

    const completedCount = updatedDays.filter(d => d.completed).length;
    const progress = Math.round((completedCount / updatedDays.length) * 100);

    const updated = await LearningPlanStore.findByIdAndUpdate(plan.id, {
      days: updatedDays,
      completedDaysCount: completedCount,
      progressPercentage: progress
    });

    return res.json({
      message: `Day ${day} progress updated`,
      learningPlan: updated
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update day progress' });
  }
}

module.exports = {
  getLearningPlan,
  updateDayProgress
};
