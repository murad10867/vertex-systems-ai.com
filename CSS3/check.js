// ==========================================
// Vertex Systems AI
// Final System Check
// ==========================================


// ==========================================
// صفحات Version 1
// ==========================================

const htmlPages = [

    "index.html",
    "login.html",
    "dashboard.html",
    "projects.html",

    "ai.html",
    "robots.html",
    "games.html",
    "web.html",

    "space.html",

    "minecraft.html",

    "planets.html",
    "stars.html",
    "black-holes.html",
    "galaxies.html",
    "moons.html",
    "exploration.html"

];


// ==========================================
// ملفات CSS المهمة
// ==========================================

const cssFiles = [

    "style.css",
    "login.css",
    "dashboard.css",
    "projects.css",

    "ai.css",
    "robots.css",
    "games.css",
    "web.css",

    "space.css",

    "minecraft.css",

    "planets.css",
    "stars.css",
    "black-holes.css",
    "galaxies.css",
    "moons.css",
    "exploration.css",

    "check.css"

];


// ==========================================
// ملفات JavaScript
// ==========================================

const jsFiles = [

    "script.js",
    "login.js",
    "dashboard.js",
    "projects.js",

    "auth.js",
    "vertex-userbar.js",

    "ai.js",
    "robots.js",
    "games.js",
    "web.js",

    "space.js",

    "minecraft.js",

    "planets.js",
    "stars.js",
    "black-holes.js",
    "galaxies.js",
    "moons.js",
    "exploration.js",

    "check.js"

];


// ==========================================
// الصفحات المحمية
// ==========================================

const protectedPages = [

    "dashboard.html",
    "projects.html",

    "ai.html",
    "robots.html",
    "games.html",
    "web.html",

    "space.html",

    "minecraft.html",

    "planets.html",
    "stars.html",
    "black-holes.html",
    "galaxies.html",
    "moons.html",
    "exploration.html"

];


// ==========================================
// LocalStorage
// ==========================================

const vertexStorageKeys = [

    "vertexSession",
    "vertexRequestedSystem",
    "vertexReturnPage",

    "vertexChatHistory",
    "vertexMemories",
    "vertexAIConversations",
    "vertexAISettings",

    "vertexWebProject",

    "vertexSpaceMissionLog",

    "vertexGamesLastProject"

];


// ==========================================
// DOM
// ==========================================

const runCheckBtn =
    document.getElementById(
        "runCheckBtn"
    );


const runAgainBtn =
    document.getElementById(
        "runAgainBtn"
    );


const homeBtn =
    document.getElementById(
        "homeBtn"
    );


const dashboardBtn =
    document.getElementById(
        "dashboardBtn"
    );


const totalTests =
    document.getElementById(
        "totalTests"
    );


const passedTests =
    document.getElementById(
        "passedTests"
    );


const failedTests =
    document.getElementById(
        "failedTests"
    );


const scoreValue =
    document.getElementById(
        "scoreValue"
    );


const progressFill =
    document.getElementById(
        "progressFill"
    );


const progressText =
    document.getElementById(
        "progressText"
    );


const checkStatus =
    document.getElementById(
        "checkStatus"
    );


const filesResults =
    document.getElementById(
        "filesResults"
    );


const htmlResults =
    document.getElementById(
        "htmlResults"
    );


const jsResults =
    document.getElementById(
        "jsResults"
    );


const authResults =
    document.getElementById(
        "authResults"
    );


const storageResults =
    document.getElementById(
        "storageResults"
    );


const filesBadge =
    document.getElementById(
        "filesBadge"
    );


const htmlBadge =
    document.getElementById(
        "htmlBadge"
    );


const jsBadge =
    document.getElementById(
        "jsBadge"
    );


const authBadge =
    document.getElementById(
        "authBadge"
    );


const storageBadge =
    document.getElementById(
        "storageBadge"
    );


const finalResult =
    document.getElementById(
        "finalResult"
    );


const finalIcon =
    document.getElementById(
        "finalIcon"
    );


const finalTitle =
    document.getElementById(
        "finalTitle"
    );


const finalMessage =
    document.getElementById(
        "finalMessage"
    );


// ==========================================
// نتائج
// ==========================================

let checks = [];


// ==========================================
// Fetch
// ==========================================

async function fetchFile(
    path
) {

    try {

        const response =
            await fetch(

                path,

                {
                    cache:
                        "no-store"
                }

            );


        if (
            !response.ok
        ) {

            return {

                exists:
                    false,

                status:
                    response.status,

                text:
                    ""

            };

        }


        return {

            exists:
                true,

            status:
                response.status,

            text:
                await response.text()

        };

    }

    catch (
        error
    ) {

        return {

            exists:
                false,

            status:
                0,

            text:
                "",

            error:
                error.message

        };

    }

}


// ==========================================
// إضافة نتيجة
// ==========================================

function addCheck(
    group,
    name,
    passed,
    message
) {

    checks.push({

        group:
            group,

        name:
            name,

        passed:
            passed,

        message:
            message

    });


    updateSummary();

}


// ==========================================
// Progress
// ==========================================

function updateSummary() {

    const total =
        checks.length;


    const passed =
        checks.filter(

            function (
                check
            ) {

                return check.passed;

            }

        ).length;


    const failed =
        total -
        passed;


    const score =
        total === 0
            ?
            0
            :
            Math.round(
                passed /
                total *
                100
            );


    totalTests.textContent =
        total;


    passedTests.textContent =
        passed;


    failedTests.textContent =
        failed;


    scoreValue.textContent =
        score +
        "%";

}


// ==========================================
// Result row
// ==========================================

function createResultItem(
    name,
    passed,
    message,
    icon
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "result-item " +
        (
            passed
                ?
            "pass"
                :
            "fail"
        );


    item.innerHTML = `

        <div class="result-icon">
            ${icon}
        </div>

        <div>

            <strong>
                ${escapeHTML(name)}
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

        <span class="result-state">
            ${passed ? "ناجح" : "خطأ"}
        </span>

    `;


    return item;

}


// ==========================================
// فحص الملفات
// ==========================================

async function checkFiles() {

    filesResults.innerHTML =
        "";


    const files =
        [
            ...cssFiles,
            ...jsFiles
        ];


    let success =
        true;


    for (
        const file of files
    ) {

        const data =
            await fetchFile(
                file
            );


        const passed =
            data.exists;


        if (
            !passed
        ) {

            success =
                false;

        }


        addCheck(

            "files",

            file,

            passed,

            passed
                ?
                "الملف موجود."
                :
                "الملف غير موجود أو تعذر الوصول إليه."

        );


        filesResults.appendChild(

            createResultItem(

                file,

                passed,

                passed
                    ?
                    "تم العثور على الملف."
                    :
                    "تحقق من اسم الملف ومكانه.",

                passed
                    ?
                    "📄"
                    :
                    "⚠️"

            )

        );


        await shortDelay();

    }


    updateSectionBadge(

        filesBadge,

        success

    );

}


// ==========================================
// HTML
// ==========================================

async function checkHTMLPages() {

    htmlResults.innerHTML =
        "";


    let allSuccess =
        true;


    for (
        const page of htmlPages
    ) {

        const data =
            await fetchFile(
                page
            );


        if (
            !data.exists
        ) {

            allSuccess =
                false;


            addCheck(

                "html",

                page,

                false,

                "الصفحة غير موجودة."

            );


            htmlResults.appendChild(

                createResultItem(

                    page,

                    false,

                    "لم يتم العثور على الصفحة.",

                    "🌐"

                )

            );


            continue;

        }


        const parser =
            new DOMParser();


        const documentObject =
            parser.parseFromString(

                data.text,

                "text/html"

            );


        const title =
            documentObject.querySelector(
                "title"
            );


        const hasTitle =
            Boolean(
                title &&
                title.textContent.trim()
            );


        const hasBody =
            Boolean(
                documentObject.body
            );


        const passed =
            hasTitle &&
            hasBody;


        if (
            !passed
        ) {

            allSuccess =
                false;

        }


        addCheck(

            "html",

            page,

            passed,

            passed
                ?
                "الصفحة تحتوي على HTML أساسي سليم."
                :
                "تحقق من title و body."

        );


        htmlResults.appendChild(

            createResultItem(

                page,

                passed,

                passed
                    ?
                    "العنوان والـ body موجودان."
                    :
                    "الهيكل الأساسي ناقص.",

                "🌐"

            )

        );


        // ======================================
        // فحص ملفات الصفحة المرتبطة
        // ======================================

        const stylesheetLinks =
            Array.from(

                documentObject
                    .querySelectorAll(
                        'link[rel="stylesheet"]'
                    )

            );


        for (
            const link of stylesheetLinks
        ) {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                !href ||
                href.startsWith(
                    "http"
                )
            ) {

                continue;

            }


            const linkedFile =
                await fetchFile(
                    href
                );


            const linkPassed =
                linkedFile.exists;


            if (
                !linkPassed
            ) {

                allSuccess =
                    false;

            }


            addCheck(

                "html",

                page +
                " → " +
                href,

                linkPassed,

                linkPassed
                    ?
                    "CSS المرتبط موجود."
                    :
                    "CSS المرتبط مفقود."

            );

        }


        await shortDelay();

    }


    updateSectionBadge(

        htmlBadge,

        allSuccess

    );

}


// ==========================================
// JavaScript syntax
// ==========================================

async function checkJavaScript() {

    jsResults.innerHTML =
        "";


    let allSuccess =
        true;


    for (
        const file of jsFiles
    ) {

        const data =
            await fetchFile(
                file
            );


        if (
            !data.exists
        ) {

            allSuccess =
                false;


            addCheck(

                "javascript",

                file,

                false,

                "ملف JavaScript غير موجود."

            );


            jsResults.appendChild(

                createResultItem(

                    file,

                    false,

                    "لم يتم العثور على الملف.",

                    "⚙️"

                )

            );


            continue;

        }


        let passed =
            true;


        let message =
            "لا توجد أخطاء Syntax واضحة.";


        try {

            // فحص Syntax فقط
            // لا يتم تشغيل الملف.

            new Function(
                data.text
            );

        }

        catch (
            error
        ) {

            passed =
                false;


            allSuccess =
                false;


            message =
                error.message;

        }


        addCheck(

            "javascript",

            file,

            passed,

            message

        );


        jsResults.appendChild(

            createResultItem(

                file,

                passed,

                message,

                "⚙️"

            )

        );


        await shortDelay();

    }


    updateSectionBadge(

        jsBadge,

        allSuccess

    );

}


// ==========================================
// Auth
// ==========================================

async function checkAuth() {

    authResults.innerHTML =
        "";


    let allSuccess =
        true;


    // auth.js

    const authFile =
        await fetchFile(
            "auth.js"
        );


    const authExists =
        authFile.exists;


    addCheck(

        "auth",

        "auth.js",

        authExists,

        authExists
            ?
            "نظام Vertex Auth موجود."
            :
            "ملف auth.js مفقود."

    );


    authResults.appendChild(

        createResultItem(

            "Vertex Auth",

            authExists,

            authExists
                ?
                "تم العثور على auth.js."
                :
                "auth.js غير موجود.",

            "🔐"

        )

    );


    if (
        !authExists
    ) {

        allSuccess =
            false;

    }


    // protected pages

    for (
        const page of protectedPages
    ) {

        const data =
            await fetchFile(
                page
            );


        if (
            !data.exists
        ) {

            allSuccess =
                false;


            continue;

        }


        const hasAuth =
            data.text.includes(
                'src="auth.js"'
            )
            ||
            data.text.includes(
                "src='auth.js'"
            );


        if (
            !hasAuth
        ) {

            allSuccess =
                false;

        }


        addCheck(

            "auth",

            page,

            hasAuth,

            hasAuth
                ?
                "الصفحة مرتبطة بـ auth.js."
                :
                "صفحة محمية لكنها لا تستدعي auth.js."

        );


        authResults.appendChild(

            createResultItem(

                page,

                hasAuth,

                hasAuth
                    ?
                    "الحماية مرتبطة بالصفحة."
                    :
                    "أضف <script src=\"auth.js\"></script>.",

                "🔒"

            )

        );

    }


    // Session

    const session =
        localStorage.getItem(
            "vertexSession"
        );


    addCheck(

        "auth",

        "vertexSession",

        true,

        session
            ?
            "توجد جلسة مستخدم حاليًا."
            :
            "لا توجد جلسة حاليًا، وهذا طبيعي إذا لم تسجل الدخول."

    );


    authResults.appendChild(

        createResultItem(

            "حالة الجلسة",

            true,

            session
                ?
                "المستخدم مسجل الدخول حاليًا."
                :
                "لا توجد جلسة حالية.",

            session
                ?
                "👤"
                :
                "🚪"

        )

    );


    updateSectionBadge(

        authBadge,

        allSuccess

    );

}


// ==========================================
// LocalStorage
// ==========================================

function checkStorage() {

    storageResults.innerHTML =
        "";


    let success =
        true;


    const storageAvailable =
        testLocalStorage();


    addCheck(

        "storage",

        "LocalStorage",

        storageAvailable,

        storageAvailable
            ?
            "LocalStorage يعمل."
            :
            "LocalStorage غير متاح."

    );


    storageResults.appendChild(

        createResultItem(

            "LocalStorage",

            storageAvailable,

            storageAvailable
                ?
                "التخزين المحلي يعمل."
                :
                "المتصفح يمنع LocalStorage.",

            "💾"

        )

    );


    if (
        !storageAvailable
    ) {

        success =
            false;

    }


    vertexStorageKeys.forEach(

        function (
            key
        ) {

            const exists =
                localStorage.getItem(
                    key
                ) !==
                null;


            storageResults.appendChild(

                createResultItem(

                    key,

                    true,

                    exists
                        ?
                        "يوجد بيانات محفوظة."
                        :
                        "لا توجد بيانات بعد — طبيعي إذا لم تستخدم هذه الميزة.",

                    exists
                        ?
                        "📦"
                        :
                        "▫️"

                )

            );


            addCheck(

                "storage",

                key,

                true,

                exists
                    ?
                    "موجود."
                    :
                    "غير مستخدم حاليًا."

            );

        }

    );


    updateSectionBadge(

        storageBadge,

        success

    );

}


// ==========================================
// Test LocalStorage
// ==========================================

function testLocalStorage() {

    try {

        const key =
            "__vertex_test__";


        localStorage.setItem(
            key,
            "ok"
        );


        localStorage.removeItem(
            key
        );


        return true;

    }

    catch (
        error
    ) {

        return false;

    }

}


// ==========================================
// Badge
// ==========================================

function updateSectionBadge(
    element,
    success
) {

    element.classList.remove(
        "success",
        "error"
    );


    if (
        success
    ) {

        element.classList.add(
            "success"
        );


        element.textContent =
            "✅ ناجح";

    }

    else {

        element.classList.add(
            "error"
        );


        element.textContent =
            "❌ يحتاج مراجعة";

    }

}


// ==========================================
// Reset
// ==========================================

function resetResults() {

    checks =
        [];


    totalTests.textContent =
        "0";


    passedTests.textContent =
        "0";


    failedTests.textContent =
        "0";


    scoreValue.textContent =
        "0%";


    progressFill.style.width =
        "0%";


    progressText.textContent =
        "0%";


    [
        filesResults,
        htmlResults,
        jsResults,
        authResults,
        storageResults

    ].forEach(

        function (
            container
        ) {

            container.innerHTML =
                `
                <div class="empty-result">
                    جاري الفحص...
                </div>
                `;

        }

    );


    [
        filesBadge,
        htmlBadge,
        jsBadge,
        authBadge,
        storageBadge

    ].forEach(

        function (
            badge
        ) {

            badge.className =
                "section-badge";


            badge.textContent =
                "جاري الفحص";

        }

    );


    finalResult.className =
        "final-result";


    finalIcon.textContent =
        "🔍";


    finalTitle.textContent =
        "جاري الفحص";


    finalMessage.textContent =
        "انتظر حتى ينتهي Vertex من فحص جميع أجزاء المشروع.";

}


// ==========================================
// Progress
// ==========================================

function setProgress(
    percent,
    text
) {

    progressFill.style.width =
        percent +
        "%";


    progressText.textContent =
        percent +
        "%";


    checkStatus.textContent =
        text;

}


// ==========================================
// Full Check
// ==========================================

async function runFullCheck() {

    runCheckBtn.disabled =
        true;


    runAgainBtn.disabled =
        true;


    resetResults();


    setProgress(
        5,
        "بدء الفحص..."
    );


    await checkFiles();


    setProgress(
        25,
        "تم فحص الملفات"
    );


    await checkHTMLPages();


    setProgress(
        50,
        "تم فحص صفحات HTML"
    );


    await checkJavaScript();


    setProgress(
        75,
        "تم فحص JavaScript"
    );


    await checkAuth();


    setProgress(
        90,
        "تم فحص نظام الدخول"
    );


    checkStorage();


    setProgress(
        100,
        "اكتمل الفحص"
    );


    showFinalResult();


    runCheckBtn.disabled =
        false;


    runAgainBtn.disabled =
        false;

}


// ==========================================
// Final result
// ==========================================

function showFinalResult() {

    const total =
        checks.length;


    const passed =
        checks.filter(

            function (
                check
            ) {

                return check.passed;

            }

        ).length;


    const failed =
        total -
        passed;


    const score =
        total === 0
            ?
            0
            :
            Math.round(
                passed /
                total *
                100
            );


    if (
        failed ===
        0
    ) {

        finalResult.className =
            "final-result complete";


        finalIcon.textContent =
            "🏆";


        finalTitle.textContent =
            "Vertex Systems AI — Version 1 جاهز";


        finalMessage.textContent =
            "جميع الاختبارات التي يستطيع نظام الفحص تنفيذها نجحت. الآن جرّب الموقع يدويًا مرة أخيرة على الكمبيوتر والجوال.";

    }

    else if (
        score >=
        90
    ) {

        finalResult.className =
            "final-result warning";


        finalIcon.textContent =
            "⚠️";


        finalTitle.textContent =
            "المشروع شبه مكتمل";


        finalMessage.textContent =
            "النتيجة ممتازة، لكن يوجد " +
            failed +
            " اختبار يحتاج مراجعة قبل اعتماد Version 1.";

    }

    else {

        finalResult.className =
            "final-result warning";


        finalIcon.textContent =
            "🛠️";


        finalTitle.textContent =
            "يوجد أشياء تحتاج إصلاح";


        finalMessage.textContent =
            "نجح " +
            passed +
            " من أصل " +
            total +
            " اختبار. راجع العناصر الحمراء ثم أعد الفحص.";

    }

}


// ==========================================
// Escape
// ==========================================

function escapeHTML(
    value
) {

    return String(
        value
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// Delay
// ==========================================

function shortDelay() {

    return new Promise(

        function (
            resolve
        ) {

            setTimeout(
                resolve,
                20
            );

        }

    );

}


// ==========================================
// Buttons
// ==========================================

runCheckBtn.addEventListener(

    "click",

    runFullCheck

);


runAgainBtn.addEventListener(

    "click",

    runFullCheck

);


homeBtn.addEventListener(

    "click",

    function () {

        window.location.href =
            "index.html";

    }

);


dashboardBtn.addEventListener(

    "click",

    function () {

        window.location.href =
            "dashboard.html";

    }

);


// ==========================================
// Initial state
// ==========================================

[
    filesResults,
    htmlResults,
    jsResults,
    authResults,
    storageResults

].forEach(

    function (
        container
    ) {

        container.innerHTML =

            `
            <div class="empty-result">
                لم يتم الفحص بعد.
            </div>
            `;

    }

);