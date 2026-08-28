// ==========================================
// بيانات الأنظمة
// ==========================================

const systems = {

    ai: {

        name:
            "Vertex AI",

        icon:
            "🤖",

        page:
            "ai.html"

    },


    robots: {

        name:
            "Vertex Robots",

        icon:
            "🦾",

        page:
            "robots.html"

    },


    games: {

        name:
            "Vertex Games",

        icon:
            "🎮",

        page:
            "games.html"

    },


    web: {

        name:
            "Vertex Web",

        icon:
            "🌐",

        page:
            "web.html"

    },


    space: {

        name:
            "Vertex Space",

        icon:
            "🌌",

        page:
            "space.html"

    }

};


// ==========================================
// عناصر الصفحة
// ==========================================

const homeBtn =
    document.getElementById(
        "homeBtn"
    );


const backHomeBtn =
    document.getElementById(
        "backHomeBtn"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const nameInput =
    document.getElementById(
        "nameInput"
    );


const emailInput =
    document.getElementById(
        "emailInput"
    );


const passwordInput =
    document.getElementById(
        "passwordInput"
    );


const rememberMe =
    document.getElementById(
        "rememberMe"
    );


const togglePasswordBtn =
    document.getElementById(
        "togglePasswordBtn"
    );


const nameError =
    document.getElementById(
        "nameError"
    );


const emailError =
    document.getElementById(
        "emailError"
    );


const passwordError =
    document.getElementById(
        "passwordError"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


const submitBtn =
    document.getElementById(
        "submitBtn"
    );


const requestedSystemIcon =
    document.getElementById(
        "requestedSystemIcon"
    );


const requestedSystemName =
    document.getElementById(
        "requestedSystemName"
    );


// ==========================================
// الجلسة السابقة
// ==========================================

const existingSession =
    document.getElementById(
        "existingSession"
    );


const sessionUserName =
    document.getElementById(
        "sessionUserName"
    );


const continueSessionBtn =
    document.getElementById(
        "continueSessionBtn"
    );


const differentAccountBtn =
    document.getElementById(
        "differentAccountBtn"
    );


// ==========================================
// Modal
// ==========================================

const forgotPasswordBtn =
    document.getElementById(
        "forgotPasswordBtn"
    );


const forgotModal =
    document.getElementById(
        "forgotModal"
    );


const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );


const modalOkBtn =
    document.getElementById(
        "modalOkBtn"
    );


const modalOverlay =
    document.querySelector(
        ".modal-overlay"
    );


// ==========================================
// Particles
// ==========================================

const particles =
    document.getElementById(
        "particles"
    );


// ==========================================
// النظام المطلوب
// ==========================================

let requestedSystem =
    localStorage.getItem(
        "vertexRequestedSystem"
    );


// ==========================================
// الصفحة التي سيتم فتحها
// ==========================================

function getDestinationPage() {

    if (
        requestedSystem &&
        systems[requestedSystem]
    ) {

        return systems[
            requestedSystem
        ].page;

    }


    return "dashboard.html";

}


// ==========================================
// عرض النظام المطلوب
// ==========================================

function updateRequestedSystem() {

    if (
        requestedSystem &&
        systems[requestedSystem]
    ) {

        const system =
            systems[
                requestedSystem
            ];


        requestedSystemIcon.textContent =
            system.icon;


        requestedSystemName.textContent =
            system.name;

    }

    else {

        requestedSystemIcon.textContent =
            "📊";


        requestedSystemName.textContent =
            "لوحة التحكم";

    }

}


// ==========================================
// العودة للرئيسية
// ==========================================

function goHome() {

    window.location.href =
        "index.html";

}


homeBtn.addEventListener(
    "click",
    goHome
);


backHomeBtn.addEventListener(
    "click",
    goHome
);


// ==========================================
// إظهار / إخفاء كلمة المرور
// ==========================================

togglePasswordBtn.addEventListener(

    "click",

    function () {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";


            togglePasswordBtn.textContent =
                "🙈";


            togglePasswordBtn.setAttribute(
                "aria-label",
                "إخفاء كلمة المرور"
            );

        }

        else {

            passwordInput.type =
                "password";


            togglePasswordBtn.textContent =
                "👁️";


            togglePasswordBtn.setAttribute(
                "aria-label",
                "إظهار كلمة المرور"
            );

        }

    }

);


// ==========================================
// تنظيف الأخطاء
// ==========================================

function clearErrors() {

    nameError.textContent =
        "";


    emailError.textContent =
        "";


    passwordError.textContent =
        "";


    const wrappers =
        document.querySelectorAll(
            ".input-wrapper"
        );


    wrappers.forEach(

        function (
            wrapper
        ) {

            wrapper.classList.remove(
                "error"
            );

        }

    );

}


// ==========================================
// وضع خطأ
// ==========================================

function showFieldError(
    input,
    errorElement,
    message
) {

    errorElement.textContent =
        message;


    const wrapper =
        input.closest(
            ".input-wrapper"
        );


    if (
        wrapper
    ) {

        wrapper.classList.add(
            "error"
        );

    }

}


// ==========================================
// التحقق من البريد
// ==========================================

function isValidEmail(
    email
) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return pattern.test(
        email
    );

}


// ==========================================
// التحقق من النموذج
// ==========================================

function validateForm() {

    clearErrors();


    const name =
        nameInput
            .value
            .trim();


    const email =
        emailInput
            .value
            .trim();


    const password =
        passwordInput
            .value;


    let valid =
        true;


    // الاسم

    if (
        name.length <
        2
    ) {

        showFieldError(

            nameInput,

            nameError,

            "اكتب اسمًا من حرفين على الأقل."

        );


        valid =
            false;

    }


    // البريد

    if (
        email ===
        ""
    ) {

        showFieldError(

            emailInput,

            emailError,

            "اكتب البريد الإلكتروني."

        );


        valid =
            false;

    }

    else if (
        !isValidEmail(
            email
        )
    ) {

        showFieldError(

            emailInput,

            emailError,

            "صيغة البريد الإلكتروني غير صحيحة."

        );


        valid =
            false;

    }


    // كلمة المرور

    if (
        password.length <
        4
    ) {

        showFieldError(

            passwordInput,

            passwordError,

            "كلمة المرور يجب أن تكون 4 أحرف على الأقل."

        );


        valid =
            false;

    }


    return valid;

}


// ==========================================
// عرض رسالة
// ==========================================

function showFormMessage(
    message,
    type
) {

    formMessage.textContent =
        message;


    formMessage.className =
        "form-message visible " +
        type;

}


// ==========================================
// إخفاء الرسالة
// ==========================================

function hideFormMessage() {

    formMessage.className =
        "form-message";


    formMessage.textContent =
        "";

}


// ==========================================
// حالة التحميل
// ==========================================

function setLoading(
    loading
) {

    if (
        loading
    ) {

        submitBtn.classList.add(
            "loading"
        );


        submitBtn.disabled =
            true;

    }

    else {

        submitBtn.classList.remove(
            "loading"
        );


        submitBtn.disabled =
            false;

    }

}


// ==========================================
// حفظ البريد إذا اختار تذكرني
// ==========================================

function saveRememberedEmail(
    email
) {

    if (
        rememberMe.checked
    ) {

        localStorage.setItem(
            "vertexRememberedEmail",
            email
        );

    }

    else {

        localStorage.removeItem(
            "vertexRememberedEmail"
        );

    }

}


// ==========================================
// إنشاء جلسة
// ==========================================

function createSession(
    name,
    email
) {

    const session = {

        name:
            name,

        email:
            email,

        loginAt:
            new Date()
                .toISOString()

    };


    localStorage.setItem(

        "vertexSession",

        JSON.stringify(
            session
        )

    );

}


// ==========================================
// تنفيذ تسجيل الدخول
// ==========================================

loginForm.addEventListener(

    "submit",

    function (
        event
    ) {

        event.preventDefault();


        hideFormMessage();


        const valid =
            validateForm();


        if (
            !valid
        ) {

            showFormMessage(
                "⚠️ تأكد من البيانات المكتوبة.",
                "error"
            );


            return;

        }


        const name =
            nameInput
                .value
                .trim();


        const email =
            emailInput
                .value
                .trim();


        setLoading(
            true
        );


        // ======================================
        // محاكاة تسجيل الدخول
        // ======================================

        setTimeout(

            function () {

                createSession(
                    name,
                    email
                );


                saveRememberedEmail(
                    email
                );


                showFormMessage(
                    "✅ تم تسجيل الدخول بنجاح.",
                    "success"
                );


                setTimeout(

                    function () {

                        const destination =
                            getDestinationPage();


                        // بعد معرفة الوجهة نحذف الطلب
                        // حتى لا يبقى في تسجيل الدخول القادم

                        localStorage.removeItem(
                            "vertexRequestedSystem"
                        );


                        window.location.href =
                            destination;

                    },

                    600

                );

            },

            800

        );

    }

);


// ==========================================
// إزالة الخطأ عند الكتابة
// ==========================================

[
    nameInput,
    emailInput,
    passwordInput

].forEach(

    function (
        input
    ) {

        input.addEventListener(

            "input",

            function () {

                const wrapper =
                    input.closest(
                        ".input-wrapper"
                    );


                if (
                    wrapper
                ) {

                    wrapper.classList.remove(
                        "error"
                    );

                }


                hideFormMessage();

            }

        );

    }

);


// ==========================================
// تحميل البريد المحفوظ
// ==========================================

function loadRememberedEmail() {

    const rememberedEmail =
        localStorage.getItem(
            "vertexRememberedEmail"
        );


    if (
        rememberedEmail
    ) {

        emailInput.value =
            rememberedEmail;


        rememberMe.checked =
            true;

    }

}


// ==========================================
// قراءة الجلسة الحالية
// ==========================================

function getCurrentSession() {

    const storedSession =
        localStorage.getItem(
            "vertexSession"
        );


    if (
        !storedSession
    ) {

        return null;

    }


    try {

        const session =
            JSON.parse(
                storedSession
            );


        if (
            !session ||
            !session.name ||
            !session.email
        ) {

            return null;

        }


        return session;

    }

    catch (
        error
    ) {

        return null;

    }

}


// ==========================================
// عرض الجلسة الحالية
// ==========================================

function checkExistingSession() {

    const session =
        getCurrentSession();


    if (
        !session
    ) {

        existingSession.classList.remove(
            "visible"
        );


        loginForm.style.display =
            "block";


        return;

    }


    sessionUserName.textContent =
        session.name;


    existingSession.classList.add(
        "visible"
    );


    loginForm.style.display =
        "none";

}


// ==========================================
// متابعة الجلسة الحالية
// ==========================================

continueSessionBtn.addEventListener(

    "click",

    function () {

        const destination =
            getDestinationPage();


        localStorage.removeItem(
            "vertexRequestedSystem"
        );


        window.location.href =
            destination;

    }

);


// ==========================================
// استخدام حساب آخر
// ==========================================

differentAccountBtn.addEventListener(

    "click",

    function () {

        localStorage.removeItem(
            "vertexSession"
        );


        existingSession.classList.remove(
            "visible"
        );


        loginForm.style.display =
            "block";


        passwordInput.value =
            "";


        nameInput.focus();

    }

);


// ==========================================
// نافذة نسيت كلمة المرور
// ==========================================

function openForgotModal() {

    forgotModal.classList.add(
        "visible"
    );

}


function closeForgotModal() {

    forgotModal.classList.remove(
        "visible"
    );

}


forgotPasswordBtn.addEventListener(
    "click",
    openForgotModal
);


closeModalBtn.addEventListener(
    "click",
    closeForgotModal
);


modalOkBtn.addEventListener(
    "click",
    closeForgotModal
);


modalOverlay.addEventListener(
    "click",
    closeForgotModal
);


// ==========================================
// Escape يغلق النافذة
// ==========================================

document.addEventListener(

    "keydown",

    function (
        event
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeForgotModal();

        }

    }

);


// ==========================================
// إنشاء الجزيئات
// ==========================================

function createParticles() {

    const numberOfParticles =
        45;


    for (
        let i = 0;
        i < numberOfParticles;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "particle";


        particle.style.left =
            Math.random() *
            100 +
            "%";


        particle.style.top =
            Math.random() *
            100 +
            "%";


        particle.style.setProperty(

            "--duration",

            (
                2 +
                Math.random() *
                5
            )
            +
            "s"

        );


        particle.style.setProperty(

            "--delay",

            (
                Math.random() *
                -5
            )
            +
            "s"

        );


        particles.appendChild(
            particle
        );

    }

}


// ==========================================
// تشغيل الصفحة
// ==========================================

updateRequestedSystem();


loadRememberedEmail();


checkExistingSession();


createParticles();