// ==========================================
// بيانات أنواع المجرات
// ==========================================

const galaxiesData = {

    spiral: {

        name:
            "مجرة حلزونية",

        className:
            "spiral-preview",

        description:
            "المجرة الحلزونية تحتوي عادة على قرص وأذرع حلزونية تمتد حول منطقة مركزية.",

        shape:
            "قرص مع أذرع حلزونية",

        stars:
            "تحتوي على أعداد هائلة من النجوم",

        gas:
            "يمكن أن تحتوي على كميات كبيرة من الغاز والغبار",

        example:
            "مجرة درب التبانة"

    },


    elliptical: {

        name:
            "مجرة إهليلجية",

        className:
            "elliptical-preview",

        description:
            "المجرات الإهليلجية تكون أقرب للشكل الكروي أو البيضاوي ولا تظهر فيها أذرع حلزونية واضحة.",

        shape:
            "كروي أو بيضاوي",

        stars:
            "تحتوي على أعداد كبيرة جدًا من النجوم",

        gas:
            "عادة أقل في الغاز البارد والغبار مقارنة بكثير من المجرات الحلزونية",

        example:
            "Messier 87 مثال مشهور"

    },


    irregular: {

        name:
            "مجرة غير منتظمة",

        className:
            "irregular-preview",

        description:
            "المجرات غير المنتظمة لا تمتلك شكلًا منتظمًا واضحًا مثل الشكل الحلزوني أو الإهليلجي.",

        shape:
            "غير منتظم",

        stars:
            "تحتوي على نجوم من أعمار مختلفة",

        gas:
            "قد تحتوي على كميات كبيرة من الغاز والغبار",

        example:
            "سحابتا ماجلان من الأمثلة القريبة"

    },


    lenticular: {

        name:
            "مجرة عدسية",

        className:
            "lenticular-preview",

        description:
            "المجرة العدسية تمتلك قرصًا وانتفاخًا مركزيًا لكنها لا تظهر أذرعًا حلزونية واضحة مثل المجرات الحلزونية.",

        shape:
            "قرص وعدسة مركزية",

        stars:
            "تحتوي على عدد ضخم من النجوم",

        gas:
            "عادة أقل في الغاز البارد من المجرات الحلزونية",

        example:
            "NGC 5866 مثال معروف"

    }

};


// ==========================================
// عناصر الصفحة
// ==========================================

const exploreBtn =
    document.getElementById(
        "exploreBtn"
    );


const galaxySimulator =
    document.getElementById(
        "galaxySimulator"
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


const galaxyCards =
    document.querySelectorAll(
        "[data-galaxy]"
    );


const selectedGalaxyVisual =
    document.getElementById(
        "selectedGalaxyVisual"
    );


const galaxyName =
    document.getElementById(
        "galaxyName"
    );


const galaxyDescription =
    document.getElementById(
        "galaxyDescription"
    );


const galaxyShape =
    document.getElementById(
        "galaxyShape"
    );


const galaxyStars =
    document.getElementById(
        "galaxyStars"
    );


const galaxyGas =
    document.getElementById(
        "galaxyGas"
    );


const galaxyExample =
    document.getElementById(
        "galaxyExample"
    );


const locationBtn =
    document.getElementById(
        "locationBtn"
    );


const solarLocation =
    document.getElementById(
        "solarLocation"
    );


const solarLabel =
    document.getElementById(
        "solarLabel"
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
// الحالات
// ==========================================

let galaxyPaused =
    false;


let galaxyFast =
    false;


let locationVisible =
    false;


// ==========================================
// زر بدء الاستكشاف
// ==========================================

exploreBtn.addEventListener(

    "click",

    function () {

        document
            .getElementById(
                "galaxySimulation"
            )
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }

);


// ==========================================
// إيقاف وتشغيل المجرة
// ==========================================

pauseBtn.addEventListener(

    "click",

    function () {

        galaxyPaused =
            !galaxyPaused;


        if (
            galaxyPaused
        ) {

            galaxySimulator.classList.add(
                "paused"
            );


            pauseBtn.textContent =
                "▶️ تشغيل الحركة";

        }

        else {

            galaxySimulator.classList.remove(
                "paused"
            );


            pauseBtn.textContent =
                "⏸️ إيقاف الحركة";

        }

    }

);


// ==========================================
// تسريع المجرة
// ==========================================

speedBtn.addEventListener(

    "click",

    function () {

        galaxyFast =
            !galaxyFast;


        if (
            galaxyFast
        ) {

            galaxySimulator.classList.add(
                "fast"
            );


            speedBtn.textContent =
                "🐢 السرعة العادية";

        }

        else {

            galaxySimulator.classList.remove(
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

        galaxyPaused =
            false;


        galaxyFast =
            false;


        galaxySimulator.classList.remove(
            "paused"
        );


        galaxySimulator.classList.remove(
            "fast"
        );


        pauseBtn.textContent =
            "⏸️ إيقاف الحركة";


        speedBtn.textContent =
            "⚡ تسريع";

    }

);


// ==========================================
// عرض نوع المجرة
// ==========================================

function showGalaxy(
    galaxyId
) {

    const galaxy =
        galaxiesData[
            galaxyId
        ];


    if (
        !galaxy
    ) {

        return;

    }


    galaxyName.textContent =
        galaxy.name;


    galaxyDescription.textContent =
        galaxy.description;


    galaxyShape.textContent =
        galaxy.shape;


    galaxyStars.textContent =
        galaxy.stars;


    galaxyGas.textContent =
        galaxy.gas;


    galaxyExample.textContent =
        galaxy.example;


    selectedGalaxyVisual.className =
        "selected-galaxy " +
        galaxy.className;


    galaxyCards.forEach(

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
            '[data-galaxy="' +
            galaxyId +
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
// الضغط على نوع المجرة
// ==========================================

galaxyCards.forEach(

    function (
        card
    ) {

        card.addEventListener(

            "click",

            function () {

                showGalaxy(
                    card.dataset.galaxy
                );

            }

        );

    }

);


// ==========================================
// إظهار موقع النظام الشمسي
// ==========================================

locationBtn.addEventListener(

    "click",

    function () {

        locationVisible =
            !locationVisible;


        if (
            locationVisible
        ) {

            solarLocation.classList.add(
                "visible"
            );


            solarLabel.classList.add(
                "visible"
            );


            locationBtn.textContent =
                "❌ إخفاء موقع النظام الشمسي";

        }

        else {

            solarLocation.classList.remove(
                "visible"
            );


            solarLabel.classList.remove(
                "visible"
            );


            locationBtn.textContent =
                "☀️ إظهار موقع النظام الشمسي";

        }

    }

);


// ==========================================
// الضغط على الشمس داخل المجرة
// ==========================================

solarLocation.addEventListener(

    "click",

    function () {

        alert(
            "☀️ هنا تقريبًا نوضح موقع نظامنا الشمسي داخل أحد أذرع مجرة درب التبانة."
        );

    }

);


// ==========================================
// معلومات عشوائية
// ==========================================

const facts = [

    "🌌 نظامنا الشمسي يقع داخل مجرة درب التبانة.",

    "⭐ المجرات قد تحتوي على ملايين أو مليارات أو حتى أعداد أكبر من النجوم.",

    "🌀 درب التبانة مجرة حلزونية قضيبية.",

    "🌌 أندروميدا من أقرب المجرات الكبيرة إلى درب التبانة.",

    "🕳️ يوجد في مركز درب التبانة ثقب أسود فائق الكتلة يسمى Sagittarius A*.",

    "☁️ الغاز والغبار داخل بعض المجرات يمكن أن يكونا مناطق لتكوين نجوم جديدة.",

    "🌑 المادة المظلمة لا تُرى مباشرة، لكن العلماء يستدلون عليها من تأثيرات الجاذبية.",

    "✨ المجرات يمكن أن تتفاعل أو تندمج مع بعضها بسبب الجاذبية.",

    "🔭 عندما ننظر إلى مجرة بعيدة جدًا فنحن نراها كما كانت في الماضي لأن ضوءها احتاج وقتًا طويلًا ليصل إلينا.",

    "🌌 توجد أنواع مختلفة من المجرات، منها الحلزونية والإهليلجية وغير المنتظمة والعدسية."

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
// العودة إلى Vertex Space
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

showGalaxy(
    "spiral"
);