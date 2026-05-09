(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function difficultyWeight(level) {
    return 0.65 + clamp(Number(level || 1), 1, 5) * 0.08;
  }

  function speedScore(record) {
    const expectedSeconds = clamp(Number(record.estimatedMinutes || 3) * 60, 60, 1800);
    if (!record.answerTime || record.answerTime <= 0) return 0.6;
    const ratio = expectedSeconds / record.answerTime;
    return clamp(ratio, 0.2, 1);
  }

  function recentScore(record, now) {
    const diff = Math.max(0, now - Number(record.timestamp || now));
    const days = diff / (1000 * 60 * 60 * 24);
    if (days <= 1) return record.correct ? 1 : 0.2;
    if (days <= 3) return record.correct ? 0.85 : 0.3;
    if (days <= 7) return record.correct ? 0.7 : 0.4;
    return record.correct ? 0.55 : 0.45;
  }

  function computeMastery(records) {
    if (!records || !records.length) return 0;
    const now = Date.now();
    let accuracy = 0;
    let speed = 0;
    let recent = 0;
    let difficulty = 0;
    records.forEach(record => {
      accuracy += record.correct ? 1 : 0;
      speed += speedScore(record);
      recent += recentScore(record, now);
      difficulty += (record.correct ? 1 : 0.35) * difficultyWeight(record.difficulty);
    });
    const total = records.length;
    const accuracyAvg = accuracy / total;
    const speedAvg = speed / total;
    const recentAvg = recent / total;
    const difficultyAvg = clamp(difficulty / total, 0, 1);
    const score = accuracyAvg * 0.55 + speedAvg * 0.15 + recentAvg * 0.2 + difficultyAvg * 0.1;
    return clamp(score, 0, 1);
  }

  function recommendedDifficulty(mastery, streak) {
    if (streak && streak <= -2) return [1, 2];
    if (streak && streak >= 3) return [4, 5];
    if (mastery < 0.5) return [1, 2];
    if (mastery < 0.75) return [2, 3];
    if (mastery < 0.9) return [3, 4];
    return [4, 5];
  }

  window.MasteryScoring = {
    clamp: clamp,
    computeMastery: computeMastery,
    recommendedDifficulty: recommendedDifficulty
  };
})();
