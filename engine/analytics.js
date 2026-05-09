(function () {
  function normalizeTag(tag) {
    return String(tag || "").trim();
  }

  function groupAttemptsByTag(attemptLog) {
    const map = {};
    (attemptLog || []).forEach(record => {
      (record.knowledgeTags || []).map(normalizeTag).filter(Boolean).forEach(tag => {
        if (!map[tag]) map[tag] = [];
        map[tag].push(record);
      });
    });
    return map;
  }

  function getQuestionAttempts(state, questionId) {
    const attemptLog = state && Array.isArray(state.attemptLog) ? state.attemptLog : [];
    return attemptLog.filter(record => record.questionId === questionId);
  }

  function getQuestionStreak(state, questionId) {
    const attempts = getQuestionAttempts(state, questionId).slice(-3);
    if (!attempts.length) return 0;
    let streak = 0;
    for (let index = attempts.length - 1; index >= 0; index -= 1) {
      if (attempts[index].correct) {
        if (streak < 0) break;
        streak += 1;
      } else {
        if (streak > 0) break;
        streak -= 1;
      }
    }
    return streak;
  }

  function buildMasteryMap(state) {
    const grouped = groupAttemptsByTag(state.attemptLog || []);
    const result = {};
    Object.keys(grouped).forEach(tag => {
      const records = grouped[tag];
      const mastery = window.MasteryScoring.computeMastery(records);
      const lastRecord = records[records.length - 1];
      result[tag] = {
        tag: tag,
        mastery: mastery,
        attempts: records.length,
        correctRate: records.filter(record => record.correct).length / records.length,
        lastPracticedAt: lastRecord ? lastRecord.timestamp : 0
      };
    });
    return result;
  }

  function summarizeSubject(state, subjectId) {
    const attempts = ((state && state.attemptLog) || []).filter(record => record.subject === subjectId);
    const masteryMap = buildMasteryMap({ attemptLog: attempts });
    const entries = Object.values(masteryMap);
    const averageMastery = entries.length
      ? entries.reduce((sum, entry) => sum + entry.mastery, 0) / entries.length
      : 0;
    const accuracy = attempts.length
      ? attempts.filter(record => record.correct).length / attempts.length
      : 0;
    return {
      attempts: attempts.length,
      averageMastery: averageMastery,
      accuracy: accuracy,
      weakTags: entries
        .sort((left, right) => left.mastery - right.mastery)
        .slice(0, 3)
        .map(entry => ({ tag: entry.tag, mastery: entry.mastery }))
    };
  }

  function buildAttemptRecord(question, payload) {
    return {
      questionId: question.id,
      subject: question.subject,
      knowledgeTags: question.knowledgeTags || [],
      type: question.typeCategory,
      difficulty: question.difficulty,
      correct: !!payload.correct,
      answerTime: Number(payload.answerTime || 0),
      attempts: Number(payload.attempts || 1),
      timestamp: Number(payload.timestamp || Date.now()),
      mistakeReason: payload.mistakeReason || "",
      estimatedMinutes: question.estimatedMinutes || 3,
      source: question.source,
      shanxiFrequency: question.shanxiFrequency || 1
    };
  }

  window.PracticeAnalytics = {
    buildAttemptRecord: buildAttemptRecord,
    buildMasteryMap: buildMasteryMap,
    summarizeSubject: summarizeSubject,
    countQuestionAttempts: function (state, questionId) {
      return getQuestionAttempts(state, questionId).length;
    },
    getQuestionAttempts: getQuestionAttempts,
    getQuestionStreak: getQuestionStreak
  };
})();
