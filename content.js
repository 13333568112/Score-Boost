// ============ 中考提分助手 - 全部7科知识点数据 ============
const SUBJECT_DATA = {

// ==================== 物理 (90分) ====================
physics: {
  id:"physics", name:"物理", fullScore:90, icon:"⚛️", color:"#2196F3",
  units: [
    { id:"phys-sound", name:"一、声现象", order:1, estimatedMinutes:25, difficulty:1, priority:4, examWeight:"~4分",
      concepts: [
        { id:"phys-sound-1", title:"声音的产生与传播", body:"声音由物体<strong>振动</strong>产生。声音靠<strong>介质</strong>传播（固体>液体>气体），<strong>真空不能传声</strong>。声速：15℃空气中<strong>340m/s</strong>，温度越高声速越大。", highlight:true, mnemonic:"声靠振动生，真空传不成。固快气最慢，340记心中。" },
        { id:"phys-sound-2", title:"声音三要素", body:"<strong>音调</strong>：由频率决定，频率高音调高。<strong>响度</strong>：由振幅决定，振幅大响度大，还与距离有关。<strong>音色</strong>：由发声体材料和结构决定，用来区分不同发声体。", highlightText:"频率→音调；振幅→响度；材料→音色", children:[
          { title:"超声波与次声波", body:"超声波>20000Hz（蝙蝠、B超）；次声波<20Hz（地震、火山），人耳听不到。" }
        ]},
        { id:"phys-sound-3", title:"回声计算", body:"回声到达人耳比原声晚<strong>0.1s以上</strong>才能区分。公式：<strong>s = vt/2</strong>（s为障碍物距离，v为声速，t为往返时间）。" }
      ],
      formulas: [
        { expression:"s = vt/2", description:"回声测距", variables:{s:"距离(m)", v:"声速(m/s)", t:"时间(s)"} },
        { expression:"v = s/t", description:"声速公式（通用）", variables:{v:"声速(m/s)", s:"距离(m)", t:"时间(s)"} }
      ],
      commonMistakes: [
        { wrong:"声音在真空中传播", correct:"真空不能传声，声音需要介质" },
        { wrong:"音调高声音就大", correct:"音调由频率决定，响度由振幅决定，两者不同" }
      ],
      quizBank: [
        { id:"p-s-1", type:"single", difficulty:1, stem:"关于声音，下列说法正确的是？", options:[
          { key:"A", text:"声音可以在真空中传播" },{ key:"B", text:"声音由物体振动产生" },
          { key:"C", text:"声音在固体中传播最慢" },{ key:"D", text:"音调由振幅决定" }
        ], answer:"B", explanation:"声音由物体振动产生，真空不能传声，固体中声速最快，音调由频率决定。" },
        { id:"p-s-2", type:"single", difficulty:1, stem:"在15℃空气中，声音的传播速度约为？", options:[
          { key:"A", text:"340 km/h" },{ key:"B", text:"340 m/s" },{ key:"C", text:"3×10⁸ m/s" },{ key:"D", text:"1500 m/s" }
        ], answer:"B", explanation:"15℃空气中声速为340m/s。3×10⁸m/s是光速。1500m/s是水中声速。" }
      ]
    },
    { id:"phys-light", name:"二、光现象", order:2, estimatedMinutes:35, difficulty:2, priority:5, examWeight:"~6分",
      concepts: [
        { id:"phys-light-1", title:"光的直线传播", body:"光在<strong>同种均匀介质</strong>中沿直线传播。", highlightText:"现象：影子、日食月食、小孔成像。光速c=3×10⁸m/s（真空中最快）。光年是长度单位。" },
        { id:"phys-light-2", title:"光的反射定律", body:"<strong>三线共面、两线分居、两角相等</strong>。反射角=入射角。光路可逆。", highlightText:"镜面反射：平行光入射，平行光反射（如平面镜）。漫反射：平行光入射，向各个方向反射（如黑板），但每条光线仍遵守反射定律！", commonMistake:"漫反射不遵守反射定律 → 错误！漫反射的每条光线都遵守反射定律。" },
        { id:"phys-light-3", title:"平面镜成像", body:"特点：<strong>等大、等距、垂直、虚像</strong>。像与物大小相等，像到镜面的距离=物到镜面的距离，像与物的连线与镜面垂直，平面镜成虚像。", mnemonic:"平面镜成像口诀：等大等距垂虚像", commonMistake:"物体靠近平面镜，像变大 → 错误！像与物始终等大，只是视角变化。" },
        { id:"phys-light-4", title:"光的折射定律", body:"光从一种介质斜射入另一种介质时，传播方向发生改变。<strong>三线共面、两线分居</strong>。光从空气斜射入水/玻璃中，折射角<strong>小于</strong>入射角，折射光线<strong>靠近</strong>法线。光从水/玻璃进入空气则相反。", mnemonic:"空入水，角变小，折近法线；水入空，角变大，折远法线", highlightText:"现象：池水看起来变浅、筷子「折断」、海市蜃楼" },
        { id:"phys-light-5", title:"凸透镜成像规律", body:"<strong>核心口诀：物近像远像变大，物远像近像变小。</strong>", highlight:true, children:[
          { title:"一倍焦距分虚实", body:"u<f 成正立放大虚像（放大镜）；u>f 成倒立实像" },
          { title:"二倍焦距分大小", body:"u=2f 成等大实像；u>2f 成缩小实像（照相机）；f<u<2f 成放大实像（投影仪）" },
          { title:"近视眼与远视眼", body:"近视眼：像成在视网膜前，用<strong>凹透镜</strong>矫正。远视眼：像成在视网膜后，用<strong>凸透镜</strong>矫正。" }
        ]}
      ],
      formulas: [
        { expression:"1/f = 1/u + 1/v", description:"透镜成像公式（了解）", variables:{f:"焦距", u:"物距", v:"像距"} }
      ],
      commonMistakes: [
        { wrong:"漫反射不遵守反射定律", correct:"漫反射的每条入射光线仍遵守反射定律，只是反射面不平" },
        { wrong:"物体靠近平面镜像变大", correct:"像与物等大，只是靠近后视角改变" }
      ],
      quizBank: [
        { id:"p-l-1", type:"single", difficulty:1, stem:"下列现象中，属于光的折射的是？", options:[
          { key:"A", text:"水中倒影" },{ key:"B", text:"池水看起来比实际浅" },
          { key:"C", text:"小孔成像" },{ key:"D", text:"黑板反光" }
        ], answer:"B", explanation:"池水变浅是光的折射；倒影是反射；小孔成像是直线传播；黑板反光是反射。" },
        { id:"p-l-2", type:"truefalse", difficulty:2, stem:"物体离平面镜越近，镜中的像越大。", answer:"B", explanation:"错误。平面镜成像始终与物体等大，不会因为距离改变而改变大小。" }
      ]
    },
    { id:"phys-heat", name:"三、热学基础", order:3, estimatedMinutes:30, difficulty:2, priority:4, examWeight:"~6分",
      concepts: [
        { id:"phys-heat-1", title:"温度与温度计", body:"温度表示物体的<strong>冷热程度</strong>。常用温度计原理：液体的<strong>热胀冷缩</strong>。摄氏温度：标准大气压下冰水混合物为0℃，沸水为100℃。体温计量程35-42℃，分度值0.1℃。" },
        { id:"phys-heat-2", title:"六种物态变化", body:"<strong>吸热</strong>：熔化（固态→液态）、汽化（液态→气态）、升华（固态→气态）。<strong>放热</strong>：凝固（液态→固态）、液化（气态→液态）、凝华（气态→固态）。", highlight:true, mnemonic:"吸热：熔汽升；放热：凝液华。", children:[
          { title:"晶体与非晶体", body:"晶体有固定熔点（冰0℃、海波48℃、萘80℃）；非晶体无固定熔点（蜡、玻璃、沥青、松香）。晶体熔化条件：达到熔点+继续吸热。" },
          { title:"沸腾条件", body:"达到沸点+继续吸热。液体沸点与气压有关：气压高沸点高（高压锅原理）。" },
          { title:"蒸发与沸腾区别", body:"蒸发：任何温度下、只在表面进行、缓慢。沸腾：沸点下、内部和表面同时、剧烈。蒸发吸热有制冷作用。" }
        ]}
      ],
      formulas: [
        { expression:"Q = cmΔt", description:"热量计算公式（比热容）", variables:{Q:"热量(J)", c:"比热容(J/kg·℃)", m:"质量(kg)", Δt:"温度变化(℃)"} }
      ],
      commonMistakes: [
        { wrong:"水在100℃时一定沸腾", correct:"沸腾需要达到沸点+继续吸热，缺一不可" },
        { wrong:"0℃的冰比0℃的水温度低", correct:"温度相同，但冰熔化需要吸热" }
      ],
      quizBank: [
        { id:"p-h-1", type:"single", difficulty:1, stem:"下列属于放热过程的是？", options:[
          { key:"A", text:"春天冰雪消融" },{ key:"B", text:"夏天湿衣服晾干" },
          { key:"C", text:"秋天早晨出现霜" },{ key:"D", text:"冬天冰冻的衣服变干" }
        ], answer:"C", explanation:"霜是水蒸气凝华，放热。冰融化吸热，水蒸发吸热，冰冻衣服变干是升华吸热。" }
      ]
    },
    { id:"phys-mechanics", name:"四、力学基础", order:4, estimatedMinutes:50, difficulty:2, priority:5, examWeight:"~12分",
      concepts: [
        { id:"phys-mech-1", title:"牛顿第一定律（惯性定律）", body:"一切物体在<strong>没有受到力的作用</strong>时，总保持<strong>静止状态或匀速直线运动状态</strong>。", highlight:true, mnemonic:"不受力，保原态：静止还静止，匀速还匀速", children:[
          { title:"惯性", body:"物体保持原有运动状态不变的性质。一切物体都有惯性。惯性大小<strong>只与质量有关</strong>，质量越大惯性越大，与速度无关。惯性不是力，不能说「受到惯性」或「惯性力」。" }
        ], commonMistake:"运动需要力来维持 → 错误！力是改变运动状态的原因，不是维持运动的原因。" },
        { id:"phys-mech-2", title:"二力平衡", body:"物体在两个力作用下保持<strong>静止或匀速直线运动</strong>状态。二力平衡条件：<strong>同体、等大、反向、共线</strong>。", highlightText:"区分：平衡力（作用在同一物体上）与相互作用力（作用在不同物体上）" },
        { id:"phys-mech-3", title:"摩擦力", body:"产生条件：接触面粗糙+有压力+有相对运动（或趋势）。方向：与相对运动方向<strong>相反</strong>。增大有益摩擦：增大压力、增大粗糙度。减小有害摩擦：加润滑油、变滑动为滚动、气垫/磁悬浮。" }
      ],
      formulas: [
        { expression:"v = s/t", description:"速度公式", variables:{v:"速度(m/s)", s:"路程(m)", t:"时间(s)"} },
        { expression:"G = mg", description:"重力公式（g≈9.8N/kg，粗略取10N/kg）", variables:{G:"重力(N)", m:"质量(kg)", g:"重力常数"} },
        { expression:"ρ = m/V", description:"密度公式", variables:{ρ:"密度(kg/m³)", m:"质量(kg)", V:"体积(m³)"} }
      ],
      commonMistakes: [
        { wrong:"速度大的物体惯性大", correct:"惯性只与质量有关，与速度无关" },
        { wrong:"物体不受力就会停下来", correct:"不受力时物体保持匀速直线运动或静止（牛顿第一定律）" }
      ],
      quizBank: [
        { id:"p-m-1", type:"single", difficulty:1, stem:"关于惯性，下列说法正确的是？", options:[
          { key:"A", text:"物体运动速度越大，惯性越大" },{ key:"B", text:"物体受力时才有惯性" },
          { key:"C", text:"一切物体在任何情况下都有惯性" },{ key:"D", text:"静止的物体没有惯性" }
        ], answer:"C", explanation:"一切物体在任何情况下都有惯性。惯性大小只与质量有关，与运动状态和是否受力无关。" },
        { id:"p-m-2", type:"single", difficulty:1, stem:"一个物体重490N，质量约为？（g=9.8N/kg）", options:[
          { key:"A", text:"4900 kg" },{ key:"B", text:"50 kg" },{ key:"C", text:"4.9 kg" },{ key:"D", text:"490 kg" }
        ], answer:"B", explanation:"m=G/g=490/9.8=50kg。" }
      ]
    },
    { id:"phys-pressure", name:"五、压强与浮力", order:5, estimatedMinutes:45, difficulty:2, priority:5, examWeight:"~10分",
      concepts: [
        { id:"phys-pres-1", title:"压强", body:"定义：物体<strong>单位面积</strong>上受到的压力。增大压强：增大压力或减小受力面积（刀刃、针尖）。减小压强：减小压力或增大受力面积（书包宽带、铁轨枕木）。", highlight:true },
        { id:"phys-pres-2", title:"液体压强", body:"特点：液体内部<strong>向各个方向</strong>都有压强，同种液体同一深度各方向压强相等，深度增加压强增大，液体压强还与液体密度有关。", highlightText:"液体压强只与液体密度和深度有关，与容器形状无关！" },
        { id:"phys-pres-3", title:"大气压强", body:"大气对浸在它里面的物体产生的压强。标准大气压：1.013×10⁵Pa = <strong>760mmHg</strong>。大气压随高度增加而减小。应用：吸盘、吸管喝水、活塞式抽水机、高压锅（气压越高沸点越高）。" },
        { id:"phys-pres-4", title:"阿基米德原理（浮力）", body:"浸在液体（或气体）中的物体受到向上的浮力，浮力大小等于物体<strong>排开的液体（或气体）所受的重力</strong>。", highlight:true, mnemonic:"浮力=排开的液重，F浮=ρ液gV排", children:[
          { title:"物体浮沉条件", body:"上浮：F浮>G 或 ρ液>ρ物；悬浮：F浮=G 或 ρ液=ρ物；下沉：F浮<G 或 ρ液<ρ物。漂浮：F浮=G（物体部分浸入）。" }
        ]}
      ],
      formulas: [
        { expression:"p = F/S", description:"压强公式", variables:{p:"压强(Pa)", F:"压力(N)", S:"受力面积(m²)"} },
        { expression:"p = ρgh", description:"液体压强公式", variables:{p:"压强(Pa)", ρ:"密度(kg/m³)", g:"9.8N/kg", h:"深度(m)"} },
        { expression:"F浮 = ρ液·g·V排", description:"阿基米德原理（浮力公式）", variables:{F浮:"浮力(N)", ρ液:"液体密度(kg/m³)", g:"9.8N/kg", V排:"排开液体的体积(m³)"} }
      ],
      commonMistakes: [
        { wrong:"铁块在水中一定下沉", correct:"铁船可以浮在水面上，因为做成空心增大了V排，从而增大了浮力" },
        { wrong:"液体压强由液体重力决定", correct:"液体压强只由ρgh决定，与容器形状和液体总重无关" }
      ],
      quizBank: [
        { id:"p-f-1", type:"single", difficulty:1, stem:"一艘轮船从河里驶入海里，它受到的浮力将？", options:[
          { key:"A", text:"变大" },{ key:"B", text:"变小" },{ key:"C", text:"不变" },{ key:"D", text:"无法判断" }
        ], answer:"C", explanation:"轮船始终漂浮，F浮=G，重力不变，所以浮力不变。又因为 F浮=ρ液gV排 保持不变，海水密度比河水大，所以排开液体体积要减小，船的吃水会更浅，看起来会上浮一些。" }
      ]
    },
    { id:"phys-work", name:"六、功与机械能", order:6, estimatedMinutes:35, difficulty:2, priority:4, examWeight:"~8分",
      concepts: [
        { id:"phys-work-1", title:"功", body:"做功的两个必要因素：<strong>有力+在力的方向上有距离</strong>。不做功的三种情况：有力无距离（推不动）、有距离无力（惯性运动）、力与距离垂直（提水水平走）。" },
        { id:"phys-work-2", title:"功率", body:"表示做功的<strong>快慢</strong>。功率大表示单位时间内做功多，不表示做功多。" },
        { id:"phys-work-3", title:"机械效率（η）", body:"η = W有用/W总 × 100%。由于额外功不可避免，机械效率<strong>总小于1</strong>。" },
        { id:"phys-work-4", title:"动能与势能", body:"<strong>动能</strong>：物体由于运动而具有的能，与质量和速度有关。质量越大、速度越大，动能越大。<strong>重力势能</strong>：物体由于被举高而具有的能，与质量和高度有关。<strong>弹性势能</strong>：物体发生弹性形变而具有的能。动能和势能可以相互转化，如果只有动能和势能的转化，机械能<strong>守恒</strong>。" }
      ],
      formulas: [
        { expression:"W = Fs", description:"功的公式", variables:{W:"功(J)", F:"力(N)", s:"沿力方向的距离(m)"} },
        { expression:"P = W/t", description:"功率公式", variables:{P:"功率(W)", W:"功(J)", t:"时间(s)"} }
      ],
      commonMistakes: [
        { wrong:"功率大的机器做功多", correct:"功率大说明做功快，但做功多少还取决于时间" },
        { wrong:"机械效率可以大于100%", correct:"机械效率总小于100%，因为总有额外功（摩擦等）" }
      ],
      quizBank: [
        { id:"p-w-1", type:"single", difficulty:1, stem:"下列哪种情况力对物体做了功？", options:[
          { key:"A", text:"用力推车但车未动" },{ key:"B", text:"提着水桶在水平地面行走" },
          { key:"C", text:"足球被踢出后在草地上滚动" },{ key:"D", text:"起重机将重物竖直向上提升" }
        ], answer:"D", explanation:"D有力且在力的方向上有距离。A有力无距离，B力与距离垂直，C有距离无力（惯性）。" }
      ]
    },
    { id:"phys-lever", name:"七、简单机械", order:7, estimatedMinutes:30, difficulty:2, priority:4, examWeight:"~6分",
      concepts: [
        { id:"phys-lev-1", title:"杠杆", body:"杠杆五要素：<strong>支点、动力、阻力、动力臂、阻力臂</strong>。平衡条件：<strong>F₁L₁ = F₂L₂</strong>。", highlight:true, children:[
          { title:"省力杠杆", body:"L₁>L₂，省力但费距离（撬棒、瓶起子、羊角锤）" },
          { title:"费力杠杆", body:"L₁<L₂，费力但省距离（镊子、钓鱼竿、筷子、理发剪刀）" },
          { title:"等臂杠杆", body:"L₁=L₂，不省力也不费力（天平、定滑轮）" }
        ]},
        { id:"phys-lev-2", title:"滑轮", body:"<strong>定滑轮</strong>：不省力，改变力的方向，实质是等臂杠杆。<strong>动滑轮</strong>：省一半力，不能改变力的方向，实质是省力杠杆。<strong>滑轮组</strong>：既省力又能改变力的方向。承重绳子段数n，拉力F=G/n（不计摩擦和滑轮重）。" }
      ],
      formulas: [
        { expression:"F₁L₁ = F₂L₂", description:"杠杆平衡条件", variables:{"F₁":"动力(N)", "L₁":"动力臂(m)", "F₂":"阻力(N)", "L₂":"阻力臂(m)"} }
      ],
      quizBank: [
        { id:"p-l-3", type:"single", difficulty:1, stem:"下列工具属于费力杠杆的是？", options:[
          { key:"A", text:"羊角锤" },{ key:"B", text:"筷子" },{ key:"C", text:"瓶起子" },{ key:"D", text:"撬棒" }
        ], answer:"B", explanation:"筷子是费力杠杆，动力臂小于阻力臂。羊角锤、瓶起子、撬棒都是省力杠杆。" }
      ]
    },
    { id:"phys-electric", name:"八、电学基础（欧姆定律）⭐最重要", order:8, estimatedMinutes:55, difficulty:3, priority:5, examWeight:"~14分",
      concepts: [
        { id:"phys-elec-1", title:"电路基础", body:"<strong>串联电路</strong>：电流<strong>处处相等</strong>I=I₁=I₂，总电压=各电压之和U=U₁+U₂，总电阻=各电阻之和R=R₁+R₂。<strong>并联电路</strong>：干路电流=各支路电流之和I=I₁+I₂，各支路电压<strong>相等</strong>U=U₁=U₂，总电阻的倒数=各电阻倒数之和1/R=1/R₁+1/R₂。", highlight:true, mnemonic:"串：流相等压相加阻相加；并：压相等流相加，阻倒加后再取倒" },
        { id:"phys-elec-2", title:"欧姆定律（最核心）", body:"导体中的电流与导体两端的电压<strong>成正比</strong>，与导体的电阻<strong>成反比</strong>。欧姆定律只适用于<strong>纯电阻电路</strong>。", highlight:true },
        { id:"phys-elec-3", title:"电功率", body:"电流在单位时间内所做的功。额定电压：用电器正常工作时的电压。额定功率：用电器在额定电压下的功率。实际功率随实际电压变化。" },
        { id:"phys-elec-4", title:"焦耳定律", body:"电流通过导体产生的热量与<strong>电流的平方、电阻、通电时间</strong>成正比。电热器：利用电流热效应（电饭煲、电烙铁）。" }
      ],
      formulas: [
        { expression:"I = U/R", description:"欧姆定律（核心）", variables:{I:"电流(A)", U:"电压(V)", R:"电阻(Ω)"} },
        { expression:"P = UI", description:"电功率", variables:{P:"电功率(W)", U:"电压(V)", I:"电流(A)"} },
        { expression:"P = I²R = U²/R", description:"电功率（纯电阻电路）", variables:{P:"功率(W)", I:"电流(A)", R:"电阻(Ω)", U:"电压(V)"} },
        { expression:"W = UIt = Pt", description:"电功", variables:{W:"电功(J)", U:"电压(V)", I:"电流(A)", t:"时间(s)"} },
        { expression:"Q = I²Rt", description:"焦耳定律（电热）", variables:{Q:"热量(J)", I:"电流(A)", R:"电阻(Ω)", t:"时间(s)"} }
      ],
      commonMistakes: [
        { wrong:"串联电路中电压处处相等", correct:"串联电路中电流处处相等，电压按电阻比例分配" },
        { wrong:"灯泡的额定功率越大越亮", correct:"灯泡亮度由实际功率决定，不是额定功率" }
      ],
      quizBank: [
        { id:"p-e-1", type:"single", difficulty:1, stem:"根据欧姆定律，下列说法正确的是？", options:[
          { key:"A", text:"导体中电流与电压成反比" },{ key:"B", text:"导体电阻与电压成正比" },
          { key:"C", text:"同一导体，电流与电压成正比" },{ key:"D", text:"导体电阻随电流增大而减小" }
        ], answer:"C", explanation:"同一导体的电阻不变（不考虑温度影响），电流与电压成正比。电阻是导体自身性质。" },
        { id:"p-e-2", type:"single", difficulty:2, stem:"两个电阻R₁=3Ω、R₂=6Ω并联在电路中，总电阻为？", options:[
          { key:"A", text:"9Ω" },{ key:"B", text:"2Ω" },{ key:"C", text:"4.5Ω" },{ key:"D", text:"1Ω" }
        ], answer:"B", explanation:"并联：1/R=1/3+1/6=1/2，所以R=2Ω。" }
      ]
    },
    { id:"phys-em", name:"九、电磁学初步", order:9, estimatedMinutes:25, difficulty:2, priority:3, examWeight:"~5分",
      concepts: [
        { id:"phys-em-1", title:"磁现象", body:"磁体有<strong>两个磁极</strong>：北极(N)和南极(S)。同名磁极相互<strong>排斥</strong>，异名磁极相互<strong>吸引</strong>。磁感线方向：从N极出发回到S极（外部），内部从S到N形成闭合曲线。" },
        { id:"phys-em-2", title:"电流的磁效应（奥斯特实验）", body:"通电导线周围存在<strong>磁场</strong>。通电螺线管的磁场与<strong>条形磁铁</strong>相似。", highlightText:"安培定则（右手螺旋定则）：右手握住螺线管，四指指向电流方向，拇指所指即为N极方向。" },
        { id:"phys-em-3", title:"电磁感应", body:"<strong>闭合</strong>电路的<strong>部分</strong>导体在磁场中做<strong>切割磁感线</strong>运动时，导体中产生感应电流。这是<strong>发电机</strong>的原理。感应电流方向与导体运动方向和磁场方向有关。", highlightText:"电动机原理：通电导体在磁场中受力（电能→机械能）。发电机原理：电磁感应（机械能→电能）。" }
      ],
      commonMistakes: [
        { wrong:"电动机原理是电磁感应", correct:"电动机原理是通电导体在磁场中受力；发电机原理才是电磁感应" }
      ],
      quizBank: [
        { id:"p-em-1", type:"single", difficulty:1, stem:"发电机的原理是？", options:[
          { key:"A", text:"电流的磁效应" },{ key:"B", text:"通电导体在磁场中受力" },
          { key:"C", text:"电磁感应" },{ key:"D", text:"磁场对电流的作用" }
        ], answer:"C", explanation:"发电机原理是电磁感应（磁生电），将机械能转化为电能。" }
      ]
    }
  ]
},

// ==================== 化学 (70分) ====================
chemistry: {
  id:"chemistry", name:"化学", fullScore:70, icon:"🧪", color:"#9C27B0",
  units: [
    { id:"chem-change", name:"一、物质的变化与性质", order:1, estimatedMinutes:25, difficulty:1, priority:5, examWeight:"~6分",
      concepts: [
        { id:"chem-c-1", title:"物理变化 vs 化学变化", body:"<strong>物理变化</strong>：没有新物质生成（水结冰、蜡烛熔化、玻璃破碎）。<strong>化学变化</strong>：有新物质生成，伴随发光、放热、变色、放出气体、生成沉淀等（燃烧、铁生锈、食物腐败）。", highlight:true, mnemonic:"有无新物质，是判断关键！", commonMistake:"灯泡发光是化学变化 → 错误！灯泡发光是物理变化（电能转光能，无新物质生成）" },
        { id:"chem-c-2", title:"物理性质 vs 化学性质", body:"<strong>物理性质</strong>：不需化学变化就表现出来的性质（颜色、状态、气味、熔点、沸点、密度、硬度、溶解性、导电导热性）。<strong>化学性质</strong>：在化学变化中表现出来的性质（可燃性、氧化性、还原性、酸碱性、稳定性）。" }
      ],
      quizBank: [
        { id:"c-c-1", type:"single", difficulty:1, stem:"下列变化属于化学变化的是？", options:[
          { key:"A", text:"酒精挥发" },{ key:"B", text:"铁生锈" },{ key:"C", text:"水结冰" },{ key:"D", text:"玻璃破碎" }
        ], answer:"B", explanation:"铁生锈生成新物质Fe₂O₃·xH₂O，是化学变化。其他都是物理变化。" }
      ]
    },
    { id:"chem-air", name:"二、空气与氧气", order:2, estimatedMinutes:35, difficulty:2, priority:5, examWeight:"~8分",
      concepts: [
        { id:"chem-a-1", title:"空气的组成", body:"空气是混合物。按体积分数：<strong>N₂占78%</strong>，<strong>O₂占21%</strong>，稀有气体0.94%，CO₂ 0.03%，其他气体和杂质0.03%。", highlight:true, mnemonic:"氮七八氧二一，稀有气体零点九四" },
        { id:"chem-a-2", title:"氧气的性质", body:"O₂：无色无味气体，<strong>不易溶于水</strong>，密度比空气略大。化学性质活泼，有<strong>助燃性</strong>（使带火星木条复燃）。与大多数金属和非金属反应生成氧化物。" },
        { id:"chem-a-3", title:"氧气的实验室制法（3种）", body:"<strong>①加热KMnO₄（高锰酸钾）</strong>：2KMnO₄ →△ K₂MnO₄+MnO₂+O₂↑（试管口塞棉花防止粉末进入导管）。<strong>②加热KClO₃（氯酸钾）+MnO₂催化剂</strong>：2KClO₃ →MnO₂/△ 2KCl+3O₂↑。<strong>③H₂O₂（过氧化氢）+MnO₂催化剂</strong>：2H₂O₂ →MnO₂ 2H₂O+O₂↑（不需加热，最简便）。", highlightText:"收集方法：排水法（O₂不易溶于水）或向上排空气法（O₂密度>空气）。验满：带火星木条放瓶口，复燃则满。" }
      ],
      formulas: [
        { expression:"2KMnO₄ →△ K₂MnO₄＋MnO₂＋O₂↑", description:"高锰酸钾加热制氧气" },
        { expression:"2H₂O₂ →MnO₂ 2H₂O＋O₂↑", description:"过氧化氢分解制氧气（不需加热）" }
      ],
      quizBank: [
        { id:"c-a-1", type:"single", difficulty:1, stem:"空气中体积分数约占21%的气体是？", options:[
          { key:"A", text:"氮气" },{ key:"B", text:"氧气" },{ key:"C", text:"二氧化碳" },{ key:"D", text:"稀有气体" }
        ], answer:"B", explanation:"空气中N₂占78%，O₂占21%。" }
      ]
    },
    { id:"chem-water", name:"三、水的组成与净化", order:3, estimatedMinutes:25, difficulty:1, priority:5, examWeight:"~6分",
      concepts: [
        { id:"chem-w-1", title:"电解水实验", body:"正极产生<strong>O₂</strong>（能使带火星木条复燃），负极产生<strong>H₂</strong>（能燃烧）。体积比：O₂:H₂=<strong>1:2</strong>。证明水由<strong>氢元素和氧元素</strong>组成。", mnemonic:"正氧负氢，氧一氢二" },
        { id:"chem-w-2", title:"水的净化", body:"<strong>沉淀</strong>（静置沉降）→<strong>过滤</strong>（除去不溶性杂质，一贴二低三靠）→<strong>吸附</strong>（活性炭吸附色素和异味）→<strong>蒸馏</strong>（得到纯净水，净化程度最高）。<strong>硬水</strong>：含较多Ca²⁺、Mg²⁺，肥皂水起泡少浮渣多，煮沸可软化。<strong>软水</strong>：含较少Ca²⁺、Mg²⁺。" }
      ],
      formulas: [
        { expression:"2H₂O →通电 2H₂↑＋O₂↑", description:"电解水反应" }
      ],
      quizBank: [
        { id:"c-w-1", type:"single", difficulty:1, stem:"电解水时，正极产生的气体是？", options:[
          { key:"A", text:"氢气" },{ key:"B", text:"氧气" },{ key:"C", text:"氮气" },{ key:"D", text:"水蒸气" }
        ], answer:"B", explanation:"电解水：正极O₂（氧），负极H₂（氢），口诀：正氧负氢。" }
      ]
    },
    { id:"chem-formula", name:"四、化学式与化合价", order:4, estimatedMinutes:35, difficulty:2, priority:5, examWeight:"~8分",
      concepts: [
        { id:"chem-f-1", title:"元素符号与化合价", body:"常见元素化合价口诀：<strong>一价钾钠氯氢银，二价氧钙钡镁锌。三铝四硅五价磷，二三铁、二四碳。铜汞一二中间分。</strong>", highlight:true, children:[
          { title:"化合价规则", body:"单质化合价为0；化合物中正负化合价代数和为0；原子团（根）的化合价等于各元素化合价代数和。" },
          { title:"常见原子团", body:"OH⁻（氢氧根-1）、SO₄²⁻（硫酸根-2）、CO₃²⁻（碳酸根-2）、NO₃⁻（硝酸根-1）、NH₄⁺（铵根+1）、PO₄³⁻（磷酸根-3）" }
        ]},
        { id:"chem-f-2", title:"相对分子质量与元素质量分数", body:"相对分子质量=各原子相对原子质量之和。元素质量分数=该元素相对原子质量×原子个数/相对分子质量×100%。计算时注意化学式中的下标。" }
      ],
      quizBank: [
        { id:"c-f-1", type:"single", difficulty:2, stem:"在Fe₂O₃中铁元素的化合价为？", options:[
          { key:"A", text:"+1" },{ key:"B", text:"+2" },{ key:"C", text:"+3" },{ key:"D", text:"0" }
        ], answer:"C", explanation:"O的化合价为-2，3个O共-6，根据代数和为0，2个Fe共+6，每个Fe为+3。" }
      ]
    },
    { id:"chem-equation", name:"五、化学方程式（核心）", order:5, estimatedMinutes:45, difficulty:3, priority:5, examWeight:"~10分",
      concepts: [
        { id:"chem-e-1", title:"质量守恒定律", body:"参加化学反应的各物质的质量总和，等于反应后生成的各物质的质量总和。化学反应前后：原子种类不变、原子数目不变、原子质量不变（即<strong>原子三不变</strong>）。", highlight:true },
        { id:"chem-e-2", title:"化学方程式配平", body:"常用方法：<strong>最小公倍数法</strong>、观察法、奇数配偶法。步骤：写化学式→配平→标注条件（△/通电/催化剂）→标注↑（气体）↓（沉淀）→检查。" },
        { id:"chem-e-3", title:"四大基本反应类型", body:"<strong>化合反应</strong>：A+B→AB（多变一）。<strong>分解反应</strong>：AB→A+B（一变多）。<strong>置换反应</strong>：A+BC→AC+B（单换单）。<strong>复分解反应</strong>：AB+CD→AD+CB（互相交换成分）。复分解反应条件：生成物中有沉淀/气体/水。" }
      ],
      commonMistakes: [
        { wrong:"配平化学方程式时改变化学式下标", correct:"只能改变化学式前面的系数（化学计量数），不能改变化学式本身" }
      ],
      quizBank: [
        { id:"c-e-1", type:"single", difficulty:1, stem:"下列化学方程式中，属于置换反应的是？", options:[
          { key:"A", text:"2H₂+O₂→2H₂O" },{ key:"B", text:"CaCO₃→CaO+CO₂↑" },
          { key:"C", text:"Fe+CuSO₄→FeSO₄+Cu" },{ key:"D", text:"NaOH+HCl→NaCl+H₂O" }
        ], answer:"C", explanation:"铁置换铜，单质→新单质。A是化合反应，B是分解反应，D是复分解反应。" }
      ]
    },
    { id:"chem-carbon", name:"六、碳和碳的氧化物", order:6, estimatedMinutes:30, difficulty:2, priority:4, examWeight:"~6分",
      concepts: [
        { id:"chem-cb-1", title:"碳的单质", body:"<strong>金刚石</strong>：最硬的天然物质，无色透明，正八面体，不导电。<strong>石墨</strong>：深灰色，有金属光泽，导电，质软滑腻（铅笔芯、电极）。<strong>C₆₀</strong>：足球烯，由分子构成。它们都是碳元素组成的单质，但碳原子排列方式不同（<strong>同素异形体</strong>）。" },
        { id:"chem-cb-2", title:"CO₂与CO对比", body:"<strong>CO₂</strong>：无色无味，密度>空气，能溶于水（与水生成H₂CO₃），能使澄清石灰水变浑浊Ca(OH)₂+CO₂=CaCO₃↓+H₂O。不燃烧不支持燃烧，用于灭火。<strong>CO</strong>：无色无味，密度略小于空气，<strong>难溶于水</strong>，有<strong>毒性</strong>（与血红蛋白结合），可燃（蓝色火焰2CO+O₂→2CO₂），有还原性（炼铁Fe₂O₃+3CO→2Fe+3CO₂）。", children:[
          { title:"CO₂实验室制法", body:"CaCO₃（石灰石/大理石）+2HCl（稀盐酸）=CaCl₂+H₂O+CO₂↑。收集：向上排空气法。" }
        ]}
      ],
      formulas: [
        { expression:"Ca(OH)₂＋CO₂＝CaCO₃↓＋H₂O", description:"CO₂使石灰水变浑浊（检验CO₂）" },
        { expression:"CaCO₃＋2HCl＝CaCl₂＋H₂O＋CO₂↑", description:"实验室制取CO₂" }
      ],
      quizBank: [
        { id:"c-cb-1", type:"single", difficulty:1, stem:"检验CO₂气体常用的方法是？", options:[
          { key:"A", text:"用带火星木条" },{ key:"B", text:"通入澄清石灰水" },
          { key:"C", text:"闻气味" },{ key:"D", text:"观察颜色" }
        ], answer:"B", explanation:"CO₂能使澄清石灰水变浑浊，这是检验CO₂的特征反应。O₂用带火星木条检验。" }
      ]
    },
    { id:"chem-metal", name:"七、金属与金属材料", order:7, estimatedMinutes:35, difficulty:2, priority:4, examWeight:"~8分",
      concepts: [
        { id:"chem-m-1", title:"金属的物理性质", body:"大多数金属有金属光泽、导电性、导热性、延展性。常温下<strong>汞(Hg)是液体</strong>，其余金属是固体。" },
        { id:"chem-m-2", title:"金属活动性顺序（必背！）", body:"<strong>K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au</strong>", highlight:true, mnemonic:"钾钙钠镁铝，锌铁锡铅氢，铜汞银铂金。K最活泼，Au最不活泼。排在H前面的金属能与酸反应置换出H₂，排在后面的不能。" },
        { id:"chem-m-3", title:"铁的锈蚀与防护", body:"铁生锈条件：<strong>同时接触氧气和水</strong>。铁锈主要成分：Fe₂O₃·xH₂O（疏松多孔，不能阻止内部铁继续生锈）。防锈：刷漆、涂油、镀其他金属、制成不锈钢（合金）。" }
      ],
      commonMistakes: [
        { wrong:"铁锈能保护内部的铁", correct:"铁锈疏松多孔，空气和水可继续进入，加速生锈" }
      ],
      quizBank: [
        { id:"c-m-1", type:"single", difficulty:2, stem:"下列金属不能与稀盐酸反应生成氢气的是？", options:[
          { key:"A", text:"Fe 铁" },{ key:"B", text:"Zn 锌" },{ key:"C", text:"Cu 铜" },{ key:"D", text:"Mg 镁" }
        ], answer:"C", explanation:"铜排在H之后，不能与酸反应置换出H₂。" }
      ]
    },
    { id:"chem-acidbase", name:"八、溶液与酸碱盐基础（只做基础）", order:8, estimatedMinutes:40, difficulty:3, priority:4, examWeight:"~18分",
      concepts: [
        { id:"chem-ab-1", title:"溶液", body:"<strong>溶液</strong>：一种或几种物质分散到另一种物质中形成的均一、稳定的混合物。溶质：被溶解的物质。溶剂：能溶解其他物质的物质（水是最常见的溶剂）。溶液不一定是无色的（如CuSO₄溶液是蓝色）。" },
        { id:"chem-ab-2", title:"溶解度", body:"在一定温度下，某固体物质在100g溶剂里达到饱和状态时所溶解的质量。大多数固体物质的溶解度随温度升高而<strong>增大</strong>（如KNO₃），少数受温度影响不大（如NaCl），极少数随温度升高而减小（如Ca(OH)₂）。" },
        { id:"chem-ab-3", title:"溶质质量分数", body:"ω = m(溶质)/m(溶液) × 100%。溶液稀释前后溶质质量不变：m₁ω₁ = m₂ω₂。" },
        { id:"chem-ab-4", title:"酸碱盐基础概念（只记常见的）", body:"<strong>酸</strong>：H⁺ + 酸根离子。常见酸：HCl（盐酸）、H₂SO₄（硫酸）、HNO₃（硝酸）、H₂CO₃（碳酸，易分解）。<strong>碱</strong>：金属离子 + OH⁻。常见碱：NaOH（烧碱/苛性钠）、Ca(OH)₂（熟石灰/消石灰）。<strong>盐</strong>：金属离子 + 酸根离子。常见盐：NaCl（食盐）、Na₂CO₃（纯碱/苏打）、NaHCO₃（小苏打）、CaCO₃（大理石/石灰石的主要成分）。", highlight:true, mnemonic:"酸有H⁺，碱有OH⁻，盐是金属+酸根", children:[
          { title:"pH值", body:"pH<7酸性，pH=7中性，pH>7碱性。pH越小酸性越强，pH越大碱性越强。用pH试纸测定（粗略），不能直接把试纸浸入待测液！" },
          { title:"酸碱指示剂", body:"紫色石蕊：酸红碱蓝中不变。无色酚酞：酸不变碱变红。遇到中性和酸都不变色。" }
        ], commonMistake:"纯碱(Na₂CO₃)是碱 → 错误！纯碱是盐，水溶液显碱性所以叫「纯碱」" }
      ],
      formulas: [
        { expression:"ω = m(溶质)/m(溶液)×100%", description:"溶质质量分数", variables:{ω:"质量分数", m溶质:"溶质质量(g)", m溶液:"溶液质量(g)"} }
      ],
      quizBank: [
        { id:"c-ab-1", type:"single", difficulty:1, stem:"下列物质属于酸的是？", options:[
          { key:"A", text:"NaOH" },{ key:"B", text:"NaCl" },{ key:"C", text:"H₂SO₄" },{ key:"D", text:"Na₂CO₃" }
        ], answer:"C", explanation:"H₂SO₄在水中电离出H⁺，属于酸。A是碱，B和D是盐。" }
      ]
    }
  ]
},

// ==================== 数学 (120分) ====================
math: {
  id:"math", name:"数学", fullScore:120, icon:"📐", color:"#FF9800",
  units: [
    { id:"math-number", name:"一、实数与运算", order:1, estimatedMinutes:35, difficulty:1, priority:5, examWeight:"~15分",
      concepts: [
        { id:"math-n-1", title:"实数分类与基本概念", body:"<strong>有理数</strong>：整数和分数（有限/无限循环小数）。<strong>无理数</strong>：无限不循环小数（π、√2、√3）。<strong>相反数</strong>：a+b=0则a与b互为相反数。<strong>绝对值</strong>：|a|=a(a≥0)，|a|=-a(a<0)。几何意义：到原点的距离。|a|≥0，最小值是0。" },
        { id:"math-n-2", title:"科学记数法", body:"写成<strong>a×10ⁿ</strong>（1≤|a|<10）。n>0表示大数（整数位数-1），n<0表示小数。" },
        { id:"math-n-3", title:"二次根式", body:"√a（a≥0）。性质：(√a)²=a；√a²=<strong>|a|</strong>（易错！）；√a·√b=√(ab)；√a/√b=√(a/b)。最简二次根式：被开方数不含分母，不含能开尽方的因数。" }
      ],
      commonMistakes:[{ wrong:"√(a²)=a", correct:"√(a²)=|a|。如√((-3)²)=3≠-3" }],
      quizBank:[
        { id:"m-n-1", type:"single", difficulty:1, stem:"√16的值为？", options:[{ key:"A", text:"±4" },{ key:"B", text:"4" },{ key:"C", text:"2" },{ key:"D", text:"±2" }], answer:"B", explanation:"√16=4（算术平方根）。问16的平方根才是±4。" }
      ]
    },
    { id:"math-algebra", name:"二、整式与因式分解", order:2, estimatedMinutes:30, difficulty:1, priority:4, examWeight:"~8分",
      concepts: [
        { id:"math-a-1", title:"幂运算法则", body:"<strong>同底数幂乘</strong>：aᵐ·aⁿ=aᵐ⁺ⁿ。<strong>同底数幂除</strong>：aᵐ÷aⁿ=aᵐ⁻ⁿ。<strong>幂的乘方</strong>：(aᵐ)ⁿ=aᵐⁿ。<strong>积的乘方</strong>：(ab)ⁿ=aⁿbⁿ。<strong>零指数</strong>：a⁰=1（a≠0）。<strong>负指数</strong>：a⁻ⁿ=1/aⁿ。", mnemonic:"乘加除减，乘方相乘", highlight:true },
        { id:"math-a-2", title:"乘法公式（必背）", body:"<strong>平方差</strong>：(a+b)(a−b)=a²−b²。<strong>完全平方</strong>：(a±b)²=a²±2ab+b²。", commonMistake:"(a+b)²≠a²+b²，中间项2ab不能丢！" },
        { id:"math-a-3", title:"因式分解步骤", body:"①提公因式→②套公式（平方差/完全平方）→③分组分解→④检查到不能再分为止。" }
      ],
      formulas:[
        { expression:"(a+b)(a−b)=a²−b²", description:"平方差" },
        { expression:"(a±b)²=a²±2ab+b²", description:"完全平方" }
      ],
      quizBank:[
        { id:"m-a-1", type:"single", difficulty:1, stem:"(x+3)²展开为？", options:[{ key:"A", text:"x²+9" },{ key:"B", text:"x²+6x+9" },{ key:"C", text:"x²+3x+9" },{ key:"D", text:"x²−6x+9" }], answer:"B", explanation:"完全平方公式：x²+2·x·3+3²=x²+6x+9。别丢2ab。" }
      ]
    },
    { id:"math-equation", name:"三、方程与不等式", order:3, estimatedMinutes:50, difficulty:2, priority:5, examWeight:"~18分",
      concepts: [
        { id:"math-eq-1", title:"一元一次方程", body:"ax+b=0（a≠0），解为x=−b/a。" },
        { id:"math-eq-2", title:"二元一次方程组", body:"解法：<strong>代入消元法</strong>和<strong>加减消元法</strong>。核心思想：消元化为一元。" },
        { id:"math-eq-3", title:"一元二次方程⭐", body:"ax²+bx+c=0（a≠0）。<strong>求根公式：x=[−b±√(b²−4ac)]/(2a)</strong>。Δ>0两不等实根；Δ=0两相等实根；Δ<0无实根。四种解法：直接开平方法、配方法、公式法、因式分解法。", highlight:true, mnemonic:"负b±根Δ，除以2a", commonMistake:"求根公式写作(b±√Δ)/2a，漏了负号！应为−b。" },
        { id:"math-eq-4", title:"不等式（组）", body:"两边同乘除以<strong>负数</strong>时，<strong>不等号方向改变</strong>（最易错！）。解不等式组：取各解集的公共部分。" }
      ],
      formulas:[{ expression:"x = [−b±√(b²−4ac)]/(2a)", description:"一元二次求根公式" }],
      quizBank:[
        { id:"m-e-1", type:"single", difficulty:2, stem:"x²−5x+6=0的解为？", options:[{ key:"A", text:"2或3" },{ key:"B", text:"−2或−3" },{ key:"C", text:"2或−3" },{ key:"D", text:"1或6" }], answer:"A", explanation:"因式分解(x−2)(x−3)=0，x=2或3。" }
      ]
    },
    { id:"math-function1", name:"四、一次函数与反比例函数", order:4, estimatedMinutes:45, difficulty:2, priority:5, examWeight:"~15分",
      concepts: [
        { id:"math-f1-1", title:"一次函数 y=kx+b（k≠0）", body:"图像：直线。k>0上升，k<0下降。|k|越大越陡。b是y轴截距。<strong>两点求k=(y₂−y₁)/(x₂−x₁)</strong>。", highlight:true },
        { id:"math-f1-2", title:"反比例函数 y=k/x（k≠0）", body:"图像：双曲线。k>0在一三象限；k<0在二四象限。<strong>|k|=过曲线上点作两轴垂线围成的矩形面积</strong>（重要几何意义）。" }
      ],
      formulas:[
        { expression:"k = (y₂−y₁)/(x₂−x₁)", description:"一次函数斜率" },
        { expression:"S = |k|", description:"反比例函数k的几何意义" }
      ],
      quizBank:[
        { id:"m-f-1", type:"single", difficulty:1, stem:"y=−2x+1的图像不经过第几象限？", options:[{ key:"A", text:"一" },{ key:"B", text:"二" },{ key:"C", text:"三" },{ key:"D", text:"四" }], answer:"C", explanation:"k<0下降过二四象限，b>0向上平移过第一象限，所以过一二四，不过三。" }
      ]
    },
    { id:"math-function2", name:"五、二次函数基础（浅做）", order:5, estimatedMinutes:35, difficulty:3, priority:3, examWeight:"~12分",
      concepts: [
        { id:"math-f2-1", title:"一般式 y=ax²+bx+c（a≠0）", body:"图像：抛物线。a>0开口向上；a<0开口向下。对称轴：<strong>x=−b/(2a)</strong>。顶点：(−b/(2a), (4ac−b²)/(4a))。", highlight:true },
        { id:"math-f2-2", title:"顶点式 y=a(x−h)²+k", body:"顶点(h,k)，x=h时y最值=k。配方法转化一般式为顶点式。" }
      ],
      formulas:[
        { expression:"x=−b/(2a)", description:"对称轴" },
        { expression:"y=(4ac−b²)/(4a)", description:"顶点纵坐标" }
      ],
      quizBank:[
        { id:"m-f2-1", type:"single", difficulty:2, stem:"y=x²−4x+3的顶点是？", options:[{ key:"A", text:"(2,−1)" },{ key:"B", text:"(−2,15)" },{ key:"C", text:"(2,1)" },{ key:"D", text:"(1,0)" }], answer:"A", explanation:"配方y=(x−2)²−1，顶点(2,−1)。" }
      ]
    },
    { id:"math-triangle", name:"六、三角形与勾股定理", order:6, estimatedMinutes:45, difficulty:2, priority:5, examWeight:"~12分",
      concepts: [
        { id:"math-t-1", title:"三角形基础", body:"内角和=180°。外角=不相邻两内角之和。三边：任意两边之和>第三边。" },
        { id:"math-t-2", title:"全等三角形判定（5种）", body:"<strong>SSS、SAS、ASA、AAS、HL</strong>（HL仅适用于直角三角形）。", highlight:true, mnemonic:"SSS、SAS、ASA、AAS、HL——记住五种判定" },
        { id:"math-t-3", title:"等腰三角形", body:"等边对等角，等角对等边。<strong>三线合一</strong>：顶角平分线=底边中线=底边高线。" },
        { id:"math-t-4", title:"勾股定理⭐", body:"<strong>a²+b²=c²</strong>（a,b直角边，c斜边）。常见勾股数：<strong>{3,4,5}、{6,8,10}、{5,12,13}、{7,24,25}</strong>。", highlight:true },
        { id:"math-t-5", title:"锐角三角函数", body:"sinA=对边/斜边，cosA=邻边/斜边，tanA=对边/邻边。<strong>30°：½,√3/2,√3/3；45°：√2/2,√2/2,1；60°：√3/2,½,√3</strong>。", mnemonic:"30度123，45度222，60度321（sin值）" }
      ],
      formulas:[
        { expression:"a²+b²=c²", description:"勾股定理" },
        { expression:"sinA=对/斜 cosA=邻/斜 tanA=对/邻", description:"三角函数" }
      ],
      quizBank:[
        { id:"m-t-1", type:"single", difficulty:1, stem:"能构成直角三角形的是？", options:[{ key:"A", text:"1,2,3" },{ key:"B", text:"6,8,10" },{ key:"C", text:"5,6,7" },{ key:"D", text:"2,3,5" }], answer:"B", explanation:"6²+8²=36+64=100=10²。1+2=3不构成三角形。" }
      ]
    },
    { id:"math-quad", name:"七、四边形", order:7, estimatedMinutes:30, difficulty:2, priority:4, examWeight:"~8分",
      concepts: [
        { id:"math-q-1", title:"平行四边形", body:"对边平行且相等，对角相等，对角线互相平分。判定：两组对边分别平行/相等，或一组对边平行且相等，或对角线互相平分。" },
        { id:"math-q-2", title:"矩形/菱形/正方形", body:"<strong>矩形</strong>：四个直角，对角线相等。<strong>菱形</strong>：四边相等，对角线垂直且平分对角。<strong>正方形</strong>：兼具矩形和菱形全部性质。" }
      ],
      quizBank:[
        { id:"m-q-1", type:"single", difficulty:1, stem:"矩形独有而一般平行四边形没有的性质？", options:[{ key:"A", text:"对边相等" },{ key:"B", text:"对角线相等" },{ key:"C", text:"对角相等" },{ key:"D", text:"对角线互相平分" }], answer:"B", explanation:"对角线相等是矩形特有。A、C、D是平行四边形共有性质。" }
      ]
    },
    { id:"math-circle", name:"八、圆的基础（浅做）", order:8, estimatedMinutes:30, difficulty:3, priority:3, examWeight:"~8分",
      concepts: [
        { id:"math-cir-1", title:"垂径定理", body:"垂直于弦的直径平分弦且平分弦所对的两条弧。" },
        { id:"math-cir-2", title:"圆周角定理", body:"同弧所对圆周角=圆心角的一半。直径所对圆周角=<strong>90°</strong>。同弧或等弧所对圆周角相等。" },
        { id:"math-cir-3", title:"切线", body:"切线垂直于过切点的半径。判定：过半径外端且垂直于该半径的直线是切线。" }
      ],
      quizBank:[
        { id:"m-cir-1", type:"single", difficulty:2, stem:"圆直径10，弦AB=8，圆心到弦的距离为？", options:[{ key:"A", text:"6" },{ key:"B", text:"3" },{ key:"C", text:"4" },{ key:"D", text:"5" }], answer:"B", explanation:"r=5，弦一半=4，距离=√(25−16)=3。" }
      ]
    },
    { id:"math-stats", name:"九、统计与概率", order:9, estimatedMinutes:30, difficulty:1, priority:5, examWeight:"~10分",
      concepts: [
        { id:"math-s-1", title:"平均数/中位数/众数", body:"<strong>平均数</strong>受极端值影响。<strong>中位数</strong>不受极端值影响（排序后中间位置）。<strong>众数</strong>出现次数最多，可能不唯一。" },
        { id:"math-s-2", title:"方差", body:"<strong>S²=1/n·Σ(xᵢ−x̄)²</strong>。方差越小数据越<strong>稳定</strong>。标准差=√方差。" },
        { id:"math-s-3", title:"概率", body:"<strong>P(A)=m/n</strong>（等可能事件）。求法：<strong>列表法</strong>（两步）、<strong>树状图</strong>（多步）。概率范围：0≤P≤1。" }
      ],
      formulas:[
        { expression:"S² = 1/n·Σ(xi−x̄)²", description:"方差" },
        { expression:"P(A) = m/n", description:"概率（等可能）" }
      ],
      quizBank:[
        { id:"m-s-1", type:"single", difficulty:1, stem:"数据2,3,3,5,7的中位数是？", options:[{ key:"A", text:"2" },{ key:"B", text:"3" },{ key:"C", text:"4" },{ key:"D", text:"5" }], answer:"B", explanation:"从小到大：2,3,3,5,7，5个数中间是第3个=3。" }
      ]
    },
    { id:"math-transform", name:"十、图形变换", order:10, estimatedMinutes:25, difficulty:1, priority:3, examWeight:"~6分",
      concepts: [
        { id:"math-tr-1", title:"平移", body:"图形沿方向移动，不改变形状大小。对应点连线平行且相等。" },
        { id:"math-tr-2", title:"轴对称", body:"沿对称轴折叠后重合。对称轴是对应点连线的<strong>垂直平分线</strong>。" },
        { id:"math-tr-3", title:"旋转与中心对称", body:"绕某点旋转后重合。<strong>中心对称</strong>：旋转180°后重合。常见中心对称图形：平行四边形、矩形、菱形、正方形、圆。" }
      ],
      quizBank:[
        { id:"m-tr-1", type:"single", difficulty:1, stem:"既是轴对称又是中心对称的是？", options:[{ key:"A", text:"等腰三角形" },{ key:"B", text:"平行四边形" },{ key:"C", text:"正方形" },{ key:"D", text:"直角三角形" }], answer:"C", explanation:"正方形4条对称轴+中心对称。等腰三角形仅轴对称。一般平行四边形仅中心对称。" }
      ]
    }
  ]
},

// ==================== 语文 (120分) ====================
chinese: {
  id:"chinese", name:"语文", fullScore:120, icon:"📖", color:"#E91E63",
  units: [
    { id:"cn-poem", name:"一、古诗文默写（30首高频）", order:1, estimatedMinutes:60, difficulty:2, priority:5, examWeight:"~10分",
      concepts: [
        { id:"cn-p-1", title:"七年级必背重点句", body:"<strong>《观沧海》曹操</strong>：日月之行，若出其中；星汉灿烂，若出其里。<br><strong>《次北固山下》王湾</strong>：海日生残夜，江春入旧年。<br><strong>《天净沙·秋思》马致远</strong>：枯藤老树昏鸦，小桥流水人家，古道西风瘦马。<br><strong>《论语》</strong>：学而不思则罔，思而不学则殆。三人行，必有我师焉。" },
        { id:"cn-p-2", title:"八年级必背重点句", body:"<strong>《桃花源记》陶渊明</strong>：土地平旷，屋舍俨然。<br><strong>《陋室铭》刘禹锡</strong>：山不在高，有仙则名。水不在深，有龙则灵。<br><strong>《爱莲说》周敦颐</strong>：出淤泥而不染，濯清涟而不妖。<br><strong>《望岳》杜甫</strong>：会当凌绝顶，一览众山小。<br><strong>《春望》杜甫</strong>：感时花溅泪，恨别鸟惊心。" },
        { id:"cn-p-3", title:"九年级必背重点句", body:"<strong>《岳阳楼记》范仲淹</strong>：先天下之忧而忧，后天下之乐而乐。<br><strong>《醉翁亭记》欧阳修</strong>：醉翁之意不在酒，在乎山水之间也。<br><strong>《行路难》李白</strong>：长风破浪会有时，直挂云帆济沧海。<br><strong>《水调歌头》苏轼</strong>：但愿人长久，千里共婵娟。<br><strong>《出师表》诸葛亮</strong>：受任于败军之际，奉命于危难之间。", mnemonic:"理解意思再背！默写错一字整句无分，多检查！" }
      ],
      quizBank:[
        { id:"cn-p-1", type:"single", difficulty:1, stem:'"海日生残夜，江春入旧年"出自？', options:[{ key:"A", text:"《观沧海》" },{ key:"B", text:"《次北固山下》" },{ key:"C", text:"《春望》" },{ key:"D", text:"《行路难》" }], answer:"B", explanation:"王湾《次北固山下》。考查作者与篇名对应。" }
      ]
    },
    { id:"cn-classical", name:"二、文言文：50实词+10虚词", order:2, estimatedMinutes:50, difficulty:3, priority:5, examWeight:"~15分",
      concepts: [
        { id:"cn-c-1", title:"10个高频虚词（必掌握）", body:"<strong>之</strong>（的/去/代词/无义取独）<strong>而</strong>（并列/承接/转折/修饰）<strong>以</strong>（用/凭借/因为/来）<strong>其</strong>（他的/那个/其中的/难道）<strong>于</strong>（在/比/被/对）<strong>乃</strong>（于是/竟然/就是）<strong>则</strong>（就/却/就是）<strong>者</strong>（…的人/句中停顿）<strong>所</strong>（…的地方/为…所被动）<strong>也</strong>（判断/陈述/疑问语气）", highlight:true },
        { id:"cn-c-2", title:"常见古今异义实词", body:"<strong>去</strong>古义离开（去国怀乡）/<strong>走</strong>古义跑（走送之）/<strong>汤</strong>古义热水（汤池）/<strong>或</strong>古义有的人/<strong>是</strong>古义这/<strong>顾</strong>古义回头看/<strong>会</strong>古义适逢/<strong>间</strong>古义参与、暗中/<strong>绝</strong>古义极、断/<strong>良</strong>古义很、的确。", mnemonic:"古义≠今义！翻译时优先考虑古义。" }
      ],
      quizBank:[
        { id:"cn-c-1", type:"single", difficulty:2, stem:'"去国怀乡"中"去"的意思是？', options:[{ key:"A", text:"前往" },{ key:"B", text:"离开" },{ key:"C", text:"去除" },{ key:"D", text:"距离" }], answer:"B", explanation:'古义"去"是离开。"去国怀乡"=离开国都，怀念家乡。' }
      ]
    },
    { id:"cn-reading", name:"三、现代文阅读·答题模板", order:3, estimatedMinutes:45, difficulty:3, priority:5, examWeight:"~30分",
      concepts: [
        { id:"cn-r-1", title:"赏析题（修辞手法）模板", body:"运用了<strong>【修辞】</strong>，将【XX】…，<strong>生动形象地写出了</strong>【内容】，<strong>表达了</strong>【情感/特点】。", highlight:true, mnemonic:"修辞+内容+情感，三步必答" },
        { id:"cn-r-2", title:"含义题模板", body:"<strong>表层含义</strong>（字面/事件本身）+<strong>深层含义</strong>（引申义/象征义/情感/主旨）。", highlightText:"答题格式：表面上指…，实际上指/表达了…" },
        { id:"cn-r-3", title:"作用题模板", body:"<strong>内容上</strong>：写了…表达了…。<strong>结构上</strong>：开头（总领/铺垫/设悬）、中间（承上启下）、结尾（总结/点题/呼应/留白）。" },
        { id:"cn-r-4", title:"概括题方法", body:"<strong>谁+做了什么+结果</strong>。找每段首句/尾句/过渡句，用原文关键词概括。" }
      ],
      quizBank:[
        { id:"cn-r-1", type:"single", difficulty:2, stem:"现代文阅读中赏析句子的答题模板是？", options:[{ key:"A", text:"只用说运用了什么修辞" },{ key:"B", text:"修辞+内容+情感三步" },{ key:"C", text:"直接抄原文" },{ key:"D", text:"只写自己的感受" }], answer:"B", explanation:"赏析题三步法：修辞手法+写了什么内容+表达了什么情感。" },
        { id:"cn-r-2", type:"single", difficulty:2, stem:"作用题中，开头段在结构上的作用通常是？", options:[{ key:"A", text:"总结全文" },{ key:"B", text:"承上启下" },{ key:"C", text:"总领全文/铺垫/设悬" },{ key:"D", text:"点题" }], answer:"C", explanation:"开头段结构作用主要是总领全文、做铺垫或设置悬念。B是中间段，A/D是结尾段。" }
      ]
    }, { id:"cn-basics", name:"四、基础运用：字音字形+成语", order:4, estimatedMinutes:35, difficulty:1, priority:5, examWeight:"~10分",
      concepts: [
        { id:"cn-b-1", title:"高频易错字音30组", body:"狭隘<strong>ài</strong>(非yì)、包庇<strong>bì</strong>(非pì)、粗糙<strong>cāo</strong>(非zào)、刽子手<strong>guì</strong>(非kuài)、畸形<strong>jī</strong>(非qí)、发酵<strong>jiào</strong>(非xiào)、质量<strong>zhì</strong>(非zhǐ)、比较<strong>jiào</strong>(非jiǎo)、处理<strong>chǔ</strong>(非chù)、逮捕<strong>dài</strong>(非dǎi)……" },
        { id:"cn-b-2", title:"高频易错字形20组", body:"再接再<strong>厉</strong>(非励)、川流不<strong>息</strong>(非穿)、不<strong>胫</strong>而走(非径)、一<strong>鼓</strong>作气(非股)、迫不<strong>及</strong>待(非急)、<strong>墨</strong>守成规(非默)、出奇<strong>制</strong>胜(非致)、一<strong>筹</strong>莫展(非愁)。" },
        { id:"cn-b-3", title:"成语易错类型", body:"<strong>望文生义</strong>：差强人意=大体使人满意（非不满意）。<strong>褒贬误用</strong>：无所不为=什么坏事都干（贬义）。<strong>对象误用</strong>：豆蔻年华=专指十三四岁少女。" }
      ],
      quizBank:[
        { id:"cn-b-1", type:"single", difficulty:1, stem:"下列字形完全正确的是？", options:[{ key:"A", text:"再接再励" },{ key:"B", text:"川流不息" },{ key:"C", text:"不径而走" },{ key:"D", text:"出奇致胜" }], answer:"B", explanation:"正确：再接再厉、川流不息、不胫而走、出奇制胜。川流不息意为像河水一样流个不停。" },
        { id:"cn-b-2", type:"single", difficulty:1, stem:'"差强人意"的意思是？', options:[{ key:"A", text:"让人很不满意" },{ key:"B", text:"大体使人满意" },{ key:"C", text:"强迫别人" },{ key:"D", text:"差别很大" }], answer:"B", explanation:"差强人意意为大体上还能使人满意，不是不满意。这是最易望文生义的成语之一。" }
      ]
    }, { id:"cn-books", name:"五、名著阅读（6本必读概要）", order:5, estimatedMinutes:40, difficulty:2, priority:4, examWeight:"~10分",
      concepts: [
        { id:"cn-bk-1", title:"《西游记》吴承恩", body:"唐僧师徒四人西天取经。孙悟空（齐天大圣、七十二变）、猪八戒、沙僧。<strong>情节</strong>：大闹天宫→三打白骨精→真假美猴王→三借芭蕉扇。", mnemonic:"八十一难取真经" },
        { id:"cn-bk-2", title:"《水浒传》施耐庵", body:"官逼民反。宋江（及时雨）、林冲（豹子头，风雪山神庙逼上梁山）、武松（行者，景阳冈打虎）、鲁智深（花和尚，倒拔垂杨柳）、李逵（黑旋风）。" },
        { id:"cn-bk-3", title:"《朝花夕拾》鲁迅", body:"回忆性散文集。<strong>《阿长与山海经》</strong>（长妈妈）、<strong>《从百草园到三味书屋》</strong>（童年与私塾）、<strong>《藤野先生》</strong>（师生情谊）、<strong>《五猖会》</strong>（封建教育对儿童的压制）。" },
        { id:"cn-bk-4", title:"《骆驼祥子》老舍", body:"祥子：北平人力车夫，经历<strong>三起三落</strong>，最终从勤劳善良堕落为行尸走肉。主题：旧社会对人的摧残。" },
        { id:"cn-bk-5", title:"《海底两万里》凡尔纳", body:"尼摩船长驾<strong>诺第留斯号</strong>潜艇海底探险。科幻与探险主题。" },
        { id:"cn-bk-6", title:"《钢铁是怎样炼成的》", body:"<strong>保尔·柯察金</strong>：从顽皮少年→红军战士→筑路工人→瘫痪失明后写作。名言：「不因虚度年华而悔恨……」" }
      ],
      quizBank:[
        { id:"cn-bk-1", type:"single", difficulty:1, stem:"《骆驼祥子》中祥子的最终结局是？", options:[{ key:"A", text:"买车成为车主" },{ key:"B", text:"回乡种地" },{ key:"C", text:"堕落为行尸走肉" },{ key:"D", text:"参加革命" }], answer:"C", explanation:"三起三落后祥子彻底堕落。" }
      ]
    },
    { id:"cn-writing", name:"六、作文·万能框架", order:6, estimatedMinutes:50, difficulty:3, priority:5, examWeight:"~40分",
      concepts: [
        { id:"cn-w-1", title:"记叙文结构", body:"<strong>开头(凤头)60-80字</strong>：环境描写/引用名言/设置悬念。<br><strong>中间(猪肚)400-500字</strong>：1-2件事，详略得当，每件事=起因→经过(详写)→结果。加细节描写（动作/语言/神态/心理）。<br><strong>结尾(豹尾)60-80字</strong>：首尾呼应/升华主题/引发共鸣。", highlight:true },
        { id:"cn-w-2", title:"5种万能开头", body:"①环境式：那天，阳光…+我的心情。②回忆式：每当…，就会想起…③设问式：什么是真正的…？④引用式：「…」这句话…⑤画面式：那一刻，…（特写镜头）" },
        { id:"cn-w-3", title:"5种万能结尾", body:"①首尾呼应：如今，…（呼应但有变化）。②抒情升华：…让我明白…③展望式：带着这份…，我将…④留白式：…（一个画面结束）。⑤感悟式：这看似…的事，让我领悟到…", mnemonic:"记叙文关键：真情实感+具体细节！说「妈妈很累」不如写「妈妈靠在沙发上睡着了，手里还握着我的作业本」" }
      ],
      quizBank:[
        { id:"cn-w-1", type:"single", difficulty:1, stem:"中考作文最推荐的文体是？", options:[{ key:"A", text:"议论文" },{ key:"B", text:"记叙文" },{ key:"C", text:"说明文" },{ key:"D", text:"诗歌" }], answer:"B", explanation:"中考作文首选记叙文，写自己亲身经历的事，真情实感最能打动人。" },
        { id:"cn-w-2", type:"single", difficulty:2, stem:"记叙文结尾不推荐的方式是？", options:[{ key:"A", text:"首尾呼应" },{ key:"B", text:"抒情升华" },{ key:"C", text:"突然结束不写结尾" },{ key:"D", text:"感悟式" }], answer:"C", explanation:"作文不写结尾是大忌，会被扣分。" }
      ]
    }
  ]
},

// ==================== 历史 (75分) ====================
history: {
  id:"history", name:"历史", fullScore:75, icon:"📜", color:"#795548",
  units: [
    { id:"hist-ancient", name:"一、中国古代史", order:1, estimatedMinutes:55, difficulty:2, priority:5, examWeight:"~25分",
      concepts: [
        { id:"hist-a-1", title:"朝代顺序（必背）", body:"<strong>夏商周→秦→汉→三国→两晋→南北朝→隋→唐→五代→宋→元→明→清</strong>", highlight:true, children:[
          { title:"秦朝重点", body:"前221年秦始皇统一六国，建立第一个中央集权封建王朝。统一文字货币度量衡、修长城、焚书坑儒。陈胜吴广起义（第一次大规模农民起义）。" },
          { title:"汉朝重点", body:"汉武帝：推恩令、罢黜百家独尊儒术（董仲舒）、张骞出使西域开丝绸之路。东汉蔡伦改进造纸术。司马迁《史记》。" },
          { title:"唐朝重点", body:"贞观之治（唐太宗）、开元盛世（唐玄宗）、科举制完善、安史之乱（由盛转衰）。唐诗：李白、杜甫、白居易。", mnemonic:"唐太宗贞观、唐玄宗开元——必考盛世" },
          { title:"宋元明清", body:"宋：活字印刷（毕昇）、经济重心南移完成。元：行省制、回族形成。明：朱元璋废丞相、郑和下西洋、八股取士。清：军机处、闭关锁国→1840鸦片战争。" }
        ]}
      ],
      quizBank:[
        { id:"h-a-1", type:"single", difficulty:1, stem:"中国第一个统一的中央集权封建王朝？", options:[{ key:"A", text:"夏朝" },{ key:"B", text:"商朝" },{ key:"C", text:"秦朝" },{ key:"D", text:"汉朝" }], answer:"C", explanation:"秦始皇统一六国建立秦朝。" },
        { id:"h-a-2", type:"single", difficulty:1, stem:'建议"罢黜百家独尊儒术"的是？', options:[{ key:"A", text:"张骞" },{ key:"B", text:"董仲舒" },{ key:"C", text:"司马迁" },{ key:"D", text:"诸葛亮" }], answer:"B", explanation:"董仲舒向汉武帝建议，使儒家成为正统。" }
      ]
    },
    { id:"hist-modern", name:"二、中国近代史（1840-1949）", order:2, estimatedMinutes:50, difficulty:3, priority:5, examWeight:"~20分",
      concepts: [
        { id:"hist-m-1", title:"近代大事时间轴（必背）", body:"<strong>1840</strong>鸦片战争→<strong>1842</strong>《南京条约》（割香港岛，开五口）→<strong>1860s</strong>洋务运动（自强求富）→<strong>1898</strong>戊戌变法→<strong>1911</strong>辛亥革命（推翻清朝，结束封建帝制）→<strong>1919</strong>五四运动（新民主主义开端）→<strong>1921</strong>中共成立→<strong>1931</strong>九一八→<strong>1937</strong>七七事变（全面抗战）→<strong>1945</strong>抗战胜利→<strong>1949</strong>新中国成立。", highlight:true, mnemonic:"40鸦62约60洋98戊11辛19五21共31九37七45胜49建" },
        { id:"hist-m-2", title:"辛亥革命·孙中山", body:"<strong>三民主义</strong>：民族（驱除鞑虏恢复中华）、民权（创立民国）、民生（平均地权）。<strong>武昌起义</strong>1911.10.10。意义：推翻清朝、结束<strong>两千年封建帝制</strong>、建立中华民国。" },
        { id:"hist-m-3", title:"抗日战争（1931-1945）", body:"九一八→东北沦陷。<strong>七七事变</strong>→全民族抗战开始。<strong>南京大屠杀</strong>（1937.12，30万同胞）。平型关大捷（首次大捷）、台儿庄战役（正面战场最大胜利）、百团大战（彭德怀）。<strong>1945.8.15</strong>日本投降。抗战胜利根本原因：<strong>全民族抗战（抗日民族统一战线）</strong>。" }
      ],
      quizBank:[
        { id:"h-m-1", type:"single", difficulty:2, stem:"辛亥革命最重要的历史意义？", options:[{ key:"A", text:"推翻了帝国主义" },{ key:"B", text:"结束两千年封建帝制" },{ key:"C", text:"标志着近代化开端" },{ key:"D", text:"使中国走上社会主义" }], answer:"B", explanation:"辛亥革命结束封建帝制建立中华民国。A未推翻帝国主义。C是洋务运动。" }
      ]
    },
    { id:"hist-contemp", name:"三、中国现代史", order:3, estimatedMinutes:30, difficulty:1, priority:4, examWeight:"~10分",
      concepts: [
        { id:"hist-c-1", title:"新中国成立与建设", body:"<strong>1949.10.1</strong>新中国成立。1950-1953抗美援朝。<strong>1978</strong>十一届三中全会：以经济建设为中心，<strong>改革开放</strong>。家庭联产承包责任制（安徽凤阳小岗村）。1980经济特区（深圳等）。", mnemonic:"1978改革，1980特区——记住两个关键年" },
        { id:"hist-c-2", title:"一国两制与回归", body:"<strong>邓小平</strong>提出一国两制。<strong>1997</strong>香港回归，<strong>1999</strong>澳门回归。2001加入WTO。" }
      ],
      quizBank:[
        { id:"h-c-1", type:"single", difficulty:1, stem:"中国改革开放开始于哪一年？", options:[{ key:"A", text:"1949年" },{ key:"B", text:"1978年" },{ key:"C", text:"1980年" },{ key:"D", text:"1992年" }], answer:"B", explanation:"1978年十一届三中全会提出改革开放。1980年设立经济特区。" },
        { id:"h-c-2", type:"truefalse", difficulty:1, stem:"香港回归的时间是1999年。", answer:"B", explanation:"错误。香港1997年回归，澳门是1999年回归。" }
      ]
    }, { id:"hist-world", name:"四、世界史重点", order:4, estimatedMinutes:45, difficulty:2, priority:4, examWeight:"~20分",
      concepts: [
        { id:"hist-w-1", title:"世界古代文明", body:"古埃及：金字塔。古巴比伦：《汉谟拉比法典》（第一部成文法典）。古印度：种姓制度、佛教。古希腊：雅典民主政治（伯里克利时代）。" },
        { id:"hist-w-2", title:"文艺复兴与资产阶级革命", body:"<strong>文艺复兴</strong>核心：<strong>人文主义</strong>。但丁《神曲》、达·芬奇《蒙娜丽莎》、莎士比亚。<strong>英国资产阶级革命</strong>：《权利法案》确立君主立宪。<strong>美国独立战争</strong>：《独立宣言》（1776.7.4）、《1787宪法》（三权分立）。<strong>法国大革命</strong>：《人权宣言》、拿破仑《法典》。" },
        { id:"hist-w-3", title:"工业革命与世界大战", body:"<strong>第一次工业革命</strong>：瓦特改良蒸汽机→蒸汽时代。<strong>第二次工业革命</strong>：电力+内燃机。<strong>一战</strong>（1914-1918）：萨拉热窝导火索。<strong>二战</strong>（1939-1945）：1939德国闪击波兰。1942反法西斯同盟形成。1945联合国成立。<strong>冷战</strong>：北约vs华约。1991苏联解体冷战结束。", mnemonic:"一工蒸汽机，二工电力；一战萨拉热窝，二战闪击波兰" }
      ],
      quizBank:[
        { id:"h-w-1", type:"single", difficulty:1, stem:"文艺复兴的核心思想是？", options:[{ key:"A", text:"理性主义" },{ key:"B", text:"人文主义" },{ key:"C", text:"自由主义" },{ key:"D", text:"民主主义" }], answer:"B", explanation:"文艺复兴核心是人文主义（以人为中心）。理性主义是启蒙运动的核心。" }
      ]
    }
  ]
},

// ==================== 道法 (75分) ====================
daofa: {
  id:"daofa", name:"道法", fullScore:75, icon:"⚖️", color:"#607D8B",
  units: [
    { id:"df-self", name:"一、成长中的我", order:1, estimatedMinutes:30, difficulty:1, priority:4, examWeight:"~12分",
      concepts: [
        { id:"df-s-1", title:"认识自己", body:"正确认识自己：<strong>自我评价+他人评价</strong>。接纳自己需要接纳全部——优点和缺点。做更好的自己：扬长避短+主动改正缺点+激发潜能。", mnemonic:"自评+他评=认识自己" },
        { id:"df-s-2", title:"情绪管理", body:"情绪的种类：喜、怒、哀、惧（基本情绪）。调节情绪的方法：改变认知评价、转移注意、合理宣泄、放松训练。情绪具有感染性，要学会表达和调节情绪。" },
        { id:"df-s-3", title:"面对挫折", body:"挫折是人生的一部分。如何面对：①正确认识挫折（不逃避）；②分析原因；③寻求帮助；④坚持努力。挫折具有两面性——可以是绊脚石也可以是垫脚石。" },
        { id:"df-s-4", title:"生命的思考", body:"生命的特点：来之不易、独特、不可逆、短暂。敬畏生命：生命至上，休戚与共。实现生命价值：对自己负责+对他人和社会有所贡献。平凡中创造伟大。" }
      ],
      quizBank:[
        { id:"df-s-1", type:"single", difficulty:1, stem:"调节情绪的正确方法是？", options:[{ key:"A", text:"一直压抑情绪" },{ key:"B", text:"合理宣泄" },{ key:"C", text:"对他人发脾气" },{ key:"D", text:"不做任何处理" }], answer:"B", explanation:"合理宣泄是有效的情绪调节方法。压抑和向他人发脾气都是负面影响。" }
      ]
    },
    { id:"df-rel", name:"二、我与他人和集体", order:2, estimatedMinutes:35, difficulty:2, priority:4, examWeight:"~15分",
      concepts: [
        { id:"df-r-1", title:"友谊", body:"友谊的特质：亲密、平等、双向、心灵相遇。交友原则：真诚、尊重、理解、宽容。网上交友需谨慎（不轻易泄露个人信息、不随意约见网友）。" },
        { id:"df-r-2", title:"师生与亲子关系", body:"师生交往：教学相长、亦师亦友。正确对待老师的批评——是关心和爱护。<strong>孝敬父母</strong>是中华民族传统美德和公民义务。亲子冲突处理：沟通、理解、换位思考。" },
        { id:"df-r-3", title:"集体生活", body:"个人与集体：集体离不开个人，个人也离不开集体。集体力量：不是个人力量的简单相加，而是<strong>团结协作</strong>产生的合力。在集体中发展个性：包容差异+学习他人优点。", mnemonic:"个人离不开集体，团结就是力量" }
      ],
      quizBank:[
        { id:"df-r-1", type:"single", difficulty:1, stem:"孝敬父母是什么的体现？", options:[{ key:"A", text:"仅仅是个人选择" },{ key:"B", text:"中华民族传统美德和公民义务" },{ key:"C", text:"可有可无" },{ key:"D", text:"法律不强制的行为" }], answer:"B", explanation:"孝敬父母既是中华民族传统美德，也是公民的法律义务。" },
        { id:"df-r-2", type:"single", difficulty:2, stem:"关于集体力量，以下说法正确的是？", options:[{ key:"A", text:"集体力量是个人力量的简单相加" },{ key:"B", text:"集体力量来自团结协作" },{ key:"C", text:"个人可以脱离集体" },{ key:"D", text:"集体力量与个人无关" }], answer:"B", explanation:"集体力量不是简单相加，而是团结协作产生的合力。" }
      ]
    }, { id:"df-nation", name:"三、我与国家和社会⭐核心", order:3, estimatedMinutes:50, difficulty:3, priority:5, examWeight:"~28分",
      concepts: [
        { id:"df-n-1", title:"法律基础知识", body:"<strong>法律的特征</strong>：①由国家制定或认可；②由国家强制力保证实施（最显著特征）；③对全体社会成员具有普遍约束力。<strong>违法与犯罪</strong>：违法≠犯罪——犯罪是严重违法行为（具有严重社会危害性、触犯刑法、受刑罚处罚）。<strong>未成年人特殊保护</strong>：家庭保护、学校保护、社会保护、司法保护、政府保护、网络保护（六大保护）。", highlight:true },
        { id:"df-n-2", title:"宪法是根本法", body:"宪法是国家的<strong>根本法</strong>，具有最高的法律效力。宪法是其他法律的立法基础和依据——普通法律不得与宪法相抵触。宪法规定国家生活中<strong>最根本、最重要</strong>的问题。宪法制定和修改程序比其他法律更严格。" },
        { id:"df-n-3", title:"公民权利与义务", body:"<strong>基本权利</strong>：选举权和被选举权、人身自由权、人格尊严权、受教育权、劳动权、监督权等。<strong>基本义务</strong>：遵守宪法法律、维护国家统一和民族团结、依法纳税、受教育（既是权利也是义务）、服兵役。行使权利不得损害国家、社会、集体和其他公民的合法权利。" },
        { id:"df-n-4", title:"国家制度与机构", body:"<strong>根本制度</strong>：社会主义制度。<strong>国家机构</strong>：人民代表大会（权力机关）、人民政府（行政机关）、人民法院（审判机关，独立行使审判权）、人民检察院（法律监督机关）。<strong>根本政治制度</strong>：人民代表大会制度。<strong>基本政治制度</strong>：中国共产党领导的多党合作和政治协商制度、民族区域自治制度、基层群众自治制度。" },
        { id:"df-n-5", title:"社会主义核心价值观", body:"<strong>国家层面</strong>：富强、民主、文明、和谐。<strong>社会层面</strong>：自由、平等、公正、法治。<strong>个人层面</strong>：爱国、敬业、诚信、友善。", highlight:true, mnemonic:"国（富民主文明和谐）+社（自由平等公正法治）+人（爱国敬业诚信友善）" }
      ],
      quizBank:[
        { id:"df-n-1", type:"single", difficulty:1, stem:"我国的根本法是？", options:[{ key:"A", text:"民法典" },{ key:"B", text:"刑法" },{ key:"C", text:"宪法" },{ key:"D", text:"未成年人保护法" }], answer:"C", explanation:"宪法是国家的根本法，具有最高法律效力。" },
        { id:"df-n-2", type:"single", difficulty:2, stem:"法律最显著的特征是？", options:[{ key:"A", text:"由国家制定或认可" },{ key:"B", text:"由国家强制力保证实施" },{ key:"C", text:"对全体社会成员有普遍约束力" },{ key:"D", text:"维护社会公平正义" }], answer:"B", explanation:"法律最显著的特征是由国家强制力（警察、监狱、法院等）保证实施。" }
      ]
    },
    { id:"df-current", name:"四、时事政治", order:4, estimatedMinutes:25, difficulty:1, priority:3, examWeight:"~10分",
      concepts: [
        { id:"df-c-1", title:"答题方向", body:"时事题通常与教材知识点结合，不会单纯考新闻。<strong>答题思路</strong>：①提取新闻中的核心信息→②对应教材相关知识点→③用教材术语表达。常见关联：科技创新→科教兴国战略、创新驱动发展；环保新闻→可持续发展、绿水青山就是金山银山；法治新闻→依法治国、宪法权威。", mnemonic:"时事题不难：新闻→知识点→术语表达" }
      ],
      quizBank:[
        { id:"df-c-1", type:"single", difficulty:1, stem:"时事政治题的答题思路是？", options:[{ key:"A", text:"凭感觉随便答" },{ key:"B", text:"新闻→对应知识点→用教材术语表达" },{ key:"C", text:"只抄新闻不联系知识点" },{ key:"D", text:"不考时事不用准备" }], answer:"B", explanation:"时事题核心是将新闻与教材知识点关联，用教材中的术语作答。" }
      ]
    }, { id:"df-conditions", name:"五、国情教育", order:5, estimatedMinutes:30, difficulty:2, priority:4, examWeight:"~10分",
      concepts: [
        { id:"df-cn-1", title:"基本国情与发展", body:"<strong>我国基本国情</strong>：处于并将长期处于<strong>社会主义初级阶段</strong>。<strong>主要矛盾</strong>：人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾。<strong>基本国策</strong>：计划生育、节约资源、保护环境、对外开放。", mnemonic:"初级阶段是国情，发展不平衡是矛盾" },
        { id:"df-cn-2", title:"新发展理念", body:"<strong>五大发展理念</strong>：创新、协调、绿色、开放、共享。<strong>以人民为中心</strong>的发展思想——发展的根本目的是增进民生福祉。<strong>两个百年目标</strong>：建党一百年全面建成小康社会（已实现）；建国一百年全面建成社会主义现代化强国。" },
        { id:"df-cn-3", title:"生态文明与传统文化", body:"<strong>人与自然和谐共生</strong>：绿水青山就是金山银山。坚持节约资源和保护环境的基本国策。<strong>中华文化</strong>特点：源远流长、博大精深。坚定文化自信。传统美德：见利思义、自强不息、敬业乐群等。" }
      ],
      quizBank:[
        { id:"df-cn-1", type:"single", difficulty:1, stem:"我国当前的基本国情是？", options:[{ key:"A", text:"发达国家" },{ key:"B", text:"社会主义初级阶段" },{ key:"C", text:"社会主义高级阶段" },{ key:"D", text:"资本主义初级阶段" }], answer:"B", explanation:"我国处于并将长期处于社会主义初级阶段。" },
        { id:"df-cn-2", type:"single", difficulty:2, stem:"五大发展理念不包括？", options:[{ key:"A", text:"创新" },{ key:"B", text:"协调" },{ key:"C", text:"竞争" },{ key:"D", text:"共享" }], answer:"C", explanation:"五大发展理念是：创新、协调、绿色、开放、共享。没有竞争。" }
      ]
    }
  ]
},

// ==================== 英语 (120分) ====================
english: {
  id:"english", name:"英语", fullScore:120, icon:"🔤", color:"#009688",
  units: [
    { id:"en-grammar", name:"一、8大基础语法点", order:1, estimatedMinutes:55, difficulty:2, priority:5, examWeight:"~30分",
      concepts: [
        { id:"en-g-1", title:"6大时态（必考）", body:"<strong>一般现在时</strong>：do/does（三单+s）。<strong>一般过去时</strong>：did（不规则动词必背！）。<strong>一般将来时</strong>：will do / be going to do。<strong>现在进行时</strong>：am/is/are doing。<strong>过去进行时</strong>：was/were doing。<strong>现在完成时</strong>：have/has done（与一般过去时的区别——现在完成时强调对现在的影响，常与already/just/yet/ever/since/for连用）。", highlight:true, mnemonic:"三单加s，过去加ed，进行be+ing，完成have+done" },
        { id:"en-g-2", title:"被动语态", body:"<strong>结构：be + 过去分词(done)</strong>。一般现在时被动：am/is/are done。一般过去时被动：was/were done。一般将来时被动：will be done。情态动词被动：can/must/should be done。被动语态中by后面的执行者可省略。" },
        { id:"en-g-3", title:"比较级与最高级", body:"比较级(-er/more)：两者比较，常与<strong>than</strong>连用。最高级(-est/most)：三者及以上比较，常与<strong>in/of</strong>连用。<strong>as+原级+as</strong>：和…一样。注意不规则变化：good→better→best，bad→worse→worst，many→more→most，little→less→least。" },
        { id:"en-g-4", title:"情态动词", body:"<strong>can/could</strong>（能力/可能性），<strong>must</strong>（必须/推测），<strong>may/might</strong>（可能/允许），<strong>should</strong>（应该），<strong>need</strong>（需要，可作情态或实义动词）。mustn't=禁止（不是「不必」），needn't=不必。", mnemonic:"must必须may可能，can能力should应该" },
        { id:"en-g-5", title:"介词、连词、冠词、代词", body:"<strong>介词</strong>：at/in/on（时间地点区分）——at+时刻，in+月季年，on+具体某天。<strong>连词</strong>：并列（and/but/or/so），从属（because/although/if/when/while/until）。<strong>冠词</strong>：a/an（泛指），the（特指），零冠词（球类/三餐/学科前不加冠词）。<strong>代词</strong>：人称/物主/反身/指示/不定代词。注意主格vs宾格。" }
      ],
      quizBank:[
        { id:"en-g-1", type:"single", difficulty:1, stem:"She ___ to school every day.", options:[{ key:"A", text:"go" },{ key:"B", text:"goes" },{ key:"C", text:"went" },{ key:"D", text:"going" }], answer:"B", explanation:"一般现在时，主语She为第三人称单数，动词加s/es。" },
        { id:"en-g-2", type:"single", difficulty:2, stem:"The cake ___ by my mom yesterday.", options:[{ key:"A", text:"was made" },{ key:"B", text:"is made" },{ key:"C", text:"made" },{ key:"D", text:"makes" }], answer:"A", explanation:"yesterday提示过去时，cake与make是被动关系，所以用was made（一般过去时被动）。" },
        { id:"en-g-3", type:"single", difficulty:2, stem:"He is the ___ student in his class.", options:[{ key:"A", text:"tall" },{ key:"B", text:"taller" },{ key:"C", text:"tallest" },{ key:"D", text:"more tall" }], answer:"C", explanation:"in his class是三者以上范围，用最高级tallest。前面需加the。" }
      ]
    },
    { id:"en-vocab", name:"二、高频词汇（500中考核心词）", order:2, estimatedMinutes:60, difficulty:2, priority:5, examWeight:"~20分",
      concepts: [
        { id:"en-v-1", title:"词语运用高频考点", body:"<strong>词性转换重点</strong>：名词→形容词（-ful/-less/-y/-ous）、动词→名词（-tion/-ment/-er/-ing）、形容词→副词（-ly）。<strong>高频同义词替换</strong>：important→significant、like→enjoy/be fond of、because→since/as、but→however、good→excellent/wonderful、think→believe/suppose、start→begin。", highlight:true },
        { id:"en-v-2", title:"易混淆词辨析", body:"maybe（副词，也许）vs may be（情态动词+be可能是）。too（也/太）vs also（也，正式）vs either（也，否定句）。few（几乎没有，接可数）vs a few（有几个）vs little（几乎没有，接不可数）vs a little（有一点）。many/much→大量，a lot of/lots of→大量（通用）。" },
        { id:"en-v-3", title:"不规则动词表（高频30个）", body:"be→was/were→been, become→became→become, begin→began→begun, bring→brought→brought, buy→bought→bought, catch→caught→caught, choose→chose→chosen, come→came→come, do→did→done, draw→drew→drawn, drink→drank→drunk, drive→drove→driven, eat→ate→eaten, fall→fell→fallen, feel→felt→felt, find→found→found, fly→flew→flown, forget→forgot→forgotten, get→got→got, give→gave→given, go→went→gone, have→had→had, hear→heard→heard, know→knew→known, leave→left→left, make→made→made, meet→met→met, put→put→put, read→read→read, run→ran→run", mnemonic:"不规则动词每天背10个，反复记忆。中考完形填空和语法填空必考！" }
      ],
      quizBank:[
        { id:"en-v-1", type:"single", difficulty:1, stem:"The opposite of 'possible' is ___?", options:[{ key:"A", text:"possibly" },{ key:"B", text:"impossible" },{ key:"C", text:"impossibly" },{ key:"D", text:"possibility" }], answer:"B", explanation:"possible（可能的）的反义词是impossible（不可能的）。im-是否定前缀。" },
        { id:"en-v-2", type:"single", difficulty:2, stem:"I have ___ money. I can't buy this book.", options:[{ key:"A", text:"a few" },{ key:"B", text:"few" },{ key:"C", text:"a little" },{ key:"D", text:"little" }], answer:"D", explanation:"money不可数，little表示几乎没有（否定含义），与can't buy对应。" },
        { id:"en-v-3", type:"single", difficulty:2, stem:"The past tense of 'begin' is ___?", options:[{ key:"A", text:"began" },{ key:"B", text:"begun" },{ key:"C", text:"beginned" },{ key:"D", text:"begin" }], answer:"A", explanation:"begin→began→begun是不规则变化。过去式是began，过去分词是begun。" }
      ]
    },
    { id:"en-cloze", name:"三、完形填空（方法+步骤）", order:3, estimatedMinutes:40, difficulty:3, priority:5, examWeight:"~15分",
      concepts: [
        { id:"en-cl-1", title:"完形填空三步法", body:"<strong>第一步：通读全文</strong>，把握大意（2-3分钟，不急着选）。<strong>第二步：逐句分析</strong>，先易后难（根据上下文、固定搭配、语法线索判断）。<strong>第三步：复读全文</strong>，检查验证（填入选项后通读，看是否通顺）。", highlight:true },
        { id:"en-cl-2", title:"常见出题点", body:"<strong>上下文逻辑关系</strong>（转折/因果/并列/递进）。<strong>固定搭配</strong>（look forward to + doing，pay attention to，be interested in，be good at等）。<strong>语法线索</strong>（时态一致、单复数、代词指代）。<strong>词义辨析</strong>（近义词在语境中的区别）。", mnemonic:"完形填空=语境+语法+搭配，缺一不可" }
      ],
      quizBank:[
        { id:"en-cl-1", type:"single", difficulty:2, stem:"完形填空的正确步骤是？", options:[{ key:"A", text:"直接看选项选答案" },{ key:"B", text:"先通读全文再逐句分析" },{ key:"C", text:"按顺序逐词翻译" },{ key:"D", text:"先看答案再读文章" }], answer:"B", explanation:"三步法：先通读把握大意→逐句分析选答案→复读检查。不能直接看选项选。" },
        { id:"en-cl-2", type:"single", difficulty:2, stem:"以下哪个是常见的固定搭配？", options:[{ key:"A", text:"look forward to do" },{ key:"B", text:"look forward to doing" },{ key:"C", text:"look forward doing" },{ key:"D", text:"look forward to done" }], answer:"B", explanation:"look forward to + doing，to是介词后接动名词。这是中考高频考点。" }
      ]
    }, { id:"en-reading", name:"四、阅读理解（4大题型）", order:4, estimatedMinutes:40, difficulty:3, priority:5, examWeight:"~40分",
      concepts: [
        { id:"en-r-1", title:"细节题（占比最大）", body:"<strong>选定对检法</strong>：①根据题目关键词在文中<strong>定位</strong>；②比对原文和选项，找<strong>同义替换</strong>；③排除法选出正确答案。不要凭印象选，必须回原文确认！", highlight:true },
        { id:"en-r-2", title:"推理判断题", body:"不能在原文直接找到，需要<strong>根据原文信息合理推断</strong>。关键词：infer/imply/suggest/probably。做题原则：推断不能过度，不能离开原文。" },
        { id:"en-r-3", title:"主旨大意题", body:"找<strong>主题句</strong>（通常在段首段尾）。主要看：标题、封面、首段、末段、各段首句。选项警惕：太空泛（扩大范围）、太细节（以偏概全）。" },
        { id:"en-r-4", title:"词义猜测题", body:"根据<strong>上下文线索</strong>推测词义：①定义线索（that is/meaning/破折号/括号）；②对比线索（but/however/rather than）；③因果线索（because/so/therefore）；④构词法（前缀后缀）。" }
      ],
      quizBank:[
        { id:"en-r-1", type:"single", difficulty:1, stem:"阅读理解中占比最大的题型是？", options:[{ key:"A", text:"主旨大意题" },{ key:"B", text:"细节题" },{ key:"C", text:"推理判断题" },{ key:"D", text:"词义猜测题" }], answer:"B", explanation:"细节题是阅读理解中考查最多的题型，答案基本可以直接在原文中找到。" },
        { id:"en-r-2", type:"single", difficulty:2, stem:"做阅读理解细节题的正确方法是？", options:[{ key:"A", text:"凭印象选择" },{ key:"B", text:"根据关键词在文中定位并比对" },{ key:"C", text:"全部选C" },{ key:"D", text:"只看选项不看文章" }], answer:"B", explanation:"选定对检法：关键词定位→比对原文和选项→排除法选出正确答案。" }
      ]
    }, { id:"en-writing", name:"五、书面表达（作文模板）", order:5, estimatedMinutes:45, difficulty:3, priority:5, examWeight:"~15分",
      concepts: [
        { id:"en-w-1", title:"作文万能框架", body:"<strong>开头段（2-3句）</strong>：点题+交代背景。常用句：I'm writing to... / As we all know... / With the development of... / Nowadays...<br><strong>中间段（5-8句）</strong>：分点表达。First,... Second,... Third,... / On one hand,... On the other hand,... / What's more,... Besides,... / For example,...<br><strong>结尾段（2-3句）</strong>：总结+展望。All in all,... / In a word,... / I believe that... / Let's take action now.", highlight:true },
        { id:"en-w-2", title:"高级替换词（提分关键）", body:"very good→excellent/wonderful/fantastic<br>important→significant/essential/vital<br>I think→In my opinion/As far as I'm concerned<br>many→a number of/plenty of/a great many<br>but→however/nonetheless<br>because→due to/owing to/as a result of<br>should→be supposed to/be expected to<br>like→be fond of/be keen on/enjoy", mnemonic:"少用very+简单词，多用高级替换词。作文能提3-5分！" },
        { id:"en-w-3", title:"常见作文类型模板", body:"<strong>建议信</strong>：I'm glad to hear that... I'd like to give you some advice. First,... Second,... I hope my advice can help you.<br><strong>介绍类</strong>：I'd like to introduce... to you. It is... It has a long history of... You can...<br><strong>观点类</strong>：Different people have different opinions. Some think... while others believe... In my opinion,...<br><strong>日记/记叙</strong>：Today was a special day. In the morning,... At noon,... In the evening,... I learned that..." }
      ],
      quizBank:[
        { id:"en-w-1", type:"single", difficulty:1, stem:"作文中替换'very good'的高级词是？", options:[{ key:"A", text:"very bad" },{ key:"B", text:"excellent" },{ key:"C", text:"goodly" },{ key:"D", text:"gooder" }], answer:"B", explanation:"excellent / wonderful / fantastic 都是 very good 的高级替换词。" },
        { id:"en-w-2", type:"single", difficulty:2, stem:"以下哪个是表达观点的常用开头？", options:[{ key:"A", text:"How are you?" },{ key:"B", text:"In my opinion" },{ key:"C", text:"Once upon a time" },{ key:"D", text:"How much is it?" }], answer:"B", explanation:"In my opinion / As far as I'm concerned 是表达观点的常用开头。" }
      ]
    }
  ]
}
};
