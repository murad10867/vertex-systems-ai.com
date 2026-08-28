// ==========================================
// Vertex Space Exploration
// exploration.js
// ==========================================


// ==========================================
// حماية إضافية
// ==========================================

if (
    !window.VertexAuth ||
    !VertexAuth.isLoggedIn()
) {

    window.location.replace(
        "login.html"
    );

}


// ==========================================
// بيانات المهمات
// ==========================================

const missionsData = {

    moon: {

        icon:
            "🌙",

        className:
            "moon-visual",

        name:
            "مهمة القمر",

        description:
            "رحلة تعليمية لمحاكاة الوصول إلى القمر ودراسة سطحه.",

        destination:
            "القمر",

        distance:
            "384,400 كم تقريبًا",

        duration:
            "عدة أيام حسب المهمة والمسار",

        goal:
            "البحث والاستكشاف",

        fact:
            "متوسط المسافة بين الأرض والقمر يقارب 384 ألف كيلومتر."

    },


    mars: {

        icon:
            "🔴",

        className:
            "mars-visual",

        name:
            "مهمة المريخ",

        description:
            "رحلة طويلة إلى الكوكب الأحمر لدراسة سطحه وبيئته.",

        destination:
            "المريخ",

        distance:
            "تتغير باستمرار",

        duration:
            "عادةً عدة أشهر",

        goal:
            "استكشاف الكوكب الأحمر",

        fact:
            "المسافة بين الأرض والمريخ تتغير كثيرًا لأن الكوكبين يدوران حول الشمس بسرعات ومسارات مختلفة."

    },


    station: {

        icon:
            "🛰️",

        className:
            "station-visual",

        name:
            "مهمة المحطة الفضائية",

        description:
            "رحلة إلى مدار أرضي منخفض للوصول إلى محطة فضائية.",

        destination:
            "مدار أرضي منخفض",

        distance:
            "حوالي 400 كم ارتفاعًا",

        duration:
            "ساعات للوصول حسب المهمة",

        goal:
            "البحث العلمي في المدار",

        fact:
            "محطة الفضاء الدولية تدور على ارتفاع يقارب 400 كم وتكمل دورة حول الأرض في نحو 90 دقيقة."

    },


    deepSpace: {

        icon:
            "🌌",

        className:
            "deep-space-visual",

        name:
            "مهمة الفضاء العميق",

        description:
            "استكشاف المناطق البعيدة من النظام الشمسي وما وراء الكواكب الخارجية.",

        destination:
            "الفضاء العميق",

        distance:
            "مليارات الكيلومترات",

        duration:
            "سنوات أو عقود",

        goal:
            "استكشاف النظام الشمسي البعيد",

        fact:
            "فوياجر 1 من أبعد الأجسام التي صنعها الإنسان وأرسلت إلى الفضاء."

    }

};


// ==========================================
// المهمة الحالية
// ==========================================

let selectedMission =
    "moon";


// ==========================================
// عناصر المهمات
// ==========================================

const missionCards =
    document.querySelectorAll(
        ".mission-card"
    );


const selectedMissionVisual =
    document.getElementById(
        "selectedMissionVisual"
    );


const missionName =
    document.getElementById(
        "missionName"
    );


const missionDescription =
    document.getElementById(
        "missionDescription"
    );


const missionDestination =
    document.getElementById(
        "missionDestination"
    );


const missionDistance =
    document.getElementById(
        "missionDistance"
    );


const missionDuration =
    document.getElementById(
        "missionDuration"
    );


const missionGoal =
    document.getElementById(
        "missionGoal"
    );


const missionFact =
    document.getElementById(
        "missionFact"
    );


// ==========================================
// عرض المهمة
// ==========================================

function showMission(
    missionId
) {

    const mission =
        missionsData[
            missionId
        ];


    if (
        !mission
    ) {

        return;

    }


    selectedMission =
        missionId;


    missionCards.forEach(

        function (
            card
        ) {

            card.classList.remove(
                "active"
            );

        }

    );


    const selectedCard =
        document.querySelector(
            '[data-mission="' +
            missionId +
            '"]'
        );


    if (
        selectedCard
    ) {

        selectedCard.classList.add(
            "active"
        );

    }


    selectedMissionVisual.textContent =
        mission.icon;


    missionName.textContent =
        mission.name;


    missionDescription.textContent =
        mission.description;


    missionDestination.textContent =
        mission.destination;


    missionDistance.textContent =
        mission.distance;


    missionDuration.textContent =
        mission.duration;


    missionGoal.textContent =
        mission.goal;


    missionFact.textContent =
        mission.fact;

}


// ==========================================
// اختيار المهمة
// ==========================================

missionCards.forEach(

    function (
        card
    ) {

        card.addEventListener(

            "click",

            function () {

                showMission(
                    card.dataset.mission
                );


                resetLaunch();

            }

        );

    }

);


// ==========================================
// Explore
// ==========================================

document
    .getElementById(
        "exploreBtn"
    )
    .addEventListener(

        "click",

        function () {

            document
                .getElementById(
                    "missionSection"
                )
                .scrollIntoView({

                    behavior:
                        "smooth"

                });

        }

    );


// ==========================================
// Checklist
// ==========================================

const checkItems =
    document.querySelectorAll(
        ".check-item"
    );


const checklistProgress =
    document.getElementById(
        "checklistProgress"
    );


const checklistProgressText =
    document.getElementById(
        "checklistProgressText"
    );


const checklistMessage =
    document.getElementById(
        "checklistMessage"
    );


const resetChecklistBtn =
    document.getElementById(
        "resetChecklistBtn"
    );


function updateChecklist() {

    const done =
        document.querySelectorAll(
            ".check-item.done"
        ).length;


    const total =
        checkItems.length;


    const percent =
        Math.round(
            (
                done /
                total
            )
            *
            100
        );


    checklistProgress.style.width =
        percent +
        "%";


    checklistProgressText.textContent =
        percent +
        "%";


    if (
        percent ===
        100
    ) {

        checklistMessage.textContent =
            "✅ المهمة جاهزة للإطلاق.";

    }

    else {

        checklistMessage.textContent =
            "أكمل " +
            (
                total -
                done
            )
            +
            " عناصر.";

    }

}


checkItems.forEach(

    function (
        item
    ) {

        item.addEventListener(

            "click",

            function () {

                item.classList.toggle(
                    "done"
                );


                updateChecklist();

            }

        );

    }

);


resetChecklistBtn.addEventListener(

    "click",

    function () {

        checkItems.forEach(

            function (
                item
            ) {

                item.classList.remove(
                    "done"
                );

            }

        );


        updateChecklist();

    }

);


// ==========================================
// Launch Simulator
// ==========================================

const rocket =
    document.getElementById(
        "rocket"
    );


const launchBtn =
    document.getElementById(
        "launchBtn"
    );


const pauseLaunchBtn =
    document.getElementById(
        "pauseLaunchBtn"
    );


const resetLaunchBtn =
    document.getElementById(
        "resetLaunchBtn"
    );


const launchStatus =
    document.getElementById(
        "launchStatus"
    );


const launchStage =
    document.getElementById(
        "launchStage"
    );


const altitudeValue =
    document.getElementById(
        "altitudeValue"
    );


const velocityValue =
    document.getElementById(
        "velocityValue"
    );


const missionTimeValue =
    document.getElementById(
        "missionTimeValue"
    );


const launchPercent =
    document.getElementById(
        "launchPercent"
    );


const launchProgressFill =
    document.getElementById(
        "launchProgressFill"
    );


let launchProgress =
    0;


let launchRunning =
    false;


let launchPaused =
    false;


let launchTimer =
    null;


let missionSeconds =
    0;


let missionLogged =
    false;


// ==========================================
// Start Launch
// ==========================================

function startLaunch() {

    if (
        launchRunning
    ) {

        return;

    }


    launchRunning =
        true;


    launchPaused =
        false;


    rocket.classList.add(
        "launching"
    );


    launchStatus.textContent =
        "الإطلاق";


    pauseLaunchBtn.textContent =
        "⏸ إيقاف مؤقت";


    launchTimer =
        setInterval(

            function () {

                if (
                    launchPaused
                ) {

                    return;

                }


                launchProgress +=
                    0.55;


                missionSeconds +=
                    1;


                if (
                    launchProgress >=
                    100
                ) {

                    launchProgress =
                        100;


                    updateLaunchUI();


                    completeLaunch();


                    return;

                }


                updateLaunchUI();

            },

            80

        );

}


// ==========================================
// Update launch UI
// ==========================================

function updateLaunchUI() {

    const rocketBottom =
        38 +
        launchProgress *
        3.45;


    rocket.style.bottom =
        rocketBottom +
        "px";


    launchProgressFill.style.width =
        launchProgress +
        "%";


    launchPercent.textContent =
        Math.round(
            launchProgress
        )
        +
        "%";


    // محاكاة تعليمية تقريبية

    const altitude =
        Math.round(
            launchProgress *
            1.2
        );


    const velocity =
        Math.round(
            launchProgress *
            280
        );


    altitudeValue.textContent =
        altitude +
        " كم";


    velocityValue.textContent =
        velocity
            .toLocaleString(
                "ar-SA"
            )
        +
        " كم/س";


    missionTimeValue.textContent =
        formatSimulationTime(
            missionSeconds
        );


    if (
        launchProgress <
        15
    ) {

        launchStage.textContent =
            "مغادرة منصة الإطلاق";

    }

    else if (
        launchProgress <
        40
    ) {

        launchStage.textContent =
            "الصعود خلال الغلاف الجوي";

    }

    else if (
        launchProgress <
        70
    ) {

        launchStage.textContent =
            "الطبقات العليا";

    }

    else if (
        launchProgress <
        100
    ) {

        launchStage.textContent =
            "الاقتراب من الفضاء";

    }

    else {

        launchStage.textContent =
            "وصلنا إلى الفضاء";

    }

}


// ==========================================
// Pause launch
// ==========================================

function toggleLaunchPause() {

    if (
        !launchRunning
    ) {

        return;

    }


    launchPaused =
        !launchPaused;


    if (
        launchPaused
    ) {

        launchStatus.textContent =
            "متوقف مؤقتًا";


        pauseLaunchBtn.textContent =
            "▶ متابعة";

    }

    else {

        launchStatus.textContent =
            "الإطلاق";


        pauseLaunchBtn.textContent =
            "⏸ إيقاف مؤقت";

    }

}


// ==========================================
// Complete Launch
// ==========================================

function completeLaunch() {

    launchRunning =
        false;


    launchPaused =
        false;


    clearInterval(
        launchTimer
    );


    launchTimer =
        null;


    rocket.classList.remove(
        "launching"
    );


    launchStatus.textContent =
        "✅ المهمة انطلقت";


    launchStage.textContent =
        "الوصول إلى الفضاء";


    pauseLaunchBtn.textContent =
        "⏸ إيقاف مؤقت";


    logMission();

}


// ==========================================
// Reset launch
// ==========================================

function resetLaunch() {

    if (
        launchTimer
    ) {

        clearInterval(
            launchTimer
        );

    }


    launchTimer =
        null;


    launchRunning =
        false;


    launchPaused =
        false;


    launchProgress =
        0;


    missionSeconds =
        0;


    missionLogged =
        false;


    rocket.classList.remove(
        "launching"
    );


    rocket.style.bottom =
        "38px";


    launchStatus.textContent =
        "جاهز";


    launchStage.textContent =
        "على المنصة";


    altitudeValue.textContent =
        "0 كم";


    velocityValue.textContent =
        "0 كم/س";


    missionTimeValue.textContent =
        "00:00";


    launchPercent.textContent =
        "0%";


    launchProgressFill.style.width =
        "0%";


    pauseLaunchBtn.textContent =
        "⏸ إيقاف مؤقت";

}


// ==========================================
// Simulation time
// ==========================================

function formatSimulationTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds /
            60
        );


    const remaining =
        seconds %
        60;


    return (
        String(
            minutes
        )
            .padStart(
                2,
                "0"
            )
        +
        ":"
        +
        String(
            remaining
        )
            .padStart(
                2,
                "0"
            )
    );

}


// ==========================================
// Mission log
// Dashboard compatibility
// ==========================================

function logMission() {

    if (
        missionLogged
    ) {

        return;

    }


    missionLogged =
        true;


    let log =
        [];


    const stored =
        localStorage.getItem(
            "vertexSpaceMissionLog"
        );


    if (
        stored
    ) {

        try {

            const parsed =
                JSON.parse(
                    stored
                );


            if (
                Array.isArray(
                    parsed
                )
            ) {

                log =
                    parsed;

            }

        }

        catch (
            error
        ) {

            log =
                [];

        }

    }


    const mission =
        missionsData[
            selectedMission
        ];


    log.push({

        id:
            Date.now(),

        mission:
            selectedMission,

        name:
            mission.name,

        destination:
            mission.destination,

        completedAt:
            new Date()
                .toISOString()

    });


    localStorage.setItem(

        "vertexSpaceMissionLog",

        JSON.stringify(
            log
        )

    );

}


// ==========================================
// Launch controls
// ==========================================

launchBtn.addEventListener(

    "click",

    startLaunch

);


pauseLaunchBtn.addEventListener(

    "click",

    toggleLaunchPause

);


resetLaunchBtn.addEventListener(

    "click",

    resetLaunch

);


// ==========================================
// Station
// ==========================================

const stationOrbit =
    document.getElementById(
        "stationOrbit"
    );


const stationPauseBtn =
    document.getElementById(
        "stationPauseBtn"
    );


let stationPaused =
    false;


stationPauseBtn.addEventListener(

    "click",

    function () {

        stationPaused =
            !stationPaused;


        stationOrbit.classList.toggle(
            "paused",
            stationPaused
        );


        stationPauseBtn.textContent =
            stationPaused
                ?
                "▶ متابعة المدار"
                :
                "⏸ إيقاف المدار";

    }

);


// ==========================================
// Space facts
// ==========================================

const facts = [

    "🌍 يُستخدم ارتفاع يقارب 100 كم غالبًا كحد تقريبي لبداية الفضاء ويسمى خط كارمان.",

    "🌙 متوسط المسافة بين الأرض والقمر يقارب 384,400 كم.",

    "🛰️ محطة الفضاء الدولية تدور حول الأرض تقريبًا مرة كل 90 دقيقة.",

    "🔴 رحلة المركبات إلى المريخ تستغرق عادةً عدة أشهر حسب المسار ومواقع الكوكبين.",

    "🚀 الوصول إلى المدار لا يعني انعدام الجاذبية؛ الأجسام في المدار ما زالت تتأثر بجاذبية الأرض.",

    "☀️ الضوء من الشمس يحتاج نحو 8 دقائق و20 ثانية تقريبًا للوصول إلى الأرض.",

    "🌌 فوياجر 1 من أبعد الأجسام التي صنعها الإنسان وأرسلها إلى الفضاء.",

    "🧑‍🚀 في المدار يشعر رواد الفضاء بالجاذبية الصغرى لأن المركبة والرواد يسقطون حول الأرض معًا.",

    "🛰️ الأقمار الصناعية تستطيع البقاء في المدار لأن سرعتها الأفقية تجعلها تسقط حول الأرض بدل السقوط مباشرة على سطحها.",

    "🌙 عام 1969 أصبح أبولو 11 أول مهمة تهبط ببشر على سطح القمر."

];


const randomFact =
    document.getElementById(
        "randomFact"
    );


const factBtn =
    document.getElementById(
        "factBtn"
    );


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
// Back
// ==========================================

document
    .getElementById(
        "backBtn"
    )
    .addEventListener(

        "click",

        function () {

            window.location.href =
                "space.html";

        }

    );


// ==========================================
// Start
// ==========================================

showMission(
    "moon"
);


updateChecklist();


resetLaunch();