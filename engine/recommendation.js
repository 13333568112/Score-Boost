(function () {
  function sample(list, count) {
    const cloned = [...list];
    for (let index = cloned.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = cloned[index];
      cloned[index] = cloned[swapIndex];
      cloned[swapIndex] = temp;
    }
    return cloned.slice(0, Math.max(0, count));
  }

  function applyDifficultyFilter(bank, options) {
    const range = options && options.difficultyRange;
    if (!range || range.length !== 2) return bank;
    return bank.filter(question => question.difficulty >= range[0] && question.difficulty <= range[1]);
  }

  function applySourceFilter(bank, options) {
    const source = options && options.source;
    if (!source) return bank;
    return bank.filter(question => question.sourceCategory === source);
  }

  function applyFilters(bank, options) {
    return applySourceFilter(applyDifficultyFilter(bank, options), options);
  }

  function byHistory(state) {
    const seen = new Set((state.attemptLog || []).map(record => record.questionId));
    const wrongIds = new Set((state.attemptLog || []).filter(record => !record.correct).map(record => record.questionId));
    return { seen: seen, wrongIds: wrongIds };
  }

  function getWeakQuestions(bank, masteryMap) {
    return bank
      .map(question => {
        const scores = (question.knowledgeTags || []).map(tag => masteryMap[tag] ? masteryMap[tag].mastery : 0.35);
        const minMastery = scores.length ? Math.min.apply(null, scores) : 0.35;
        return { question: question, mastery: minMastery };
      })
      .sort((left, right) => left.mastery - right.mastery)
      .map(entry => entry.question);
  }

  function getVariantQuestions(bank, state) {
    const history = byHistory(state);
    const wrongQuestions = bank.filter(question => history.wrongIds.has(question.id));
    const variantKeys = new Set();
    wrongQuestions.forEach(question => {
      const firstTag = (question.knowledgeTags || [question.knowledgePoint])[0];
      variantKeys.add(question.typeCategory + "|" + firstTag);
    });
    const variants = bank.filter(question => {
      const firstTag = (question.knowledgeTags || [question.knowledgePoint])[0];
      const key = question.typeCategory + "|" + firstTag;
      return variantKeys.has(key) && !history.wrongIds.has(question.id);
    });
    return variants.length ? variants : wrongQuestions;
  }

  function pickByDifficulty(bank, range) {
    return bank.filter(question => question.difficulty >= range[0] && question.difficulty <= range[1]);
  }

  function isGeneratedQuestion(question) {
    return /^gen-/.test(String(question && question.id || ''));
  }

  function questionQualityRank(question) {
    if (!question) return 0;
    if (question.sourceEvidence) return 2;
    if (!isGeneratedQuestion(question)) return 1;
    return 0;
  }

  function preferReliableBank(bank) {
    const sourceBacked = bank.filter(question => questionQualityRank(question) === 2);
    if (sourceBacked.length) return sourceBacked;
    const nonGenerated = bank.filter(question => questionQualityRank(question) >= 1);
    return nonGenerated.length ? nonGenerated : bank;
  }

  function isTrustedSprintQuestion(question) {
    if (!question) return false;
    const source = String(question.source || '');
    const sourceCategory = String(question.sourceCategory || '');
    const id = String(question.id || '');
    const hasSourceEvidence = !!(question && question.sourceEvidence);
    const hasValidOptions = !Array.isArray(question.options) || question.options.length === 4;
    const isShanxiStyle = /山西真题改编|山西高频训练|山西模拟原创/.test(source) || /山西真题|山西高频|山西模拟/.test(sourceCategory);
    const isWeakGenerated = /^gen-/.test(id) || /功能扩题/.test(source) || /-(?:method|summary-choice|correction-choice|formula-choice|concept|mistake|formula)$/.test(id);
    return hasSourceEvidence && hasValidOptions && isShanxiStyle && !isWeakGenerated;
  }

  function sprintPriority(question) {
    return [
      question && question.sourceEvidence ? 1 : 0,
      Number(question && question.shanxiFrequency || 0),
      Number(question && question.difficulty || 0)
    ];
  }

  function dueForReview(question, masteryMap) {
    const tags = question.knowledgeTags || [];
    return tags.some(tag => {
      const entry = masteryMap[tag];
      if (!entry || !entry.lastPracticedAt) return false;
      return Date.now() - entry.lastPracticedAt >= 3 * 24 * 60 * 60 * 1000;
    });
  }

  function rankQuestions(bank, state) {
    const masteryMap = window.PracticeAnalytics.buildMasteryMap(state);
    const history = byHistory(state);
    return bank
      .map(question => {
        const tagMasteries = (question.knowledgeTags || []).map(tag => masteryMap[tag] ? masteryMap[tag].mastery : 0.35);
        const mastery = tagMasteries.length ? Math.min.apply(null, tagMasteries) : 0.35;
        let score = (1 - mastery) * 60 + (question.shanxiFrequency || 1) * 8;
        if (!history.seen.has(question.id)) score += 6;
        if (history.wrongIds.has(question.id)) score += 18;
        if (dueForReview(question, masteryMap)) score += 14;
        if (question.source === "山西近年真题改编") score += 8;
        score += questionQualityRank(question) * 20;
        if (isGeneratedQuestion(question) && !question.sourceEvidence) score -= 20;
        return { question: question, score: score, mastery: mastery };
      })
      .sort((left, right) => right.score - left.score);
  }

  function pickDistinct(ranked, count, selectedIds) {
    const picked = [];
    ranked.forEach(entry => {
      if (picked.length >= count) return;
      if (selectedIds.has(entry.question.id)) return;
      selectedIds.add(entry.question.id);
      picked.push(entry.question);
    });
    return picked;
  }

  function buildSmartDaily(bank, state) {
    const effectiveBank = preferReliableBank(bank);
    const ranked = rankQuestions(effectiveBank, state);
    const selectedIds = new Set();
    const masteryMap = window.PracticeAnalytics.buildMasteryMap(state);
    const weakRanked = getWeakQuestions(effectiveBank, masteryMap).map(question => ({ question: question }));
    const highFrequency = ranked.filter(entry => (entry.question.shanxiFrequency || 1) >= 4);
    const variants = getVariantQuestions(effectiveBank, state).map(question => ({ question: question }));
    const newChallenges = ranked.filter(entry => entry.question.difficulty >= 4 && !(state.attemptLog || []).some(record => record.questionId === entry.question.id));
    const result = [];
    result.push.apply(result, pickDistinct(weakRanked, 8, selectedIds));
    result.push.apply(result, pickDistinct(highFrequency, 6, selectedIds));
    result.push.apply(result, pickDistinct(variants, 4, selectedIds));
    result.push.apply(result, pickDistinct(newChallenges, 2, selectedIds));
    if (result.length < 20) {
      result.push.apply(result, pickDistinct(ranked, 20 - result.length, selectedIds));
    }
    return result;
  }

  function buildQuickScoreBoost(bank, state) {
    const effectiveBank = preferReliableBank(bank);
    const ranked = rankQuestions(effectiveBank, state).filter(entry => entry.question.difficulty <= 3 && (entry.question.shanxiFrequency || 1) >= 3);
    return pickDistinct(ranked, 15, new Set());
  }

  function buildShanxiSprint(bank) {
    const trustedReal = bank.filter(question => isTrustedSprintQuestion(question) && /山西真题改编|山西高频训练/.test(question.source || ''));
    const trustedMock = bank.filter(question => isTrustedSprintQuestion(question) && /山西模拟原创/.test(question.source || ''));
    const trusted = trustedReal.length ? trustedReal.concat(trustedMock) : bank.filter(isTrustedSprintQuestion);
    const ranked = trusted
      .slice()
      .sort((a, b) => {
        const aPriority = sprintPriority(a);
        const bPriority = sprintPriority(b);
        return bPriority[0] - aPriority[0] || bPriority[1] - aPriority[1] || bPriority[2] - aPriority[2];
      });
    return sample(ranked, Math.min(12, ranked.length));
  }

  function buildBossFinal(bank, subjectId) {
    const effectiveBank = preferReliableBank(bank);
    const focusMap = {
      math: ["函数综合", "几何证明", "动点最值", "圆综合"],
      physics: ["电学综合", "力学综合", "实验探究"],
      chemistry: ["实验探究", "推断题", "计算题"],
      history: ["材料题", "启示建议"],
      daofa: ["材料题", "辨析评价"],
      english: ["阅读", "作文"],
      chinese: ["阅读赏析", "作文"]
    };
    const focus = focusMap[subjectId] || [];
    const filtered = effectiveBank.filter(question => question.difficulty >= 4 && (!focus.length || focus.indexOf(question.typeCategory) !== -1));
    return sample(filtered.length ? filtered : pickByDifficulty(effectiveBank, [4, 5]), 10);
  }

  function buildScoreGuard(bank) {
    const effectiveBank = preferReliableBank(bank);
    const filtered = effectiveBank.filter(question => question.difficulty <= 2 || (question.shanxiFrequency || 1) >= 4);
    return sample(filtered, 12);
  }

  function buildVariantWrong(bank, state) {
    const effectiveBank = preferReliableBank(bank);
    return sample(getVariantQuestions(effectiveBank, state), 12);
  }

  function buildChapterPaper(bank, options) {
    const unitId = options.unitId;
    const filteredBank = applyFilters(bank, options);
    const reliableBank = preferReliableBank(filteredBank);
    const scoped = unitId ? reliableBank.filter(question => question.unitId === unitId) : reliableBank;
    const effectiveBank = scoped.length ? scoped : reliableBank;
    const ranked = rankQuestions(effectiveBank, options.state || { attemptLog: [] });
    return pickDistinct(ranked, Math.min(options.count || 12, effectiveBank.length), new Set());
  }

  function buildSpecialPaper(bank, options) {
    const state = options.state || { attemptLog: [] };
    const filteredBank = applyFilters(bank, options);
    const reliableBank = preferReliableBank(filteredBank);
    const grouped = reliableBank.reduce((accumulator, question) => {
      const key = question.typeCategory || '综合题';
      if (!accumulator[key]) accumulator[key] = [];
      accumulator[key].push(question);
      return accumulator;
    }, {});
    const rankedTypes = Object.keys(grouped)
      .map(type => ({
        type: type,
        count: grouped[type].length,
        score: grouped[type].reduce((sum, question) => sum + (question.shanxiFrequency || 1), 0)
      }))
      .sort((left, right) => right.score - left.score || right.count - left.count);
    const targetType = options.typeCategory || (rankedTypes[0] ? rankedTypes[0].type : null);
    const scoped = targetType ? reliableBank.filter(question => question.typeCategory === targetType) : reliableBank;
    const effectiveBank = scoped.length ? scoped : reliableBank;
    const ranked = rankQuestions(effectiveBank, state);
    return pickDistinct(ranked, Math.min(options.count || 12, effectiveBank.length), new Set());
  }

  function buildMistakePaper(bank, options) {
    const state = options.state || { attemptLog: [] };
    const filteredBank = applyFilters(bank, options);
    const reliableBank = preferReliableBank(filteredBank);
    const wrong = reliableBank.filter(question => byHistory(state).wrongIds.has(question.id));
    const variants = getVariantQuestions(reliableBank, state);
    const preferred = wrong.length ? wrong.concat(variants) : variants;
    if (preferred.length) return sample(preferred, options.count || 15);
    return pickDistinct(rankQuestions(reliableBank, state), Math.min(options.count || 12, reliableBank.length), new Set());
  }

  function buildSprintPaper(bank, options) {
    const state = options.state || { attemptLog: [] };
    const filteredBank = applyFilters(bank, options);
    const ranked = rankQuestions(filteredBank, state)
      .filter(entry => isTrustedSprintQuestion(entry.question) && (entry.question.shanxiFrequency || 1) >= 3 && entry.question.difficulty >= 2);
    return pickDistinct(ranked, Math.min(options.count || 18, filteredBank.length), new Set());
  }

  function buildRecommendationSet(mode, options) {
    const bank = options.bank || [];
    const state = options.state || { attemptLog: [] };
    if (mode === "smartDaily") return buildSmartDaily(bank, state);
    if (mode === "quickScoreBoost") return buildQuickScoreBoost(bank, state);
    if (mode === "variantWrong") return buildVariantWrong(bank, state);
    if (mode === "shanxiSprint") return buildShanxiSprint(bank);
    if (mode === "bossFinal") return buildBossFinal(bank, options.subject);
    if (mode === "scoreGuard") return buildScoreGuard(bank);
    return sample(bank, Math.min(10, bank.length));
  }

  function buildByMode(mode, options) {
    const modeMap = {
      "smart-daily": "smartDaily",
      "quick-score": "quickScoreBoost",
      "variant-wrong": "variantWrong",
      "shanxi-focus": "shanxiSprint",
      "boss-breakthrough": "bossFinal",
      "score-guard": "scoreGuard",
      "adaptive": "smartDaily"
    };
    if (mode === "chapter-paper") return buildChapterPaper(options.bank || [], options || {});
    if (mode === "special-paper") return buildSpecialPaper(options.bank || [], options || {});
    if (mode === "mistake-paper") return buildMistakePaper(options.bank || [], options || {});
    if (mode === "sprint-paper") return buildSprintPaper(options.bank || [], options || {});
    return buildRecommendationSet(modeMap[mode] || mode, options || {});
  }

  window.RecommendationEngine = {
    buildByMode: buildByMode,
    buildRecommendationSet: buildRecommendationSet,
    rankQuestions: rankQuestions
  };
})();
