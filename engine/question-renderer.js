(function () {
  function difficultyDots(level) {
    return "★".repeat(Math.max(1, Math.min(5, Number(level || 1))));
  }

  function uniqueChips(list) {
    return Array.from(new Set((list || []).filter(Boolean)));
  }

  function renderQuestionMeta(question, escapeText) {
    const chips = uniqueChips([
      question.typeCategory,
      question.sourceCategory || question.source,
      '难度' + difficultyDots(question.difficulty)
    ]).slice(0, 3);
    return '<div class="q-num">' + escapeText(question.subjectName + ' · ' + question.unitName) + ' · 难度' + difficultyDots(question.difficulty) + '</div>' +
      '<div class="tag-row">' + chips.map(chip => '<span class="tag">' + escapeText(chip) + '</span>').join('') + '</div>';
  }

  function renderMasterySummary(summary, escapeText) {
    if (!summary) return '';
    const percent = Math.round((summary.averageMastery || 0) * 100);
    const weakText = summary.weakTags && summary.weakTags.length
      ? summary.weakTags.map(tag => escapeText(typeof tag === 'string' ? tag : tag.tag)).join(' / ')
      : '暂无练习记录';
    return '<div class="card"><div class="card-header">📈 学情画像</div>' +
      '<div style="font-size:28px;font-weight:700;color:var(--primary)">' + percent + '%</div>' +
      '<div style="font-size:13px;color:var(--text2);margin-top:4px">当前掌握度（按正确率、速度、近期表现、难度加权计算）</div>' +
      '<div class="template-box" style="margin-top:12px">当前最需要补强：' + weakText + '</div></div>';
  }

  window.QuestionRenderer = {
    renderQuestionMeta: renderQuestionMeta,
    renderMasterySummary: renderMasterySummary
  };
})();
