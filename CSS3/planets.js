// ==========================================
// بيانات المجموعة الشمسية
// ==========================================

const planetsData = {

    sun: {

        name: "الشمس",

        preview: "☀️",

        description:
            "الشمس هي النجم الموجود في مركز المجموعة الشمسية، وهي المصدر الرئيسي للضوء والطاقة في مجموعتنا الشمسية.",

        type:
            "نجم",

        position:
            "مركز المجموعة الشمسية",

        moons:
            "لا يوجد",

        year:
            "تدور حول مركز مجرة درب التبانة",

        day:
            "تختلف سرعة الدوران حسب المنطقة",

        diameter:
            "حوالي 1.39 مليون كم",

        temperature:
            "حوالي 5,500°C على السطح",

        fact:
            "يستغرق ضوء الشمس حوالي 8 دقائق و20 ثانية للوصول إلى الأرض."

    },


    mercury: {

        name:
            "عطارد",

        preview:
            "⚪",

        description:
            "عطارد هو أقرب كوكب إلى الشمس، وهو أصغر كواكب المجموعة الشمسية الرئيسية.",

        type:
            "كوكب صخري",

        position:
            "الأول من الشمس",

        moons:
            "0",

        year:
            "حوالي 88 يومًا أرضيًا",

        day:
            "حوالي 59 يومًا أرضيًا للدوران حول المحور",

        diameter:
            "حوالي 4,879 كم",

        temperature:
            "تتغير بشدة بين الليل والنهار",

        fact:
            "سطحه مليء بالفوهات ويشبه سطح القمر من بعض النواحي."

    },


    venus: {

        name:
            "الزهرة",

        preview:
            "🟠",

        description:
            "الزهرة هو ثاني كوكب من الشمس وله غلاف جوي كثيف جدًا غني بثاني أكسيد الكربون.",

        type:
            "كوكب صخري",

        position:
            "الثاني من الشمس",

        moons:
            "0",

        year:
            "حوالي 225 يومًا أرضيًا",

        day:
            "حوالي 243 يومًا أرضيًا",

        diameter:
            "حوالي 12,104 كم",

        temperature:
            "حوالي 465°C",

        fact:
            "الزهرة أكثر كواكب المجموعة الشمسية حرارة على سطحه."

    },


    earth: {

        name:
            "الأرض",

        preview:
            "🌍",

        description:
            "الأرض هي الكوكب الثالث من الشمس والموطن الوحيد المعروف حتى الآن الذي توجد عليه حياة.",

        type:
            "كوكب صخري",

        position:
            "الثالث من الشمس",

        moons:
            "1",

        year:
            "365.25 يوم",

        day:
            "حوالي 24 ساعة",

        diameter:
            "حوالي 12,742 كم",

        temperature:
            "متوسط السطح يقارب 15°C",

        fact:
            "المياه تغطي حوالي 71% من سطح الأرض."

    },


    mars: {

        name:
            "المريخ",

        preview:
            "🔴",

        description:
            "المريخ هو الكوكب الرابع من الشمس ويُعرف باسم الكوكب الأحمر بسبب أكاسيد الحديد الموجودة على سطحه.",

        type:
            "كوكب صخري",

        position:
            "الرابع من الشمس",

        moons:
            "2",

        year:
            "حوالي 687 يومًا أرضيًا",

        day:
            "حوالي 24 ساعة و37 دقيقة",

        diameter:
            "حوالي 6,779 كم",

        temperature:
            "متوسط يقارب -63°C",

        fact:
            "يوجد على المريخ جبل أوليمبوس، وهو من أكبر البراكين المعروفة في المجموعة الشمسية."

    },


    jupiter: {

        name:
            "المشتري",

        preview:
            "🟤",

        description:
            "المشتري هو أكبر كوكب في المجموعة الشمسية ويتكون في معظمه من الهيدروجين والهيليوم.",

        type:
            "عملاق غازي",

        position:
            "الخامس من الشمس",

        moons:
            "عدد كبير من الأقمار",

        year:
            "حوالي 11.86 سنة أرضية",

        day:
            "حوالي 10 ساعات",

        diameter:
            "حوالي 139,820 كم",

        temperature:
            "قمم السحب شديدة البرودة",

        fact:
            "توجد على المشتري العاصفة الشهيرة المسماة البقعة الحمراء العظيمة."

    },


    saturn: {

        name:
            "زحل",

        preview:
            "🪐",

        description:
            "زحل هو الكوكب السادس من الشمس ويشتهر بنظام حلقاته الكبير المكون من الجليد والصخور والغبار.",

        type:
            "عملاق غازي",

        position:
            "السادس من الشمس",

        moons:
            "عدد كبير من الأقمار",

        year:
            "حوالي 29.5 سنة أرضية",

        day:
            "حوالي 10.7 ساعة",

        diameter:
            "حوالي 116,460 كم",

        temperature:
            "شديد البرودة",

        fact:
            "حلقات زحل واسعة جدًا، لكنها رقيقة مقارنة بعرضها."

    },


    uranus: {

        name:
            "أورانوس",

        preview:
            "🔵",

        description:
            "أورانوس هو عملاق جليدي أزرق مائل للأخضر، ويتميز بميل محور دورانه الكبير جدًا.",

        type:
            "عملاق جليدي",

        position:
            "السابع من الشمس",

        moons:
            "عدة أقمار",

        year:
            "حوالي 84 سنة أرضية",

        day:
            "حوالي 17 ساعة",

        diameter:
            "حوالي 50,724 كم",

        temperature:
            "من أبرد أجواء الكواكب",

        fact:
            "أورانوس يدور تقريبًا وهو مستلقٍ على جانبه."

    },


    neptune: {

        name:
            "نبتون",

        preview:
            "🔵",

        description:
            "نبتون هو أبعد الكواكب الرئيسية عن الشمس، وهو عملاق جليدي يتميز بلونه الأزرق.",

        type:
            "عملاق جليدي",

        position:
            "الثامن من الشمس",

        moons:
            "عدة أقمار",

        year:
            "حوالي 165 سنة أرضية",

        day:
            "حوالي 16 ساعة",

        diameter:
            "حوالي 49,244 كم",

        temperature:
            "شديد البرودة",

        fact:
            "توجد في نبتون بعض أسرع الرياح المعروفة في المجموعة الشمسية."

    }

};


// ==========================================
// عناصر النظام الشمسي
// ==========================================

const solarSystem =
    document.getElementById(
        "solarSystem"
    );


const planetButtons =
    document.querySelectorAll(
        "[data-planet]"
    );


// ==========================================
// معلومات الكوكب
// ==========================================

const planetPreview =
    document.getElementById(
        "planetPreview"
    );


const planetName =
    document.getElementById(
        "planetName"
    );


const planetDescription =
    document.getElementById(
        "planetDescription"
    );


const planetType =
    document.getElementById(
        "planetType"
    );


const planetPosition =
    document.getElementById(
        "planetPosition"
    );


const planetMoons =
    document.getElementById(
        "planetMoons"
    );


const planetYear =
    document.getElementById(
        "planetYear"
    );


const planetDay =
    document.getElementById(
        "planetDay"
    );


const planetDiameter =
    document.getElementById(
        "planetDiameter"
    );


const planetTemperature =
    document.getElementById(
        "planetTemperature"
    );


const planetFact =
    document.getElementById(
        "planetFact"
    );


// ==========================================
// أزرار التحكم
// ==========================================

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
// الأرض والقمر
// ==========================================

const earthDemo =
    document.getElementById(
        "earthDemo"
    );


const earthPauseBtn =
    document.getElementById(
        "earthPauseBtn"
    );


// ==========================================
// العودة
// ==========================================

const backBtn =
    document.getElementById(
        "backBtn"
    );


// ==========================================
// حالات البرنامج
// ==========================================

let solarPaused =
    false;


let solarFast =
    false;


let earthPaused =
    false;


// ==========================================
// عرض معلومات كوكب
// ==========================================

function showPlanet(
    planetId
) {

    const planet =
        planetsData[
            planetId
        ];


    if (!planet) {

        return;

    }


    planetPreview.textContent =
        planet.preview;


    planetName.textContent =
        planet.name;


    planetDescription.textContent =
        planet.description;


    planetType.textContent =
        planet.type;


    planetPosition.textContent =
        planet.position;


    planetMoons.textContent =
        planet.moons;


    planetYear.textContent =
        planet.year;


    planetDay.textContent =
        planet.day;


    planetDiameter.textContent =
        planet.diameter;


    planetTemperature.textContent =
        planet.temperature;


    planetFact.textContent =
        planet.fact;


    // إزالة التحديد من الجميع

    planetButtons.forEach(
        function (
            button
        ) {

            button.classList.remove(
                "selected"
            );

        }
    );


    // تحديد الكوكب المختار

    const selectedPlanet =
        document.querySelector(
            '[data-planet="' +
            planetId +
            '"]'
        );


    if (selectedPlanet) {

        selectedPlanet.classList.add(
            "selected"
        );

    }

}


// ==========================================
// الضغط على أي كوكب
// ==========================================

planetButtons.forEach(

    function (
        button
    ) {

        button.addEventListener(

            "click",

            function () {

                const planetId =
                    button.dataset.planet;


                showPlanet(
                    planetId
                );

            }

        );

    }

);


// ==========================================
// إيقاف وتشغيل النظام الشمسي
// ==========================================

pauseBtn.addEventListener(

    "click",

    function () {

        solarPaused =
            !solarPaused;


        if (
            solarPaused
        ) {

            solarSystem.classList.add(
                "paused"
            );


            pauseBtn.textContent =
                "▶️ تشغيل الحركة";

        }

        else {

            solarSystem.classList.remove(
                "paused"
            );


            pauseBtn.textContent =
                "⏸️ إيقاف الحركة";

        }

    }

);


// ==========================================
// تسريع النظام الشمسي
// ==========================================

speedBtn.addEventListener(

    "click",

    function () {

        solarFast =
            !solarFast;


        if (
            solarFast
        ) {

            solarSystem.classList.add(
                "fast"
            );


            speedBtn.textContent =
                "🐢 السرعة العادية";

        }

        else {

            solarSystem.classList.remove(
                "fast"
            );


            speedBtn.textContent =
                "⚡ تسريع";

        }

    }

);


// ==========================================
// إعادة النظام للوضع الطبيعي
// ==========================================

resetBtn.addEventListener(

    "click",

    function () {

        solarPaused =
            false;


        solarFast =
            false;


        solarSystem.classList.remove(
            "paused"
        );


        solarSystem.classList.remove(
            "fast"
        );


        pauseBtn.textContent =
            "⏸️ إيقاف الحركة";


        speedBtn.textContent =
            "⚡ تسريع";

    }

);


// ==========================================
// الأرض والقمر
// ==========================================

earthPauseBtn.addEventListener(

    "click",

    function () {

        earthPaused =
            !earthPaused;


        if (
            earthPaused
        ) {

            earthDemo.classList.add(
                "paused"
            );


            earthPauseBtn.textContent =
                "▶️ تشغيل الأرض والقمر";

        }

        else {

            earthDemo.classList.remove(
                "paused"
            );


            earthPauseBtn.textContent =
                "⏸️ إيقاف الأرض والقمر";

        }

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
// تشغيل الصفحة لأول مرة
// ==========================================

showPlanet(
    "earth"
);