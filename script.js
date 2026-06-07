const firebaseConfig = {
    apiKey: "AIzaSyD7Q6CX6cZmEUBuJyyQjr9y7yw1JHrFz3Q",
    authDomain: "team-extraordinary.firebaseapp.com",
    databaseURL: "https://team-extraordinary-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "team-extraordinary",
    storageBucket: "team-extraordinary.firebasestorage.app",
    messagingSenderId: "680202131001",
    appId: "1:680202131001:web:2b412c1694ab569c711fe8"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
document.addEventListener("DOMContentLoaded", () => {
let isCaptain =
        localStorage.getItem("captainMode") === "true";

    // 👑 STATE FIRST

    // 🔐 SECURITY CHECK FUNCTION
  function captainOnly() {

    console.log("captainOnly called");
    console.log("isCaptain =", isCaptain);

    if (!isCaptain) {
        alert("Captain access required.");
        return false;
    }

    return true;
}
    
    // now EVERYTHING else comes below safely

const captainBtn =
document.getElementById(
"captainLoginBtn"
);

const captainStatus =
document.getElementById(
"captainStatus"
);

function updateCaptainUI(){

    if(isCaptain){

        captainStatus.textContent =
        "👑 Captain Mode";

        captainBtn.textContent =
        "🚪 Logout";

    }else{

        captainStatus.textContent =
        "❌ Guest Mode";

        captainBtn.textContent =
        "🔒 Captain Login";

    }

}

captainBtn.addEventListener(
"click",
()=>{

    if(isCaptain){

        isCaptain = false;

        localStorage.setItem(
        "captainMode",
        "false"
        );

        updateCaptainUI();

        return;
    }

    const password =
    prompt(
    "Captain Password:"
    );
if(password === "pratik10"){

    isCaptain = true;

    console.log("Captain login successful");
    console.log("isCaptain =", isCaptain);

    localStorage.setItem(
    "captainMode",
    "true"
    );

    updateCaptainUI();

}
   else{

        alert(
        "Wrong Password"
        );

    }

});

updateCaptainUI();
    const editBtn = document.getElementById("editBtn");
    const resetBtn = document.getElementById("resetBtn");
    const players = document.querySelectorAll(".player");
    const board = document.querySelector(".board");

    let editMode = false;
    let dragging = false;
    let activePlayer = null;
    let offsetX = 0;
    let offsetY = 0;

    const initialPositions = new Map();
function savePositions() {

    const positions = {};

    players.forEach(player => {

        const playerId =
            player.dataset.id ||
            player.classList[1];

        positions[playerId] = {

            left: player.style.left,
            top: player.style.top

        };

    });

    localStorage.setItem(
        "tacticsPositions",
        JSON.stringify(positions)
    );
}
function loadPositions() {

    const saved =
        localStorage.getItem("tacticsPositions");

    if (!saved) return;

    const positions = JSON.parse(saved);

    players.forEach(player => {

        const playerId =
            player.dataset.id ||
            player.classList[1];

        if (positions[playerId]) {

            player.style.left =
                positions[playerId].left;

            player.style.top =
                positions[playerId].top;
        }

    });
}

    // SAVE ORIGINAL POSITIONS
    players.forEach(player => {
        initialPositions.set(player, {
            left: player.offsetLeft,
            top: player.offsetTop
        });
    });
loadPositions();

    // EDIT BUTTON
    editBtn.addEventListener("click", () => {
       
        editMode = !editMode;
        alert(editMode ? "Edit Mode ON" : "Edit Mode OFF");
    });

    // RESET BUTTON
    resetBtn.addEventListener("click", () => {

        players.forEach(player => {
            const pos = initialPositions.get(player);
            player.style.left = pos.left + "px";
            player.style.top = pos.top + "px";
        });

        alert("Reset complete");
    });
function setFormation(type) {

    const boardRect = board.getBoundingClientRect();
    const centerX = boardRect.width / 2;

    const formations = {
        "433": {
            gk: [centerX, 350],
            lb: [80, 250],
            cb1: [centerX - 80, 250],
            cb2: [centerX + 80, 250],
            rb: [boardRect.width - 80, 250],
            cm1: [centerX - 120, 180],
            cm2: [centerX + 120, 180],
            cam: [centerX, 120],
            lw: [80, 60],
            st: [centerX, 40],
            rw: [boardRect.width - 80, 60]
        },

        "5221": {
            gk: [centerX, 350],
            lb: [60, 250],
            cb1: [centerX - 100, 250],
            cb2: [centerX + 100, 250],
            rb: [boardRect.width - 60, 250],
            cm1: [centerX - 60, 170],
            cm2: [centerX + 60, 170],
            lw: [120, 90],
            rw: [boardRect.width - 120, 90],
            st: [centerX, 40],
            cam: [centerX, 120]
        },

        "4222": {
            gk: [centerX, 350],
            lb: [80, 250],
            cb1: [centerX - 80, 250],
            cb2: [centerX + 80, 250],
            rb: [boardRect.width - 80, 250],
            cm1: [centerX - 100, 160],
            cm2: [centerX + 100, 160],
            lw: [120, 80],
            rw: [boardRect.width - 120, 80],
            st: [centerX - 60, 40],
            cam: [centerX + 60, 40]
        },

        "3331": {
            gk: [centerX, 350],
            lb: [100, 250],
            cb1: [centerX, 250],
            rb: [boardRect.width - 100, 250],
            cm1: [100, 170],
            cm2: [centerX, 170],
            cam: [boardRect.width - 100, 170],
            lw: [100, 70],
            st: [centerX, 40],
            rw: [boardRect.width - 100, 70]
        }
    };

    const formation = formations[type];
    if (!formation) return;

    players.forEach(player => {
const key = Array.from(player.classList).find(c => formation[c]);
    if (key && formation[key]) {
        const [x, y] = formation[key];
        player.style.left = x + "px";
        player.style.top = y + "px";
    }
});

savePositions();

}
    // START DRAG
    players.forEach(player => {

        player.addEventListener("pointerdown", (e) => {

            if (!editMode) return;

            dragging = true;
            activePlayer = player;

            const rect = player.getBoundingClientRect();

            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            e.preventDefault();
        });

    });

    // MOVE DRAG
    document.addEventListener("pointermove", (e) => {

        if (!editMode || !dragging || !activePlayer) return;

        const boardRect = board.getBoundingClientRect();

        let x = e.clientX - boardRect.left - offsetX;
        let y = e.clientY - boardRect.top - offsetY;

        x = Math.max(0, Math.min(x, boardRect.width - 45));
        y = Math.max(0, Math.min(y, boardRect.height - 45));

        activePlayer.style.left = x + "px";
        activePlayer.style.top = y + "px";
    });

    // STOP DRAG
    document.addEventListener("pointerup", () => {

    dragging = false;
    activePlayer = null;

    savePositions();

});
window.setFormation = setFormation;
function addEmoji(emoji) {

    chatInput.value += emoji;

    chatInput.focus();

}

window.addEmoji = addEmoji;
 // CHAT SYSTEM
const chatBox = document.getElementById("chatBox");
db.ref("chat").on("child_added", snapshot => {

    const data = snapshot.val();

    const div = document.createElement("div");

    div.classList.add("chat-message");

    div.textContent =
        data.user + ": " + data.text;

    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;

});
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const announcementInput =
    document.getElementById("announcementInput");
const announcementBox =
    document.getElementById("announcementBox");

const postAnnouncementBtn =
    document.getElementById("postAnnouncementBtn");
const changeNameBtn =
    document.getElementById("changeNameBtn");
let username = localStorage.getItem("teamUsername");

if (!username) {

    username = prompt("Enter your team name:");

    if (username && username.trim() !== "") {

        localStorage.setItem(
            "teamUsername",
            username
        );

    } else {

        username = "Player";

    }
}
// send message function
function sendMessage() {

    const msg = chatInput.value.trim();

    if (msg === "") return;

    db.ref("chat").push({
        user: username,
        text: msg,
        time: Date.now()
    });

    chatInput.value = "";

}

function saveMessages() {

    const messages = [];

document.querySelectorAll(".chat-message").forEach(msg => {
    messages.push(msg.innerText);
});

localStorage.setItem("teamChat", JSON.stringify(messages));
}

function loadMessages() {

    const saved = localStorage.getItem("teamChat");

    if (saved) {
const saved = JSON.parse(localStorage.getItem("teamChat")) || [];

saved.forEach(text => {
    const div = document.createElement("div");
    div.classList.add("chat-message");

    const span = document.createElement("span");
    span.textContent = text;

    div.appendChild(span);
    chatBox.appendChild(div);
});
        document.querySelectorAll(".delete-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    btn.parentElement.remove();

                    saveMessages();
                });

            });
    }
}
function saveAnnouncements(){

    localStorage.setItem(
        "teamAnnouncements",
        announcementBox.innerHTML
    );
}

function loadAnnouncements(){

    const saved =
        localStorage.getItem(
            "teamAnnouncements"
        );

    if(saved){

        announcementBox.innerHTML =
            saved;
    }
}

function postAnnouncement(){

    const text =
        announcementInput.value.trim();

    if(text === "") return;

    const div =
        document.createElement("div");

    div.classList.add(
        "announcement"
    );

const owner = username;

div.innerHTML = `
    <b>${owner}</b><br>
    ${text}
    <button class="delete-announcement">
        ✖
    </button>
`;

const deleteBtn =
    div.querySelector(
        ".delete-announcement"
    );

deleteBtn.addEventListener(
    "click",
    () => {

        if(owner !== username){
            alert(
                "Only the announcer can delete this."
            );
            return;
        }

        div.remove();
        saveAnnouncements();
    }
);
    announcementBox.prepend(div);

    saveAnnouncements();

    announcementInput.value = "";
}
loadMessages();
loadAnnouncements();
postAnnouncementBtn.addEventListener(
    "click",
    postAnnouncement
);
changeNameBtn.addEventListener("click", () => {
if(!isCaptain){

    alert(
    "Captain access required."
    );

    return;
}
    const newName =
        prompt("Enter new name:");

    if (
        newName &&
        newName.trim() !== ""
    ) {

        username = newName;

        localStorage.setItem(
            "teamUsername",
            username
        );

        alert(
            "Name changed to " + username
        );
    }

});
// button click
sendBtn.addEventListener("click", sendMessage);

// enter key support
chatInput.addEventListener("keydown", (e) => {
    
    if (e.key === "Enter") {
        sendMessage();
    }
});   
const rateButtons =
document.querySelectorAll(".rateBtn");

rateButtons.forEach(button => {

    button.addEventListener("click", () => {
        const rating =
        prompt("Give rating (1-10)");

        if (!rating) return;

        const card =
        button.closest(".player-card");

        const display =
        card.querySelector(".ratingDisplay");

        const playerId = card.id;

        localStorage.setItem(
            "rating_" + playerId,
            rating
        );

        display.textContent =
            "Rating: " + rating + "/10";

    });

});

document
.querySelectorAll(".player-card")
.forEach(card => {

    const saved =
    localStorage.getItem(
        "rating_" + card.id
    );

    if(saved){

        card.querySelector(
            ".ratingDisplay"
        ).textContent =
        "Rating: " + saved + "/10";

    }

});
const voteButtons =
document.querySelectorAll(".voteBtn");

const pollResults =
document.getElementById("pollResults");

let votes =
JSON.parse(
localStorage.getItem("teamVotes")
) || {};

function updatePoll(){

    pollResults.innerHTML = "";

    for(let player in votes){

        const row =
        document.createElement("div");

        const text =
        document.createElement("span");

        text.textContent =
        player + ": " +
        votes[player] +
        " votes ";

        const removeBtn =
        document.createElement("button");

        removeBtn.textContent =
        "➖ Remove Vote";

        removeBtn.addEventListener(
        "click",
        () => {
      if(!captainOnly()) return;
            if(votes[player] > 0){

                votes[player]--;

                if(votes[player] === 0){

                    delete votes[player];

                }

                localStorage.setItem(
                    "teamVotes",
                    JSON.stringify(votes)
                );

                updatePoll();
            }

        });

        row.appendChild(text);
        row.appendChild(removeBtn);

        pollResults.appendChild(row);

    }

}
voteButtons.forEach(button => {

    button.addEventListener("click", () => {
if(!captainOnly()) return;
        const player =
        button.dataset.player;

        votes[player] =
        (votes[player] || 0) + 1;

        localStorage.setItem(
            "teamVotes",
            JSON.stringify(votes)
        );

        updatePoll();

    });

});
document
.getElementById("resetPollBtn")
.addEventListener("click", () => {
if(!isCaptain){
    alert(
    "Captain access required."
    );

    return;
}
    votes = {};

    localStorage.removeItem(
        "teamVotes"
    );

    updatePoll();

});
const goalButtons =
document.querySelectorAll(".goalBtn");

const scorersBox =
document.getElementById("topScorers");

let goals =
JSON.parse(
localStorage.getItem("teamGoals")
) || {};

function updateScorers(){

    scorersBox.innerHTML = "";

    const sorted =
    Object.entries(goals)
    .sort((a,b) => b[1] - a[1]);

    sorted.forEach(player => {

        const row =
        document.createElement("div");

        row.innerHTML = `
        <b>${player[0]}</b>
        - ${player[1]} Goals
        <button class="minusGoal">
        ➖
        </button>
        `;

        row.querySelector(".minusGoal")
        .addEventListener("click", () => {
if(!captainOnly()) return;
            goals[player[0]]--;

            if(goals[player[0]] <= 0){

                delete goals[player[0]];

            }

            localStorage.setItem(
                "teamGoals",
                JSON.stringify(goals)
            );

            updateScorers();

        });

        scorersBox.appendChild(row);

    });

}

goalButtons.forEach(button => {

    button.addEventListener("click", () => {
if(!captainOnly()) return;
        const player =
        button.dataset.player;

        goals[player] =
        (goals[player] || 0) + 1;

        localStorage.setItem(
            "teamGoals",
            JSON.stringify(goals)
        );

        updateScorers();

    });

});

document
.getElementById("resetGoalsBtn")
.addEventListener("click", () => {
if(!captainOnly()) return;
    goals = {};

    localStorage.removeItem(
        "teamGoals"
    );

    updateScorers();

});

updateScorers();
const assistButtons =
document.querySelectorAll(".assistBtn");

const assistsBox =
document.getElementById("topAssists");

let assists =
JSON.parse(
localStorage.getItem("teamAssists")
) || {};

function updateAssists(){

    assistsBox.innerHTML = "";

    const sorted =
    Object.entries(assists)
    .sort((a,b) => b[1] - a[1]);

    sorted.forEach(player => {

        const row =
        document.createElement("div");

        row.innerHTML = `
        <b>${player[0]}</b>
        - ${player[1]} Assists
        <button class="minusAssist">
        ➖
        </button>
        `;

        row.querySelector(".minusAssist")
        .addEventListener("click", () => {
if(!captainOnly()) return;
            assists[player[0]]--;

            if(assists[player[0]] <= 0){

                delete assists[player[0]];

            }

            localStorage.setItem(
                "teamAssists",
                JSON.stringify(assists)
            );

            updateAssists();

        });

        assistsBox.appendChild(row);

    });

}

assistButtons.forEach(button => {

    button.addEventListener("click", () => {
if(!captainOnly()) return;
        const player =
        button.dataset.player;

        assists[player] =
        (assists[player] || 0) + 1;

        localStorage.setItem(
            "teamAssists",
            JSON.stringify(assists)
        );

        updateAssists();

    });

});

document
.getElementById("resetAssistsBtn")
.addEventListener("click", () => {
if(!captainOnly()) return;
    assists = {};

    localStorage.removeItem(
        "teamAssists"
    );

    updateAssists();

});

updateAssists();
const seasonLeaderboard =
document.getElementById(
"seasonLeaderboard"
);

function updateSeasonRanking(){

    seasonLeaderboard.innerHTML = "";

    const players = [

    "Joseph",
    "Pratik",
    "Sornabo",
    "Deepbarman",
    "Sujit",
    "Debapriya",
    "Rono",
    "Debamalya",
    "Sayan",
    "Deepak",
    "Yusuf",
    "Arnab",
    "Deepjoy",
    "Swarup",
    "Rajdeep",
    "Ayush Majumdar",
    "Arindam",
    "Soumyajit",
    "Aniruddha",
    "Aman",
    "Subir",
    "Ayush Das",
    "Ayush Sarkar",
    "Ajay",
    "Saham",
    "Sainit",
    "Prabanta",
    "Joydeb",
    "Nayan",
    "Simon",
    "Pritam",
    "Arghadip"

    ];

    const rankings = [];

    players.forEach(player => {

        const goals =
        JSON.parse(
        localStorage.getItem("teamGoals")
        ) || {};

        const assists =
        JSON.parse(
        localStorage.getItem("teamAssists")
        ) || {};

        let rating = 0;

        for(let key in localStorage){

            if(
            key.startsWith("rating_")
            ){

                const value =
                parseInt(
                localStorage.getItem(key)
                );

                if(!isNaN(value)){

                    rating = value;

                }

            }

        }

        const score =

        ((goals[player] || 0) * 4)

        +

        ((assists[player] || 0) * 3)

        +

        (rating * 2);

        rankings.push({
            player,
            score
        });

    });

    rankings.sort(
    (a,b)=>b.score-a.score
    );

    rankings.forEach(
    (player,index)=>{

        const row =
        document.createElement("p");

        row.textContent =
        `${index+1}. ${player.player}
        - ${player.score} pts`;

        seasonLeaderboard
        .appendChild(row);

    });

}

updateSeasonRanking();
console.log("GOALS:", localStorage.getItem("teamGoals"));
console.log("ASSISTS:", localStorage.getItem("teamAssists"));

for(let i = 0; i < localStorage.length; i++){

    const key = localStorage.key(i);

    console.log(
        key,
        localStorage.getItem(key)
    );

}
const attendanceButtons =
document.querySelectorAll(".attendanceBtn");

const attendanceBoard =
document.getElementById(
"attendanceLeaderboard"
);

let attendance =
JSON.parse(
localStorage.getItem(
"teamAttendance"
)
) || {};

function updateAttendance(){

    attendanceBoard.innerHTML = "";

    const sorted =
    Object.entries(attendance)
    .sort((a,b)=>b[1]-a[1]);

    sorted.forEach(player=>{

        const row =
        document.createElement("div");

        row.innerHTML = `
        <b>${player[0]}</b>
        - ${player[1]} Sessions

        <button class="minusAttendance">
        ➖
        </button>
        `;

        row.querySelector(
".minusAttendance"
)
.addEventListener(
"click",
()=>{

    if(!captainOnly()) return;

    attendance[player[0]]--;

            if(
            attendance[player[0]]
            <=0
            ){
                delete attendance[
                player[0]
                ];
            }

            localStorage.setItem(
            "teamAttendance",
            JSON.stringify(
            attendance
            ));

            updateAttendance();

        });

        attendanceBoard
        .appendChild(row);

    });

}

attendanceButtons.forEach(
button=>{

    button.addEventListener(
    "click",
    ()=>{
if(!captainOnly()) return;
        const player =
        button.dataset.player;

        attendance[player] =
        (
        attendance[player]
        || 0
        ) + 1;

        localStorage.setItem(
        "teamAttendance",
        JSON.stringify(
        attendance
        ));

        updateAttendance();

    });

});

document
.getElementById(
"resetAttendanceBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    attendance = {};

    localStorage.removeItem(
    "teamAttendance"
    );

    updateAttendance();

});

updateAttendance();
const addMatchBtn =
document.getElementById(
"addMatchBtn"
);

const savedMatches =
document.getElementById(
"savedMatches"
);

let matches =
JSON.parse(
localStorage.getItem(
"teamMatches"
)
) || [];

function updateMatches(){

    savedMatches.innerHTML = "";

    matches.forEach(
    (match,index)=>{

        const card =
        document.createElement(
        "div"
        );

        card.className =
        "match-card";

        card.innerHTML = `
        <h3>
        Team Extraordinary vs
        ${match.opponent}
        </h3>

        <p>
        Score:
        ${match.score}
        </p>

        <p>
        Winner:
        ${match.winner}
        </p>

        <button
        class="deleteMatch">

        🗑 Delete

        </button>
        `;

        card.querySelector(
        ".deleteMatch"
        )
        .addEventListener(
        "click",
        ()=>{
if(!captainOnly()) return;
            matches.splice(
            index,
            1
            );

            localStorage.setItem(
            "teamMatches",
            JSON.stringify(
            matches
            ));

            updateMatches();

        });

        savedMatches
        .appendChild(card);

    });

}

addMatchBtn.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    const opponent =
    document
    .getElementById(
    "opponentInput"
    )
    .value;

    const score =
    document
    .getElementById(
    "scoreInput"
    )
    .value;

    const winner =
    document
    .getElementById(
    "winnerInput"
    )
    .value;

    if(
    !opponent ||
    !score ||
    !winner
    ) return;

    matches.push({

        opponent,
        score,
        winner

    });

    localStorage.setItem(
    "teamMatches",
    JSON.stringify(
    matches
    ));

    updateMatches();

});
    
updateMatches();
const scheduleBoard =
document.getElementById(
"scheduleBoard"
);

let schedules =
JSON.parse(
localStorage.getItem(
"teamSchedules"
)
) || [];

function updateSchedule(){

    scheduleBoard.innerHTML = "";

    schedules.forEach(
    (session,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "practice-card";

        card.innerHTML = `
        <h3>${session.date}</h3>

        <p>
        🕒 ${session.time}
        </p>

        <p>
        📍 ${session.location}
        </p>

        <button
        class="deleteSchedule">

        Delete

        </button>
        `;

        card.querySelector(
        ".deleteSchedule"
        )
        .addEventListener(
        "click",
        ()=>{
if(!captainOnly()) return;
            schedules.splice(
            index,
            1
            );

            localStorage.setItem(
            "teamSchedules",
            JSON.stringify(
            schedules
            ));

            updateSchedule();

        });

        scheduleBoard
        .appendChild(card);

    });

}

document
.getElementById(
"addScheduleBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    const date =
    document
    .getElementById(
    "scheduleDate"
    )
    .value;

    const time =
    document
    .getElementById(
    "scheduleTime"
    )
    .value;

    const location =
    document
    .getElementById(
    "scheduleLocation"
    )
    .value;

    if(
    !date ||
    !time ||
    !location
    ) return;

    schedules.push({

        date,
        time,
        location

    });

    localStorage.setItem(
    "teamSchedules",
    JSON.stringify(
    schedules
    ));

    updateSchedule();

});

document
.getElementById(
"resetScheduleBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    schedules = [];

    localStorage.removeItem(
    "teamSchedules"
    );

    updateSchedule();

});

updateSchedule();
const availabilityBoard =
document.getElementById(
"availabilityBoard"
);

let availability =
JSON.parse(
localStorage.getItem(
"teamAvailability"
)
) || {};

function updateAvailability(){

    availabilityBoard.innerHTML = "";

    Object.entries(
    availability
    ).forEach(([player,status])=>{

        const row =
        document.createElement("div");

        row.innerHTML = `
        <b>${player}</b>
        - ${status}
        `;

        availabilityBoard
        .appendChild(row);

    });

}

document
.getElementById(
"setAvailabilityBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    const player =
    document
    .getElementById(
    "availabilityPlayer"
    )
    .value;

    const status =
    document
    .getElementById(
    "availabilityStatus"
    )
    .value;

    availability[player] =
    status;

    localStorage.setItem(
    "teamAvailability",
    JSON.stringify(
    availability
    ));

    updateAvailability();

});

document
.getElementById(
"resetAvailabilityBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    availability = {};

    localStorage.removeItem(
    "teamAvailability"
    );

    updateAvailability();

});

updateAvailability();
const fixturesBoard =
document.getElementById(
"fixturesBoard"
);

let fixtures =
JSON.parse(
localStorage.getItem(
"teamFixtures"
)
) || [];

function updateFixtures(){

    fixturesBoard.innerHTML = "";

    fixtures.sort(
    (a,b)=>
    new Date(a.date)
    -
    new Date(b.date)
    );

    fixtures.forEach(
    (fixture,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "match-card";

        card.innerHTML = `

        <h3>
        Team Extraordinary vs
        ${fixture.opponent}
        </h3>

        <p>
        📅 ${fixture.date}
        </p>

        <p>
        📍 ${fixture.venue}
        </p>

        <button
        class="deleteFixture">

        Delete

        </button>

        `;

        card.querySelector(
        ".deleteFixture"
        )
        .addEventListener(
        "click",
        ()=>{
if(!captainOnly()) return;
            fixtures.splice(
            index,
            1
            );

            localStorage.setItem(
            "teamFixtures",
            JSON.stringify(
            fixtures
            ));

            updateFixtures();

        });

        fixturesBoard
        .appendChild(card);

    });

}

document
.getElementById(
"addFixtureBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    const date =
    document
    .getElementById(
    "fixtureDate"
    )
    .value;

    const opponent =
    document
    .getElementById(
    "fixtureOpponent"
    )
    .value;

    const venue =
    document
    .getElementById(
    "fixtureVenue"
    )
    .value;

    if(
    !date ||
    !opponent ||
    !venue
    ) return;

    fixtures.push({

        date,
        opponent,
        venue

    });

    localStorage.setItem(
    "teamFixtures",
    JSON.stringify(
    fixtures
    ));

    updateFixtures();

});

document
.getElementById(
"resetFixturesBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    fixtures = [];

    localStorage.removeItem(
    "teamFixtures"
    );

    updateFixtures();

});

updateFixtures();
const diaryBoard =
document.getElementById(
"diaryBoard"
);

let diaryEntries =
JSON.parse(
localStorage.getItem(
"teamDiary"
)
) || [];

function updateDiary(){

    diaryBoard.innerHTML = "";

    diaryEntries.sort(
    (a,b)=>
    new Date(b.date)
    -
    new Date(a.date)
    );

    diaryEntries.forEach(
    (entry,index)=>{

        const card =
        document.createElement(
        "div"
        );

        card.className =
        "practice-card";

        card.innerHTML = `

        <h3>
        ${entry.date}
        </h3>

        <p>
        ${entry.note}
        </p>

        <button
        class="deleteDiary">

        Delete

        </button>

        `;

        card.querySelector(
        ".deleteDiary"
        )
        .addEventListener(
        "click",
        ()=>{

            diaryEntries.splice(
            index,
            1
            );

            localStorage.setItem(
            "teamDiary",
            JSON.stringify(
            diaryEntries
            ));

            updateDiary();

        });

        diaryBoard
        .appendChild(card);

    });

}

document
.getElementById(
"saveDiaryBtn"
)
.addEventListener(
"click",
()=>{

    const date =
    document
    .getElementById(
    "diaryDate"
    )
    .value;

    const note =
    document
    .getElementById(
    "diaryEntry"
    )
    .value;

    if(
    !date ||
    !note
    ) return;

    diaryEntries.push({

        date,
        note

    });

    localStorage.setItem(
    "teamDiary",
    JSON.stringify(
    diaryEntries
    ));

    updateDiary();

});

document
.getElementById(
"resetDiaryBtn"
)
.addEventListener(
"click",
()=>{

    diaryEntries = [];

    localStorage.removeItem(
    "teamDiary"
    );

    updateDiary();

});

updateDiary();
const squadBoard =
document.getElementById(
"squadBoard"
);

let squad =
JSON.parse(
localStorage.getItem(
"teamSquad"
)
) || [];

function updateSquad(){

    squadBoard.innerHTML = "";

    squad.forEach(
    (player,index)=>{

        const row =
        document.createElement(
        "div"
        );

        row.innerHTML = `
        ${player}

        <button
        class="removeSquad">

        ❌

        </button>
        `;

        row.querySelector(
        ".removeSquad"
        )
        .addEventListener(
        "click",
        ()=>{
if(!captainOnly()) return;
            squad.splice(
            index,
            1
            );

            localStorage.setItem(
            "teamSquad",
            JSON.stringify(
            squad
            ));

            updateSquad();

        });

        squadBoard.appendChild(
        row
        );

    });

}

document
.getElementById(
"addToSquadBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    const player =
    document
    .getElementById(
    "playerSelect"
    )
    .value;

    if(
    squad.includes(
    player
    )
    ) return;

    squad.push(
    player
    );

    localStorage.setItem(
    "teamSquad",
    JSON.stringify(
    squad
    ));

    updateSquad();

});

document
.getElementById(
"clearSquadBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    squad = [];

    localStorage.removeItem(
    "teamSquad"
    );

    updateSquad();

});

updateSquad();
const timelineBoard =
document.getElementById(
"timelineBoard"
);

let timeline =
JSON.parse(
localStorage.getItem(
"teamTimeline"
)
) || [];

function updateTimeline(){

    timelineBoard.innerHTML = "";

    timeline.sort(
    (a,b)=>
    new Date(a.date)
    -
    new Date(b.date)
    );

    timeline.forEach(
    (item,index)=>{

        const card =
        document.createElement(
        "div"
        );

        card.className =
        "practice-card";

        card.innerHTML = `
        <h3>${item.date}</h3>

        <p>${item.text}</p>

        <button
        class="deleteTimeline">
        Delete
        </button>
        `;

        card.querySelector(
        ".deleteTimeline"
        )
        .addEventListener(
        "click",
        ()=>{
if(!captainOnly()) return;
            timeline.splice(
            index,
            1
            );

            localStorage.setItem(
            "teamTimeline",
            JSON.stringify(
            timeline
            ));

            updateTimeline();

        });

        timelineBoard
        .appendChild(card);

    });

}

document
.getElementById(
"addTimelineBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    const date =
    document
    .getElementById(
    "timelineDate"
    )
    .value;

    const text =
    document
    .getElementById(
    "timelineText"
    )
    .value;

    if(
    !date ||
    !text
    ) return;

    timeline.push({

        date,
        text

    });

    localStorage.setItem(
    "teamTimeline",
    JSON.stringify(
    timeline
    ));

    updateTimeline();

});

document
.getElementById(
"resetTimelineBtn"
)
.addEventListener(
"click",
()=>{
if(!captainOnly()) return;
    timeline = [];

    localStorage.removeItem(
    "teamTimeline"
    );

    updateTimeline();

});

updateTimeline();
const themeBtn =
document.getElementById(
"themeBtn"
);

const savedTheme =
localStorage.getItem(
"teamTheme"
);

if(savedTheme === "dark"){

    document.body.classList.add(
    "dark-mode"
    );

    themeBtn.textContent =
    "☀️ Light Mode";

}

themeBtn.addEventListener(
"click",
()=>{
    document.body.classList.toggle(
    "dark-mode"
    );

    const dark =
    document.body.classList.contains(
    "dark-mode"
    );

    themeBtn.textContent =
    dark
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

    localStorage.setItem(
    "teamTheme",
    dark
    ? "dark"
    : "light"
);

});   // closes themeBtn listener

});   // closes DOMContentLoaded