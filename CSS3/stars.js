// ==========================================
// بيانات النجوم
// ==========================================

const starsData = {

    redDwarf: {

        name:
            "القزم الأحمر",

        className:
            "red-dwarf",

        description:
            "القزم الأحمر نجم صغير وبارد نسبيًا مقارنة بالنجوم الأكبر، ويستطيع الاستمرار لفترات زمنية هائلة بسبب استهلاكه البطيء للوقود.",

        temperature:
            "حوالي 2,500 إلى 4,000 كلفن",

        size:
            "أصغر من الشمس غالبًا",

        color:
            "أحمر إلى برتقالي",

        lifetime:
            "يمكن أن يعيش فترات هائلة جدًا",

        fact:
            "الأقزام الحمراء من أكثر أنواع النجوم انتشارًا في مجرتنا.",

        energy:
            "اندماج الهيدروجين"

    },


    sunLike: {

        name:
            "نجم شبيه بالشمس",

        className:
            "sun-like",

        description:
            "نجم متوسط الكتلة مثل الشمس، يقضي معظم حياته في دمج الهيدروجين إلى هيليوم داخل قلبه.",

        temperature:
            "الشمس حوالي 5,778 كلفن عند السطح",

        size:
            "متوسط",

        color:
            "أبيض مائل إلى الأصفر",

        lifetime:
            "نحو مليارات السنين",

        fact:
            "شمسنا نجم من النوع الطيفي G.",

        energy:
            "اندماج الهيدروجين إلى هيليوم"

    },


    blueGiant: {

        name:
            "العملاق الأزرق",

        className:
            "blue-giant",

        description:
            "نجم ضخم شديد الحرارة والسطوع، لكنه يستهلك وقوده بسرعة أكبر بكثير من النجوم الصغيرة.",

        temperature:
            "قد تتجاوز 20,000 كلفن",

        size:
            "أكبر بكثير من الشمس",

        color:
            "أزرق أو أزرق مائل للأبيض",

        lifetime:
            "أقصر من النجوم الصغيرة",

        fact:
            "ارتفاع حرارته هو سبب ظهوره باللون الأزرق.",

        energy:
            "اندماج نووي شديد وسريع"

    },


    redGiant: {

        name:
            "العملاق الأحمر",

        className:
            "red-giant",

        description:
            "مرحلة يصل إليها بعض النجوم عندما يبدأ وقود الهيدروجين في قلبها بالنفاد، فتتمدد طبقاتها الخارجية بشكل كبير.",

        temperature:
            "سطحه أبرد نسبيًا من بعض النجوم الزرقاء",

        size:
            "ضخم جدًا",

        color:
            "أحمر أو برتقالي",

        lifetime:
            "مرحلة متأخرة من حياة النجم",

        fact:
            "من المتوقع أن تصبح الشمس عملاقًا أحمر في المستقبل البعيد جدًا.",

        energy:
            "اندماج عناصر مختلفة حسب المرحلة"

    },


    whiteDwarf: {

        name:
            "القزم الأبيض",

        className:
            "white-dwarf",

        description:
            "القزم الأبيض هو البقايا الكثيفة الساخنة التي قد تبقى بعد انتهاء حياة نجم صغير أو متوسط.",

        temperature:
            "قد يكون شديد الحرارة في البداية",

        size:
            "قريب من حجم الأرض تقريبًا",

        color:
            "أبيض",

        lifetime:
            "يبرد ببطء شديد",

        fact:
            "رغم صغر حجمه يمكن أن يحتوي على كتلة كبيرة جدًا.",

        energy:
            "لا يعتمد على اندماج نووي مستمر مثل النجم العادي"

    },


    neutronStar: {

        name:
            "النجم النيوتروني",

        className:
            "neutron-star",

        description:
            "نجم نيوتروني هو بقايا شديدة الكثافة قد تتكون بعد انفجار نجم ضخم كمستعر أعظم.",

        temperature:
            "قد يكون شديد الحرارة",

        size:
            "قطره عشرات الكيلومترات تقريبًا",

        color:
            "قد يظهر أبيض أو أزرق شديد",

        lifetime:
            "يمكن أن يستمر فترة طويلة جدًا",

        fact:
            "النجم النيوتروني صغير جدًا مقارنة بالشمس لكنه شديد الكثافة.",

        energy:
            "دوران ومجالات مغناطيسية وإشعاع"

    }

};


// ==========================================
// عناصر الصفحة
// ==========================================

const exploreBtn =
    document.getElementById(
        "exploreBtn"
    );


const starCards =
    document.querySelectorAll(
        "[data-star]"
    );


const selectedStarVisual =
    document.getElementById(
        "selectedStarVisual"
    );


const starName =
    document.getElementById(
        "starName"
    );


const starDescription =
    document.getElementById(
        "starDescription"
    );


const starTemperature =
    document.getElementById(
        "starTemperature"
    );


const starSize =
    document.getElementById(
        "starSize"
    );


const starColor =
    document.getElementById(
        "starColor"
    );


const starLifetime =
    document.getElementById(
        "starLifetime"
    );


const starFact =
    document.getElementById(
        "starFact"
    );


const starEnergy =
    document.getElementById(
        "starEnergy"
    );


const pulsarSpace =
    document.getElementById(
        "pulsarSpace"
    );


const pulsarBtn =
    document.getElementById(
        "pulsarBtn"
    );


const randomFact =
    document.getElementById(
        "randomFact"
    );


const factBtn =
    document.getElementById(
        "factBtn"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


// ==========================================
// حالة النجم النابض
// ==========================================

let pulsarPaused =
    false;


// ==========================================
// عرض معلومات النجم
// ==========================================

function showStar(
    starId
) {

    const star =
        starsData[
            starId
        ];


    if (!star) {

        return;

    }


    starName.textContent =
        star.name;


    starDescription.textContent =
        star.description;


    starTemperature.textContent =
        star.temperature;


    starSize.textContent =
        star.size;


    starColor.textContent =
        star.color;


    starLifetime.textContent =
        star.lifetime;


    starFact.textContent =
        star.fact;


    starEnergy.textContent =
        star.energy;


    // ======================================
    // تغيير شكل النجم الكبير
    // ======================================

    selectedStarVisual.className =
        "selected-star " +
        star.className;


    // ======================================
    // إزالة التحديد القديم
    // ======================================

    starCards.forEach(
        function (
            card
        ) {

            card.classList.remove(
                "selected"
            );

        }
    );


    // ======================================
    // تحديد البطاقة الجديدة
    // ======================================

    const selectedCard =
        document.querySelector(
            '[data-star="' +
            starId +
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
// الضغط على بطاقة نجم
// ==========================================

starCards.forEach(

    function (
        card
    ) {

        card.addEventListener(

            "click",

            function () {

                const starId =
                    card.dataset.star;


                showStar(
                    starId
                );

            }

        );

    }

);


// ==========================================
// زر ابدأ الاستكشاف
// ==========================================

exploreBtn.addEventListener(

    "click",

    function () {

        document
            .getElementById(
                "starTypes"
            )
            .scrollIntoView({
                behavior:
                    "smooth"
            });

    }

);


// ==========================================
// إيقاف وتشغيل النجم النابض
// ==========================================

pulsarBtn.addEventListener(

    "click",

    function () {

        pulsarPaused =
            !pulsarPaused;


        if (
            pulsarPaused
        ) {

            pulsarSpace.classList.add(
                "paused"
            );


            pulsarBtn.textContent =
                "▶️ تشغيل النجم النابض";

        }

        else {

            pulsarSpace.classList.remove(
                "paused"
            );


            pulsarBtn.textContent =
                "⏸️ إيقاف النجم النابض";

        }

    }

);


// ==========================================
// معلومات نجمية عشوائية
// ==========================================

const facts = [

    "⭐ الشمس نجم واحد من عدد هائل من النجوم في مجرة درب التبانة.",

    "🌈 لون النجم يساعد العلماء على معرفة درجة حرارة سطحه.",

    "🔵 النجوم الزرقاء عادة أكثر حرارة من النجوم الحمراء.",

    "🔴 القزم الأحمر يستهلك وقوده ببطء شديد مقارنة بالنجوم الضخمة.",

    "💥 بعض النجوم الضخمة تنتهي بانفجار يسمى المستعر الأعظم.",

    "🌀 بعض بقايا المستعرات العظمى تتحول إلى نجوم نيوترونية.",

    "🕳️ بعض النجوم شديدة الضخامة يمكن أن تترك وراءها ثقوبًا سوداء.",

    "☀️ الطاقة في قلب الشمس تنتج أساسًا من اندماج الهيدروجين إلى هيليوم.",

    "✨ معظم النجوم التي تراها ليلًا بعيدة جدًا عن الأرض.",

    "🌌 النجوم تتكون داخل مناطق تحتوي على الغاز والغبار تسمى السدم."

];


// ==========================================
// معلومة عشوائية
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

showStar(
    "sunLike"
);