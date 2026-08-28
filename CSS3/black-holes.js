// ==========================================
// بيانات أنواع الثقوب السوداء
// ==========================================

const blackHolesData = {

    stellar: {

        name:
            "ثقب أسود نجمي",

        description:
            "يتكون هذا النوع عندما تنهار نواة بعض النجوم الضخمة بعد انتهاء مراحل متقدمة من حياتها.",

        mass:
            "عادة عدة كتل شمسية إلى عشرات الكتل الشمسية",

        location:
            "يمكن أن يوجد في أنحاء المجرة",

        formation:
            "انهيار نواة بعض النجوم الضخمة",

        fact:
            "يمكن اكتشاف بعض الثقوب السوداء النجمية من تأثيرها في نجم مرافق أو في المادة المحيطة.",

        size:
            90

    },


    intermediate: {

        name:
            "ثقب أسود متوسط الكتلة",

        description:
            "نوع يقع من حيث الكتلة بين الثقوب السوداء النجمية والثقوب السوداء فائقة الكتلة.",

        mass:
            "مئات إلى مئات الآلاف تقريبًا من الكتل الشمسية حسب التصنيف المستخدم",

        location:
            "قد يوجد في بعض العناقيد النجمية أو البيئات الكثيفة",

        formation:
            "ما زالت طرق تكوينه مجالًا مهمًا للبحث",

        fact:
            "هذا النوع أصعب في الرصد من بعض الأنواع الأخرى وما زال العلماء يدرسون أمثلة مرشحة له.",

        size:
            120

    },


    supermassive: {

        name:
            "ثقب أسود فائق الكتلة",

        description:
            "ثقوب سوداء هائلة الكتلة توجد في مراكز كثير من المجرات.",

        mass:
            "من ملايين إلى مليارات الكتل الشمسية",

        location:
            "مراكز المجرات",

        formation:
            "يُعتقد أنها نمت عبر تاريخ طويل من تراكم المادة والاندماجات وعمليات أخرى",

        fact:
            "يوجد في مركز مجرة درب التبانة ثقب أسود فائق الكتلة يسمى Sagittarius A*.",

        size:
            155

    }

};


// ==========================================
// العناصر
// ==========================================

const exploreBtn =
    document.getElementById(
        "exploreBtn"
    );


const simulator =
    document.getElementById(
        "blackHoleSimulator"
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


const typeCards =
    document.querySelectorAll(
        "[data-hole]"
    );


const selectedHole =
    document.getElementById(
        "selectedHole"
    );


const holeName =
    document.getElementById(
        "holeName"
    );


const holeDescription =
    document.getElementById(
        "holeDescription"
    );


const holeMass =
    document.getElementById(
        "holeMass"
    );


const holeLocation =
    document.getElementById(
        "holeLocation"
    );


const holeFormation =
    document.getElementById(
        "holeFormation"
    );


const holeFact =
    document.getElementById(
        "holeFact"
    );


const ship =
    document.getElementById(
        "ship"
    );


const distanceBox =
    document.getElementById(
        "distanceBox"
    );


const shipMessage =
    document.getElementById(
        "shipMessage"
    );


const closerBtn =
    document.getElementById(
        "closerBtn"
    );


const fartherBtn =
    document.getElementById(
        "fartherBtn"
    );


const shipResetBtn =
    document.getElementById(
        "shipResetBtn"
    );


const faqQuestions =
    document.querySelectorAll(
        ".faq-question"
    );


const factBtn =
    document.getElementById(
        "factBtn"
    );


const randomFact =
    document.getElementById(
        "randomFact"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


// ==========================================
// حالات المحاكاة
// ==========================================

let isPaused =
    false;


let isFast =
    false;


// ==========================================
// المركبة
// ==========================================

let shipDistance =
    100;


// ==========================================
// ابدأ الاستكشاف
// ==========================================

exploreBtn.addEventListener(

    "click",

    function () {

        document
            .getElementById(
                "simulationSection"
            )
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }

);


// ==========================================
// إيقاف المحاكاة
// ==========================================

pauseBtn.addEventListener(

    "click",

    function () {

        isPaused =
            !isPaused;


        if (
            isPaused
        ) {

            simulator.classList.add(
                "paused"
            );


            pauseBtn.textContent =
                "▶️ تشغيل الحركة";

        }

        else {

            simulator.classList.remove(
                "paused"
            );


            pauseBtn.textContent =
                "⏸️ إيقاف الحركة";

        }

    }

);


// ==========================================
// تسريع المحاكاة
// ==========================================

speedBtn.addEventListener(

    "click",

    function () {

        isFast =
            !isFast;


        if (
            isFast
        ) {

            simulator.classList.add(
                "fast"
            );


            speedBtn.textContent =
                "🐢 السرعة العادية";

        }

        else {

            simulator.classList.remove(
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

        isPaused =
            false;


        isFast =
            false;


        simulator.classList.remove(
            "paused"
        );


        simulator.classList.remove(
            "fast"
        );


        pauseBtn.textContent =
            "⏸️ إيقاف الحركة";


        speedBtn.textContent =
            "⚡ تسريع";

    }

);


// ==========================================
// عرض نوع الثقب الأسود
// ==========================================

function showBlackHole(
    holeId
) {

    const data =
        blackHolesData[
            holeId
        ];


    if (
        !data
    ) {

        return;

    }


    holeName.textContent =
        data.name;


    holeDescription.textContent =
        data.description;


    holeMass.textContent =
        data.mass;


    holeLocation.textContent =
        data.location;


    holeFormation.textContent =
        data.formation;


    holeFact.textContent =
        data.fact;


    selectedHole.style.width =
        data.size + "px";


    selectedHole.style.height =
        data.size + "px";


    typeCards.forEach(

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
            '[data-hole="' +
            holeId +
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
// الضغط على نوع
// ==========================================

typeCards.forEach(

    function (
        card
    ) {

        card.addEventListener(

            "click",

            function () {

                showBlackHole(
                    card.dataset.hole
                );

            }

        );

    }

);


// ==========================================
// تحديث المركبة
// ==========================================

function updateShip() {

    const minLeft =
        8;


    const maxLeft =
        68;


    const progress =
        (
            100 -
            shipDistance
        )
        /
        100;


    const newLeft =
        minLeft +
        (
            maxLeft -
            minLeft
        )
        *
        progress;


    ship.style.left =
        newLeft + "%";


    distanceBox.textContent =
        "المسافة: " +
        shipDistance +
        "%";


    if (
        shipDistance >= 70
    ) {

        shipMessage.textContent =
            "🚀 المركبة ما زالت بعيدة، وتأثيرات الثقب الأسود أقل شدة هنا.";


        ship.style.filter =
            "none";


        ship.style.transform =
            "translateY(-50%) rotate(45deg) scale(1)";

    }

    else if (
        shipDistance >= 40
    ) {

        shipMessage.textContent =
            "⚠️ المركبة أصبحت أقرب، وتأثير الجاذبية يزداد.";


        ship.style.filter =
            "drop-shadow(0 0 10px #ff9b28)";


        ship.style.transform =
            "translateY(-50%) rotate(45deg) scale(0.95)";

    }

    else if (
        shipDistance >= 20
    ) {

        shipMessage.textContent =
            "⚠️ اقتراب شديد! قوى الجاذبية وتأثيرات النسبية أصبحت أقوى.";


        ship.style.filter =
            "drop-shadow(0 0 16px #ff4b22)";


        ship.style.transform =
            "translateY(-50%) rotate(45deg) scale(0.85)";

    }

    else {

        shipMessage.textContent =
            "🕳️ المركبة قريبة جدًا من منطقة الخطر. هذه محاكاة تعليمية فقط.";


        ship.style.filter =
            "blur(1px) drop-shadow(0 0 20px #ff2500)";


        ship.style.transform =
            "translateY(-50%) rotate(70deg) scale(0.72)";

    }

}


// ==========================================
// الاقتراب
// ==========================================

closerBtn.addEventListener(

    "click",

    function () {

        shipDistance -=
            10;


        if (
            shipDistance < 10
        ) {

            shipDistance =
                10;

        }


        updateShip();

    }

);


// ==========================================
// الابتعاد
// ==========================================

fartherBtn.addEventListener(

    "click",

    function () {

        shipDistance +=
            10;


        if (
            shipDistance > 100
        ) {

            shipDistance =
                100;

        }


        updateShip();

    }

);


// ==========================================
// إعادة المركبة
// ==========================================

shipResetBtn.addEventListener(

    "click",

    function () {

        shipDistance =
            100;


        updateShip();

    }

);


// ==========================================
// الأسئلة
// ==========================================

faqQuestions.forEach(

    function (
        question
    ) {

        question.addEventListener(

            "click",

            function () {

                const answer =
                    question.nextElementSibling;


                answer.classList.toggle(
                    "open"
                );

            }

        );

    }

);


// ==========================================
// معلومات عشوائية
// ==========================================

const facts = [

    "🕳️ أفق الحدث ليس سطحًا صلبًا، بل حد في الزمكان.",

    "✨ العلماء يستطيعون دراسة الثقوب السوداء من تأثيرها في المادة والضوء حولها.",

    "🌌 توجد ثقوب سوداء فائقة الكتلة في مراكز كثير من المجرات.",

    "🌀 المادة في قرص التراكم قد تصبح شديدة الحرارة وتصدر إشعاعًا قويًا.",

    "🌈 الجاذبية تستطيع ثني الضوء، وهي ظاهرة مرتبطة بالنسبية العامة.",

    "⭐ بعض الثقوب السوداء النجمية تتكون بعد انهيار نجوم ضخمة.",

    "📡 في عام 2019 نُشرت أول صورة مباشرة لظل ثقب أسود بواسطة مشروع Event Horizon Telescope.",

    "🌌 الثقب الأسود الموجود في مركز مجرة درب التبانة يسمى Sagittarius A*.",

    "⚫ الثقب الأسود ليس مكنسة كونية تسحب كل شيء من مسافات بعيدة.",

    "⏱️ الجاذبية القوية تؤثر في قياس مرور الزمن."

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
// تشغيل الصفحة
// ==========================================

showBlackHole(
    "stellar"
);


updateShip();