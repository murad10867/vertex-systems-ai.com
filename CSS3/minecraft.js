// ==========================================
// قاعدة بيانات المشروع
// ==========================================

const STORAGE_KEY =
    "minecraftRellX1000Project";


const DEFAULT_PROJECT = {

    version: "v0.1.0",

    phase: "prototype",

    notes: "",

    updatedAt: null,

    tasks: [

        {
            id: "move",
            name: "حركة اللاعب",
            category: "player",
            priority: "high",
            dueDate: "",
            done: false
        },

        {
            id: "jump",
            name: "القفز",
            category: "player",
            priority: "high",
            dueDate: "",
            done: false
        },

        {
            id: "world",
            name: "إنشاء العالم",
            category: "world",
            priority: "high",
            dueDate: "",
            done: false
        },

        {
            id: "break-blocks",
            name: "تكسير البلوكات",
            category: "world",
            priority: "medium",
            dueDate: "",
            done: false
        },

        {
            id: "place-blocks",
            name: "وضع البلوكات",
            category: "world",
            priority: "medium",
            dueDate: "",
            done: false
        },

        {
            id: "animals",
            name: "الحيوانات",
            category: "content",
            priority: "low",
            dueDate: "",
            done: false
        },

        {
            id: "monsters",
            name: "الوحوش",
            category: "content",
            priority: "medium",
            dueDate: "",
            done: false
        },

        {
            id: "weapons",
            name: "الأدوات والأسلحة",
            category: "systems",
            priority: "medium",
            dueDate: "",
            done: false
        },

        {
            id: "save-system",
            name: "نظام الحفظ",
            category: "systems",
            priority: "high",
            dueDate: "",
            done: false
        }

    ],

    bugs: []

};


// ==========================================
// عناصر الصفحة
// ==========================================

const versionInput =
    document.getElementById("versionInput");

const saveVersionBtn =
    document.getElementById("saveVersionBtn");

const phaseSelect =
    document.getElementById("phaseSelect");

const phaseText =
    document.getElementById("phaseText");

const lastSaved =
    document.getElementById("lastSaved");


const progressBar =
    document.getElementById("progressBar");

const totalTasksElement =
    document.getElementById("totalTasks");

const completedTasksElement =
    document.getElementById("completedTasks");

const remainingTasksElement =
    document.getElementById("remainingTasks");

const overdueTasksElement =
    document.getElementById("overdueTasks");


const playerProgress =
    document.getElementById("playerProgress");

const playerProgressText =
    document.getElementById("playerProgressText");

const worldProgress =
    document.getElementById("worldProgress");

const worldProgressText =
    document.getElementById("worldProgressText");

const systemsProgress =
    document.getElementById("systemsProgress");

const systemsProgressText =
    document.getElementById("systemsProgressText");

const contentProgress =
    document.getElementById("contentProgress");

const contentProgressText =
    document.getElementById("contentProgressText");


const searchInput =
    document.getElementById("searchInput");

const newTaskInput =
    document.getElementById("newTaskInput");

const categorySelect =
    document.getElementById("categorySelect");

const prioritySelect =
    document.getElementById("prioritySelect");

const dueDateInput =
    document.getElementById("dueDateInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const taskList =
    document.getElementById("taskList");

const noTasksMessage =
    document.getElementById("noTasksMessage");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const sortPriorityBtn =
    document.getElementById("sortPriorityBtn");

const sortDateBtn =
    document.getElementById("sortDateBtn");

const sortNameBtn =
    document.getElementById("sortNameBtn");


const bugInput =
    document.getElementById("bugInput");

const bugSeverity =
    document.getElementById("bugSeverity");

const addBugBtn =
    document.getElementById("addBugBtn");

const bugList =
    document.getElementById("bugList");

const noBugsMessage =
    document.getElementById("noBugsMessage");

const openBugsCount =
    document.getElementById("openBugsCount");

const fixedBugsCount =
    document.getElementById("fixedBugsCount");


const projectNotes =
    document.getElementById("projectNotes");

const saveNotesBtn =
    document.getElementById("saveNotesBtn");

const notesStatus =
    document.getElementById("notesStatus");


const exportBtn =
    document.getElementById("exportBtn");

const importBtn =
    document.getElementById("importBtn");

const importInput =
    document.getElementById("importInput");

const resetBtn =
    document.getElementById("resetBtn");


const startGameBtn =
    document.getElementById("startGameBtn");

const backBtn =
    document.getElementById("backBtn");


// ==========================================
// متغيرات البرنامج
// ==========================================

let project =
    loadProject();


let currentFilter =
    "all";


let editingTaskId =
    null;


// ==========================================
// نسخ المشروع الافتراضي
// ==========================================

function cloneDefaultProject() {

    return JSON.parse(
        JSON.stringify(
            DEFAULT_PROJECT
        )
    );

}


// ==========================================
// تحميل المشروع
// ==========================================

function loadProject() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (saved) {

        try {

            const data =
                JSON.parse(saved);


            if (
                data &&
                Array.isArray(data.tasks) &&
                Array.isArray(data.bugs)
            ) {

                return data;

            }

        }

        catch (error) {

            console.log(
                "تعذر تحميل بيانات المشروع",
                error
            );

        }

    }


    // ==============================
    // نقل البيانات من النسخ القديمة
    // ==============================

    const newProject =
        cloneDefaultProject();


    // المهام الأساسية القديمة

    newProject.tasks.forEach(
        function (task) {

            if (
                localStorage.getItem(
                    "minecraft_" +
                    task.id
                ) === "done"
            ) {

                task.done =
                    true;

            }

        }
    );


    // المهام المضافة من النسخة القديمة

    const oldCustomTasks =
        localStorage.getItem(
            "minecraftCustomTasks"
        );


    if (oldCustomTasks) {

        try {

            const oldTasks =
                JSON.parse(
                    oldCustomTasks
                );


            oldTasks.forEach(
                function (oldTask) {

                    const alreadyExists =
                        newProject.tasks.some(
                            function (task) {

                                return (
                                    task.id ===
                                    oldTask.id
                                );

                            }
                        );


                    if (!alreadyExists) {

                        newProject.tasks.push({

                            id:
                                oldTask.id ||
                                "task_" +
                                Date.now(),

                            name:
                                oldTask.name ||
                                "مهمة",

                            category:
                                oldTask.category ||
                                "systems",

                            priority:
                                oldTask.priority ||
                                "medium",

                            dueDate:
                                oldTask.dueDate ||
                                "",

                            done:
                                localStorage.getItem(
                                    "minecraft_" +
                                    oldTask.id
                                ) === "done"

                        });

                    }

                }
            );

        }

        catch (error) {

            console.log(
                "تعذر نقل المهام القديمة"
            );

        }

    }


    const oldPhase =
        localStorage.getItem(
            "minecraftPhase"
        );


    if (oldPhase) {

        newProject.phase =
            oldPhase;

    }


    return newProject;

}


// ==========================================
// حفظ المشروع
// ==========================================

function saveProject() {

    project.updatedAt =
        new Date().toISOString();


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(project)
    );


    updateLastSaved();

}


// ==========================================
// آخر حفظ
// ==========================================

function updateLastSaved() {

    if (!project.updatedAt) {

        lastSaved.textContent =
            "لم يتم الحفظ بعد";

        return;

    }


    const date =
        new Date(
            project.updatedAt
        );


    lastSaved.textContent =
        date.toLocaleString(
            "ar-SA"
        );

}


// ==========================================
// اليوم YYYY-MM-DD
// ==========================================

function getTodayString() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ==========================================
// تنسيق التاريخ
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "بدون موعد";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "ar-SA-u-ca-gregory",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// ==========================================
// هل المهمة متأخرة؟
// ==========================================

function isOverdue(task) {

    return (
        !task.done &&
        task.dueDate !== "" &&
        task.dueDate <
        getTodayString()
    );

}


// ==========================================
// اسم القسم
// ==========================================

function getCategoryText(category) {

    if (category === "player") {

        return "🧍 اللاعب";

    }


    if (category === "world") {

        return "🌍 العالم";

    }


    if (category === "systems") {

        return "⚙️ الأنظمة";

    }


    return "🐺 المحتوى";

}


// ==========================================
// اسم الأولوية
// ==========================================

function getPriorityText(priority) {

    if (priority === "high") {

        return "🔴 مهمة جدًا";

    }


    if (priority === "medium") {

        return "🟡 متوسطة";

    }


    return "🟢 عادية";

}


// ==========================================
// اسم خطورة Bug
// ==========================================

function getSeverityText(severity) {

    if (severity === "high") {

        return "🔴 خطير";

    }


    if (severity === "medium") {

        return "🟡 متوسط";

    }


    return "🟢 بسيط";

}


// ==========================================
// المرحلة
// ==========================================

function updatePhaseText() {

    if (
        project.phase ===
        "prototype"
    ) {

        phaseText.textContent =
            "🧪 Prototype - النموذج الأولي";

    }

    else if (
        project.phase ===
        "alpha"
    ) {

        phaseText.textContent =
            "🟠 Alpha - تطوير الأنظمة الأساسية";

    }

    else if (
        project.phase ===
        "beta"
    ) {

        phaseText.textContent =
            "🔵 Beta - الاختبار والتحسين";

    }

    else {

        phaseText.textContent =
            "🟢 Release - جاهزة للإصدار";

    }

}


// ==========================================
// تحميل معلومات المشروع
// ==========================================

function loadProjectInfo() {

    versionInput.value =
        project.version;


    phaseSelect.value =
        project.phase;


    projectNotes.value =
        project.notes;


    updatePhaseText();

    updateLastSaved();

}


// ==========================================
// حفظ الإصدار
// ==========================================

saveVersionBtn.addEventListener(
    "click",
    function () {

        let version =
            versionInput.value.trim();


        if (version === "") {

            alert(
                "اكتب رقم الإصدار"
            );

            return;

        }


        if (
            !version
                .toLowerCase()
                .startsWith("v")
        ) {

            version =
                "v" + version;

        }


        project.version =
            version;


        versionInput.value =
            version;


        saveProject();


        alert(
            "تم حفظ الإصدار " +
            version +
            " ✅"
        );

    }
);


// ==========================================
// تغيير المرحلة
// ==========================================

phaseSelect.addEventListener(
    "change",
    function () {

        project.phase =
            phaseSelect.value;


        saveProject();

        updatePhaseText();

    }
);


// ==========================================
// فلترة المهام
// ==========================================

function taskMatchesFilter(task) {

    if (
        currentFilter === "all"
    ) {

        return true;

    }


    if (
        currentFilter ===
        "pending"
    ) {

        return !task.done;

    }


    if (
        currentFilter === "done"
    ) {

        return task.done;

    }


    if (
        currentFilter ===
        "overdue"
    ) {

        return isOverdue(task);

    }


    return (
        task.priority ===
        currentFilter
    );

}


// ==========================================
// البحث
// ==========================================

function taskMatchesSearch(task) {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (search === "") {

        return true;

    }


    return (
        task.name
            .toLowerCase()
            .includes(search)
    );

}


// ==========================================
// رسم المهام
// ==========================================

function renderTasks() {

    taskList.innerHTML =
        "";


    const visibleTasks =
        project.tasks.filter(
            function (task) {

                return (
                    taskMatchesFilter(
                        task
                    )
                    &&
                    taskMatchesSearch(
                        task
                    )
                );

            }
        );


    noTasksMessage.style.display =
        visibleTasks.length === 0
            ? "block"
            : "none";


    visibleTasks.forEach(
        function (task) {

            const taskElement =
                document.createElement(
                    "div"
                );


            taskElement.className =
                "task";


            if (task.done) {

                taskElement.classList.add(
                    "done"
                );

            }


            if (isOverdue(task)) {

                taskElement.classList.add(
                    "overdue"
                );

            }


            // ==========================
            // زر الإنجاز
            // ==========================

            const checkButton =
                document.createElement(
                    "button"
                );


            checkButton.className =
                "task-check";


            checkButton.textContent =
                task.done
                    ? "✅"
                    : "⬜";


            checkButton.addEventListener(
                "click",
                function () {

                    toggleTask(
                        task.id
                    );

                }
            );


            // ==========================
            // معلومات المهمة
            // ==========================

            const taskMain =
                document.createElement(
                    "div"
                );


            taskMain.className =
                "task-main";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "task-title";


            title.textContent =
                task.name;


            const details =
                document.createElement(
                    "div"
                );


            details.className =
                "task-details";


            const categoryBadge =
                createBadge(
                    getCategoryText(
                        task.category
                    )
                );


            const priorityBadge =
                createBadge(
                    getPriorityText(
                        task.priority
                    )
                );


            let dateText;


            if (task.done) {

                dateText =
                    task.dueDate
                        ? "✅ " +
                          formatDate(
                              task.dueDate
                          )
                        : "✅ مكتملة";

            }

            else if (
                isOverdue(task)
            ) {

                dateText =
                    "⚠️ متأخرة - " +
                    formatDate(
                        task.dueDate
                    );

            }

            else if (
                task.dueDate ===
                getTodayString()
            ) {

                dateText =
                    "⏰ اليوم - " +
                    formatDate(
                        task.dueDate
                    );

            }

            else {

                dateText =
                    "📅 " +
                    formatDate(
                        task.dueDate
                    );

            }


            const dateBadge =
                createBadge(
                    dateText
                );


            details.appendChild(
                categoryBadge
            );

            details.appendChild(
                priorityBadge
            );

            details.appendChild(
                dateBadge
            );


            taskMain.appendChild(
                title
            );

            taskMain.appendChild(
                details
            );


            // ==========================
            // أزرار المهمة
            // ==========================

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "task-actions";


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.textContent =
                "✏️";


            editButton.title =
                "تعديل";


            editButton.addEventListener(
                "click",
                function () {

                    startEditTask(
                        task.id
                    );

                }
            );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "حذف";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTask(
                        task.id
                    );

                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            taskElement.appendChild(
                checkButton
            );

            taskElement.appendChild(
                taskMain
            );

            taskElement.appendChild(
                actions
            );


            taskList.appendChild(
                taskElement
            );

        }
    );

}


// ==========================================
// إنشاء Badge
// ==========================================

function createBadge(text) {

    const badge =
        document.createElement(
            "span"
        );


    badge.className =
        "badge";


    badge.textContent =
        text;


    return badge;

}


// ==========================================
// إضافة أو حفظ تعديل المهمة
// ==========================================

function submitTask() {

    const name =
        newTaskInput.value.trim();


    if (name === "") {

        alert(
            "اكتب اسم المهمة أولاً 😄"
        );

        return;

    }


    const category =
        categorySelect.value;


    const priority =
        prioritySelect.value;


    const dueDate =
        dueDateInput.value;


    // ==========================
    // تعديل
    // ==========================

    if (editingTaskId) {

        const task =
            project.tasks.find(
                function (item) {

                    return (
                        item.id ===
                        editingTaskId
                    );

                }
            );


        if (task) {

            task.name =
                name;

            task.category =
                category;

            task.priority =
                priority;

            task.dueDate =
                dueDate;

        }

    }

    // ==========================
    // إضافة
    // ==========================

    else {

        project.tasks.push({

            id:
                "task_" +
                Date.now(),

            name:
                name,

            category:
                category,

            priority:
                priority,

            dueDate:
                dueDate,

            done:
                false

        });

    }


    saveProject();

    resetTaskEditor();

    renderAll();

}


// ==========================================
// بدء تعديل مهمة
// ==========================================

function startEditTask(id) {

    const task =
        project.tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {

        return;

    }


    editingTaskId =
        id;


    newTaskInput.value =
        task.name;


    categorySelect.value =
        task.category;


    prioritySelect.value =
        task.priority;


    dueDateInput.value =
        task.dueDate;


    addTaskBtn.textContent =
        "💾 حفظ التعديل";


    cancelEditBtn.style.display =
        "block";


    newTaskInput.focus();


    document
        .getElementById(
            "taskEditor"
        )
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


// ==========================================
// إعادة محرر المهمة
// ==========================================

function resetTaskEditor() {

    editingTaskId =
        null;


    newTaskInput.value =
        "";


    categorySelect.value =
        "systems";


    prioritySelect.value =
        "medium";


    dueDateInput.value =
        "";


    addTaskBtn.textContent =
        "➕ إضافة مهمة";


    cancelEditBtn.style.display =
        "none";

}


// ==========================================
// إنجاز المهمة
// ==========================================

function toggleTask(id) {

    const task =
        project.tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {

        return;

    }


    task.done =
        !task.done;


    saveProject();

    renderAll();

}


// ==========================================
// حذف المهمة
// ==========================================

function deleteTask(id) {

    const task =
        project.tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {

        return;

    }


    const answer =
        confirm(
            "هل تريد حذف المهمة:\n" +
            task.name +
            " ؟"
        );


    if (!answer) {

        return;

    }


    project.tasks =
        project.tasks.filter(
            function (item) {

                return item.id !== id;

            }
        );


    if (
        editingTaskId === id
    ) {

        resetTaskEditor();

    }


    saveProject();

    renderAll();

}


// ==========================================
// زر إضافة المهمة
// ==========================================

addTaskBtn.addEventListener(
    "click",
    submitTask
);


// ==========================================
// إضافة المهمة بـ Enter
// ==========================================

newTaskInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            submitTask();

        }

    }
);


// ==========================================
// إلغاء التعديل
// ==========================================

cancelEditBtn.addEventListener(
    "click",
    resetTaskEditor
);


// ==========================================
// البحث
// ==========================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ==========================================
// الفلاتر
// ==========================================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


// ==========================================
// ترتيب بالأولوية
// ==========================================

sortPriorityBtn.addEventListener(
    "click",
    function () {

        const ranking = {

            high: 1,
            medium: 2,
            low: 3

        };


        project.tasks.sort(
            function (a, b) {

                return (
                    ranking[
                        a.priority
                    ]
                    -
                    ranking[
                        b.priority
                    ]
                );

            }
        );


        saveProject();

        renderTasks();

    }
);


// ==========================================
// ترتيب بالتاريخ
// ==========================================

sortDateBtn.addEventListener(
    "click",
    function () {

        project.tasks.sort(
            function (a, b) {

                const dateA =
                    a.dueDate ||
                    "9999-12-31";


                const dateB =
                    b.dueDate ||
                    "9999-12-31";


                return (
                    dateA.localeCompare(
                        dateB
                    )
                );

            }
        );


        saveProject();

        renderTasks();

    }
);


// ==========================================
// ترتيب بالاسم
// ==========================================

sortNameBtn.addEventListener(
    "click",
    function () {

        project.tasks.sort(
            function (a, b) {

                return (
                    a.name.localeCompare(
                        b.name,
                        "ar"
                    )
                );

            }
        );


        saveProject();

        renderTasks();

    }
);


// ==========================================
// الإحصائيات
// ==========================================

function updateStats() {

    const total =
        project.tasks.length;


    const completed =
        project.tasks.filter(
            function (task) {

                return task.done;

            }
        ).length;


    const overdue =
        project.tasks.filter(
            isOverdue
        ).length;


    const remaining =
        total - completed;


    totalTasksElement.textContent =
        total;


    completedTasksElement.textContent =
        completed;


    remainingTasksElement.textContent =
        remaining;


    overdueTasksElement.textContent =
        overdue;


    let percent =
        0;


    if (total > 0) {

        percent =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    progressBar.style.width =
        percent + "%";


    progressBar.textContent =
        percent + "%";

}


// ==========================================
// تقدم الأقسام
// ==========================================

function updateCategoryProgress(
    category,
    bar,
    text
) {

    const tasks =
        project.tasks.filter(
            function (task) {

                return (
                    task.category ===
                    category
                );

            }
        );


    const completed =
        tasks.filter(
            function (task) {

                return task.done;

            }
        ).length;


    let percent =
        0;


    if (
        tasks.length > 0
    ) {

        percent =
            Math.round(
                (
                    completed /
                    tasks.length
                )
                * 100
            );

    }


    bar.style.width =
        percent + "%";


    text.textContent =
        percent + "%";

}


// ==========================================
// تحديث جميع الأقسام
// ==========================================

function updateAllCategoryProgress() {

    updateCategoryProgress(
        "player",
        playerProgress,
        playerProgressText
    );


    updateCategoryProgress(
        "world",
        worldProgress,
        worldProgressText
    );


    updateCategoryProgress(
        "systems",
        systemsProgress,
        systemsProgressText
    );


    updateCategoryProgress(
        "content",
        contentProgress,
        contentProgressText
    );

}


// ==========================================
// إضافة Bug
// ==========================================

function addBug() {

    const title =
        bugInput.value.trim();


    if (title === "") {

        alert(
            "اكتب الخطأ أولاً 🐞"
        );

        return;

    }


    project.bugs.push({

        id:
            "bug_" +
            Date.now(),

        title:
            title,

        severity:
            bugSeverity.value,

        fixed:
            false,

        createdAt:
            new Date().toISOString()

    });


    bugInput.value =
        "";


    bugSeverity.value =
        "medium";


    saveProject();

    renderBugs();

}


// ==========================================
// رسم Bugs
// ==========================================

function renderBugs() {

    bugList.innerHTML =
        "";


    noBugsMessage.style.display =
        project.bugs.length === 0
            ? "block"
            : "none";


    const openCount =
        project.bugs.filter(
            function (bug) {

                return !bug.fixed;

            }
        ).length;


    const fixedCount =
        project.bugs.length -
        openCount;


    openBugsCount.textContent =
        openCount;


    fixedBugsCount.textContent =
        fixedCount;


    project.bugs.forEach(
        function (bug) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "bug-item";


            if (bug.fixed) {

                element.classList.add(
                    "fixed"
                );

            }


            const main =
                document.createElement(
                    "div"
                );


            main.className =
                "bug-main";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "bug-title";


            title.textContent =
                bug.title;


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "bug-info";


            info.appendChild(
                createBadge(
                    getSeverityText(
                        bug.severity
                    )
                )
            );


            info.appendChild(
                createBadge(
                    bug.fixed
                        ? "✅ تم الإصلاح"
                        : "🐞 مفتوح"
                )
            );


            const date =
                new Date(
                    bug.createdAt
                );


            info.appendChild(
                createBadge(
                    "📅 " +
                    date.toLocaleDateString(
                        "ar-SA"
                    )
                )
            );


            main.appendChild(
                title
            );

            main.appendChild(
                info
            );


            const toggleButton =
                document.createElement(
                    "button"
                );


            toggleButton.textContent =
                bug.fixed
                    ? "↩️ إعادة فتح"
                    : "✅ تم الإصلاح";


            toggleButton.addEventListener(
                "click",
                function () {

                    toggleBug(
                        bug.id
                    );

                }
            );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "🗑️";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteBug(
                        bug.id
                    );

                }
            );


            element.appendChild(
                main
            );

            element.appendChild(
                toggleButton
            );

            element.appendChild(
                deleteButton
            );


            bugList.appendChild(
                element
            );

        }
    );

}


// ==========================================
// إصلاح / فتح Bug
// ==========================================

function toggleBug(id) {

    const bug =
        project.bugs.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!bug) {

        return;

    }


    bug.fixed =
        !bug.fixed;


    saveProject();

    renderBugs();

}


// ==========================================
// حذف Bug
// ==========================================

function deleteBug(id) {

    const answer =
        confirm(
            "هل تريد حذف هذا الخطأ؟"
        );


    if (!answer) {

        return;

    }


    project.bugs =
        project.bugs.filter(
            function (bug) {

                return bug.id !== id;

            }
        );


    saveProject();

    renderBugs();

}


// ==========================================
// زر Bug
// ==========================================

addBugBtn.addEventListener(
    "click",
    addBug
);


bugInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addBug();

        }

    }
);


// ==========================================
// حفظ الملاحظات
// ==========================================

saveNotesBtn.addEventListener(
    "click",
    function () {

        project.notes =
            projectNotes.value;


        saveProject();


        notesStatus.textContent =
            "تم الحفظ ✅";


        setTimeout(
            function () {

                notesStatus.textContent =
                    "";

            },
            2000
        );

    }
);


// ==========================================
// تنزيل نسخة احتياطية
// ==========================================

exportBtn.addEventListener(
    "click",
    function () {

        saveProject();


        const json =
            JSON.stringify(
                project,
                null,
                2
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "Minecraft-Rell-X1000-Backup.json";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


// ==========================================
// استيراد نسخة
// ==========================================

importBtn.addEventListener(
    "click",
    function () {

        importInput.click();

    }
);


importInput.addEventListener(
    "change",
    function () {

        const file =
            importInput.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function () {

                try {

                    const data =
                        JSON.parse(
                            reader.result
                        );


                    if (
                        !Array.isArray(
                            data.tasks
                        )
                        ||
                        !Array.isArray(
                            data.bugs
                        )
                    ) {

                        throw new Error(
                            "Invalid file"
                        );

                    }


                    const answer =
                        confirm(
                            "سيتم استبدال بيانات المشروع الحالية. هل تريد المتابعة؟"
                        );


                    if (!answer) {

                        return;

                    }


                    project =
                        data;


                    saveProject();


                    editingTaskId =
                        null;


                    currentFilter =
                        "all";


                    resetTaskEditor();

                    initializePage();


                    alert(
                        "تم استرجاع النسخة الاحتياطية ✅"
                    );

                }

                catch (error) {

                    alert(
                        "ملف النسخة الاحتياطية غير صحيح ❌"
                    );

                }

            };


        reader.readAsText(
            file
        );


        importInput.value =
            "";

    }
);


// ==========================================
// إعادة المشروع
// ==========================================

resetBtn.addEventListener(
    "click",
    function () {

        const answer =
            confirm(
                "⚠️ سيتم حذف كل تقدم المشروع والمهام والأخطاء والملاحظات.\n\nهل أنت متأكد؟"
            );


        if (!answer) {

            return;

        }


        const secondAnswer =
            confirm(
                "تأكيد أخير: هل تريد إعادة Minecraft Rell X1000 من البداية؟"
            );


        if (!secondAnswer) {

            return;

        }


        // تنظيف مفاتيح النسخ القديمة

        Object.keys(
            localStorage
        ).forEach(
            function (key) {

                if (
                    key.startsWith(
                        "minecraft_"
                    )
                    ||
                    key ===
                    "minecraftCustomTasks"
                    ||
                    key ===
                    "minecraftPhase"
                ) {

                    localStorage.removeItem(
                        key
                    );

                }

            }
        );


        project =
            cloneDefaultProject();


        currentFilter =
            "all";


        editingTaskId =
            null;


        saveProject();

        resetTaskEditor();

        initializePage();


        alert(
            "تمت إعادة المشروع من البداية ✅"
        );

    }
);


// ==========================================
// حالة المشروع
// ==========================================

startGameBtn.addEventListener(
    "click",
    function () {

        const completed =
            project.tasks.filter(
                function (task) {

                    return task.done;

                }
            ).length;


        const total =
            project.tasks.length;


        const percent =
            total === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        total
                    ) * 100
                );


        const openBugs =
            project.bugs.filter(
                function (bug) {

                    return !bug.fixed;

                }
            ).length;


        alert(
            "🎮 Minecraft Rell X1000\n\n" +

            "الإصدار: " +
            project.version +
            "\n\n" +

            "المرحلة: " +
            phaseText.textContent +
            "\n\n" +

            "تقدم المشروع: " +
            percent +
            "%\n\n" +

            "المهام: " +
            completed +
            " / " +
            total +
            "\n\n" +

            "Bugs المفتوحة: " +
            openBugs
        );

    }
);


// ==========================================
// العودة
// ==========================================

backBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "games.html";

    }
);


// ==========================================
// رسم كل شيء
// ==========================================

function renderAll() {

    renderTasks();

    updateStats();

    updateAllCategoryProgress();

    renderBugs();

    updateLastSaved();

}


// ==========================================
// تشغيل الصفحة
// ==========================================

function initializePage() {

    loadProjectInfo();

    renderAll();

}


// ==========================================
// البداية
// ==========================================

initializePage();