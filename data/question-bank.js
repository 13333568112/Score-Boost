(function () {
  const TYPE_KEYWORDS = {
    math: [
      ["函数综合", ["函数", "抛物线", "一次函数", "二次函数"]],
      ["几何证明", ["证明", "相似", "全等", "圆", "三角形"]],
      ["动点最值", ["最值", "动点", "范围"]],
      ["统计概率", ["概率", "统计", "平均数", "方差"]],
      ["圆综合", ["圆", "切线", "圆周角"]],
      ["解答", ["计算", "过程", "说明"]],
      ["选择填空", []]
    ],
    physics: [
      ["实验探究", ["实验", "探究", "控制变量"]],
      ["作图", ["作图"]],
      ["计算", ["计算", "求", "功率", "速度", "电流"]],
      ["图像题", ["图像", "图象"]],
      ["电学综合", ["电学", "欧姆", "电功率"]],
      ["力学综合", ["力学", "浮力", "压强", "机械"]]
    ],
    chemistry: [
      ["实验探究", ["实验", "探究", "装置"]],
      ["流程题", ["流程"]],
      ["推断题", ["推断", "判断对应"]],
      ["计算题", ["计算", "质量分数"]],
      ["除杂鉴别", ["除杂", "鉴别", "检验"]]
    ],
    chinese: [
      ["默写", ["空缺处", "应填"]],
      ["文言翻译", ["翻译", "文言"]],
      ["阅读赏析", ["赏析", "阅读", "作用"]],
      ["作用题", ["作用"]],
      ["作文", ["作文", "构思", "写作"]]
    ],
    english: [
      ["语法填空", ["语法填空", "fill"]],
      ["完形", ["完形"]],
      ["阅读", ["阅读", "主旨", "短文"]],
      ["任务型阅读", ["阅读表达", "translate"]],
      ["作文", ["书面表达", "写作"]]
    ],
    history: [
      ["辨析评价", ["辨析评价", "评析", "比较"]],
      ["材料题", ["材料"]],
      ["原因意义", ["原因", "意义"]],
      ["启示建议", ["启示", "建议"]]
    ],
    daofa: [
      ["辨析评价", ["辨析评价", "评析", "辨析"]],
      ["材料题", ["材料"]],
      ["原因意义", ["原因", "意义"]],
      ["启示建议", ["启示", "做法", "如何"]]
    ]
  };

  function uniq(list) {
    return Array.from(new Set((list || []).filter(Boolean)));
  }

  function stripHtml(text) {
    return String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  function firstSentence(text) {
    const plain = stripHtml(text);
    if (!plain) return "";
    const sentenceMatch = plain.match(/^(.+?[。！？；])/);
    if (sentenceMatch) return sentenceMatch[1].trim();
    return plain.trim();
  }

  function stripOrderPrefix(name) {
    return String(name || "")
      .replace(/^(?:[一二三四五六七八九十]+[、.]|[0-9]+[、.．]|\([0-9]+\)|（[0-9]+）|\s*[0-9]+\s*[-.、])\s*/, "")
      .trim();
  }

  function detectSource(question) {
    const stem = String(question.stem || "");
    const id = String(question.id || "");
    if (id.indexOf("real-") === 0 || stem.indexOf("山西真题") !== -1) return "山西近年真题改编";
    if (stem.indexOf("山西") !== -1) return "山西模拟题改编";
    if (id.indexOf("adv-") === 0 || stem.indexOf("大招") !== -1) return "大招专项题";
    return "教材例题变式";
  }

  function inferSourceCategory(source, question, unit, difficulty, frequency) {
    const value = String(source || "");
    if (value.indexOf("真题") !== -1) return "山西真题";
    if (value.indexOf("模拟") !== -1) return "山西模拟";
    if (value.indexOf("大招") !== -1) return "大招专项";
    if (value.indexOf("功能扩题") !== -1) return "专项能力";
    if (difficulty >= 4) return "压轴冲刺";
    if (frequency >= 4 || Number(unit.priority || 0) >= 5) return "山西高频";
    if (["material", "essay", "short", "calculation"].indexOf(String(question.type || "")) !== -1) return "专项能力";
    return "教材例题";
  }

  function inferDifficulty(question, unit) {
    const raw = Number(question.difficulty || unit.difficulty || 2);
    return Math.max(1, Math.min(5, raw));
  }

  function inferQuestionType(subjectId, unit, question) {
    if (question.typeCategory) return question.typeCategory;
    if (question.type === "essay") return "作文";
    if (question.type === "fill") return subjectId === "english" ? "语法填空" : "选择填空";
    if (question.type === "material") return "材料题";
    if (question.type === "calculation") return subjectId === "physics" ? "计算" : "计算题";
    if (question.type === "short") return ["history", "daofa"].includes(subjectId) ? "启示建议" : "解答";
    const subjectRules = TYPE_KEYWORDS[subjectId] || [];
    const corpus = [unit.name, question.stem].concat(question.tags || []).join(" ");
    for (let index = 0; index < subjectRules.length; index += 1) {
      const rule = subjectRules[index];
      const label = rule[0];
      const keywords = rule[1];
      if (!keywords.length) continue;
      if (keywords.some(keyword => corpus.indexOf(keyword) !== -1)) return label;
    }
    if (["single", "truefalse"].includes(question.type)) {
      if (["history", "daofa"].includes(subjectId)) return "基础识记";
      return "选择填空";
    }
    return "综合题";
  }

  function inferKnowledgeTags(subject, unit, question) {
    const tags = [];
    const knowledgePoint = stripOrderPrefix(unit.name);
    const subKnowledgePoint = question.subKnowledgePoint || question.knowledgePoint || (unit.concepts && unit.concepts[0] ? unit.concepts[0].title : knowledgePoint);
    tags.push(subject.name, knowledgePoint, stripOrderPrefix(subKnowledgePoint));
    (question.tags || []).forEach(tag => tags.push(tag));
    if (question.typeCategory) tags.push(question.typeCategory);
    return uniq(tags);
  }

  function inferScore(question) {
    if (question.score) return question.score;
    if (["essay", "material"].includes(question.type)) return 10;
    if (["short", "calculation"].includes(question.type)) return 6;
    if (question.type === "fill") return 3;
    return 2;
  }

  function inferCommonMistake(unit, question) {
    if (question.commonMistake) return question.commonMistake;
    if (Array.isArray(unit.commonMistakes) && unit.commonMistakes.length) {
      return unit.commonMistakes[0].wrong + "；应改为：" + unit.commonMistakes[0].correct;
    }
    const concept = (unit.concepts || []).find(item => item.commonMistake);
    return concept ? concept.commonMistake : "审题不清或知识点迁移不稳";
  }

  function normalizeQuestion(subject, unit, question, index) {
    const difficulty = inferDifficulty(question, unit);
    const typeCategory = inferQuestionType(subject.id, unit, question);
    const source = question.source || detectSource(question);
    const shanxiFrequency = Number(question.shanxiFrequency || unit.priority || Math.min(5, difficulty + 1));
    const knowledgePoint = question.knowledgePoint || stripOrderPrefix(unit.name);
    const subKnowledgePoint = question.subKnowledgePoint || (unit.concepts && unit.concepts[0] ? stripOrderPrefix(unit.concepts[0].title) : knowledgePoint);
    const normalized = Object.assign({}, question, {
      id: question.id || subject.id + "-" + unit.id + "-" + index,
      subject: subject.id,
      subjectName: subject.name,
      textbookModule: unit.name,
      knowledgePoint: knowledgePoint,
      subKnowledgePoint: subKnowledgePoint,
      knowledgeTags: inferKnowledgeTags(subject, unit, Object.assign({}, question, { typeCategory: typeCategory })),
      typeCategory: typeCategory,
      shanxiFrequency: shanxiFrequency,
      score: inferScore(question),
      commonMistake: inferCommonMistake(unit, question),
      difficulty: difficulty,
      difficultyLevel: "L" + difficulty,
      source: source,
      sourceCategory: inferSourceCategory(source, question, unit, difficulty, shanxiFrequency),
      unitId: unit.id,
      unitName: unit.name,
      estimatedMinutes: Number(question.estimatedMinutes || unit.estimatedMinutes || 8),
      isComprehensive: unit.id.indexOf("comprehensive") !== -1 || typeCategory.indexOf("综合") !== -1,
      stem: String(question.stem || "")
    });
    return normalized;
  }

  function dedupeQuestions(list) {
    const map = new Map();
    (list || []).forEach(question => {
      if (!question || !question.id) return;
      map.set(question.id, question);
    });
    return Array.from(map.values());
  }

  function normalizeChoiceText(text) {
    return stripHtml(text).replace(/\s+/g, "").replace(/[，。！？；：、“”‘’（）()【】\[\],.!?;:'"\-]/g, "").toLowerCase();
  }

  function pickFirstFormula(unit) {
    const formula = Array.isArray(unit.formulas) && unit.formulas.length ? unit.formulas[0] : null;
    if (!formula) return null;
    return {
      expression: stripHtml(formula.expression || ""),
      description: stripHtml(formula.description || formula.expression || "")
    };
  }

  function buildProfileDistractors(subject, unit, concept, correctText, profile) {
    const focusTitle = stripOrderPrefix((concept && concept.title) || unit.name || "本单元重点");
    const formula = pickFirstFormula(unit);
    const methodText = stripHtml((concept && (concept.mnemonic || concept.highlightText || firstSentence(concept.body))) || "");
    const profileType = String((profile && profile.type) || "generic");
    const profileText = stripHtml((profile && profile.referenceText) || "");
    const questionStem = stripHtml((profile && profile.stem) || "");
    const extras = [];

    if (Array.isArray(profile && profile.extraWrongTexts)) {
      profile.extraWrongTexts.forEach(item => extras.push(stripHtml(item)));
    }

    if (profileType === "formula") {
      if (formula && formula.expression) {
        extras.push("只要出现“" + focusTitle + "”就机械套用“" + formula.expression + "”，不先判断已知量和适用条件。");
      }
      extras.push("先根据感觉猜一个关系式，再回头看题目条件是否匹配“" + focusTitle + "”。");
      extras.push("把“" + focusTitle + "”中的公式、单位和物理量含义混着用，认为代进去就能得分。");
    } else if (profileType === "method") {
      extras.push("复习“" + focusTitle + "”时，只记零散口诀，不知道它对应的题型入口和使用前提。");
      extras.push("遇到“" + focusTitle + "”时，先凭经验跳步骤，不用本单元的核心方法梳理解题顺序。");
      extras.push("把“" + focusTitle + "”的方法模板和别的单元技巧混用，默认都能直接套。");
    } else if (profileType === "summary") {
      extras.push("概括“" + focusTitle + "”时，只摘局部现象或关键词，没有回到核心定义或规律。");
      extras.push("把“" + focusTitle + "”的条件、结果和结论顺序说反，认为意思差不多即可。");
      extras.push("总结“" + focusTitle + "”时，脱离题干和材料，只背一个模糊印象。");
    } else if (profileType === "correction") {
      extras.push("知道“" + focusTitle + "”这类说法有问题，但纠正时仍然没有补上正确前提或条件。");
      extras.push("纠正“" + focusTitle + "”误区时，只把错误词换掉，没有回到正确概念重新表达。");
      extras.push("看到易错点就直接否定原说法，却说不清为什么错、应该怎么改。");
    } else if (profileType === "exam-step") {
      extras.push("做“" + focusTitle + "”题时第一步就急着算或作答，没有先定位定义、关系式或材料信息。");
      extras.push("处理“" + focusTitle + "”题时，先看选项猜结果，再倒推过程，忽略题目给出的关键信息。");
      extras.push("面对“" + focusTitle + "”时把审题、建模和计算顺序打乱，导致后面步骤都失真。");
    } else if (profileType === "shanxi-real") {
      extras.push("遇到山西真题风格的“" + focusTitle + "”题，只抓表面表述，不回到课本定义和条件限制。");
      extras.push("把材料中的关键信息略过，直接按熟悉说法判断“" + focusTitle + "”结论是否成立。");
      extras.push("觉得“" + focusTitle + "”这类真题只考记忆，不去比较各说法的准确程度和适用范围。");
    } else if (profileType === "shanxi-mock") {
      extras.push("备考“" + focusTitle + "”时，只求做题快，不先固定本单元最稳的拿分方法。");
      extras.push("面对“" + focusTitle + "”模拟题，看到熟词就选，看似会做却没有真正匹配题目条件。");
      extras.push("复习“" + focusTitle + "”时，把所谓技巧当答案本身，没有和教材概念结合。");
    }

    if (profileText && profileText !== stripHtml(correctText)) {
      extras.push("作答时没有抓住“" + profileText + "”这个关键信息，而是换成了看似相近但不贴题的表述。");
    }
    if (questionStem) {
      extras.push("审这道题时忽略了“" + questionStem.slice(0, 24) + (questionStem.length > 24 ? "..." : "") + "”里的限制条件。");
    }
    if (methodText && methodText !== stripHtml(correctText)) {
      extras.push("虽然知道“" + methodText + "”，但实际选择时没把它和“" + focusTitle + "”的设问对上。");
    }

    return extras;
  }

  function buildContextualDistractors(subject, unit, concept, correctText, profile) {
    const focusTitle = stripOrderPrefix((concept && concept.title) || unit.name || "本单元重点");
    const peerConcept = (unit.concepts || []).find(item => !concept || item.id !== concept.id);
    const peerTitle = stripOrderPrefix((peerConcept && peerConcept.title) || "");
    const formulaHint = stripHtml((((unit.formulas || [])[0]) || {}).description || (((unit.formulas || [])[0]) || {}).expression || "题目条件");
    const wrongTexts = [];
    buildProfileDistractors(subject, unit, concept, correctText, profile).forEach(text => {
      wrongTexts.push(text);
    });

    if (Array.isArray(unit.commonMistakes)) {
      unit.commonMistakes.forEach(item => {
        if (item && item.wrong) wrongTexts.push(stripHtml(item.wrong));
      });
    }
    if (concept && concept.commonMistake) {
      wrongTexts.push(stripHtml(concept.commonMistake));
    }
    if (peerTitle && peerTitle !== focusTitle) {
      wrongTexts.push("把“" + peerTitle + "”的规律直接套到“" + focusTitle + "”，不再判断题目条件。");
    }

    const subjectTemplates = {
      physics: [
        "处理“{focus}”时，只代数字，不先判断物理量关系和单位。",
        "看到“{focus}”就默认所有题都用“{formula}”，不核对适用条件。",
        "遇到“{focus}”情境时，只看结果大小，不分析受力、状态或过程。"
      ],
      chemistry: [
        "判断“{focus}”时，只看表面现象，不分析是否生成新物质或是否满足反应条件。",
        "遇到“{focus}”相关题，直接按生活经验判断，不回到化学概念。",
        "处理“{focus}”时，把不同实验现象和结论混在一起，不区分前提。"
      ],
      math: [
        "遇到“{focus}”就直接套结论，不先分析范围、符号和已知条件。",
        "处理“{focus}”时，不审题，默认所有同类题都用同一个公式。",
        "看到“{focus}”先猜答案，再回头补过程即可。"
      ],
      chinese: [
        "复习“{focus}”时，只背零散句子，不结合语境和设问要求。",
        "处理“{focus}”题时，默认任何文本都能照搬同一答案模板。",
        "遇到“{focus}”相关题，只看关键词，不回到原文内容和表达作用。"
      ],
      english: [
        "处理“{focus}”时，只抓单个关键词，不结合上下文和固定搭配。",
        "复习“{focus}”时，先凭语感猜答案，不核对语法、语境或结构。",
        "遇到“{focus}”相关题，把不同句型或写作模板直接混用，不分场景。"
      ],
      history: [
        "处理“{focus}”时，只背事件名称，不分析时空背景、原因和影响。",
        "遇到“{focus}”相关材料，脱离材料原文，直接套现成结论。",
        "复习“{focus}”时，只记碎片时间点，不建立事件之间的联系。"
      ],
      daofa: [
        "回答“{focus}”时，只抄教材原句，不联系材料信息和现实做法。",
        "处理“{focus}”题时，只表态，不写理由、责任或行动。",
        "遇到“{focus}”相关材料时，只谈个人感受，不回到教材观点。"
      ]
    };

    (subjectTemplates[subject.id] || []).forEach(template => {
      wrongTexts.push(template.replace(/\{focus\}/g, focusTitle).replace(/\{formula\}/g, formulaHint || "题目条件"));
    });

    wrongTexts.push("处理“" + focusTitle + "”时，只记结论，不判断适用条件。");
    wrongTexts.push("遇到“" + focusTitle + "”相关题，跳过定义和材料，直接按印象作答。");

    const correctKey = normalizeChoiceText(correctText);
    const unique = [];
    wrongTexts.forEach(text => {
      const plain = stripHtml(text);
      const key = normalizeChoiceText(plain);
      if (!plain || key === correctKey) return;
      if (unique.some(item => normalizeChoiceText(item) === key)) return;
      unique.push(plain);
    });
    return unique.slice(0, 3);
  }

  function buildChoiceOptions(correctText, distractors) {
    const keys = ["A", "B", "C", "D"];
    const safeDistractors = (distractors || []).slice(0, 3);
    while (safeDistractors.length < 3) {
      safeDistractors.push("未结合题目条件，只凭印象作答。");
    }
    return [correctText].concat(safeDistractors).map((text, index) => ({ key: keys[index], text: stripHtml(text) }));
  }

  function buildConceptGeneratedQuestion(subject, unit) {
    const concept = (unit.concepts || []).find(item => firstSentence(item.body));
    if (!concept) return null;
    const statement = firstSentence(concept.body);
    if (!statement) return null;
    return {
      id: "gen-" + unit.id + "-concept",
      type: "truefalse",
      difficulty: Math.max(1, Number(unit.difficulty || 1)),
      stem: "判断正误：" + statement,
      answer: "A",
      explanation: statement + " 这是本单元核心概念。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: stripOrderPrefix(concept.title || unit.name),
      source: "功能扩题·核心概念",
      estimatedMinutes: 2
    };
  }

  function buildMistakeGeneratedQuestion(subject, unit) {
    const mistake = Array.isArray(unit.commonMistakes) && unit.commonMistakes.length
      ? unit.commonMistakes[0]
      : (unit.concepts || []).find(item => item.commonMistake);
    if (!mistake) return null;
    const wrong = mistake.wrong || mistake.commonMistake;
    const correct = mistake.correct || stripHtml(mistake.commonMistake || "审题时需要回到概念定义重新判断");
    if (!wrong) return null;
    return {
      id: "gen-" + unit.id + "-mistake",
      type: "truefalse",
      difficulty: Math.min(5, Math.max(1, Number(unit.difficulty || 1) + 1)),
      stem: "判断正误：" + stripHtml(wrong),
      answer: "B",
      explanation: "错误。正确表述：" + correct,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "高频易错点",
      source: "功能扩题·易错纠偏",
      commonMistake: stripHtml(wrong),
      estimatedMinutes: 2
    };
  }

  function buildFormulaGeneratedQuestion(subject, unit) {
    const formula = Array.isArray(unit.formulas) && unit.formulas.length ? unit.formulas[0] : null;
    if (!formula || !formula.expression) return null;
    return {
      id: "gen-" + unit.id + "-formula",
      type: "truefalse",
      difficulty: Math.min(5, Math.max(1, Number(unit.difficulty || 1) + 1)),
      stem: "判断正误：在“" + unit.name + "”中，公式“" + formula.expression + "”可用于“" + stripHtml(formula.description || "本单元计算") + "”。",
      answer: "A",
      explanation: "正确。这是本单元的核心公式之一：" + formula.expression,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: stripHtml(formula.description || "核心公式"),
      source: "功能扩题·公式应用",
      estimatedMinutes: 2
    };
  }

  function buildFormulaChoiceQuestion(subject, unit) {
    const formula = Array.isArray(unit.formulas) && unit.formulas.length ? unit.formulas[0] : null;
    if (!formula || !formula.expression) return null;
    const correctText = formula.expression + "（结合题目条件代入）";
    const stem = "在“" + unit.name + "”中，遇到“" + stripHtml(formula.description || "相关计算") + "”类问题，最合适的关键公式或方法是？";
    const distractors = buildContextualDistractors(subject, unit, null, correctText, {
      type: "formula",
      referenceText: stripHtml(formula.description || formula.expression),
      stem: stem
    });
    return {
      id: "gen-" + unit.id + "-formula-choice",
      type: "single",
      difficulty: Math.min(5, Math.max(1, Number(unit.difficulty || 1) + 1)),
      stem: stem,
      options: buildChoiceOptions(correctText, distractors),
      answer: "A",
      explanation: "应优先定位适用关系式“" + formula.expression + "”，再结合条件代入求解。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: stripHtml(formula.description || "公式选择"),
      source: "功能扩题·公式选择",
      estimatedMinutes: 3
    };
  }

  function buildMethodChoiceQuestion(subject, unit) {
    const concept = (unit.concepts || []).find(item => item.title && (item.mnemonic || item.highlightText || item.body));
    if (!concept) return null;
    const title = stripOrderPrefix(concept.title || unit.name);
    const methodText = stripHtml(concept.mnemonic || concept.highlightText || firstSentence(concept.body));
    if (!methodText) return null;
    const stem = "复习“" + title + "”时，下列哪一项最适合作为快速解题抓手？";
    const distractors = buildContextualDistractors(subject, unit, concept, methodText, {
      type: "method",
      referenceText: title,
      stem: stem
    });
    return {
      id: "gen-" + unit.id + "-method",
      type: "single",
      difficulty: Math.max(1, Number(unit.difficulty || 1)),
      stem: stem,
      options: buildChoiceOptions(methodText, distractors),
      answer: "A",
      explanation: "本单元更有效的抓手是：" + methodText,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: title,
      source: "功能扩题·方法模板",
      estimatedMinutes: 3
    };
  }

  function buildKnowledgeSummaryChoiceQuestion(subject, unit) {
    const concept = (unit.concepts || []).find(item => item.title && item.body);
    if (!concept) return null;
    const title = stripOrderPrefix(concept.title || unit.name);
    const summary = firstSentence(concept.body);
    if (!summary) return null;
    const stem = "围绕“" + title + "”，下列哪一项最符合本单元的核心结论？";
    const distractors = buildContextualDistractors(subject, unit, concept, summary, {
      type: "summary",
      referenceText: title,
      stem: stem
    });
    return {
      id: "gen-" + unit.id + "-summary-choice",
      type: "single",
      difficulty: Math.max(1, Number(unit.difficulty || 1)),
      stem: stem,
      options: buildChoiceOptions(summary, distractors),
      answer: "A",
      explanation: "复习时要先抓住核心定义或规律，再结合题目条件判断。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: title,
      source: "功能扩题·核心概括",
      estimatedMinutes: 3,
      shanxiFrequency: Math.min(5, Number(unit.priority || 3) + 1)
    };
  }

  function buildCorrectionChoiceQuestion(subject, unit) {
    const mistake = Array.isArray(unit.commonMistakes) && unit.commonMistakes.length
      ? unit.commonMistakes[0]
      : (unit.concepts || []).find(item => item.commonMistake);
    if (!mistake) return null;
    const wrong = stripHtml(mistake.wrong || mistake.commonMistake);
    const correct = stripHtml(mistake.correct || "先回到概念和条件再判断");
    if (!wrong || !correct) return null;
    const stem = "针对“" + wrong + "”这一高频误区，下列纠正最准确的是？";
    const distractors = buildContextualDistractors(subject, unit, null, correct, {
      type: "correction",
      referenceText: wrong,
      stem: stem,
      extraWrongTexts: [
        "只把“" + wrong + "”换个说法重复一遍，没有给出真正正确的纠正口径。"
      ]
    });
    return {
      id: "gen-" + unit.id + "-correction-choice",
      type: "single",
      difficulty: Math.min(5, Math.max(1, Number(unit.difficulty || 1) + 1)),
      stem: stem,
      options: buildChoiceOptions(correct, distractors),
      answer: "A",
      explanation: "高频误区要连同错误原因和正确口径一起记，才能稳定拿分。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "易错纠偏",
      source: "功能扩题·纠偏选择",
      commonMistake: wrong,
      estimatedMinutes: 3,
      shanxiFrequency: Math.min(5, Number(unit.priority || 3) + 1)
    };
  }

  function buildExamStepChoiceQuestion(subject, unit) {
    const formula = Array.isArray(unit.formulas) && unit.formulas.length ? unit.formulas[0] : null;
    const concept = (unit.concepts || []).find(item => item.title && (item.mnemonic || item.highlightText || item.body));
    const title = stripOrderPrefix((concept && concept.title) || unit.name);
    const step = formula && formula.expression
      ? "先定位“" + stripHtml(formula.description || formula.expression) + "”对应的关系式，再代入条件"
      : stripHtml((concept && (concept.mnemonic || concept.highlightText)) || firstSentence((concept && concept.body) || "先回到概念定义"));
    if (!step) return null;
    const stem = "山西中考中，处理“" + title + "”相关题目时，最稳妥的第一步是？";
    const distractors = buildContextualDistractors(subject, unit, concept, step, {
      type: "exam-step",
      referenceText: title,
      stem: stem
    });
    return {
      id: "gen-" + unit.id + "-exam-step",
      type: "single",
      difficulty: Math.max(1, Number(unit.difficulty || 1)),
      stem: stem,
      options: buildChoiceOptions(step, distractors),
      answer: "A",
      explanation: "稳分的关键是先抓定义、关系式或解题入口，再做运算或组织表达。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: title,
      source: "山西高频训练",
      estimatedMinutes: 3,
      shanxiFrequency: 5
    };
  }

  function buildCalculationVariantQuestion(subject, unit) {
    const calculationMap = {
      "phys-sound": {
        stem: "山西真题改编：某同学在山谷前大喊一声，0.6s 后听到回声。已知空气中声速按 340m/s 计算，则山谷到人的距离约为？",
        options: ["51m", "102m", "170m", "204m"],
        answer: "B",
        explanation: "回声测距用 s=vt/2，代入得 s=340×0.6÷2=102m。",
        subKnowledgePoint: "回声测距"
      },
      "phys-mechanics": {
        stem: "山西真题改编：一个物体所受重力为196N，取 g=9.8N/kg，则它的质量约为？",
        options: ["10kg", "20kg", "98kg", "196kg"],
        answer: "B",
        explanation: "由 G=mg 得 m=196÷9.8=20kg。",
        subKnowledgePoint: "重力公式"
      },
      "phys-pressure": {
        stem: "山西真题改编：一位同学站立时对地面的压力为600N，双脚与地面总接触面积约为0.03m²，则他对地面的压强约为？",
        options: ["200Pa", "2000Pa", "20000Pa", "200000Pa"],
        answer: "C",
        explanation: "压强 p=F/S=600÷0.03=20000Pa。",
        subKnowledgePoint: "压强公式"
      },
      "phys-work": {
        stem: "山西真题改编：某机械在30s内做功1800J，则它的功率为？",
        options: ["30W", "60W", "600W", "1800W"],
        answer: "B",
        explanation: "功率 P=W/t=1800÷30=60W。",
        subKnowledgePoint: "功率公式"
      },
      "phys-electric": {
        stem: "山西真题改编：某导体两端电压为6V，电阻为3Ω，则通过导体的电流为？",
        options: ["0.5A", "1A", "2A", "3A"],
        answer: "C",
        explanation: "由欧姆定律 I=U/R=6÷3=2A。",
        subKnowledgePoint: "欧姆定律"
      },
      "chem-acidbase": {
        stem: "山西真题改编：100g 食盐水中含食盐20g，则该食盐水的溶质质量分数为？",
        options: ["5%", "10%", "20%", "80%"],
        answer: "C",
        explanation: "溶质质量分数=20÷100×100%=20%。",
        subKnowledgePoint: "溶质质量分数"
      },
      "math-equation": {
        stem: "山西真题改编：方程 x²-7x+10=0 的解是？",
        options: ["x=2 或 x=5", "x=3 或 x=4", "x=-2 或 x=-5", "x=1 或 x=10"],
        answer: "A",
        explanation: "因式分解得 (x-2)(x-5)=0，所以 x=2 或 5。",
        subKnowledgePoint: "一元二次方程求解"
      },
      "math-function1": {
        stem: "山西真题改编：一次函数图像经过点(1,3)和(3,7)，则其斜率 k 为？",
        options: ["1", "2", "3", "4"],
        answer: "B",
        explanation: "k=(7-3)/(3-1)=2。",
        subKnowledgePoint: "一次函数斜率"
      },
      "math-function2": {
        stem: "山西真题改编：抛物线 y=x²-6x+5 的顶点坐标是？",
        options: ["(3,-4)", "(-3,-4)", "(3,4)", "(6,5)"],
        answer: "A",
        explanation: "配方得 y=(x-3)²-4，顶点为(3,-4)。",
        subKnowledgePoint: "二次函数顶点"
      },
      "math-triangle": {
        stem: "山西真题改编：在直角三角形中，两条直角边长分别为6和8，则斜边长为？",
        options: ["7", "9", "10", "12"],
        answer: "C",
        explanation: "由勾股定理 c²=6²+8²=100，得 c=10。",
        subKnowledgePoint: "勾股定理"
      },
      "math-stats": {
        stem: "山西真题改编：一组数据 2，4，4，7，9 的中位数为？",
        options: ["4", "5", "6", "7"],
        answer: "A",
        explanation: "按大小规律排列后，中间数是4。",
        subKnowledgePoint: "中位数"
      }
    };
    const config = calculationMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-calculation-variant",
      type: "single",
      difficulty: Math.min(5, Math.max(2, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 4,
      shanxiFrequency: 5
    };
  }

  function buildShanxiRealChoiceQuestion(subject, unit) {
    const concept = (unit.concepts || []).find(item => item.title && item.body);
    if (!concept) return null;
    const right = firstSentence(concept.body);
    if (!right) return null;
    const stem = "山西真题改编：围绕“" + stripOrderPrefix(concept.title || unit.name) + "”，下列说法正确的是？";
    const distractors = buildContextualDistractors(subject, unit, concept, right, {
      type: "shanxi-real",
      referenceText: stripOrderPrefix(concept.title || unit.name),
      stem: stem
    });
    return {
      id: "gen-" + unit.id + "-shanxi-real",
      type: "single",
      difficulty: Math.max(1, Number(unit.difficulty || 1)),
      stem: stem,
      options: buildChoiceOptions(right, distractors),
      answer: "A",
      explanation: "本题考查该单元的核心概念，正确表述应回到定义和适用条件。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: stripOrderPrefix(concept.title || unit.name),
      source: "山西真题改编",
      estimatedMinutes: 3,
      shanxiFrequency: 5
    };
  }

  function buildShanxiMockChoiceQuestion(subject, unit) {
    const concept = (unit.concepts || []).find(item => item.title && (item.mnemonic || item.highlightText || item.body));
    if (!concept) return null;
    const strategy = stripHtml(concept.mnemonic || concept.highlightText || firstSentence(concept.body));
    if (!strategy) return null;
    const stem = "山西模拟原创：复习“" + stripOrderPrefix(concept.title || unit.name) + "”时，哪一项更可能帮助你稳住得分？";
    const distractors = buildContextualDistractors(subject, unit, concept, strategy, {
      type: "shanxi-mock",
      referenceText: stripOrderPrefix(concept.title || unit.name),
      stem: stem
    });
    return {
      id: "gen-" + unit.id + "-shanxi-mock",
      type: "single",
      difficulty: Math.min(5, Math.max(1, Number(unit.difficulty || 1) + 1)),
      stem: stem,
      options: buildChoiceOptions(strategy, distractors),
      answer: "A",
      explanation: "山西中考更看重基础概念和条件匹配，稳分策略是先抓住本单元的关键方法。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: stripOrderPrefix(concept.title || unit.name),
      source: "山西模拟原创",
      estimatedMinutes: 3,
      shanxiFrequency: 4
    };
  }

  function buildChainCalculationQuestion(subject, unit) {
    const chainMap = {
      "phys-sound": {
        stem: "山西真题改编：在一次山谷测距活动中，同学先根据 0.8s 的回声时间求出障碍物距离，再准备以 4m/s 的速度向前走到该障碍物处，大约还需要多长时间？",
        options: ["17s", "34s", "68s", "136s"],
        answer: "B",
        explanation: "先用 s=vt/2 求距离：340×0.8÷2=136m；再求时间 t=s/v=136÷4=34s。",
        subKnowledgePoint: "回声测距与速度综合"
      },
      "phys-pressure": {
        stem: "山西真题改编：某箱子重 480N，放在面积 0.04m² 的地面上。若两名同学又在箱子上额外放了 320N 的物体，则箱子对地面的压强变为多少？",
        options: ["8000Pa", "12000Pa", "16000Pa", "20000Pa"],
        answer: "D",
        explanation: "总压力为 480+320=800N，压强 p=F/S=800÷0.04=20000Pa。",
        subKnowledgePoint: "压强综合计算"
      },
      "phys-work": {
        stem: "山西真题改编：某装置先在 20s 内做功 1200J，随后又以相同功率工作 30s，则该装置两次共做功多少？",
        options: ["1800J", "2400J", "3000J", "3600J"],
        answer: "C",
        explanation: "先求功率 P=1200÷20=60W，再求后半段做功 W=Pt=60×30=1800J，总功 1200+1800=3000J。",
        subKnowledgePoint: "功与功率综合"
      },
      "phys-electric": {
        stem: "山西真题改编：某电阻接在 12V 电源两端时电流为 3A。若保持电阻不变并通电 20s，则这段时间内电流做功为多少？",
        options: ["60J", "120J", "240J", "720J"],
        answer: "D",
        explanation: "先由 W=UIt 直接算，12×3×20=720J；也可先求功率 P=UI=36W，再乘时间。",
        subKnowledgePoint: "欧姆定律与电功综合"
      },
      "chem-acidbase": {
        stem: "山西真题改编：有 50g 质量分数为 20% 的食盐水，若再加入 50g 水稀释，则所得溶液的溶质质量分数为多少？",
        options: ["5%", "10%", "15%", "20%"],
        answer: "B",
        explanation: "原有溶质质量 50×20%=10g，稀释后总质量 100g，所以质量分数为 10%。",
        subKnowledgePoint: "溶液稀释计算"
      },
      "math-function1": {
        stem: "山西真题改编：一次函数图像经过点(1,2)和(3,6)。若先求出该函数解析式，再求当 x=5 时的函数值，则结果为？",
        options: ["8", "10", "12", "14"],
        answer: "B",
        explanation: "斜率 k=(6-2)/(3-1)=2，代入点(1,2)得 b=0，所以 y=2x；当 x=5 时，y=10。",
        subKnowledgePoint: "一次函数综合应用"
      },
      "math-function2": {
        stem: "山西真题改编：抛物线 y=x²-4x+3 先通过配方求顶点，再判断最小值，则该函数的最小值为？",
        options: ["-1", "0", "1", "3"],
        answer: "A",
        explanation: "配方得 y=(x-2)²-1，所以顶点为(2,-1)，最小值是 -1。",
        subKnowledgePoint: "二次函数最值"
      },
      "math-triangle": {
        stem: "山西真题改编：某直角三角形两条直角边长分别为 5 和 12。若先求斜边，再求三角形周长，则周长为？",
        options: ["17", "25", "30", "42"],
        answer: "C",
        explanation: "勾股定理得斜边 13，周长为 5+12+13=30。",
        subKnowledgePoint: "勾股定理综合"
      },
      "math-stats": {
        stem: "山西真题改编：一组数据 3，4，4，5，9 的平均数为多少？若再根据排序结果求中位数，这两个量的和为多少？",
        options: ["8", "9", "10", "11"],
        answer: "B",
        explanation: "平均数 (3+4+4+5+9)/5=5，中位数为 4，两者之和为 9。",
        subKnowledgePoint: "平均数与中位数综合"
      }
    };
    const config = chainMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-chain-calculation",
      type: "single",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 2)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 5,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildMaterialQuestion(subject, unit) {
    const concept = (unit.concepts || []).find(item => item.title && item.body);
    if (!concept) return null;
    const summary = firstSentence(concept.body);
    const title = stripOrderPrefix(concept.title || unit.name);
    if (!summary) return null;
    if (["chinese", "history", "daofa", "english"].indexOf(subject.id) === -1) return null;

    const templates = {
      chinese: {
        stem: "材料：某同学整理“" + title + "”复习卡片时，摘录了这句话：“" + summary + "”。\n问题：请结合材料，概括这条复习信息的核心作用，并写出一条答题提醒。",
        refAnswer: "核心作用是帮助快速定位该知识点的主旨或答题方向；答题提醒是先回到原文关键句，再结合情感、手法或结构组织答案。",
        rubric: ["能概括材料对应的核心知识作用", "能写出与语文答题相关的提醒", "表达完整，逻辑清楚"],
        subKnowledgePoint: title
      },
      english: {
        stem: "材料：某同学复习英语专题“" + title + "”时，笔记写道：“" + summary + "”。\n问题：请根据材料，用中文写出两条稳住山西中考英语得分的复习建议。",
        refAnswer: "建议一：先抓住该知识点的固定表达或解题方法；建议二：做题时回到语境判断，而不是只凭单个词。",
        rubric: ["建议与材料内容有关", "至少写出两条复习建议", "能体现山西中考稳分思路"],
        subKnowledgePoint: title
      },
      history: {
        stem: "材料一：" + summary + "。\n材料二：某同学认为这类历史材料题只要背结论即可。\n问题：请结合材料，指出这种看法的问题，并概括作答历史材料题时应先抓住什么。",
        refAnswer: "问题在于只背结论容易脱离材料和时空背景；作答时应先抓住材料反映的历史事件、背景和核心观点，再组织答案。",
        rubric: ["能指出“只背结论”的问题", "能写出历史材料题的抓手，如背景、事件、观点", "表述完整"],
        subKnowledgePoint: title
      },
      daofa: {
        stem: "材料：围绕“" + title + "”，整理卡片写道：“" + summary + "”。\n问题：如果这是山西中考道法材料题的背景信息，你认为答题时至少要从哪两个角度展开？",
        refAnswer: "可从教材观点和现实做法两个角度展开：先点明对应教材原理，再联系个人、社会或国家层面的具体做法。",
        rubric: ["至少写出两个展开角度", "包含教材观点角度", "包含现实做法或责任担当角度"],
        subKnowledgePoint: title
      }
    };

    const config = templates[subject.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-material",
      type: subject.id === "english" ? "material" : "short",
      difficulty: Math.min(5, Math.max(2, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "这是一道材料型主观题，作答时要先回到材料关键信息，再结合学科规范组织表达。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西模拟原创",
      estimatedMinutes: 6,
      shanxiFrequency: 4,
      score: 6,
      commonMistake: "只抄材料原句，没有提炼观点和作答角度"
    };
  }

  function buildSparseUnitBoosterQuestion(subject, unit) {
    const sparseMap = {
      "chem-formula": {
        type: "single",
        stem: "山西高频：已知 OH 的化合价为 -1，Ca 的化合价为 +2，则氢氧化钙的化学式应写为？",
        options: ["CaOH", "Ca(OH)2", "Ca2OH", "CaHO2"],
        answer: "B",
        explanation: "根据化合物中正负化合价代数和为 0，Ca 为 +2，需要两个 OH- 来配平，所以是 Ca(OH)2。",
        subKnowledgePoint: "化合价与化学式书写"
      },
      "math-quad": {
        type: "single",
        stem: "山西真题改编：若一个四边形的两组对边分别平行，则这个四边形一定是？",
        options: ["矩形", "菱形", "平行四边形", "正方形"],
        answer: "C",
        explanation: "两组对边分别平行是平行四边形的判定条件，不能直接判定成矩形、菱形或正方形。",
        subKnowledgePoint: "平行四边形判定"
      },
      "math-circle": {
        type: "single",
        stem: "山西真题改编：在同圆中，若一条圆周角所对的弧与另一条圆周角所对的弧相同，则这两条圆周角的大小关系是？",
        options: ["互余", "相等", "互补", "无法确定"],
        answer: "B",
        explanation: "同弧或等弧所对的圆周角相等，这是圆周角定理的直接应用。",
        subKnowledgePoint: "圆周角定理"
      },
      "math-transform": {
        type: "single",
        stem: "山西高频：一个图形经过平移后，下列哪项一定保持不变？",
        options: ["方向和距离关系", "面积和形状大小", "对应点位置完全不变", "旋转角度变为 180°"],
        answer: "B",
        explanation: "平移不改变图形的形状和大小；位置会变化，但对应点连线平行且相等。",
        subKnowledgePoint: "平移性质"
      }
    };
    const config = sparseMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-sparse-booster",
      type: config.type,
      difficulty: Math.max(1, Number(unit.difficulty || 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西高频训练",
      estimatedMinutes: 3,
      shanxiFrequency: 5
    };
  }

  function buildShanxiRealOpenQuestion(subject, unit) {
    if (["chinese", "history", "daofa", "english"].indexOf(subject.id) === -1) return null;
    const concept = (unit.concepts || []).find(item => item.title && item.body);
    if (!concept) return null;
    const title = stripOrderPrefix(concept.title || unit.name);
    const summary = firstSentence(concept.body);
    if (!summary) return null;

    const templates = {
      chinese: {
        stem: "山西真题改编：围绕“" + title + "”，资料中提到：“" + summary + "”。请概括这条信息在阅读或积累题中的作用，并写出一条作答提醒。",
        refAnswer: "作用是帮助迅速定位知识点的核心含义或答题方向；作答提醒是先回到原句和语境，再结合手法、情感或结构组织答案。",
        rubric: ["能概括材料信息的作用", "能写出一条具体作答提醒", "表达完整清楚"]
      },
      history: {
        stem: "山西真题改编：材料显示“" + summary + "”。请结合所学，说明历史材料题为什么不能只背结论，并指出答题时应先抓住的一个关键点。",
        refAnswer: "因为历史题要结合材料背景、事件和观点，只背结论容易脱离情境；答题时应先抓住材料反映的历史背景或核心事件。",
        rubric: ["说明不能只背结论的原因", "写出一个关键抓手，如背景、事件、观点", "表述完整"]
      },
      daofa: {
        stem: "山西真题改编：学习“" + title + "”时，材料强调：“" + summary + "”。如果这是道法题背景，你认为答题应从哪两个层面展开？",
        refAnswer: "应从教材原理和现实做法两个层面展开：先点明对应观点，再联系个人、社会或国家层面的行动。",
        rubric: ["至少写出两个层面", "包含教材观点层面", "包含现实做法层面"]
      },
      english: {
        stem: "山西真题改编：材料显示，英语专题“" + title + "”可概括为：“" + summary + "”。请用中文写出两条做山西中考英语相关题时的稳分建议。",
        refAnswer: "建议一：先抓住该知识点的固定表达或判断依据；建议二：回到完整语境分析，不只看单个词。",
        rubric: ["写出两条建议", "建议与该知识点有关", "体现语境判断意识"]
      }
    };

    const config = templates[subject.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-shanxi-real-open",
      type: subject.id === "english" ? "material" : "short",
      difficulty: Math.min(5, Math.max(2, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "这类山西真题改编题需要先读懂题干中的关键信息，再按照学科规范组织答案。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: title,
      source: "山西真题改编",
      estimatedMinutes: 5,
      shanxiFrequency: 5,
      score: 6,
      commonMistake: "只复述题干，没有提炼观点或答题角度"
    };
  }

  function buildExperimentChoiceQuestion(subject, unit) {
    const experimentMap = {
      "phys-light": {
        stem: "实验探究：在“探究光的反射规律”实验中，若发现反射光线、入射光线和法线不在同一平面内，最先应检查的操作是？",
        options: ["是否把纸板前后折转了", "是否记下了光源颜色", "是否把量角器换成刻度尺", "是否让入射角一直保持 0°"],
        answer: "A",
        explanation: "反射定律实验需要保证反射光线、入射光线和法线在同一平面内，折转纸板会导致观察不到共面现象。",
        subKnowledgePoint: "光的反射实验"
      },
      "phys-electric": {
        stem: "实验探究：某同学连接“探究电流与电压关系”电路时，闭合开关前滑动变阻器应先调到什么位置更合适？",
        options: ["阻值最大处", "阻值最小处", "中间任意位置", "先不接入变阻器"],
        answer: "A",
        explanation: "闭合开关前应先把滑动变阻器调到阻值最大处，起到保护电路和用电器的作用。",
        subKnowledgePoint: "电学实验操作"
      },
      "phys-pressure": {
        stem: "实验探究：比较液体内部压强大小规律时，为了保证结论可靠，最需要控制的是？",
        options: ["橡皮膜朝向和液体种类等条件", "玻璃管颜色", "容器高低是否一样", "记录纸张大小"],
        answer: "A",
        explanation: "液体压强与液体密度、深度和方向有关，实验中必须控制无关变量，才能比较单一因素。",
        subKnowledgePoint: "液体压强实验"
      },
      "chem-air": {
        stem: "实验探究：实验室用过氧化氢和二氧化锰制取氧气时，若想证明二氧化锰起催化作用，关键要比较的是？",
        options: ["反应前后二氧化锰的质量和化学性质是否改变", "试管是否更长", "导管是否更细", "水槽中的水是否更多"],
        answer: "A",
        explanation: "催化剂在反应前后质量和化学性质不变，但能改变反应速率。",
        subKnowledgePoint: "制氧气实验"
      },
      "chem-water": {
        stem: "实验探究：过滤操作中，若滤液仍然浑浊，最可能的原因是？",
        options: ["滤纸破损或液面高于滤纸边缘", "玻璃棒紧贴漏斗内壁", "漏斗下端紧靠烧杯内壁", "先进行了沉淀操作"],
        answer: "A",
        explanation: "滤纸破损或液面超过滤纸边缘，都会导致杂质进入滤液，使滤液仍浑浊。",
        subKnowledgePoint: "过滤实验"
      },
      "chem-carbon": {
        stem: "实验探究：检验二氧化碳时，将气体通入澄清石灰水后观察到变浑浊，这一现象直接说明？",
        options: ["气体中含有 CO2", "气体一定可燃", "石灰水中的水分蒸发了", "气体一定含有氧气"],
        answer: "A",
        explanation: "CO2 与澄清石灰水反应生成白色沉淀，使石灰水变浑浊，这是 CO2 的特征检验现象。",
        subKnowledgePoint: "CO2 检验实验"
      }
    };
    const config = experimentMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-experiment-choice",
      type: "single",
      difficulty: Math.min(5, Math.max(2, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 4,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildImageInterpretationQuestion(subject, unit) {
    const imageMap = {
      "math-function1": {
        stem: "图像题：某一次函数图像经过点(0,1)和(2,5)。根据图像变化趋势判断，该函数的解析式应为？",
        options: ["y=2x+1", "y=-2x+1", "y=x+2", "y=2x-1"],
        answer: "A",
        explanation: "斜率 k=(5-1)/(2-0)=2，且截距为 1，所以解析式是 y=2x+1。",
        subKnowledgePoint: "一次函数图像判断"
      },
      "math-function2": {
        stem: "图像题：某抛物线开口向上，对称轴为 x=1，且顶点最低点纵坐标为 -3。则它的顶点坐标应为？",
        options: ["(1,-3)", "(-1,-3)", "(1,3)", "(3,1)"],
        answer: "A",
        explanation: "二次函数顶点由对称轴和最值点直接确定，所以顶点是 (1,-3)。",
        subKnowledgePoint: "二次函数顶点识图"
      },
      "math-stats": {
        stem: "图表题：某班 5 次测验成绩折线图显示分数依次为 78、80、82、81、84。根据图像判断，下列说法最准确的是？",
        options: ["整体呈波动上升趋势", "成绩持续下降", "中位数一定是 80", "众数一定是 84"],
        answer: "A",
        explanation: "从折线图看成绩有小幅波动，但整体趋势上升。中位数和众数需结合具体排序与重复情况判断。",
        subKnowledgePoint: "统计图表分析"
      },
      "phys-electric": {
        stem: "图像题：某电阻的 U-I 图像是一条过原点的直线，图上点(2A, 6V)在直线上。根据图像可知该电阻大小为？",
        options: ["2Ω", "3Ω", "4Ω", "8Ω"],
        answer: "B",
        explanation: "由图像读数可得 R=U/I=6/2=3Ω。",
        subKnowledgePoint: "电学图像分析"
      },
      "phys-heat": {
        stem: "图像题：某晶体加热时温度随时间变化图像中，熔化阶段对应的现象应是？",
        options: ["持续吸热但温度保持不变", "不吸热且温度升高", "持续放热且温度不变", "温度快速下降"],
        answer: "A",
        explanation: "晶体熔化时达到熔点后继续吸热，但温度保持不变。",
        subKnowledgePoint: "物态变化图像"
      }
    };
    const config = imageMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-image-question",
      type: "single",
      difficulty: Math.min(5, Math.max(2, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 4,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildMultiMaterialOpenQuestion(subject, unit) {
    if (["chinese", "history", "daofa", "english"].indexOf(subject.id) === -1) return null;
    const concepts = (unit.concepts || []).filter(item => item.title && item.body);
    if (concepts.length < 2) return null;
    const first = concepts[0];
    const second = concepts[1];
    const firstSummary = firstSentence(first.body);
    const secondSummary = firstSentence(second.body);
    if (!firstSummary || !secondSummary) return null;
    const title = stripOrderPrefix(unit.name);
    const templates = {
      chinese: {
        stem: "材料一：" + firstSummary + "。\n材料二：" + secondSummary + "。\n问题：结合两则材料，概括这类语文题的共同答题抓手，并写出一个容易失分的点。",
        refAnswer: "共同抓手是先回到关键句和题干要求，再从内容、手法、结构或情感角度组织答案；容易失分的点是只抄材料，不概括作用或主旨。",
        rubric: ["能概括共同答题抓手", "能写出具体失分点", "表达完整清楚"]
      },
      history: {
        stem: "材料一：" + firstSummary + "。\n材料二：" + secondSummary + "。\n问题：结合两则材料，说明历史材料题作答时为什么要先建立时空背景，再归纳观点。",
        refAnswer: "因为不同历史事件所处时代背景不同，先建立时空背景才能准确理解材料含义，再归纳核心观点，避免张冠李戴。",
        rubric: ["能说明时空背景的重要性", "能提到归纳观点的必要性", "论述完整"]
      },
      daofa: {
        stem: "材料一：" + firstSummary + "。\n材料二：" + secondSummary + "。\n问题：若这是同一道道法材料题的两则背景，请从“教材观点”和“现实行动”两个维度组织答案。",
        refAnswer: "先提炼两则材料对应的教材观点，再从个人、集体、社会或国家层面提出现实行动建议。",
        rubric: ["包含教材观点维度", "包含现实行动维度", "能结合两则材料"]
      },
      english: {
        stem: "材料一：" + firstSummary + "。\n材料二：" + secondSummary + "。\n问题：根据两则材料，用中文写出两条做相关英语题时的综合稳分建议。",
        refAnswer: "建议一：先根据两则材料锁定核心语法点或语篇主题；建议二：回到上下文和逻辑关系判断，而不是只看单个词句。",
        rubric: ["写出两条建议", "能综合两则材料信息", "体现语境和逻辑意识"]
      }
    };
    const config = templates[subject.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-multi-material-open",
      type: subject.id === "english" ? "material" : "short",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "多材料题要先提炼每则材料信息，再建立它们之间的联系，最后按学科规范整合表达。",
      knowledgePoint: title,
      subKnowledgePoint: "多材料整合",
      source: "山西模拟原创",
      estimatedMinutes: 7,
      shanxiFrequency: 5,
      score: 8,
      commonMistake: "逐条复述材料，没有整合出共同观点或答题结构"
    };
  }

  function buildCircuitFaultQuestion(subject, unit) {
    const faultMap = {
      "phys-electric": {
        stem: "电路故障分析：闭合开关后，灯泡不亮，电流表示数为 0，电压表接在灯泡两端却有示数。最可能的故障是？",
        options: ["灯泡断路", "灯泡短路", "滑动变阻器接反", "电源电压过大"],
        answer: "A",
        explanation: "电流表为 0 说明电路中有断路；电压表接在灯泡两端有示数，说明灯泡所在位置断路，最常见是灯泡断路。",
        subKnowledgePoint: "电路故障判断"
      },
      "phys-em": {
        stem: "电路故障分析：某电磁铁实验中闭合开关后铁钉吸引大头针数量明显减少，最可能的调节方向是？",
        options: ["增大电流或增加线圈匝数", "把铁芯取出", "把导线换得更长且更细", "减少电源数量并缩短通电时间"],
        answer: "A",
        explanation: "电磁铁磁性强弱与电流大小和线圈匝数有关，要增强磁性应增大电流或增加线圈匝数。",
        subKnowledgePoint: "电磁铁故障与调节"
      }
    };
    const config = faultMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-circuit-fault",
      type: "single",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 5,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildMathComprehensiveQuestion(subject, unit) {
    const map = {
      "math-circle": {
        stem: "综合题：已知 AB 是圆 O 的直径，点 C 在圆上，若 ∠A=35°，则 ∠ACB 的大小为？",
        options: ["35°", "45°", "55°", "90°"],
        answer: "D",
        explanation: "直径所对的圆周角是直角，所以 ∠ACB=90°。",
        subKnowledgePoint: "圆周角综合"
      },
      "math-quad": {
        stem: "综合题：在平行四边形 ABCD 中，对角线 AC 与 BD 交于点 O。若 AC=12，则 AO 的长为？",
        options: ["3", "6", "9", "12"],
        answer: "B",
        explanation: "平行四边形对角线互相平分，所以 AO=AC/2=6。",
        subKnowledgePoint: "平行四边形性质综合"
      },
      "math-transform": {
        stem: "综合题：将点 A(2,3) 关于原点作中心对称变换后得到点 A'，则 A' 的坐标是？",
        options: ["(2,-3)", "(-2,3)", "(-2,-3)", "(3,2)"],
        answer: "C",
        explanation: "关于原点中心对称，相当于横纵坐标都变为相反数，所以得到 (-2,-3)。",
        subKnowledgePoint: "中心对称坐标变换"
      },
      "math-function2": {
        stem: "综合题：二次函数 y=x²-2x-3 与 x 轴交于 A、B 两点。则 AB 的长为？",
        options: ["3", "4", "5", "6"],
        answer: "B",
        explanation: "令 y=0，得 x²-2x-3=0，解得 x=3 或 x=-1，所以两点间距离为 4。",
        subKnowledgePoint: "二次函数与坐标轴综合"
      }
    };
    const config = map[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-math-comprehensive",
      type: "single",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 5,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildWritingTaskQuestion(subject, unit) {
    const writingMap = {
      "cn-writing": {
        subjectName: "语文",
        stem: "作文任务：围绕“成长中的一次变化”写一段开头，要求点题并设置情感基调，再写出中间段准备详写的一个具体细节。",
        refAnswer: "可先用环境或回忆式开头点题，再用一个动作、语言或神态细节承接中间详写内容，形成真实可感的叙述。",
        rubric: ["开头能点题", "有明确情感基调", "给出一个具体可展开的细节"]
      },
      "en-writing": {
        subjectName: "英语",
        stem: "作文任务：假设你要写一篇关于“如何提升学习效率”的英语短文，请先用中文列出开头句思路，并给出两个中间段要点。",
        refAnswer: "开头可先点题，如说明学习效率的重要性；中间段可从制定计划和减少干扰两个方面展开。",
        rubric: ["包含开头思路", "至少两个中间段要点", "内容符合英语写作任务逻辑"]
      }
    };
    const config = writingMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-writing-task",
      type: "essay",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "写作任务题重点看结构意识、任务完成度和表达组织能力。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "写作任务",
      source: unit.id === "cn-writing" ? "山西模拟原创" : "山西真题改编",
      estimatedMinutes: 8,
      shanxiFrequency: 5,
      score: 10,
      commonMistake: "只写泛泛观点，没有形成清晰结构或任务要点"
    };
  }

  function buildReadingToWritingQuestion(subject, unit) {
    const map = {
      "cn-reading": {
        type: "essay",
        stem: "作文任务：读完一篇写人记事类文章后，请先用中文写出一个中心句，再列出两个可展开的细节描写方向。",
        refAnswer: "中心句要紧扣人物品质或事件带来的感受；细节可从动作、语言、神态、环境等角度展开。",
        rubric: ["能写出中心句", "至少给出两个细节方向", "体现读写衔接意识"],
        source: "山西模拟原创",
        subKnowledgePoint: "读写衔接"
      },
      "en-reading": {
        type: "essay",
        stem: "作文任务：根据一篇阅读材料的常见结构，请用中文写出英文短文的主题句、两个 supporting points 和一句结尾总结。",
        refAnswer: "主题句先概括全文中心；中间两点分别对应文章的两个主要信息；结尾句回扣主题并作简短总结。",
        rubric: ["包含主题句思路", "至少两个 supporting points", "包含结尾总结句思路"],
        source: "山西真题改编",
        subKnowledgePoint: "阅读到写作迁移"
      }
    };
    const config = map[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-reading-to-writing",
      type: config.type,
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "这类题把阅读理解和书面表达串起来，重点看信息提炼和结构迁移能力。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: config.source,
      estimatedMinutes: 8,
      shanxiFrequency: 5,
      score: 10,
      commonMistake: "只复述材料内容，没有转成写作结构"
    };
  }

  function buildEvaluationOpenQuestion(subject, unit) {
    const evaluationMap = {
      "hist-modern": {
        stem: "辨析评价：有同学认为，中国近代史只需要背年份和事件名称，材料分析并不重要。请结合所学评析这一观点。",
        refAnswer: "这一观点不完整。年份和事件是基础，但近代史更重视事件背景、原因、影响和材料分析，只有结合材料和时空背景，才能准确作答。",
        rubric: ["先表明观点不完整或片面", "能指出材料分析的重要性", "能结合历史学习特点展开"]
      },
      "hist-world": {
        stem: "辨析评价：有人认为，世界史只要记住几个大事件名称就足够应付中考。请结合材料题特点进行评析。",
        refAnswer: "这种看法片面。世界史不仅考事件名称，还考背景、影响和不同文明或制度之间的联系，材料题更要求比较和归纳。",
        rubric: ["指出观点片面", "说明世界史材料题的要求", "能提到比较、联系或影响"]
      },
      "df-nation": {
        stem: "辨析评价：有人说，道法题只要背教材原句，现实生活中的做法写不写都一样。请评析这一说法。",
        refAnswer: "这一说法错误。道法题既要有教材观点，也要联系现实行动和责任担当，只有把原理和做法结合起来，答案才完整。",
        rubric: ["明确评价该说法", "写出教材观点与现实做法都重要", "表达完整有逻辑"]
      },
      "df-conditions": {
        stem: "辨析评价：有同学认为，时事政治题只看热点新闻，不需要联系教材知识。请结合道法答题要求进行评析。",
        refAnswer: "这种看法不准确。时事题要以热点为材料，但最终仍要回到教材观点、价值判断和行动要求来组织答案。",
        rubric: ["指出说法不准确", "说明热点与教材要结合", "体现道法学科答题规范"]
      }
    };
    const config = evaluationMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-evaluation-open",
      type: "short",
      typeCategory: "辨析评价",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "辨析评价题要先判断观点是否准确，再说明理由，最后补出完整口径。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "辨析评价",
      source: "山西真题改编",
      estimatedMinutes: 6,
      shanxiFrequency: 5,
      score: 6,
      commonMistake: "只给结论，不解释原因，也不补完整观点"
    };
  }

  function buildDrawingChoiceQuestion(subject, unit) {
    const drawingMap = {
      "phys-light": {
        stem: "作图题：平面镜成像作图时，确定像点位置最关键的依据是？",
        options: ["像与物到镜面的距离相等", "像一定在镜面上", "像点位置只由观察者决定", "像与物的连线可以任意倾斜"],
        answer: "A",
        explanation: "平面镜成像特点是等大、等距、垂直、虚像，作图时必须保证像与物到镜面的距离相等。",
        subKnowledgePoint: "平面镜成像作图"
      },
      "phys-lever": {
        stem: "作图题：画杠杆动力臂时，正确的作法是从支点向什么作垂线？",
        options: ["动力作用线", "阻力方向终点", "杠杆中点", "支点到杠杆端点连线"],
        answer: "A",
        explanation: "力臂是支点到力作用线的垂直距离，因此要从支点向该力的作用线作垂线。",
        subKnowledgePoint: "杠杆作图"
      }
    };
    const config = drawingMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-drawing-choice",
      type: "single",
      difficulty: Math.min(5, Math.max(2, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 4,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildDynamicCircuitQuestion(subject, unit) {
    if (unit.id !== "phys-electric") return null;
    return {
      id: "gen-" + unit.id + "-dynamic-circuit",
      type: "single",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: "动态电路：在电源电压不变的电路中，滑动变阻器与灯泡串联。当滑片向减小阻值方向移动时，下列判断正确的是？",
      options: [
        "电路总电阻减小，电流增大，灯泡变亮",
        "电路总电阻增大，电流减小，灯泡变亮",
        "电流不变，灯泡亮度不变",
        "总电阻减小，但电流一定减小"
      ].map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: "A",
      explanation: "串联电路中滑动变阻器阻值减小，会使总电阻减小；电源电压不变时，电流增大，所以灯泡亮度增强。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "动态电路分析",
      source: "山西真题改编",
      estimatedMinutes: 5,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildMovingPointQuestion(subject, unit) {
    const movingMap = {
      "math-function1": {
        stem: "动点最值：点 P 在直线 y=2x+1 上运动，当点 P 的横坐标为 3 时，点 P 到 y 轴的距离为？",
        options: ["1", "2", "3", "7"],
        answer: "C",
        explanation: "点到 y 轴的距离等于该点横坐标的绝对值，所以距离为 3。",
        subKnowledgePoint: "函数图像中的动点"
      },
      "math-triangle": {
        stem: "动点最值：在直角三角形中，点 P 从一个顶点沿直角边移动到另一个顶点。下列关于点 P 到该直角边另一直角边距离的说法最合理的是？",
        options: ["会从 0 逐渐变化", "始终不变", "一定先增大后减小且与路径无关", "始终大于斜边长度"],
        answer: "A",
        explanation: "点沿直角边移动时，到另一条直角边的距离会随位置改变而逐渐变化，起点可为 0。",
        subKnowledgePoint: "动点与距离变化"
      },
      "math-function2": {
        stem: "动点最值：抛物线 y=(x-1)^2-4 上有一动点 P，则点 P 的纵坐标最小值为？",
        options: ["-5", "-4", "-3", "0"],
        answer: "B",
        explanation: "顶点式可直接看出抛物线顶点为 (1,-4)，开口向上，因此纵坐标最小值是 -4。",
        subKnowledgePoint: "抛物线最值"
      }
    };
    const config = movingMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-moving-point",
      type: "single",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      options: config.options.map((text, index) => ({ key: ["A", "B", "C", "D"][index], text: text })),
      answer: config.answer,
      explanation: config.explanation,
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: config.subKnowledgePoint,
      source: "山西真题改编",
      estimatedMinutes: 5,
      shanxiFrequency: 5,
      score: 4
    };
  }

  function buildEnglishWritingChainQuestion(subject, unit) {
    if (unit.id !== "en-writing") return null;
    return {
      id: "gen-" + unit.id + "-writing-chain",
      type: "essay",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: "作文任务：假设你要写一篇题为“Healthy Study Habits”的英语短文，请先用中文写出开头主题句、两个中间段分点和一个结尾句思路。",
      refAnswer: "开头可点明健康学习习惯的重要性；中间段可写合理作息和专注学习；结尾句可呼吁坚持好习惯。",
      rubric: ["包含开头主题句思路", "至少两个中间段分点", "包含结尾句思路且结构完整"],
      explanation: "书面表达任务链重点看结构完整度、分点意识和主题连贯性。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "书面表达任务链",
      source: "山西真题改编",
      estimatedMinutes: 10,
      shanxiFrequency: 5,
      score: 10,
      commonMistake: "只堆零散句子，没有形成开头-中间-结尾的任务链"
    };
  }

  function buildReasonMeaningOpenQuestion(subject, unit) {
    const reasonMap = {
      "hist-modern": {
        stem: "材料一：1840 鸦片战争后，中国逐步沦为半殖民地半封建社会。\n材料二：1919 五四运动推动了新民主主义革命的开端。\n问题：结合两则材料，分析近代中国青年运动不断发展的原因，并概括其历史意义。",
        refAnswer: "原因包括民族危机加深、救亡图存需求增强以及新思想传播；意义在于推动民族觉醒、促进革命发展并为中国社会转型积蓄力量。",
        rubric: ["能写出至少两点原因", "能概括历史意义", "表达有因果逻辑"]
      },
      "df-nation": {
        stem: "材料一：国家发展需要青少年增强责任意识。\n材料二：社会生活中也需要公民积极参与公共事务。\n问题：结合两则材料，分析为什么青少年要增强责任担当，并说明这样做的现实意义。",
        refAnswer: "原因在于个人成长离不开责任意识，国家和社会发展也需要青年参与；意义在于有助于个人成长、社会进步和国家建设。",
        rubric: ["能分析原因", "能写出现实意义", "能结合个人与国家两个层面"]
      },
      "df-conditions": {
        stem: "材料一：热点事件不断进入中考道法命题。\n材料二：教材观点仍然是分析现实问题的重要依据。\n问题：结合两则材料，说明为什么时事热点题必须联系教材知识作答，并概括这样做的意义。",
        refAnswer: "原因是热点只是材料载体，真正的分析需要回到教材观点和价值判断；意义在于答案更规范、更有逻辑，也更能体现学科素养。",
        rubric: ["说明联系教材的原因", "概括联系教材的意义", "体现道法学科规范"]
      }
    };
    const config = reasonMap[unit.id];
    if (!config) return null;
    return {
      id: "gen-" + unit.id + "-reason-meaning-open",
      type: "short",
      typeCategory: "原因意义",
      difficulty: Math.min(5, Math.max(3, Number(unit.difficulty || 1) + 1)),
      stem: config.stem,
      refAnswer: config.refAnswer,
      rubric: config.rubric,
      explanation: "原因意义题要先拆解成“为什么会这样”和“这样有什么价值”两部分，再分点作答。",
      knowledgePoint: stripOrderPrefix(unit.name),
      subKnowledgePoint: "原因与意义",
      source: "山西真题改编",
      estimatedMinutes: 7,
      shanxiFrequency: 5,
      score: 8,
      commonMistake: "只写现象，不分开作答原因和意义"
    };
  }

  function buildSourceBackedQuestions(subject, unit) {
    if (subject.id === "physics" && unit.id === "phys-electric") {
      return [
        {
          id: "src-phys-electric-ohm-understanding",
          type: "single",
          typeCategory: "电学综合",
          difficulty: 3,
          stem: "公开题源改编：在温度保持不变时，研究定值电阻中的电流、电压和电阻关系。下列说法正确的是？",
          options: [
            { key: "A", text: "导体两端电压变大时，若电阻不变，电流会随之增大" },
            { key: "B", text: "由 I=U/R 可知，电阻总是随着电压增大而减小" },
            { key: "C", text: "通过导体的电流只由电阻决定，与电压无关" },
            { key: "D", text: "同一导体中的电阻和电流成反比，所以电流变大时电阻一定变小" }
          ],
          answer: "A",
          explanation: "欧姆定律适用于同一导体、温度不变的条件。对定值电阻来说，电阻本身不因电压、电流变化而改变，电压增大时电流随之增大。",
          knowledgePoint: "电学基础（欧姆定律）",
          subKnowledgePoint: "欧姆定律理解",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：21世纪教育资源站“山西省2023年中考备考物理一轮复习 欧姆定律 练习题（含解析）”展示了欧姆定律理解型单选。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "把公式 I=U/R 误解成电阻由电压和电流决定"
        },
        {
          id: "src-phys-electric-measure-resistance",
          type: "single",
          typeCategory: "实验探究",
          difficulty: 4,
          stem: "公开题源改编：用电压表、电流表、滑动变阻器测未知电阻时，闭合开关前最合理的操作是？",
          options: [
            { key: "A", text: "开关断开，并将滑动变阻器滑片移到最大阻值端" },
            { key: "B", text: "开关闭合，并将滑片移到最小阻值端，便于尽快读数" },
            { key: "C", text: "只要电表量程合适，滑片位置和开关状态都无关紧要" },
            { key: "D", text: "先短接待测电阻检查电流表是否有示数" }
          ],
          answer: "A",
          explanation: "伏安法测电阻时，连接电路应先断开开关；闭合前把滑动变阻器调到最大阻值端，可以起到保护电路和仪表的作用。",
          knowledgePoint: "电学基础（欧姆定律）",
          subKnowledgePoint: "伏安法测电阻",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2024年山西省中考物理解析类页面提到“开关需要断开，滑片放到最大阻值一端”。",
          estimatedMinutes: 5,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "忽略实验前保护电路的基本操作"
        },
        {
          id: "src-phys-electric-series-current-experiment",
          type: "short",
          typeCategory: "实验探究",
          difficulty: 3,
          stem: "公开题源改编：某实验小组探究串联电路电流特点。完成实验后，需要写出实验结论并说明记录数据时应注意什么。请简要作答。",
          refAnswer: "实验结论：串联电路中各处电流相等。记录数据时要如实记录测量结果，不能凭感觉编造数据。",
          rubric: ["写出串联电路电流规律", "写出真实记录实验数据的要求"],
          explanation: "山西实验操作复习常把“结论是否准确”和“数据记录是否规范”放在一起考查。",
          knowledgePoint: "电学基础（欧姆定律）",
          subKnowledgePoint: "串联电路实验",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西省2023/2024理化实验操作物理复习题中出现“串联电路中各处电流……”和“要真实记录实验数据”。",
          estimatedMinutes: 5,
          shanxiFrequency: 5,
          score: 6,
          commonMistake: "只写现象，不写规范实验结论和记录要求"
        },
        {
          id: "src-phys-electric-safety-use",
          type: "single",
          typeCategory: "电学综合",
          difficulty: 3,
          stem: "公开题源改编：在家庭电路中，下列做法符合安全用电要求的是？",
          options: [
            { key: "A", text: "更换灯泡时不切断电源，直接操作更省时" },
            { key: "B", text: "电冰箱金属外壳应接地" },
            { key: "C", text: "电路着火时立即泼水降温" },
            { key: "D", text: "用湿抹布擦拭正在工作的台灯" }
          ],
          answer: "B",
          explanation: "金属外壳用电器要接地，防止外壳漏电伤人；其余做法都存在明显触电或短路风险。",
          knowledgePoint: "电学基础（欧姆定律）",
          subKnowledgePoint: "安全用电",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2024年山西省中考物理试题结果页公开片段出现家庭电路安全用电选择题。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把生活经验当成安全规范"
        },
        {
          id: "src-phys-electric-thermistor-alarm",
          type: "single",
          typeCategory: "电学综合",
          difficulty: 5,
          stem: "公开题源改编：某冷库报警电路使用热敏电阻监测温度变化。若温度升高时热敏电阻阻值减小，在控制电路电压不变的情况下，下列判断正确的是？",
          options: [
            { key: "A", text: "控制电路电流减小，电功率减小" },
            { key: "B", text: "控制电路电流增大，电功率增大" },
            { key: "C", text: "热敏电阻阻值变化不会影响控制电路" },
            { key: "D", text: "温度越高，控制电路电流一定为零" }
          ],
          answer: "B",
          explanation: "控制电路电压不变，热敏电阻阻值减小则总电阻减小，电流增大；由 P=UI 可知控制电路功率也增大。",
          knowledgePoint: "电学基础（欧姆定律）",
          subKnowledgePoint: "热敏电阻与控制电路",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2024年山西省中考物理相关结果页公开片段出现冷库热敏电阻报警情境。",
          estimatedMinutes: 6,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "看见热敏电阻就只记‘温度变、阻值变’，不会继续判断电流和功率"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-pressure") {
      return [
        {
          id: "src-phys-pressure-liquid-experiment",
          type: "single",
          typeCategory: "实验探究",
          difficulty: 4,
          stem: "公开题源改编：在探究液体压强特点的实验中，把压强计探头放在同种液体的不同深度。若其他条件不变，随着探头逐渐下移，U 形管两侧液面高度差会怎样变化？",
          options: [
            { key: "A", text: "逐渐增大" },
            { key: "B", text: "逐渐减小" },
            { key: "C", text: "始终不变" },
            { key: "D", text: "先增大后减小" }
          ],
          answer: "A",
          explanation: "同种液体中，液体压强随深度增加而增大。压强计两侧液面高度差越大，说明橡皮膜受到的压强越大。",
          knowledgePoint: "压强与浮力",
          subKnowledgePoint: "液体压强实验",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西物理备考中压强常出现在液体压强实验探究题，分值多在 4-6 分。",
          estimatedMinutes: 5,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "把液面高度差当成与容器形状有关，而忽略深度"
        },
        {
          id: "src-phys-pressure-floating-pressure",
          type: "short",
          typeCategory: "力学综合",
          difficulty: 5,
          stem: "公开题源改编：一个空心物体漂浮在水面上。若在保证它仍然漂浮的前提下，在物体上方均匀放置少量重物，请判断它受到的浮力和容器底部所受液体压强会如何变化，并说明理由。",
          refAnswer: "浮力增大，容器底部所受液体压强也增大。因为漂浮时浮力始终等于总重，放上重物后总重变大，所以需要排开更多液体，液面会上升，底部液体压强随深度增加而增大。",
          rubric: ["判断浮力增大", "判断底部液体压强增大", "能用漂浮条件和排液体积解释原因"],
          explanation: "压强与浮力综合题常把“漂浮条件”和“液面变化”放在一个情境里一起考。",
          knowledgePoint: "压强与浮力",
          subKnowledgePoint: "浮力压强综合",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：山西与晋中备考资料中，浮力与压强综合常结合受力、液面变化和计算分析。",
          estimatedMinutes: 6,
          shanxiFrequency: 5,
          score: 6,
          commonMistake: "只盯浮力变化，不会继续分析液面和底部压强"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-light") {
      return [
        {
          id: "src-phys-light-mirror-experiment",
          type: "single",
          typeCategory: "实验探究",
          difficulty: 4,
          stem: "公开题源改编：在“探究平面镜成像特点”的实验中，用玻璃板代替平面镜的主要目的是？",
          options: [
            { key: "A", text: "便于准确确定像的位置" },
            { key: "B", text: "使像更亮、更大" },
            { key: "C", text: "让后面的物体完全看不见" },
            { key: "D", text: "减小实验误差到零" }
          ],
          answer: "A",
          explanation: "玻璃板既能成像，又能透过它观察后方蜡烛位置，便于用另一支蜡烛与像重合，从而确定像的位置。",
          knowledgePoint: "光现象",
          subKnowledgePoint: "平面镜成像实验",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：光学实验复习资料明确指出，用玻璃板代替平面镜是为了便于准确确定像的位置。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只记结论，不知道玻璃板在实验中的具体作用"
        },
        {
          id: "src-phys-light-lens-application",
          type: "single",
          typeCategory: "图像题",
          difficulty: 4,
          stem: "公开题源改编：航天员使用相机拍摄舱外景象时，镜头相当于凸透镜。若景物距离镜头较远，则在感光元件上形成的像是？",
          options: [
            { key: "A", text: "倒立、缩小的实像" },
            { key: "B", text: "正立、放大的虚像" },
            { key: "C", text: "倒立、放大的实像" },
            { key: "D", text: "正立、等大的虚像" }
          ],
          answer: "A",
          explanation: "照相机利用凸透镜成像，远处物体满足物距大于二倍焦距，成倒立、缩小的实像。",
          knowledgePoint: "光现象",
          subKnowledgePoint: "凸透镜应用",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：山西 2023 光学复习题出现航天员拍摄情境，归到“透镜及其应用”。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把照相机和放大镜的成像条件混淆"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-heat") {
      return [
        {
          id: "src-phys-heat-salt-lake-change",
          type: "single",
          typeCategory: "选择填空",
          difficulty: 3,
          stem: "公开题源改编：山西运城盐湖把湖水引入盐田后，利用日光和风力使湖水逐渐减少，最后析出晶盐。该过程中湖水减少主要涉及的物态变化是？",
          options: [
            { key: "A", text: "液化" },
            { key: "B", text: "汽化" },
            { key: "C", text: "凝固" },
            { key: "D", text: "凝华" }
          ],
          answer: "B",
          explanation: "盐湖水在阳光和风力作用下不断蒸发，液态水变成水蒸气，属于汽化。",
          knowledgePoint: "热学基础",
          subKnowledgePoint: "物态变化",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西中考物理结果页公开片段出现“运城七彩盐湖”情境，考查湖水减少对应的物态变化。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "看见“结晶”就误判成凝固，而忽略湖水减少的主过程"
        },
        {
          id: "src-phys-heat-boiling-pressure",
          type: "single",
          typeCategory: "热学综合",
          difficulty: 4,
          stem: "公开题源改编：高压锅能更快煮熟食物，主要原因是锅内气压增大后？",
          options: [
            { key: "A", text: "水的沸点升高，食物可在更高温度下被加热" },
            { key: "B", text: "水的沸点降低，水更容易沸腾" },
            { key: "C", text: "水的比热容明显变大" },
            { key: "D", text: "锅内所有液体都不再蒸发" }
          ],
          answer: "A",
          explanation: "液体沸点随气压升高而升高。高压锅内部压强更大，所以水能在高于 100℃ 的温度下沸腾，从而提高加热效率。",
          knowledgePoint: "热学基础",
          subKnowledgePoint: "沸点与气压",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西专用“温度与物态变化”专题长期把沸点与气压关系列为高频考点。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "只记“高压锅更快”，不会落到“气压变大、沸点升高”这条因果链"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-air") {
      return [
        {
          id: "src-chem-air-oxygen-setup",
          type: "single",
          typeCategory: "实验探究",
          difficulty: 4,
          stem: "公开题源改编：在“氧气的实验室制取”实验中，使用高锰酸钾并加热制氧气时，试管口放一团棉花的主要目的是？",
          options: [
            { key: "A", text: "防止试管炸裂" },
            { key: "B", text: "防止高锰酸钾粉末进入导管" },
            { key: "C", text: "使收集到的氧气更纯" },
            { key: "D", text: "增大氧气生成速率" }
          ],
          answer: "B",
          explanation: "加热高锰酸钾制氧气时，试管口放棉花是为了防止高锰酸钾粉末随气流进入导管，避免堵塞或污染装置。",
          knowledgePoint: "空气与氧气",
          subKnowledgePoint: "氧气实验室制取",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：山西 2025 化学实验操作考试视频列表明确出现“氧气的实验室制取——装置组装”等标准实验项目。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只会背化学方程式，不清楚实验装置细节作用"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-water") {
      return [
        {
          id: "src-chem-water-purify-order",
          type: "single",
          typeCategory: "实验探究",
          difficulty: 3,
          stem: "公开题源改编：某同学取到一份含泥沙和少量异味的天然水，若想先除去难溶性杂质，再进一步减弱异味，较合理的操作顺序是？",
          options: [
            { key: "A", text: "蒸馏后过滤" },
            { key: "B", text: "过滤后活性炭吸附" },
            { key: "C", text: "先加肥皂水再过滤" },
            { key: "D", text: "只静置，不需要其他操作" }
          ],
          answer: "B",
          explanation: "过滤可以先除去难溶性杂质，活性炭再吸附色素和异味，这是净化天然水的常见顺序。",
          knowledgePoint: "水的组成与净化",
          subKnowledgePoint: "水的净化步骤",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西化学真题结果页出现“如何在日常生活中节约用水”等水主题材料，实验操作考试同时覆盖粗盐除杂等净化操作。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "记不住过滤和吸附的先后作用，只会机械背步骤"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-carbon") {
      return [
        {
          id: "src-chem-carbon-limewater",
          type: "single",
          typeCategory: "物质性质与应用",
          difficulty: 4,
          stem: "公开题源改编：老师将一种无色气体通入澄清石灰水中，观察到石灰水变浑浊。由此可推断该气体最可能是？",
          options: [
            { key: "A", text: "氧气" },
            { key: "B", text: "氢气" },
            { key: "C", text: "二氧化碳" },
            { key: "D", text: "氮气" }
          ],
          answer: "C",
          explanation: "二氧化碳能使澄清石灰水变浑浊，生成碳酸钙沉淀，这是检验二氧化碳的特征现象。",
          knowledgePoint: "碳和碳的氧化物",
          subKnowledgePoint: "二氧化碳检验",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西 2020-2022 三年中考化学分类汇编专列“碳和碳的氧化物、金属和金属矿物”专题。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "把‘无色无味’直接当判断依据，不会抓特征反应"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-acidbase") {
      return [
        {
          id: "src-chem-acidbase-neutralization",
          type: "single",
          typeCategory: "化学方程式",
          difficulty: 4,
          stem: "公开题源改编：向盛有少量氢氧化钠溶液的烧杯中逐滴加入稀盐酸，二者恰好完全反应后，所得溶液中的主要溶质是？",
          options: [
            { key: "A", text: "NaCl" },
            { key: "B", text: "NaOH 和 NaCl" },
            { key: "C", text: "HCl 和 NaCl" },
            { key: "D", text: "NaOH" }
          ],
          answer: "A",
          explanation: "氢氧化钠与盐酸恰好完全反应生成氯化钠和水，反应后溶液中的主要溶质是 NaCl。",
          knowledgePoint: "溶液与酸碱盐基础",
          subKnowledgePoint: "中和反应",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：山西一轮复习与真题关联结果长期聚焦“常见的酸、碱、盐”以及中和反应、离子检验等核心考点。",
          estimatedMinutes: 5,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只记‘酸加碱生成盐和水’，不会判断恰好反应后的溶质"
        }
      ];
    }
    if (subject.id === "english" && unit.id === "en-reading") {
      return [
        {
          id: "src-en-reading-heading-match",
          type: "single",
          typeCategory: "阅读",
          difficulty: 4,
          stem: "公开题源改编：在英语阅读题中，如果题目要求“根据每段内容选出适当的小标题”，最关键的做法是什么？",
          options: [
            { key: "A", text: "只看标题中是否出现原文原词，不看段落主旨" },
            { key: "B", text: "先找每段主题句或核心信息，再和标题选项进行匹配" },
            { key: "C", text: "按选项长度选最短的标题" },
            { key: "D", text: "先选自己最熟悉的话题标题，其他不用回文定位" }
          ],
          answer: "B",
          explanation: "小标题匹配题本质是概括段意。先抓段落主题句、关键词和核心信息，再对照选项，避免只盯字面重复。",
          knowledgePoint: "阅读理解",
          subKnowledgePoint: "段落标题匹配",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西中考英语结果页显示阅读部分出现“根据每段内容，从文后选项中选出适当的小标题”。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只找原词重现，不抓每段主旨"
        }
      ];
    }
    if (subject.id === "english" && unit.id === "en-writing") {
      return [
        {
          id: "src-en-writing-friendship-post",
          type: "essay",
          typeCategory: "作文",
          difficulty: 4,
          stem: "公开题源改编：你校英文报正在征集以“True Friendship” 为主题的短文。请结合你与好友的一次真实经历，写一篇英语短文投稿，内容至少包括：1. 你们之间发生的一件事；2. 你从这段友情中学到了什么。",
          refAnswer: "可按三段写：第一段交代好友和事件背景；第二段写具体经历，如朋友帮助自己或共同解决问题；第三段总结真正的友情意味着互相理解、支持与成长。",
          rubric: ["覆盖事件经过与友情感受", "有清晰的三段结构", "能用至少两个连接词组织内容", "语言基本准确，主题积极"],
          explanation: "山西书面表达近年常围绕成长、人际关系和校园生活展开，重点不在堆词，而在结构完整和内容真实。",
          knowledgePoint: "书面表达",
          subKnowledgePoint: "友情主题投稿",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2020-2024 山西中考英语书面表达分类汇编中出现“介绍你与好友之间的真挚友情，用于投稿”的话题。",
          estimatedMinutes: 10,
          shanxiFrequency: 5,
          score: 10,
          commonMistake: "只写空泛感受，不交代具体经历和收获"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-function1") {
      return [
        {
          id: "src-math-function1-graph-judge",
          type: "single",
          typeCategory: "函数综合",
          difficulty: 4,
          stem: "公开题源改编：已知一次函数 y=kx+b 的图象经过第一、二、四象限，则 k、b 的取值情况应为？",
          options: [
            { key: "A", text: "k>0，b>0" },
            { key: "B", text: "k<0，b>0" },
            { key: "C", text: "k>0，b<0" },
            { key: "D", text: "k<0，b<0" }
          ],
          answer: "B",
          explanation: "直线经过第一、二、四象限，说明函数图象随 x 增大而减小，所以 k<0；同时与 y 轴交于正半轴，所以 b>0。",
          knowledgePoint: "一次函数与反比例函数",
          subKnowledgePoint: "一次函数图象判定",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：山西专用“一次函数”专题练习出现根据 k、b 条件判断图象位置的真题化单选。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只会看斜率，不会同时结合 y 轴截距判断"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-quad") {
      return [
        {
          id: "src-math-quad-varignon",
          type: "short",
          typeCategory: "几何证明",
          difficulty: 5,
          stem: "公开题源改编：在任意四边形 ABCD 中，E、F、G、H 分别是边 AB、BC、CD、DA 的中点。连接 EFGH。请判断四边形 EFGH 的形状，并简要说明理由。",
          refAnswer: "EFGH 是平行四边形。因为在三角形 ABC 中，E、F 分别是 AB、BC 的中点，所以 EF∥AC；在三角形 CDA 中，H、G 分别是 DA、DC 的中点，所以 HG∥AC，因此 EF∥HG。同理 FG∥EH，所以 EFGH 是平行四边形。",
          rubric: ["判断出平行四边形", "能用三角形中位线性质说明两组对边分别平行"],
          explanation: "“阅读与思考”类几何题常把一个结论包装成探究任务，关键仍是回到中位线和平行四边形判定。",
          knowledgePoint: "四边形",
          subKnowledgePoint: "阅读与思考",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2023 年山西中考数学出现“阅读与思考：瓦里尼翁平行四边形”任务型几何题。",
          estimatedMinutes: 7,
          shanxiFrequency: 4,
          score: 6,
          commonMistake: "只记结论，不会把问题拆回到三角形中位线"
        }
      ];
    }
    if (subject.id === "chinese" && unit.id === "cn-poem") {
      return [
        {
          id: "src-cn-poem-activity-fill",
          type: "single",
          typeCategory: "默写",
          difficulty: 3,
          stem: "公开题源改编：学校诗社举办“寻古人雅趣”活动。下面诗句与“登高望远、胸怀壮志”这一主题最贴切的一项是？",
          options: [
            { key: "A", text: "会当凌绝顶，一览众山小" },
            { key: "B", text: "枯藤老树昏鸦，小桥流水人家" },
            { key: "C", text: "感时花溅泪，恨别鸟惊心" },
            { key: "D", text: "但愿人长久，千里共婵娟" }
          ],
          answer: "A",
          explanation: "“会当凌绝顶，一览众山小”最能体现登高远望、胸怀壮志的精神气象。",
          knowledgePoint: "古诗文默写",
          subKnowledgePoint: "主题理解型默写",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2024 年山西中考语文以“寻古人雅趣”活动”为情境考查诗文名句默写与理解。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "只会机械背诵，不会把诗句和主题情境对应起来"
        }
      ];
    }
    if (subject.id === "chinese" && unit.id === "cn-classical") {
      return [
        {
          id: "src-cn-classical-beiming",
          type: "single",
          typeCategory: "文言翻译",
          difficulty: 4,
          stem: "公开题源改编：《北冥有鱼》中“怒而飞，其翼若垂天之云”一句里，“怒”的意思最恰当的一项是？",
          options: [
            { key: "A", text: "发怒" },
            { key: "B", text: "振奋，这里指奋起" },
            { key: "C", text: "严厉责备" },
            { key: "D", text: "猛烈吹动" }
          ],
          answer: "B",
          explanation: "“怒而飞”中的“怒”不是发怒，而是形容鹏鸟振奋而起、奋起高飞的状态。",
          knowledgePoint: "文言文",
          subKnowledgePoint: "文言实词理解",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西中考语文公开片段出现《北冥有鱼》文言阅读材料。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "直接按现代汉语字面义理解文言实词"
        }
      ];
    }
    if (subject.id === "chinese" && unit.id === "cn-writing") {
      return [
        {
          id: "src-cn-writing-youth",
          type: "essay",
          typeCategory: "作文",
          difficulty: 4,
          stem: "公开题源改编：班级准备开展“青年当有为·建功新时代”主题分享活动。请写一篇记叙性文章，结合你熟悉的人或自己的经历，表达你对“青年有为”的理解。",
          refAnswer: "可写成记叙文：先写某位青年在学习、志愿服务或科技创新中的具体行动，再写自己受到的触动，最后点出“有为”不一定惊天动地，但要在具体行动中承担责任、服务社会。",
          rubric: ["主题紧扣“青年有为”", "有具体人物或事件", "结尾能升华到责任与担当", "记叙清楚，有真情实感"],
          explanation: "山西作文近年常把价值主题放进真实情境，关键不是空喊口号，而是用具体经历承载主题。",
          knowledgePoint: "作文",
          subKnowledgePoint: "时代主题记叙文",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西中考语文结果页出现“青年当有为·建功新时代”材料表达情境。",
          estimatedMinutes: 12,
          shanxiFrequency: 5,
          score: 10,
          commonMistake: "只喊价值口号，不写真实人物和具体细节"
        }
      ];
    }
    if (subject.id === "history" && unit.id === "hist-world") {
      return [
        {
          id: "src-hist-world-material-summary",
          type: "short",
          typeCategory: "材料题",
          difficulty: 4,
          stem: "公开题源改编：材料：随着机械化带来的高效量产，下层贫民也逐渐吃上了过去并不常见的食品，某些食品开始从少数人的食物变成劳动者也能享用的大众食物。根据材料，概括工业化带来的一个社会变化，并指出这一变化反映了什么历史趋势。",
          refAnswer: "社会变化：机械化生产使食品等商品更容易大量生产，普通劳动者也能享用原本较少见的商品。历史趋势：工业革命推动了生产力提高，也推动了社会生活方式和消费结构的变化。",
          rubric: ["能概括出机械化量产改变大众生活", "能联系工业革命或生产力提高作答"],
          explanation: "历史材料题常要求先从材料中提炼现象，再上升到“工业革命推动社会变化”这一历史趋势。",
          knowledgePoint: "世界史重点",
          subKnowledgePoint: "工业革命材料题",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西历史卷解析片段出现“机械化量产使意大利面成为劳动者食物”的材料概括题。",
          estimatedMinutes: 6,
          shanxiFrequency: 4,
          score: 6,
          commonMistake: "只复述材料，不会上升到工业革命推动社会变迁"
        }
      ];
    }
    if (subject.id === "daofa" && unit.id === "df-nation") {
      return [
        {
          id: "src-df-nation-rule-law-material",
          type: "short",
          typeCategory: "材料题",
          difficulty: 4,
          stem: "公开题源改编：材料：某地围绕未成年人网络保护、校园安全和文明上网开展系列治理行动，要求平台、学校、家庭和有关部门共同发力。请结合材料说明，为什么未成年人保护需要多方协同推进？",
          refAnswer: "因为未成年人身心发育尚不成熟，自我保护能力较弱，需要全社会给予特殊保护；同时未成年人保护涉及家庭、学校、社会、政府、司法、网络等多个方面，只有多方协同，才能形成合力，更好保障未成年人合法权益和健康成长。",
          rubric: ["写出未成年人需要特殊保护的原因", "写出多方协同形成保护合力"],
          explanation: "山西道法材料题常把现实治理情境与教材中的“六大保护”“法治保障”结合起来考。",
          knowledgePoint: "我与国家和社会",
          subKnowledgePoint: "未成年人保护材料题",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西道法真题精品解析与材料题技巧资源长期聚焦法治、未成年人保护和责任担当。",
          estimatedMinutes: 6,
          shanxiFrequency: 5,
          score: 6,
          commonMistake: "只写一个主体的责任，答不出协同保护"
        },
        {
          id: "src-df-nation-rights-obligations",
          type: "single",
          typeCategory: "辨析评价",
          difficulty: 3,
          stem: "公开题源改编：有人说：“公民有权利就行，义务可以视情况履行。”对这一观点判断正确的是？",
          options: [
            { key: "A", text: "正确，权利比义务更重要" },
            { key: "B", text: "错误，公民既享有权利也必须履行义务" },
            { key: "C", text: "正确，义务只是道德要求" },
            { key: "D", text: "无法判断" }
          ],
          answer: "B",
          explanation: "在我国，公民权利和义务相统一。享有权利的同时，必须依法履行义务，不能只讲权利不讲责任。",
          knowledgePoint: "我与国家和社会",
          subKnowledgePoint: "权利义务统一",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西道法材料题技巧资源反复强调“权利义务统一”和“法治责任担当”是高频主轴。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "把权利和义务对立起来，只会背概念不会判断现实说法"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-mechanics") {
      return [
        {
          id: "src-phys-mechanics-balance-conditions",
          type: "single",
          typeCategory: "力学综合",
          difficulty: 4,
          stem: "公开题源改编：把一本课本静止放在水平桌面上，下列关于课本受力的说法正确的是？",
          options: [
            { key: "A", text: "课本只受重力作用" },
            { key: "B", text: "课本受的重力和桌面对它的支持力是一对平衡力" },
            { key: "C", text: "桌面对课本的支持力大于课本所受重力" },
            { key: "D", text: "课本对桌面的压力和支持力是一对平衡力" }
          ],
          answer: "B",
          explanation: "课本静止在水平桌面上，处于平衡状态，竖直方向上受到的重力和支持力大小相等、方向相反、作用在同一物体上，是一对平衡力。",
          knowledgePoint: "力学基础",
          subKnowledgePoint: "平衡力判定",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考物理力学专题与真题汇编长期把受力分析、平衡力和机械能作为高频考点。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "分不清平衡力和相互作用力"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-change") {
      return [
        {
          id: "src-chem-change-property-judge",
          type: "single",
          typeCategory: "物质性质与应用",
          difficulty: 3,
          stem: "公开题源改编：下列变化中，属于化学变化的是？",
          options: [
            { key: "A", text: "把铜丝弯成铜圈" },
            { key: "B", text: "冰块融化成水" },
            { key: "C", text: "酒精挥发" },
            { key: "D", text: "铁钉在潮湿空气中生锈" }
          ],
          answer: "D",
          explanation: "铁生锈生成了新物质铁锈，属于化学变化；其余都没有新物质生成，属于物理变化。",
          knowledgePoint: "物质的变化与性质",
          subKnowledgePoint: "化学变化判断",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西近年化学真题与一轮复习专题持续把“物理变化和化学变化辨析”列为基础高频小题。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只看现象变化，不判断是否生成新物质"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-formula") {
      return [
        {
          id: "src-chem-formula-valence-calc",
          type: "single",
          typeCategory: "化学方程式",
          difficulty: 4,
          stem: "公开题源改编：已知氧元素在氧化物中通常显 -2 价，则 Fe2O3 中铁元素的化合价是？",
          options: [
            { key: "A", text: "+1" },
            { key: "B", text: "+2" },
            { key: "C", text: "+3" },
            { key: "D", text: "+6" }
          ],
          answer: "C",
          explanation: "化合物中各元素化合价代数和为 0。设铁元素化合价为 x，则 2x+3×(-2)=0，解得 x=+3。",
          knowledgePoint: "化学式与化合价",
          subKnowledgePoint: "化合价计算",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考化学复习资料长期把“化学式与化合价”列为必考基础板块。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "不会利用化合价代数和为零进行计算"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-equation") {
      return [
        {
          id: "src-chem-equation-balance-burn",
          type: "single",
          typeCategory: "化学方程式",
          difficulty: 4,
          stem: "公开题源改编：下列关于化学方程式 2H2 + O2 点燃 2H2O 的说法正确的是？",
          options: [
            { key: "A", text: "该反应中氢气和氧气质量比为 2:1" },
            { key: "B", text: "该方程式说明 2 个氢元素与 1 个氧元素反应" },
            { key: "C", text: "该反应前后原子种类和数目都不变" },
            { key: "D", text: "反应后生成物的总质量一定大于反应物总质量" }
          ],
          answer: "C",
          explanation: "化学反应前后原子种类和数目保持不变，这是化学方程式配平和质量守恒的基础。A 说的是化学计量数比，不是质量比。",
          knowledgePoint: "化学方程式",
          subKnowledgePoint: "质量守恒理解",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西化学真题与专题汇编持续把“化学方程式书写与质量守恒理解”列为核心高频。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "把化学计量数比误当成质量比"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-number") {
      return [
        {
          id: "src-math-number-basic-calc",
          type: "single",
          typeCategory: "选择填空",
          difficulty: 2,
          stem: "公开题源改编：计算 -1+2 的结果是？",
          options: [
            { key: "A", text: "-3" },
            { key: "B", text: "-1" },
            { key: "C", text: "1" },
            { key: "D", text: "3" }
          ],
          answer: "C",
          explanation: "有理数加法中，异号两数相加，取绝对值较大的数的符号，并用较大绝对值减较小绝对值，所以结果为 1。",
          knowledgePoint: "实数与运算",
          subKnowledgePoint: "有理数加法",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西中考数学真题汇编公开片段列出选择题“计算 -1+2 的结果是（ ）”。",
          estimatedMinutes: 2,
          shanxiFrequency: 5,
          score: 3,
          commonMistake: "异号数相加时符号判断错误"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-equation") {
      return [
        {
          id: "src-math-equation-inequality-solve",
          type: "single",
          typeCategory: "解答",
          difficulty: 3,
          stem: "公开题源改编：不等式 2x-1<5 的解集是？",
          options: [
            { key: "A", text: "x<2" },
            { key: "B", text: "x<3" },
            { key: "C", text: "x>2" },
            { key: "D", text: "x>3" }
          ],
          answer: "B",
          explanation: "移项得 2x<6，再把两边同时除以 2，得 x<3。",
          knowledgePoint: "方程与不等式",
          subKnowledgePoint: "一元一次不等式",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学结构稳定，方程与不等式长期是高频得分板块。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "移项或去系数时计算出错"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-triangle") {
      return [
        {
          id: "src-math-triangle-pythagorean-basic",
          type: "single",
          typeCategory: "几何证明",
          difficulty: 4,
          stem: "公开题源改编：在 Rt△ABC 中，∠C=90°，AC=6，BC=8，则 AB 的长为？",
          options: [
            { key: "A", text: "10" },
            { key: "B", text: "12" },
            { key: "C", text: "14" },
            { key: "D", text: "48" }
          ],
          answer: "A",
          explanation: "由勾股定理得 AB²=AC²+BC²=6²+8²=100，所以 AB=10。",
          knowledgePoint: "三角形与勾股定理",
          subKnowledgePoint: "勾股定理计算",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学几何专题与真题解读持续覆盖勾股定理和三角形综合。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "会列式但不会开平方或误把直角边当斜边"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-stats") {
      return [
        {
          id: "src-math-stats-average-read",
          type: "single",
          typeCategory: "统计概率",
          difficulty: 3,
          stem: "公开题源改编：某小组 5 名同学一分钟跳绳成绩分别为 160、170、180、190、200，则这组数据的平均数是？",
          options: [
            { key: "A", text: "176" },
            { key: "B", text: "180" },
            { key: "C", text: "182" },
            { key: "D", text: "190" }
          ],
          answer: "B",
          explanation: "平均数为 (160+170+180+190+200)÷5=900÷5=180。",
          knowledgePoint: "统计与概率",
          subKnowledgePoint: "平均数",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学统计概率专题长期以平均数、中位数、概率基础判断为核心小题。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "求和或除法粗心出错"
        }
      ];
    }
    if (subject.id === "chinese" && unit.id === "cn-reading") {
      return [
        {
          id: "src-cn-reading-nonfiction-summary",
          type: "single",
          typeCategory: "阅读赏析",
          difficulty: 4,
          stem: "公开题源改编：做现代文阅读概括题时，下列哪一项做法最合理？",
          options: [
            { key: "A", text: "只抄原文里最长的一句话即可" },
            { key: "B", text: "先筛出关键对象、事件或观点，再按题干要求整合表达" },
            { key: "C", text: "不看题干，直接写自己的感受" },
            { key: "D", text: "把所有细节都写上，越多越好" }
          ],
          answer: "B",
          explanation: "现代文阅读概括题强调“依据文本，按要求整合信息”。先抓关键对象、事件或观点，再按照题干限定组织答案，最符合答题规范。",
          knowledgePoint: "现代文阅读",
          subKnowledgePoint: "信息概括",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西历年中考现代文阅读题库长期收录非连续文本和现代文概括类真题。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "脱离题干要求，概括时只抄原句或只写感受"
        }
      ];
    }
    if (subject.id === "chinese" && unit.id === "cn-basics") {
      return [
        {
          id: "src-cn-basics-idiom-context",
          type: "single",
          typeCategory: "选择填空",
          difficulty: 3,
          stem: "公开题源改编：下列句子中，加点成语使用恰当的一项是？",
          options: [
            { key: "A", text: "同学们听完讲座后豁然开朗，对复习思路更清楚了" },
            { key: "B", text: "他把试卷上的所有错误都改对了，真是妙手回春" },
            { key: "C", text: "这道数学题答案只有一个，他却说见仁见智" },
            { key: "D", text: "操场上静悄悄的，大家都在七手八脚地做听力" }
          ],
          answer: "A",
          explanation: "“豁然开朗”形容一下子明白过来，符合语境；其余成语都属于对象或语境误用。",
          knowledgePoint: "基础运用",
          subKnowledgePoint: "成语辨析",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西专用“基础知识综合+名著阅读”专题长期把字音字形、病句和成语辨析作为稳定考点。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "只看词面意思，不审对象和语境"
        }
      ];
    }
    if (subject.id === "history" && unit.id === "hist-ancient") {
      return [
        {
          id: "src-hist-ancient-xia-capital",
          type: "single",
          typeCategory: "基础识记",
          difficulty: 3,
          stem: "公开题源改编：下列哪一项是中国古代夏朝的都城？",
          options: [
            { key: "A", text: "阳城" },
            { key: "B", text: "咸阳" },
            { key: "C", text: "长安" },
            { key: "D", text: "临安" }
          ],
          answer: "A",
          explanation: "教材基础识记中，夏朝建立后定都阳城，这是古代史中的常考知识点。",
          knowledgePoint: "中国古代史",
          subKnowledgePoint: "夏朝建立",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2025 年山西中考历史真题公开片段出现选择题“以下哪项是中国古代夏朝的都城？”。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "把不同朝代都城混淆"
        }
      ];
    }
    if (subject.id === "history" && unit.id === "hist-modern") {
      return [
        {
          id: "src-hist-modern-first-unequal-treaty",
          type: "single",
          typeCategory: "基础识记",
          difficulty: 3,
          stem: "公开题源改编：中国近代史上，标志中国开始沦为半殖民地半封建社会的不平等条约是？",
          options: [
            { key: "A", text: "《南京条约》" },
            { key: "B", text: "《马关条约》" },
            { key: "C", text: "《辛丑条约》" },
            { key: "D", text: "《北京条约》" }
          ],
          answer: "A",
          explanation: "鸦片战争后签订的《南京条约》是中国近代史上第一个不平等条约，标志中国开始沦为半殖民地半封建社会。",
          knowledgePoint: "中国近代史",
          subKnowledgePoint: "鸦片战争影响",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西历史真题与知识点汇编长期把中国近代化开端、鸦片战争及不平等条约列为高频识记考点。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "知道条约名称，却不会对应历史地位和影响"
        }
      ];
    }
    if (subject.id === "english" && unit.id === "en-grammar") {
      return [
        {
          id: "src-en-grammar-tense-choice",
          type: "single",
          typeCategory: "语法填空",
          difficulty: 3,
          stem: "公开题源改编：My sister ______ to school on foot every day, so she is rarely late.",
          options: [
            { key: "A", text: "go" },
            { key: "B", text: "goes" },
            { key: "C", text: "went" },
            { key: "D", text: "is going" }
          ],
          answer: "B",
          explanation: "句中 every day 表示经常性、习惯性动作，应用一般现在时；主语 My sister 为第三人称单数，所以谓语动词用 goes。",
          knowledgePoint: "基础语法",
          subKnowledgePoint: "一般现在时",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考英语真题与专项训练长期把时态、主谓一致和完形填空作为稳定考查点。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 3,
          commonMistake: "看见动词原形就忽略主语单复数和时间标志词"
        }
      ];
    }
    if (subject.id === "english" && unit.id === "en-vocab") {
      return [
        {
          id: "src-en-vocab-context-choice",
          type: "single",
          typeCategory: "阅读",
          difficulty: 3,
          stem: "公开题源改编：The little boy was very ______ after running for half an hour, so he sat down to have a rest.",
          options: [
            { key: "A", text: "tired" },
            { key: "B", text: "proud" },
            { key: "C", text: "careful" },
            { key: "D", text: "famous" }
          ],
          answer: "A",
          explanation: "根据 after running for half an hour 和 have a rest 可知，小男孩应该是“累了”，故选 tired。",
          knowledgePoint: "高频词汇",
          subKnowledgePoint: "语境辨词",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考英语词汇与阅读题长期强调根据上下文辨析高频核心词义。",
          estimatedMinutes: 3,
          shanxiFrequency: 5,
          score: 3,
          commonMistake: "只背单词中文，不会结合语境选词"
        }
      ];
    }
    if (subject.id === "english" && unit.id === "en-cloze") {
      return [
        {
          id: "src-en-cloze-technology-theme",
          type: "single",
          typeCategory: "完形",
          difficulty: 4,
          stem: "公开题源改编：Technology is the first power! It is a great joy and a matter of pride to see China’s science and technology develop so fast. The underlined word pride probably means ______.",
          options: [
            { key: "A", text: "regret" },
            { key: "B", text: "shame" },
            { key: "C", text: "honor" },
            { key: "D", text: "trouble" }
          ],
          answer: "C",
          explanation: "句子表达的是“看到中国科技发展如此迅速是一件令人高兴和自豪的事”，因此 pride 最接近 honor。",
          knowledgePoint: "完形填空",
          subKnowledgePoint: "上下文词义推断",
          source: "山西真题改编",
          sourceEvidence: "公开检索摘要：2024 年山西中考英语真题公开片段出现完形语篇开头“Technology is the first power!... a matter of pride...”。",
          estimatedMinutes: 4,
          shanxiFrequency: 5,
          score: 4,
          commonMistake: "脱离上下文孤立记词义，推断不出情感色彩"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-work") {
      return [
        {
          id: "src-phys-work-power-compare",
          type: "single",
          typeCategory: "计算",
          difficulty: 4,
          stem: "公开题源改编：甲、乙两台机械做功相同，甲用时较少。比较它们的功率，正确的是？",
          options: [
            { key: "A", text: "甲的功率大" },
            { key: "B", text: "乙的功率大" },
            { key: "C", text: "两者功率相等" },
            { key: "D", text: "无法比较" }
          ],
          answer: "A",
          explanation: "功率表示做功快慢。在做功相同时，用时越少，功率越大，所以甲的功率更大。",
          knowledgePoint: "功与机械能",
          subKnowledgePoint: "功率比较",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考物理力学专题长期将功、功率和机械效率作为稳定考查点。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把做功多少和做功快慢混为一谈"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-lever") {
      return [
        {
          id: "src-phys-lever-force-arm",
          type: "single",
          typeCategory: "力学综合",
          difficulty: 4,
          stem: "公开题源改编：关于杠杆的力臂，下列说法正确的是？",
          options: [
            { key: "A", text: "力臂一定在杠杆上" },
            { key: "B", text: "力臂是支点到力作用点的距离" },
            { key: "C", text: "力臂是支点到力的作用线的距离" },
            { key: "D", text: "动力臂和阻力臂一定相等" }
          ],
          answer: "C",
          explanation: "力臂的定义是支点到力的作用线的距离，不一定落在杠杆上。",
          knowledgePoint: "简单机械",
          subKnowledgePoint: "杠杆与力臂",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西物理简单机械复习资料明确把杠杆定义、五要素和力臂判定列为重点。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把力臂误认为支点到作用点的线段"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-sound") {
      return [
        {
          id: "src-phys-sound-tone-frequency",
          type: "single",
          typeCategory: "选择填空",
          difficulty: 3,
          stem: "公开题源改编：声音的音调高低主要由声源振动的什么决定？",
          options: [
            { key: "A", text: "振幅" },
            { key: "B", text: "频率" },
            { key: "C", text: "传播速度" },
            { key: "D", text: "传播距离" }
          ],
          answer: "B",
          explanation: "音调由频率决定，频率越高，音调越高；响度主要与振幅有关。",
          knowledgePoint: "声现象",
          subKnowledgePoint: "音调与频率",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考物理基础小题长期把音调、响度和音色辨析作为入门考点。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把音调和响度混淆"
        }
      ];
    }
    if (subject.id === "physics" && unit.id === "phys-em") {
      return [
        {
          id: "src-phys-em-current-magnet",
          type: "single",
          typeCategory: "实验探究",
          difficulty: 3,
          stem: "公开题源改编：通电螺线管周围存在磁场，这说明电流具有哪种效应？",
          options: [
            { key: "A", text: "热效应" },
            { key: "B", text: "磁效应" },
            { key: "C", text: "化学效应" },
            { key: "D", text: "扩散效应" }
          ],
          answer: "B",
          explanation: "通电导体周围存在磁场，这是电流的磁效应。",
          knowledgePoint: "电磁学初步",
          subKnowledgePoint: "电流的磁效应",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考物理电磁学板块常以通电导体、通电螺线管和电磁铁为基础考点。",
          estimatedMinutes: 3,
          shanxiFrequency: 3,
          score: 4,
          commonMistake: "分不清电流的热效应和磁效应"
        }
      ];
    }
    if (subject.id === "chemistry" && unit.id === "chem-metal") {
      return [
        {
          id: "src-chem-metal-activity-order",
          type: "single",
          typeCategory: "物质性质与应用",
          difficulty: 4,
          stem: "公开题源改编：把铁片分别放入稀盐酸和硫酸铜溶液中，都有明显现象。由此能说明铁具有的性质是？",
          options: [
            { key: "A", text: "铁的活动性比铜弱" },
            { key: "B", text: "铁能与酸反应，也能和某些盐溶液反应" },
            { key: "C", text: "铁不能置换出盐中的金属" },
            { key: "D", text: "铁和酸反应时一定生成蓝色溶液" }
          ],
          answer: "B",
          explanation: "铁能与稀盐酸反应生成氢气，也能与硫酸铜溶液发生置换反应，说明铁具有较活泼的化学性质。",
          knowledgePoint: "金属与金属材料",
          subKnowledgePoint: "金属活动性",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西化学分类汇编长期把金属活动性顺序、酸和盐反应作为高频考点。",
          estimatedMinutes: 4,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "只会背活动性顺序，不会结合实验现象判断"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-algebra") {
      return [
        {
          id: "src-math-algebra-factorization-diff",
          type: "single",
          typeCategory: "选择填空",
          difficulty: 3,
          stem: "公开题源改编：因式分解 x²-9 的结果是？",
          options: [
            { key: "A", text: "(x-3)²" },
            { key: "B", text: "(x+3)²" },
            { key: "C", text: "(x-3)(x+3)" },
            { key: "D", text: "x(x-9)" }
          ],
          answer: "C",
          explanation: "x²-9 是平方差公式，分解为 (x-3)(x+3)。",
          knowledgePoint: "整式与因式分解",
          subKnowledgePoint: "平方差公式",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学基础题长期把整式运算和因式分解作为前段稳分小题。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "看不出平方差结构，盲目平方"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-circle") {
      return [
        {
          id: "src-math-circle-diameter-angle",
          type: "single",
          typeCategory: "圆综合",
          difficulty: 4,
          stem: "公开题源改编：在圆中，若 AB 是直径，点 C 在圆上，则 ∠ACB 的度数为？",
          options: [
            { key: "A", text: "30°" },
            { key: "B", text: "45°" },
            { key: "C", text: "60°" },
            { key: "D", text: "90°" }
          ],
          answer: "D",
          explanation: "半圆所对的圆周角是直角，所以 ∠ACB=90°。",
          knowledgePoint: "圆的基础",
          subKnowledgePoint: "圆周角定理",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学圆专题常把直径所对圆周角作为基础判定切入口。",
          estimatedMinutes: 3,
          shanxiFrequency: 3,
          score: 4,
          commonMistake: "忘记半圆所对圆周角是直角这一结论"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-transform") {
      return [
        {
          id: "src-math-transform-translation",
          type: "single",
          typeCategory: "选择填空",
          difficulty: 3,
          stem: "公开题源改编：点 A(2,3) 向右平移 4 个单位后得到点 A'，则 A' 的坐标是？",
          options: [
            { key: "A", text: "(6,3)" },
            { key: "B", text: "(2,7)" },
            { key: "C", text: "(-2,3)" },
            { key: "D", text: "(6,7)" }
          ],
          answer: "A",
          explanation: "向右平移 4 个单位，横坐标加 4，纵坐标不变，所以为 (6,3)。",
          knowledgePoint: "图形变换",
          subKnowledgePoint: "平移",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学图形变换题常以点坐标平移、对称和旋转作基础考查。",
          estimatedMinutes: 3,
          shanxiFrequency: 3,
          score: 4,
          commonMistake: "把横纵坐标变化方向弄反"
        }
      ];
    }
    if (subject.id === "math" && unit.id === "math-function2") {
      return [
        {
          id: "src-math-function2-parabola-open",
          type: "single",
          typeCategory: "函数综合",
          difficulty: 4,
          stem: "公开题源改编：二次函数 y=-x²+2x+3 的图象开口方向是？",
          options: [
            { key: "A", text: "向上" },
            { key: "B", text: "向下" },
            { key: "C", text: "先向上后向下" },
            { key: "D", text: "无法确定" }
          ],
          answer: "B",
          explanation: "二次项系数 a=-1<0，所以抛物线开口向下。",
          knowledgePoint: "二次函数基础",
          subKnowledgePoint: "抛物线开口方向",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西中考数学二次函数基础题常从二次项系数和图象特征切入。",
          estimatedMinutes: 3,
          shanxiFrequency: 3,
          score: 4,
          commonMistake: "不会把系数符号和开口方向对应起来"
        }
      ];
    }
    if (subject.id === "chinese" && unit.id === "cn-books") {
      return [
        {
          id: "src-cn-books-character-match",
          type: "single",
          typeCategory: "阅读赏析",
          difficulty: 3,
          stem: "公开题源改编：下列名著人物与作品对应正确的一项是？",
          options: [
            { key: "A", text: "孙悟空——《西游记》" },
            { key: "B", text: "保尔——《朝花夕拾》" },
            { key: "C", text: "祥子——《水浒传》" },
            { key: "D", text: "鲁滨逊——《简·爱》" }
          ],
          answer: "A",
          explanation: "孙悟空出自《西游记》；保尔出自《钢铁是怎样炼成的》；祥子出自《骆驼祥子》；鲁滨逊出自《鲁滨逊漂流记》。",
          knowledgePoint: "名著阅读",
          subKnowledgePoint: "人物与作品对应",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西专用“基础知识综合+名著阅读”专题长期覆盖名著人物、情节和主题辨析。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "只记人物名字，不会对应作品和情节"
        }
      ];
    }
    if (subject.id === "history" && unit.id === "hist-contemp") {
      return [
        {
          id: "src-hist-contemp-reform-open",
          type: "single",
          typeCategory: "基础识记",
          difficulty: 3,
          stem: "公开题源改编：标志我国进入改革开放和社会主义现代化建设新时期的重要会议是？",
          options: [
            { key: "A", text: "中共一大" },
            { key: "B", text: "中共七大" },
            { key: "C", text: "中共十一届三中全会" },
            { key: "D", text: "中共十四大" }
          ],
          answer: "C",
          explanation: "1978 年召开的中共十一届三中全会作出把党和国家工作中心转移到经济建设上来、实行改革开放的历史性决策。",
          knowledgePoint: "中国现代史",
          subKnowledgePoint: "改革开放起点",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西历史真题与知识点汇编长期把改革开放起点和现代化建设成就作为现代史高频识记点。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "会议名称知道但记不住历史意义"
        }
      ];
    }
    if (subject.id === "daofa" && unit.id === "df-rel") {
      return [
        {
          id: "src-df-rel-collective-action",
          type: "single",
          typeCategory: "辨析评价",
          difficulty: 3,
          stem: "公开题源改编：班级大扫除时，有同学说“只要我学习好，班级公共事务跟我关系不大”。对此认识正确的是？",
          options: [
            { key: "A", text: "正确，学习好就可以不参加集体活动" },
            { key: "B", text: "错误，建设集体需要每个人尽责担当" },
            { key: "C", text: "正确，公共事务只归班干部负责" },
            { key: "D", text: "无法判断" }
          ],
          answer: "B",
          explanation: "集体建设离不开每个成员的责任担当，个人不能只享受集体利益而不承担集体责任。",
          knowledgePoint: "我与他人和集体",
          subKnowledgePoint: "集体责任",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西道法材料题长期把集体责任、友谊交往和担当意识作为常考主题。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把个人成绩和集体责任对立起来"
        }
      ];
    }
    if (subject.id === "daofa" && unit.id === "df-self") {
      return [
        {
          id: "src-df-self-correct-view",
          type: "single",
          typeCategory: "辨析评价",
          difficulty: 3,
          stem: "公开题源改编：小明一次考试失利后说“我什么都不行，努力也没用”。你认为这种看法？",
          options: [
            { key: "A", text: "正确，成绩差说明能力固定不变" },
            { key: "B", text: "错误，应该学会正确认识自己并积极改进" },
            { key: "C", text: "正确，只要一次失败就能下结论" },
            { key: "D", text: "无所谓，情绪发泄最重要" }
          ],
          answer: "B",
          explanation: "成长中的我们要学会正确认识自己，既看到不足，也相信自己能够通过努力不断进步。",
          knowledgePoint: "成长中的我",
          subKnowledgePoint: "正确认识自己",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西道法成长主题专题长期围绕自我认识、情绪调节和挫折应对命题。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把一次挫折绝对化、永久化"
        }
      ];
    }
    if (subject.id === "daofa" && unit.id === "df-conditions") {
      return [
        {
          id: "src-df-conditions-basic-national-condition",
          type: "single",
          typeCategory: "基础识记",
          difficulty: 3,
          stem: "公开题源改编：我国现阶段最基本的国情是？",
          options: [
            { key: "A", text: "我国已全面实现现代化" },
            { key: "B", text: "我国仍处于并将长期处于社会主义初级阶段" },
            { key: "C", text: "我国已经成为世界上最发达的国家" },
            { key: "D", text: "我国人口问题已经完全解决" }
          ],
          answer: "B",
          explanation: "社会主义初级阶段是我国最基本的国情，是党和国家制定路线方针政策的重要依据。",
          knowledgePoint: "国情教育",
          subKnowledgePoint: "基本国情",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西道法国情教育模块常把基本国情、发展阶段和制度自信作为稳定考点。",
          estimatedMinutes: 3,
          shanxiFrequency: 4,
          score: 4,
          commonMistake: "把发展成就误解成发展阶段已经结束"
        }
      ];
    }
    if (subject.id === "daofa" && unit.id === "df-current") {
      return [
        {
          id: "src-df-current-civic-attitude",
          type: "single",
          typeCategory: "材料题",
          difficulty: 3,
          stem: "公开题源改编：面对国家科技、体育、航天等领域的重要时事新闻，中学生比较恰当的做法是？",
          options: [
            { key: "A", text: "只看热闹，不思考也不行动" },
            { key: "B", text: "关注时事，增强责任感，把个人成长与国家发展联系起来" },
            { key: "C", text: "只转发标题，内容真假无所谓" },
            { key: "D", text: "认为这些都和自己完全无关" }
          ],
          answer: "B",
          explanation: "关注时事政治有助于增强国家认同和责任意识，也能把教材观点和现实发展联系起来。",
          knowledgePoint: "时事政治",
          subKnowledgePoint: "时事素养",
          source: "山西高频训练",
          sourceEvidence: "公开检索摘要：山西道法时事题常把国家发展成就与青少年责任担当结合考查。",
          estimatedMinutes: 3,
          shanxiFrequency: 3,
          score: 4,
          commonMistake: "把时事热点当成与自己无关的新闻"
        }
      ];
    }
    return [];
  }

  function buildGeneratedQuestions(subject, unit) {
    return [
      buildConceptGeneratedQuestion(subject, unit),
      buildMistakeGeneratedQuestion(subject, unit),
      buildFormulaGeneratedQuestion(subject, unit),
      buildFormulaChoiceQuestion(subject, unit),
      buildMethodChoiceQuestion(subject, unit),
      buildKnowledgeSummaryChoiceQuestion(subject, unit),
      buildCorrectionChoiceQuestion(subject, unit),
      buildExamStepChoiceQuestion(subject, unit),
      buildCalculationVariantQuestion(subject, unit),
      buildExperimentChoiceQuestion(subject, unit),
      buildImageInterpretationQuestion(subject, unit),
      buildDrawingChoiceQuestion(subject, unit),
      buildCircuitFaultQuestion(subject, unit),
      buildDynamicCircuitQuestion(subject, unit),
      buildMathComprehensiveQuestion(subject, unit),
      buildMovingPointQuestion(subject, unit),
      buildChainCalculationQuestion(subject, unit),
      buildShanxiRealChoiceQuestion(subject, unit),
      buildShanxiRealOpenQuestion(subject, unit),
      buildShanxiMockChoiceQuestion(subject, unit),
      buildMaterialQuestion(subject, unit),
      buildMultiMaterialOpenQuestion(subject, unit),
      buildWritingTaskQuestion(subject, unit),
      buildReadingToWritingQuestion(subject, unit),
      buildEnglishWritingChainQuestion(subject, unit),
      buildEvaluationOpenQuestion(subject, unit),
      buildReasonMeaningOpenQuestion(subject, unit),
      buildSparseUnitBoosterQuestion(subject, unit)
    ].filter(Boolean);
  }

  const store = {
    bySubject: {},
    all: [],
    byId: {}
  };

  function rebuild(subjectData) {
    store.bySubject = {};
    store.all = [];
    store.byId = {};
    Object.keys(subjectData || {}).forEach(subjectId => {
      const subject = subjectData[subjectId];
      const bank = [];
      (subject.units || []).forEach(unit => {
        (unit.quizBank || []).forEach((question, index) => {
          bank.push(normalizeQuestion(subject, unit, question, index));
        });
        buildSourceBackedQuestions(subject, unit).forEach((question, index) => {
          bank.push(normalizeQuestion(subject, unit, question, "source-backed-" + index));
        });
        buildGeneratedQuestions(subject, unit).forEach((question, index) => {
          bank.push(normalizeQuestion(subject, unit, question, "generated-" + index));
        });
      });
      store.bySubject[subjectId] = dedupeQuestions(bank);
      store.bySubject[subjectId].forEach(question => {
        store.byId[question.id] = question;
      });
    });
    store.all = dedupeQuestions(Object.keys(store.bySubject).flatMap(subjectId => store.bySubject[subjectId]));
    window.QUESTION_BANK = store.bySubject;
    window.ALL_QUESTIONS = store.all;
    window.QUESTION_INDEX = store.byId;
    return store;
  }

  function getSubjectBank(subjectId, options) {
    const comprehensiveOnly = typeof options === "boolean" ? options : options && options.comprehensiveOnly;
    const questions = store.bySubject[subjectId] || [];
    return questions.filter(question => !comprehensiveOnly || question.isComprehensive);
  }

  function getAllBank(options) {
    const comprehensiveOnly = typeof options === "boolean" ? options : options && options.comprehensiveOnly;
    return store.all.filter(question => !comprehensiveOnly || question.isComprehensive);
  }

  function getByIds(ids) {
    return dedupeQuestions((ids || []).map(id => store.byId[id]).filter(Boolean));
  }

  window.QuestionBankEngine = {
    rebuild: rebuild,
    getSubjectBank: getSubjectBank,
    getAllBank: getAllBank,
    getByIds: getByIds,
    getById: function (id) { return store.byId[id] || null; }
  };
})();
