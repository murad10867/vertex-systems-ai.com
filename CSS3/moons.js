// ==========================================
// بيانات أطوار القمر
// ==========================================

const phasesData = {

    newMoon: {

        name:
            "المحاق",

        className:
            "new-moon",

        description:
            "في المحاق يكون القمر قريبًا من اتجاه الشمس في السماء، ويكون الجزء المضاء منه بعيدًا عنا تقريبًا لذلك يبدو مظلمًا."

    },


    waxingCrescent: {

        name:
            "الهلال المتزايد",

        className:
            "waxing-crescent",

        description:
            "يبدأ جزء صغير من الوجه المرئي للقمر بالإضاءة بعد المحاق، ويزداد الجزء المضاء يومًا بعد يوم."

    },


    firstQuarter: {

        name:
            "التربيع الأول",

        className:
            "first-quarter",

        description:
            "يظهر نصف الوجه المرئي للقمر مضاءً تقريبًا."

    },


    waxingGibbous: {

        name:
            "الأحدب المتزايد",

        className:
            "waxing-gibbous",

        description:
            "يصبح أكثر من نصف الوجه المرئي مضاءً ويستمر الجزء المضيء في الزيادة حتى البدر."

    },


    fullMoon: {

        name:
            "البدر",

        className:
            "full-moon",

        description:
            "في البدر يظهر الوجه القريب من القمر مضاءً تقريبًا بالكامل من منظور الأرض."

    },


    waningGibbous: {

        name:
            "الأحدب المتناقص",

        className:
            "waning-gibbous",

        description:
            "بعد البدر يبدأ الجزء المضيء الذي نراه بالتناقص تدريجيًا."

    },


    lastQuarter: {

        name:
            "التربيع الأخير",

        className:
            "last-quarter",

        description:
            "يظهر نصف الوجه المرئي من القمر مضاءً تقريبًا قبل الانتقال إلى الهلال المتناقص."

    },


    waningCrescent: {

        name:
            "الهلال المتناقص",

        className:
            "waning-crescent",

        description:
            "يبقى جزء صغير مضاء من القمر ويستمر في التناقص حتى يعود القمر إلى المحاق."

    }

};


// ==========================================
// بيانات أشهر الأقمار
// ==========================================

const moonsData = {

    moon: {

        name:
            "قمر الأرض",

        className:
            "earth-moon-visual",

        description:
            "القمر الطبيعي الوحيد للأرض وهو أقرب جرم سماوي كبير إلى كوكبنا.",

        planet:
            "الأرض",

        diameter:
            "حوالي 3,475 كم",

        orbit:
            "حوالي 27.3 يوم للدوران حول الأرض بالنسبة للنجوم",

        fact:
            "بسبب الدوران المتزامن نرى تقريبًا الوجه نفسه من القمر باستمرار."

    },


    io: {

        name:
            "آيو",

        className:
            "io-visual",

        description:
            "آيو أحد أقمار المشتري الغاليلية ويشتهر بنشاطه البركاني الشديد.",

        planet:
            "المشتري",

        diameter:
            "حوالي 3,643 كم",

        orbit:
            "حوالي 1.77 يوم",

        fact:
            "آيو من أكثر الأجرام المعروفة نشاطًا بركانيًا في المجموعة الشمسية."

    },


    europa: {

        name:
            "أوروبا",

        className:
            "europa-visual",

        description:
            "أوروبا قمر جليدي للمشتري وله سطح مغطى بدرجة كبيرة بالجليد.",

        planet:
            "المشتري",

        diameter:
            "حوالي 3,122 كم",

        orbit:
            "حوالي 3.55 يوم",

        fact:
            "توجد أدلة قوية على احتمال وجود محيط من الماء السائل تحت قشرته الجليدية."

    },


    ganymede: {

        name:
            "غانيميد",

        className:
            "ganymede-visual",

        description:
            "غانيميد هو أكبر قمر في المجموعة الشمسية.",

        planet:
            "المشتري",

        diameter:
            "حوالي 5,268 كم",

        orbit:
            "حوالي 7.15 يوم",

        fact:
            "غانيميد أكبر من كوكب عطارد من حيث القطر."

    },


    callisto: {

        name:
            "كاليستو",

        className:
            "callisto-visual",

        description:
            "كاليستو قمر كبير للمشتري وله سطح قديم مليء بالفوهات.",

        planet:
            "المشتري",

        diameter:
            "حوالي 4,821 كم",

        orbit:
            "حوالي 16.69 يوم",

        fact:
            "سطحه من أكثر الأسطح امتلاءً بالفوهات في المجموعة الشمسية."

    },


    titan: {

        name:
            "تيتان",

        className:
            "titan-visual",

        description:
            "تيتان أكبر أقمار زحل ويتميز بغلاف جوي كثيف.",

        planet:
            "زحل",

        diameter:
            "حوالي 5,150 كم",

        orbit:
            "حوالي 15.95 يوم",

        fact:
            "توجد على سطح تيتان بحيرات وبحار من الهيدروكربونات السائلة مثل الميثان والإيثان."

    },


    enceladus: {

        name:
            "إنسيلادوس",

        className:
            "enceladus-visual",

        description:
            "إنسيلادوس قمر جليدي صغير يدور حول زحل.",

        planet:
            "زحل",

        diameter:
            "حوالي 504 كم",

        orbit:
            "حوالي 1.37 يوم",

        fact:
            "تنبعث من قرب قطبه الجنوبي أعمدة تحتوي على جليد وبخار ماء ومواد أخرى."

    },


    triton: {

        name:
            "تريتون",

        className:
            "triton-visual",

        description:
            "تريتون هو أكبر أقمار نبتون ويدور حوله في اتجاه رجعي مقارنة بدوران نبتون.",

        planet:
            "نبتون",

        diameter:
            "حوالي 2,707 كم",

        orbit:
            "حوالي 5.88 يوم",

        fact:
            "يُعتقد أن تريتون ربما كان جسمًا في حزام كايبر ثم أسرته جاذبية نبتون."

    }

};


// ==========================================
// عناصر الصفحة
// ==========================================

const exploreBtn =
    document.getElementById(
        "exploreBtn"
    );


const earthMoonSimulator =
    document.getElementById(
        "earthMoonSimulator"
    );


const pauseBtn =
    document.getElementById(
        "pauseBtn"
    );


const speedBtn =
    document.getElementById(
        "speedBtn"
    );


const resetBtn =
    document.getElementById(
        "resetBtn"
    );


// ==========================================
// الأطوار
// ==========================================

const phaseCards =
    document.querySelectorAll(
        "[data-phase]"
    );


const selectedPhaseVisual =
    document.getElementById(
        "selectedPhaseVisual"
    );


const phaseName =
    document.getElementById(
        "phaseName"
    );


const phaseDescription =
    document.getElementById(
        "phaseDescription"
    );


// ==========================================
// الأقمار
// ==========================================

const moonCards =
    document.querySelectorAll(
        "[data-moon]"
    );


const selectedMoonVisual =
    document.getElementById(
        "selectedMoonVisual"
    );


const moonName =
    document.getElementById(
        "moonName"
    );


const moonDescription =
    document.getElementById(
        "moonDescription"
    );


const moonPlanet =
    document.getElementById(
        "moonPlanet"
    );


const moonDiameter =
    document.getElementById(
        "moonDiameter"
    );


const moonOrbit =
    document.getElementById(
        "moonOrbit"
    );


const moonFact =
    document.getElementById(
        "moonFact"
    );


// ==========================================
// المشتري
// ==========================================

const jupiterSystem =
    document.getElementById(
        "jupiterSystem"
    );


const jupiterPauseBtn =
    document.getElementById(
        "jupiterPauseBtn"
    );


// ==========================================
// معلومة
// ==========================================

const factBtn =
    document.getElementById(
        "factBtn"
    );


const randomFact =
    document.getElementById(
        "randomFact"
    );


// ==========================================
// العودة
// ==========================================

const backBtn =
    document.getElementById(
        "backBtn"
    );


// ==========================================
// الحالات
// ==========================================

let earthMoonPaused =
    false;


let earthMoonFast =
    false;


let jupiterPaused =
    false;


// ==========================================
// بدء الاستكشاف
// ==========================================

exploreBtn.addEventListener(

    "click",

    function () {

        document
            .getElementById(
                "earthMoonSection"
            )
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }

);


// ==========================================
// إيقاف الأرض والقمر
// ==========================================

pauseBtn.addEventListener(

    "click",

    function () {

        earthMoonPaused =
            !earthMoonPaused;


        if (
            earthMoonPaused
        ) {

            earthMoonSimulator.classList.add(
                "paused"
            );


            pauseBtn.textContent =
                "▶️ تشغيل الحركة";

        }

        else {

            earthMoonSimulator.classList.remove(
                "paused"
            );


            pauseBtn.textContent =
                "⏸️ إيقاف الحركة";

        }

    }

);


// ==========================================
// تسريع
// ==========================================

speedBtn.addEventListener(

    "click",

    function () {

        earthMoonFast =
            !earthMoonFast;


        if (
            earthMoonFast
        ) {

            earthMoonSimulator.classList.add(
                "fast"
            );


            speedBtn.textContent =
                "🐢 السرعة العادية";

        }

        else {

            earthMoonSimulator.classList.remove(
                "fast"
            );


            speedBtn.textContent =
                "⚡ تسريع";

        }

    }

);


// ==========================================
// الوضع الطبيعي
// ==========================================

resetBtn.addEventListener(

    "click",

    function () {

        earthMoonPaused =
            false;


        earthMoonFast =
            false;


        earthMoonSimulator.classList.remove(
            "paused"
        );


        earthMoonSimulator.classList.remove(
            "fast"
        );


        pauseBtn.textContent =
            "⏸️ إيقاف الحركة";


        speedBtn.textContent =
            "⚡ تسريع";

    }

);


// ==========================================
// عرض طور القمر
// ==========================================

function showPhase(
    phaseId
) {

    const phase =
        phasesData[
            phaseId
        ];


    if (
        !phase
    ) {

        return;

    }


    phaseName.textContent =
        phase.name;


    phaseDescription.textContent =
        phase.description;


    selectedPhaseVisual.className =
        "selected-phase " +
        phase.className;


    phaseCards.forEach(

        function (
            card
        ) {

            card.classList.remove(
                "selected"
            );

        }

    );


    const selectedCard =
        document.querySelector(
            '[data-phase="' +
            phaseId +
            '"]'
        );


    if (
        selectedCard
    ) {

        selectedCard.classList.add(
            "selected"
        );

    }

}


// ==========================================
// الضغط على الأطوار
// ==========================================

phaseCards.forEach(

    function (
        card
    ) {

        card.addEventListener(

            "click",

            function () {

                showPhase(
                    card.dataset.phase
                );

            }

        );

    }

);


// ==========================================
// عرض القمر
// ==========================================

function showMoon(
    moonId
) {

    const moon =
        moonsData[
            moonId
        ];


    if (
        !moon
    ) {

        return;

    }


    moonName.textContent =
        moon.name;


    moonDescription.textContent =
        moon.description;


    moonPlanet.textContent =
        moon.planet;


    moonDiameter.textContent =
        moon.diameter;


    moonOrbit.textContent =
        moon.orbit;


    moonFact.textContent =
        moon.fact;


    selectedMoonVisual.className =
        "selected-moon " +
        moon.className;


    moonCards.forEach(

        function (
            card
        ) {

            card.classList.remove(
                "selected"
            );

        }

    );


    const selectedCard =
        document.querySelector(
            '[data-moon="' +
            moonId +
            '"]'
        );


    if (
        selectedCard
    ) {

        selectedCard.classList.add(
            "selected"
        );

    }

}


// ==========================================
// الضغط على قمر
// ==========================================

moonCards.forEach(

    function (
        card
    ) {

        card.addEventListener(

            "click",

            function () {

                showMoon(
                    card.dataset.moon
                );

            }

        );

    }

);


// ==========================================
// أقمار المشتري
// ==========================================

jupiterPauseBtn.addEventListener(

    "click",

    function () {

        jupiterPaused =
            !jupiterPaused;


        if (
            jupiterPaused
        ) {

            jupiterSystem.classList.add(
                "paused"
            );


            jupiterPauseBtn.textContent =
                "▶️ تشغيل أقمار المشتري";

        }

        else {

            jupiterSystem.classList.remove(
                "paused"
            );


            jupiterPauseBtn.textContent =
                "⏸️ إيقاف أقمار المشتري";

        }

    }

);


// ==========================================
// معلومات عشوائية
// ==========================================

const facts = [

    "🌙 القمر هو القمر الطبيعي الوحيد لكوكب الأرض.",

    "🟤 غانيميد أكبر قمر في المجموعة الشمسية.",

    "🌋 آيو يتميز بنشاط بركاني شديد.",

    "🧊 أوروبا مغطى بالجليد ويُعتقد أن تحت سطحه محيطًا من الماء.",

    "🪐 تيتان يمتلك غلافًا جويًا كثيفًا.",

    "💦 إنسيلادوس يقذف أعمدة من الجليد وبخار الماء من سطحه.",

    "🔵 تريتون يدور حول نبتون في اتجاه رجعي.",

    "🌕 أطوار القمر تنتج من تغير الجزء المضاء الذي نراه من الأرض أثناء دوران القمر.",

    "☀️ كسوف الشمس يحدث عندما يمر القمر بين الأرض والشمس.",

    "🌍 خسوف القمر يحدث عندما يدخل القمر في ظل الأرض."

];


// ==========================================
// معلومة جديدة
// ==========================================

factBtn.addEventListener(

    "click",

    function () {

        const randomIndex =
            Math.floor(
                Math.random() *
                facts.length
            );


        randomFact.textContent =
            facts[
                randomIndex
            ];

    }

);


// ==========================================
// العودة
// ==========================================

backBtn.addEventListener(

    "click",

    function () {

        window.location.href =
            "space.html";

    }

);


// ==========================================
// بداية الصفحة
// ==========================================

showPhase(
    "fullMoon"
);


showMoon(
    "moon"
);