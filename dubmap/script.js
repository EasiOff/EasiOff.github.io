const clockSmall = document.getElementById("clockSmall");
const clockLarge = document.getElementById("clockLarge");
const dateLabel = document.getElementById("dateLabel");
const onboarding = document.getElementById("onboarding");
const obStage = document.getElementById("obStage");
const questionSelections = {
	q1: new Set(),
	q2: new Set(),
	q3: new Set()
};
const steps = ["splash", "hero", "intro", "q1", "q2", "q3", "lang", "welcome", "journey", "apply", "elig-q1", "elig-q2", "elig-q3", "elig-loading", "elig-list", "elig-detail", "elig-detail-expanded", "all", "mentors", "mentor-profile", "mentor-calendar", "mentor-confirm", "profile"];
let stepIndex = 0;
let primaryLanguage = "";
let displayTime = "9:41";
const eligibilityAnswers = {
	q1: "",
	q2: "",
	q3: ""
};
let matchedScholarshipIndex = 0;
const profileNotificationSettings = {
	deadline: false,
	mentor: true,
	stories: false
};
let selectedMentorIndex = 0;
let mentorCalendarDate = "September 22, 2026";
let mentorCalendarTime = "1:30 PM";
const savedMentorIndexes = new Set();

const mentorData = [
	{
		name: "Sofia Ramirez",
		major: "Economics · Senior",
		image: "images/mentor4.png",
		bio: "Transfered from community college with no roadmap. Now a senior in Economics - here to help you navigate the transfer process, financial aid, and finding your path at UW.",
		stats: ["47", "12", "4.8"],
		labels: ["finance", "transfer", "first-gen"],
		help: ["Transfer process", "Campus life", "Financial aid", "Career paths"],
		reviews: [
			"How I navigated college as a transfer student",
			"Finding financial aid as a first-gen student",
			"Balancing work, school, and social life"
		]
	},
	{
		name: "Marcus Chen",
		major: "Biology · Senior",
		image: "images/mentor2.png",
		bio: "Exploring research, pre-med paths, and campus resources. Marcus keeps it practical and direct.",
		stats: ["31", "9", "4.9"],
		labels: ["research", "pre-med", "bio"],
		help: ["Research labs", "Pre-med planning", "Study habits", "Internships"],
		reviews: ["First research opportunity", "Pre-med scheduling tips", "How I found a mentor"]
	},
	{
		name: "Jade Park",
		major: "Economics · Senior",
		image: "images/mentor3.png",
		bio: "Helpful with academic planning, scholarships, and keeping the bigger picture manageable.",
		stats: ["29", "8", "4.7"],
		labels: ["scholarships", "planning", "economics"],
		help: ["Scholarship search", "Course planning", "Campus jobs", "Mentoring"],
		reviews: ["What I learned from applying late", "How to stay organized at UW", "Making the most of office hours"]
	}
];

const screenBackgrounds = {
	journey: {
		image: "images/JourneyMapimg.jpg",
		opacity: 0.08
	},
	apply: {
		image: "images/onboardimg4.jpg",
		opacity: 0.14
	},
	all: {
		image: "images/onboardimg5.jpg",
		opacity: 0.12
	}
};

const timelineNodes = [
	{ label: "Class Registration", complete: true },
	{ label: "File FAFSA/Financial Aid", complete: true },
	{ label: "Meet with Academic Advisor", complete: true },
	{ label: "Apply for Scholarships", active: true },
	{ label: "Apply for Research Positions", locked: true },
	{ label: "Visit Career Center", locked: true },
	{ label: "Set up LinkedIn", locked: true }
];

const resourceLinks = [
	"UW Scholarship Portal",
	"OMSFA Advising Appointment",
	"Financial Aid Office",
	"studentaid.gov"
];

const scholarshipRows = [
	{ name: "Mary Gates Research Scholarship", due: "Oct", tone: "red" },
	{ name: "Mary Gates Leadership Scholarship", due: "Oct", tone: "red" },
	{ name: "Thomas Sedlock Icon Scholarships", due: "Oct", tone: "red" },
	{ name: "Matthew Kaiyen Hwang Endwed Memorial Research Scholarship", due: "Oct", tone: "red" },
	{ name: "Bonderman Fellowship", due: "Jan", tone: "amber" },
	{ name: "Purple & Gold Scholarship", due: "Feb", tone: "amber" },
	{ name: "Washington State Opportunity Scholarship", due: "Feb", tone: "amber" },
	{ name: "Martin Family Foundation Achievement Scholarship", due: "Apr", tone: "green" },
	{ name: "Alumni Reunion, Class Gift & Spence Scholarships", due: "Apr", tone: "green" }
];

const eligibilityQuestionData = {
	"elig-q1": {
		title: "01. What is your student status?",
		options: ["Domestic student", "International student"]
	},
	"elig-q2": {
		title: "02. What is your major/field of study?",
		options: ["STEM", "Social Sciences", "Humanities", "Business", "Undecided"]
	},
	"elig-q3": {
		title: "03. What are you looking for?",
		options: ["Research funding", "Leadership opportunities", "General financial support", "Study abroad/ fellowship"]
	}
};

const matchedScholarships = [
	{ name: "Mary Gates Research Scholarship", due: "Oct", tone: "red" },
	{ name: "Matthew Kaiyon Hwang Endwed Memorial Research Scholarship", due: "Oct", tone: "red" },
	{ name: "Bonderman Fellowship", due: "Jan", tone: "amber" }
];

const questionData = {
	q1: {
		title: "01. What are you most excited about?",
		note: "(Select up to 3)",
		options: [
			"Making friends",
			"Finding student organizations",
			"Academic success",
			"Career preparation",
			"Others"
		]
	},
	q2: {
		title: "02. What feels most challenging right now?",
		note: "(Select up to 3)",
		options: [
			"Finding resources",
			"Choosing classes",
			"Making connections",
			"Managing finances",
			"Others"
		]
	},
	q3: {
		title: "03. How familiar are you with UW?",
		note: "(Select up to 3)",
		options: [
			"Connecting with peers",
			"Exploring campus services",
			"Attending orientation events",
			"Engaging with faculty"
		]
	}
};

function logoMarkup(variant = "default") {
	const logoImage = variant === "journey" ? "images/dubmap_logo2.png" : "images/dubmap_logo.png";
	return `<div class="ob-logo"><img src="${logoImage}" alt="" class="ob-logo-image" aria-hidden="true"><span class="ob-logo-word">DubMap</span></div>`;
}

function statusMarkup() {
	return '<div class="ob-status"><span class="ob-time">' + displayTime + '</span><span class="ob-status-right"><span class="icon-signal"><i></i><i></i><i></i><i></i></span><span class="icon-wifi"></span><span class="icon-battery"><span class="icon-battery-level"></span></span></span></div>';
}

function questionDots(activeIndex) {
	const dots = [0, 1, 2, 3].map((index) => {
		return `<span class="ob-progress-dot ${index === activeIndex ? "is-active" : ""}"></span>`;
	}).join("");
	return `<div class="ob-progress">${dots}</div>`;
}

function featureBackgroundStyle(screenKey) {
	const config = screenBackgrounds[screenKey] || {};
	const imageValue = config.image ? `url("${config.image.replace(/"/g, "\\\"")}")` : "none";
	const opacityValue = Number.isFinite(config.opacity) ? Math.min(Math.max(config.opacity, 0), 1) : 0.14;
	return `style="--feature-bg-image:${imageValue};--feature-bg-opacity:${opacityValue};"`;
}

function renderFeatureTabs(activeLabel) {
	const tabs = ["Autumn", "Winter", "Spring", "Summer"].map((label) => {
		return `<button type="button" class="ob-chip ${label === activeLabel ? "is-active" : ""}">${label}</button>`;
	}).join("");
	return `<div class="ob-chip-row">${tabs}</div>`;
}

function renderBottomNav(activeKey) {
	const navItems = [
		{ key: "journey", label: "Journey" },
		{ key: "mentors", label: "Mentors" },
		{ key: "profile", label: "Profile" }
	];
	const navMarkup = navItems.map((item) => {
		const classes = ["ob-tab", item.key === activeKey ? "is-active" : ""].filter(Boolean).join(" ");
		return `<button type="button" class="${classes}" data-action="nav-${item.key}">${item.label}</button>`;
	}).join("");
	return `<div class="ob-bottom-nav">${navMarkup}</div>`;
}

function renderJourneyScreen() {
	const routeHeight = 680;
	const nodeXPositions = [69, 64, 70, 60, 30, 24, 30];
	const nodeYPositions = [64, 146, 228, 320, 420, 510, 600];
	const nodes = timelineNodes.map((node, idx) => {
		const x = nodeXPositions[idx] || 50;
		const y = nodeYPositions[idx] || (80 + idx * 94);
		return { ...node, idx, x, y };
	});

	const activeNode = nodes.find((node) => node.active) || null;
	const bonusPoint = activeNode ? { x: activeNode.x - 10, y: activeNode.y + 52 } : null;

	const routePoints = [];
	nodes.forEach((node) => {
		routePoints.push({ x: node.x, y: node.y });
		if (bonusPoint && node.active) {
			routePoints.push(bonusPoint);
		}
	});

	let pathData = "";
	if (routePoints.length > 0) {
		pathData = `M ${routePoints[0].x} ${routePoints[0].y}`;
		for (let i = 1; i < routePoints.length; i += 1) {
			const curr = routePoints[i];
			pathData += ` L ${curr.x} ${curr.y}`;
		}
	}

	const nodesMarkup = nodes.map((node) => {
		const sideClass = node.x >= 50 ? "is-right" : "is-left";
		const classes = [
			"ob-map-node",
			sideClass,
			node.complete ? "is-complete" : "",
			node.active ? "is-active" : "",
			node.locked ? "is-locked" : ""
		].filter(Boolean).join(" ");
		const nodeAction = node.active ? ' data-action="go-apply"' : "";
		const marker = node.complete ? "&#10003;" : node.locked ? "&#128274;" : node.active ? "" : "&#9679;";

		return `
			<li class="${classes}" style="--node-x:${node.x}%; --node-y:${node.y}px;"${nodeAction}>
				<span class="ob-map-bubble">${marker}</span>
				<span class="ob-map-label">${node.label}</span>
			</li>
		`;
	}).join("");

	const bonusMarkup = bonusPoint ? `
		<li class="ob-map-node is-bonus" style="--node-x:${bonusPoint.x}%; --node-y:${bonusPoint.y}px;">
			<span class="ob-map-bubble ob-bonus-bubble"><img src="images/bonus node.png" alt="" class="ob-bonus-node-icon"></span>
			<span class="ob-map-label">Bonus</span>
		</li>
	` : "";

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-journey" ${featureBackgroundStyle("journey")}>
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell">
				<header class="ob-feature-header">
					<p class="ob-feature-kicker">Journey Map</p>
					<div class="ob-journey-brand">
						${logoMarkup("journey")}
						<img src="images/bell.png" alt="Notifications" class="ob-bell-icon">
					</div>
				</header>
				<section class="ob-surface ob-map-topcard">
					<h2 class="ob-section-title">Section 1: Freshman year</h2>
					${renderFeatureTabs("Winter")}
				</section>
				<section class="ob-map-route">
					<svg class="ob-map-path" viewBox="0 0 100 ${routeHeight}" preserveAspectRatio="none" aria-hidden="true">
						<path d="${pathData}"></path>
					</svg>
					<ul class="ob-map-list">${nodesMarkup}${bonusMarkup}</ul>
				</section>
				${renderBottomNav("journey")}
			</div>
		</div>
	`;
}

function renderApplyScreen() {
	const linksMarkup = resourceLinks.map((label) => {
		return `<button type="button" class="ob-resource-row">${label}<span class="ob-resource-ext">&#8599;</span></button>`;
	}).join("");

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-apply" ${featureBackgroundStyle("apply")}>
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell">
				<header class="ob-topbar">
					<button type="button" class="ob-icon-btn" data-action="go-journey">&lsaquo;</button>
					<h2>Apply for Scholarships</h2>
					<span></span>
				</header>
				<div class="ob-search">Search scholarships...</div>
				<section class="ob-surface ob-copy-surface">
					<p class="ob-mini-head">About</p>
					<p>Scholarships at UW are open to all students regardless of citizenship or financial background. The Office of Merit Scholarships supports you in finding and applying competitively.</p>
					<p class="ob-mini-head">General eligibility</p>
					<ul>
						<li>Matriculated UW undergraduate students</li>
						<li>Open to all citizenship statuses</li>
						<li>Open to all majors and class standings</li>
					</ul>
				</section>
				<section class="ob-surface ob-link-surface">
					<p class="ob-mini-head">Resources</p>
					${linksMarkup}
				</section>
				<button type="button" class="ob-primary ob-action-btn" data-action="go-eligibility-q1">Check your Eligibility</button>
				<button type="button" class="ob-outline-btn" data-action="go-all">Browse ALL Scholarships</button>
				${renderBottomNav("journey")}
			</div>
		</div>
	`;
}

function eligibilityProgress(activeIndex) {
	const dots = [0, 1, 2].map((index) => {
		return `<span class="ob-progress-dot ${index === activeIndex ? "is-active" : ""}"></span>`;
	}).join("");
	return `<div class="ob-progress ob-elig-progress">${dots}</div>`;
}

function renderEligibilityQuestion(stepKey) {
	const data = eligibilityQuestionData[stepKey];
	const selectionMap = {
		"elig-q1": "q1",
		"elig-q2": "q2",
		"elig-q3": "q3"
	};
	const questionIndexMap = {
		"elig-q1": 0,
		"elig-q2": 1,
		"elig-q3": 2
	};
	const selectedValue = eligibilityAnswers[selectionMap[stepKey]];
	const optionsMarkup = data.options.map((option) => {
		const isSelected = selectedValue === option;
		return `<button type="button" class="ob-elig-option ${isSelected ? "is-selected" : ""}" data-action="elig-select" data-step="${stepKey}" data-value="${option.replace(/"/g, "&quot;")}">${option}</button>`;
	}).join("");

	const nextDisabled = selectedValue ? "" : "disabled";

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-elig">
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell ob-elig-shell">
				<header class="ob-topbar">
					<button type="button" class="ob-icon-btn" data-action="elig-back">&lsaquo;</button>
					<h2>Check your Eligibility</h2>
					<span></span>
				</header>
				<div class="ob-elig-main">
					<div class="ob-elig-card">
						<h3 class="ob-elig-title">${data.title}</h3>
						<div class="ob-elig-options">${optionsMarkup}</div>
						${eligibilityProgress(questionIndexMap[stepKey])}
					</div>
					<button type="button" class="ob-primary ob-elig-next-btn" data-action="elig-next" ${nextDisabled}>Next</button>
					<button type="button" class="ob-elig-back-link" data-action="elig-back">Back</button>
				</div>
			</div>
		</div>
	`;
}

function renderEligibilityLoading() {
	obStage.innerHTML = `
		<div class="ob-screen ob-screen-elig-loading">
			${statusMarkup()}
			<div class="ob-elig-loading-core">
				<div class="ob-elig-spinner" aria-hidden="true"><img src="images/dubmap_logo.png" alt="" class="ob-elig-spinner-logo"></div>
				<h2>Finding your scholarships...</h2>
				<p>Matching results based on your profile and eligibility answers</p>
			</div>
			<div class="ob-elig-loading-actions">
				<button type="button" class="ob-elig-ghost-btn" data-action="elig-back">Back</button>
				<button type="button" class="ob-elig-ghost-btn" data-action="go-apply">Cancel</button>
			</div>
		</div>
	`;

	setTimeout(() => {
		if (steps[stepIndex] === "elig-loading") {
			stepIndex = steps.indexOf("elig-list");
			renderOnboarding();
		}
	}, 1300);
}

function renderEligibilityList() {
	const rows = matchedScholarships.map((row, idx) => {
		const isLocked = idx > 0;
		const activeClass = idx === matchedScholarshipIndex ? "is-active" : "";
		const lockedClass = isLocked ? "is-disabled" : "";
		const disabledAttr = isLocked ? "disabled" : "";
		return `
			<li>
				<button type="button" class="ob-elig-list-row ${activeClass} ${lockedClass}" data-action="elig-pick" data-index="${idx}" ${disabledAttr}>
					<span>${row.name}</span>
					<span class="ob-pill ${row.tone}">${row.due}</span>
				</button>
			</li>
		`;
	}).join("");

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-elig-result" ${featureBackgroundStyle("apply")}>
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell">
				<header class="ob-topbar">
					<button type="button" class="ob-icon-btn" data-action="elig-back">&lsaquo;</button>
					<h2>Apply for Scholarships</h2>
					<span></span>
				</header>
				<div class="ob-search">Search scholarships...</div>
				<div class="ob-elig-sheet">
					<div class="ob-elig-sheet-head">
						<h3>Your Scholarships</h3>
						<button type="button" class="ob-elig-close" data-action="go-apply">&#10005;</button>
					</div>
					<ul class="ob-elig-list">${rows}</ul>
					<button type="button" class="ob-primary" data-action="elig-select-result">Select</button>
					<button type="button" class="ob-outline-btn" data-action="elig-back">Back</button>
				</div>
			</div>
		</div>
	`;
}

function renderScholarshipDetail(expanded = false) {
	const calendarButton = expanded
		? '<button type="button" class="ob-elig-calendar-success">&#10003;</button>'
		: '<button type="button" class="ob-primary ob-elig-calendar-btn" data-action="elig-expand">Add to Calendar</button>';

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-elig-detail" ${featureBackgroundStyle("apply")}>
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell">
				<header class="ob-topbar">
					<button type="button" class="ob-icon-btn" data-action="elig-back">&lsaquo;</button>
					<h2>Mary Gates Research Scholarship</h2>
					<span></span>
				</header>
				<div class="ob-elig-deadline"><span>&#9718;</span> Next deadline: Oct 26</div>
				<section class="ob-surface ob-copy-surface">
					<p class="ob-mini-head">About</p>
					<p>Competitive scholarship for UW undergraduates engaged in faculty-guided research. Awards $5,000 distributed in two installments over two quarters of your choice. Open to all citizenship statuses - open application cycle per year, every Autumn quarter.</p>
					<div class="ob-elig-calendar-wrap">${calendarButton}</div>
				</section>
				<section class="ob-surface ob-elig-steps-surface">
					<p class="ob-mini-head">Step-by-step guide</p>
					<ol class="ob-elig-steps-list">
						<li>Review the selection criteria</li>
						<li>Find a faculty mentor</li>
						<li>Prepare your application materials</li>
					</ol>
				</section>
				<section class="ob-elig-story">
					<p class="ob-mini-head">Story Cards</p>
					<div class="ob-elig-story-row">
						<article class="ob-elig-story-card"><h4>What I wish I knew before applying</h4><a href="#">Read full story &#8594;</a></article>
						<article class="ob-elig-story-card"><h4>Finding scholarships before it's too late</h4><a href="#">Read full story &#8594;</a></article>
						<article class="ob-elig-story-card"><h4>How I won my first scholarship at UW</h4><a href="#">Read full story &#8594;</a></article>
					</div>
				</section>
				${renderBottomNav("journey")}
			</div>
		</div>
	`;
}

function renderAllScholarshipsScreen() {
	const rows = scholarshipRows.map((row) => {
		return `<li class="ob-list-row"><span>${row.name}</span><span class="ob-pill ${row.tone}">${row.due}</span></li>`;
	}).join("");

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-all" ${featureBackgroundStyle("all")}>
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell">
				<header class="ob-topbar">
					<button type="button" class="ob-icon-btn" data-action="go-apply">&lsaquo;</button>
					<h2>All Scholarships</h2>
					<span></span>
				</header>
				<div class="ob-search">Search scholarships...</div>
				<div class="ob-filter-row">
					<span class="ob-filter-chip">filter</span>
					<span class="ob-filter-chip">All</span>
					<span class="ob-filter-chip is-active">Deadline</span>
					<span class="ob-filter-chip">Eligibility</span>
					<span class="ob-filter-chip">Field</span>
				</div>
				<ul class="ob-list-surface">${rows}</ul>
				${renderBottomNav("journey")}
			</div>
		</div>
	`;
}

function renderBlankTabScreen(activeKey) {
	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature">
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell">
				${renderBottomNav(activeKey)}
			</div>
		</div>
	`;
}

function renderMentorsScreen() {
	const mentorRows = mentorData.map((mentor, index) => {
		return `
			<div class="ob-mentor-row">
				<img src="${mentor.image}" alt="${mentor.name}" class="ob-mentor-avatar">
				<div class="ob-mentor-copy">
					<p class="ob-mentor-name">${mentor.name}</p>
					<p class="ob-mentor-meta">${mentor.major}</p>
				</div>
				<button type="button" class="ob-mentor-view" data-action="mentor-open" data-index="${index}">View profile</button>
				<button type="button" class="ob-mentor-save" aria-label="Save mentor"><img src="images/addicon.png" alt="" class="ob-mentor-save-icon"></button>
			</div>
		`;
	}).join("");

	const matchedCards = mentorData.slice(0, 2).map((mentor, index) => {
		return `
			<button type="button" class="ob-mentor-card" data-action="mentor-open" data-index="${index}">
				<img src="${mentor.image}" alt="${mentor.name}" class="ob-mentor-card-img">
				<p class="ob-mentor-card-name">${mentor.name}</p>
				<p class="ob-mentor-card-meta">${mentor.major}</p>
				<span class="ob-mentor-card-badge">4.8 average</span>
			</button>
		`;
	}).join("");

	const savedMentors = mentorData.slice(1, 3).map((mentor) => {
		return `<img src="${mentor.image}" alt="${mentor.name}" class="ob-mentor-saved-img">`;
	}).join("");

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-mentors" ${featureBackgroundStyle("all")}>
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell ob-mentors-shell">
				<header class="ob-topbar">
					<span></span>
					<h2>All Mentors</h2>
					<span></span>
				</header>
				<div class="ob-search">Search mentors...</div>
				<div class="ob-filter-row">
					<span class="ob-filter-chip is-active">All</span>
					<span class="ob-filter-chip">A&O</span>
					<span class="ob-filter-chip">Scholarship</span>
					<span class="ob-filter-chip">International</span>
					<span class="ob-filter-chip">Housing</span>
				</div>
				<div class="ob-mentor-list-surface">
					${mentorRows}
				</div>
				<section class="ob-surface ob-mentor-section">
					<div class="ob-mentor-section-head">
						<p class="ob-mini-head">Matched For You</p>
						<span class="ob-mentor-section-link">View all &#8250;</span>
					</div>
					<div class="ob-mentor-card-row">${matchedCards}</div>
				</section>
				<section class="ob-surface ob-mentor-section">
					<p class="ob-mini-head">Saved Mentors</p>
					<div class="ob-mentor-saved-row">${savedMentors}</div>
				</section>
				${renderBottomNav("mentors")}
			</div>
		</div>
	`;
}

function renderMentorProfileScreen() {
	const mentor = mentorData[selectedMentorIndex] || mentorData[0];
	const isSavedMentor = savedMentorIndexes.has(selectedMentorIndex);
	const statLabels = ["students helped", "sessions done", "rating"];
	const statCards = mentor.stats.map((value, index) => {
		return `
			<div class="ob-mentor-stat">
				<p class="ob-mentor-stat-value">${value}</p>
				<p class="ob-mentor-stat-label">${statLabels[index]}</p>
			</div>
		`;
	}).join("");

	const tagMarkup = mentor.labels.map((label) => `<span>${label}</span>`).join("");
	const helpMarkup = mentor.help.map((label) => `<span>${label}</span>`).join("");
	const reviewMarkup = mentor.reviews.map((review) => {
		return `<article class="ob-mentor-story-card"><h4>${review}</h4><a href="#">Read full story &#8594;</a></article>`;
	}).join("");
	const saveMentorButton = isSavedMentor
		? '<button type="button" class="ob-mentor-saved-btn" aria-label="Mentor saved">&#10003;</button>'
		: '<button type="button" class="ob-outline-btn" data-action="mentor-save-profile">Save mentor</button>';

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-mentor-profile">
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell ob-mentor-profile-shell">
				<header class="ob-topbar">
					<button type="button" class="ob-icon-btn" data-action="mentor-back">&lsaquo;</button>
					<h2>View Profile</h2>
					<span></span>
				</header>
				<div class="ob-mentor-hero">
					<img src="${mentor.image}" alt="${mentor.name}" class="ob-mentor-hero-img">
					<h3>${mentor.name}</h3>
					<p>${mentor.major}</p>
					<div class="ob-mentor-labels">${tagMarkup}</div>
				</div>
				<div class="ob-mentor-stats">${statCards}</div>
				<section class="ob-surface ob-mentor-bio">
					<p class="ob-mini-head">About</p>
					<p>${mentor.bio}</p>
				</section>
				<section class="ob-surface ob-mentor-help">
					<p class="ob-mini-head">Can help with</p>
					<div class="ob-mentor-help-tags">${helpMarkup}</div>
				</section>
				<section class="ob-surface ob-mentor-stories">
					<p class="ob-mini-head">Story Cards</p>
					<div class="ob-mentor-story-row">${reviewMarkup}</div>
				</section>
				<button type="button" class="ob-primary ob-mentor-book-btn" data-action="mentor-book">Book 30-min async Q&A Session</button>
				${saveMentorButton}
				${renderBottomNav("mentors")}
			</div>
		</div>
	`;
}

function renderMentorCalendarScreen() {
	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-mentor-calendar">
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell ob-mentor-calendar-shell">
				<div class="ob-mentor-calendar-panel">
					<button type="button" class="ob-mentor-close" data-action="mentor-back">&#10005;</button>
					<div class="ob-mentor-calendar-head">
						<p class="ob-mentor-calendar-month">September 2026</p>
						<div class="ob-mentor-calendar-nav"><span>&#8249;</span><span>&#8250;</span></div>
					</div>
					<div class="ob-mentor-calendar-grid" aria-hidden="true">
						<span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
						<span></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
						<span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span>
						<span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
						<span>21</span><span class="is-selected">22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span>
						<span>28</span><span>29</span><span>30</span>
					</div>
					<div class="ob-mentor-time-row">
						<span>Time</span>
						<button type="button" class="ob-mentor-time-btn">1:30 PM</button>
					</div>
					<button type="button" class="ob-primary" data-action="mentor-confirm">Select</button>
				</div>
			</div>
		</div>
	`;
}

function renderMentorConfirmScreen() {
	const mentor = mentorData[selectedMentorIndex] || mentorData[0];
	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-mentor-confirm">
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell ob-mentor-confirm-shell">
				<button type="button" class="ob-mentor-close ob-mentor-confirm-close" data-action="mentor-back">&#10005;</button>
				<div class="ob-mentor-confirm-icon">&#10003;</div>
				<h2>Your session has been scheduled!</h2>
				<p>A confirmation and Zoom link are being sent to your email.</p>
				<section class="ob-surface ob-mentor-confirm-card">
					<div class="ob-mentor-confirm-row">
						<img src="${mentor.image}" alt="${mentor.name}" class="ob-mentor-confirm-avatar">
						<div>
							<p>${mentor.name}</p>
							<span>${mentor.major}</span>
						</div>
					</div>
					<div class="ob-mentor-confirm-time">
						<span>&#128197;</span>
						<div>
							<p>${mentorCalendarDate}</p>
							<span>${mentorCalendarTime} (PST)</span>
						</div>
					</div>
					<button type="button" class="ob-mentor-confirm-link">See all details &#8250;</button>
				</section>
				<div class="ob-mentor-confirm-actions">
					<button type="button" class="ob-outline-btn" data-action="mentor-back">Reschedule</button>
					<button type="button" class="ob-outline-btn" data-action="mentor-back">Cancel</button>
				</div>
			</div>
		</div>
	`;
}

function renderProfileScreen() {
	const toggleRow = (key, title, subtitle) => {
		const isOn = Boolean(profileNotificationSettings[key]);
		return `
			<div class="ob-profile-toggle-row">
				<div>
					<p class="ob-profile-toggle-title">${title}</p>
					<p class="ob-profile-toggle-sub">${subtitle}</p>
				</div>
				<button
					type="button"
					class="ob-switch ${isOn ? "is-on" : ""}"
					data-action="profile-toggle"
					data-key="${key}"
					aria-label="Toggle ${title}"
				></button>
			</div>
		`;
	};

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-feature ob-screen-profile">
			${statusMarkup()}
			<div class="ob-feature-bg" aria-hidden="true"></div>
			<div class="ob-feature-shell ob-profile-shell">
				<header class="ob-profile-topbar">
					<span></span>
					<h2>My Profile</h2>
					<div class="ob-profile-actions">
						<button type="button" class="ob-profile-icon-btn" aria-label="Calendar">&#128197;</button>
						<button type="button" class="ob-profile-icon-btn" aria-label="Settings">&#9881;</button>
					</div>
				</header>
				<div class="ob-profile-scroll">
					<div class="ob-profile-identity">
						<div class="ob-profile-avatar" aria-hidden="true"><span></span></div>
						<h3>Valentina Rivera</h3>
						<p>Economics · Sophomore</p>
						<div class="ob-profile-tags">
							<span>Espanol</span>
							<span>Transfer</span>
							<span>First-gen</span>
						</div>
					</div>

					<section class="ob-surface ob-profile-card">
						<div class="ob-profile-card-head">
							<p class="ob-mini-head">My journey progress</p>
							<p class="ob-profile-progress-text">2 / 5 completed</p>
						</div>
						<div class="ob-profile-term-row">
							<span>Autumn quarter</span>
						</div>
						<div class="ob-profile-progress-track"><span style="width:40%"></span></div>
						<ul class="ob-profile-checklist">
							<li class="is-done">Set up NetID</li>
							<li class="is-done">Complete A&O</li>
							<li class="is-current">Financial Aid</li>
							<li class="is-locked">Housing</li>
							<li class="is-locked">Transfer credits</li>
						</ul>
					</section>

					<section class="ob-surface ob-profile-card">
						<p class="ob-mini-head">Saved Mentors</p>
						<div class="ob-profile-mentor-row">
							<div class="ob-profile-mentor-avatar" aria-hidden="true">
								<img src="images/mentor1.png" alt="" class="ob-profile-mentor-photo">
							</div>
							<div class="ob-profile-mentor-copy">
								<p>Jade Park</p>
								<span>Economics · Senior</span>
							</div>
							<span class="ob-profile-chevron">&#8250;</span>
						</div>
					</section>

					<section class="ob-surface ob-profile-card">
						<p class="ob-mini-head">Notifications</p>
						${toggleRow("deadline", "Deadline reminders", "Get notified before due dates")}
						${toggleRow("mentor", "Mentor session reminders", "Reminders for booked sessions")}
						${toggleRow("stories", "New story cards", "From mentors you saved")}
					</section>
				</div>
				${renderBottomNav("profile")}
			</div>
		</div>
	`;
}

function renderQuestion(stepKey) {
	const data = questionData[stepKey];
	const selected = questionSelections[stepKey];
	const questionIndexMap = { q1: 0, q2: 1, q3: 2 };
	const imageClassMap = {
		q1: "q-image-one",
		q2: "q-image-two",
		q3: "q-image-three"
	};
	const questionIndex = questionIndexMap[stepKey];

	const optionsMarkup = data.options.map((label, idx) => {
		const isSelected = selected.has(idx);
		return `<button type="button" class="ob-option ${isSelected ? "is-selected" : ""}" data-action="toggle" data-step="${stepKey}" data-index="${idx}">${label}</button>`;
	}).join("");

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-question">
			${statusMarkup()}
			<div class="ob-question-image ${imageClassMap[stepKey]}">${logoMarkup()}</div>
			<div class="ob-question-body">
				<h2 class="ob-question-title">${data.title}</h2>
				<p class="ob-question-note">${data.note}</p>
				<div class="ob-options">${optionsMarkup}</div>
				${questionDots(questionIndex)}
				<button type="button" class="ob-primary" data-action="next">Next</button>
				<button type="button" class="ob-back" data-action="back">Back</button>
			</div>
		</div>
	`;
}

function renderLanguageStep() {
	obStage.innerHTML = `
		<div class="ob-screen ob-screen-question">
			${statusMarkup()}
			<div class="ob-question-image q-image-lang">${logoMarkup()}</div>
			<div class="ob-question-body">
				<h2 class="ob-question-title">04. What is your primary language?</h2>
				<div class="ob-language-wrap">
					<input
						type="text"
						id="obLanguageInput"
						class="ob-language-input"
						placeholder="Write your primary language"
						value="${primaryLanguage.replace(/"/g, "&quot;")}"
					>
				</div>
				${questionDots(3)}
				<button type="button" class="ob-primary" data-action="finish">Get Started</button>
				<button type="button" class="ob-back" data-action="back">Back</button>
			</div>
		</div>
	`;

	const input = document.getElementById("obLanguageInput");
	if (input) {
		input.focus();
		input.addEventListener("input", (event) => {
			const nextValue = event.target.value.slice(0, 60);
			primaryLanguage = nextValue;
			event.target.value = nextValue;
		});
	}
}

function renderWelcomeScreen() {
	const langLine = primaryLanguage.trim()
		? `<p class="ob-welcome-lang">Primary language: <strong>${primaryLanguage.trim()}</strong></p>`
		: "";

	obStage.innerHTML = `
		<div class="ob-screen ob-screen-welcome">
			${statusMarkup()}
			<div class="ob-welcome-body">
				<div class="ob-welcome-icon" aria-hidden="true">&#10024;</div>
				${logoMarkup()}
				<h2 class="ob-welcome-title">You're all set!</h2>
				<p class="ob-welcome-text">Your DubMap experience is personalized and ready. Let's start your journey.</p>
				${langLine}
				<button type="button" class="ob-primary ob-welcome-cta" data-action="go-journey">Enter DubMap</button>
			</div>
		</div>
	`;
}

function renderOnboarding() {
	const step = steps[stepIndex];

	if (step === "splash") {
		obStage.innerHTML = `
			<div class="ob-screen ob-screen-splash">
				${statusMarkup()}
				<div class="ob-splash-center">
					${logoMarkup()}
					<p class="ob-splash-sub">Begin Your College Journey With Confidence</p>
				</div>
			</div>
		`;
		setTimeout(() => {
			if (steps[stepIndex] === "splash") {
				stepIndex = 1;
				renderOnboarding();
			}
		}, 1200);
		return;
	}

	if (step === "hero") {
		obStage.innerHTML = `
			<div class="ob-screen ob-screen-hero">
				${statusMarkup()}
				<div class="ob-hero-image">${logoMarkup()}</div>
				<div class="ob-card-bottom">
					<h2 class="ob-card-title">Ready to thrive at UW?</h2>
					<button type="button" class="ob-primary" data-action="next">Your Journey Starts Here</button>
				</div>
			</div>
		`;
		return;
	}

	if (step === "intro") {
		obStage.innerHTML = `
			<div class="ob-screen ob-screen-intro">
				${statusMarkup()}
				<div class="ob-intro-image">${logoMarkup()}</div>
				<div class="ob-question-body ob-intro-body">
					<h2 class="ob-intro-title">Let's get to know you first.</h2>
					<p class="ob-intro-text">Answer a few quick questions so we can personalize your DubMap experience.</p>
					<button type="button" class="ob-primary" data-action="next">Ready to Answer</button>
				</div>
			</div>
		`;
		return;
	}

	if (step === "lang") {
		renderLanguageStep();
		return;
	}

	if (step === "welcome") {
		renderWelcomeScreen();
		return;
	}

	if (step === "journey") {
		renderJourneyScreen();
		return;
	}

	if (step === "apply") {
		renderApplyScreen();
		return;
	}

	if (step === "elig-q1" || step === "elig-q2" || step === "elig-q3") {
		renderEligibilityQuestion(step);
		return;
	}

	if (step === "elig-loading") {
		renderEligibilityLoading();
		return;
	}

	if (step === "elig-list") {
		renderEligibilityList();
		return;
	}

	if (step === "elig-detail") {
		renderScholarshipDetail(false);
		return;
	}

	if (step === "elig-detail-expanded") {
		renderScholarshipDetail(true);
		return;
	}

	if (step === "all") {
		renderAllScholarshipsScreen();
		return;
	}

	if (step === "mentors") {
		renderMentorsScreen();
		return;
	}

	if (step === "mentor-profile") {
		renderMentorProfileScreen();
		return;
	}

	if (step === "mentor-calendar") {
		renderMentorCalendarScreen();
		return;
	}

	if (step === "mentor-confirm") {
		renderMentorConfirmScreen();
		return;
	}

	if (step === "profile") {
		renderProfileScreen();
		return;
	}

	renderQuestion(step);
}

function closeOnboarding() {
	onboarding.classList.add("is-hidden");
}

onboarding.addEventListener("click", (event) => {
	const target = event.target;
	if (!(target instanceof HTMLElement)) {
		return;
	}

	const actionSource = target.closest("[data-action]");
	if (!(actionSource instanceof HTMLElement)) {
		return;
	}

	const action = actionSource.dataset.action;
	if (!action) {
		return;
	}

	if (action === "toggle") {
		const stepKey = actionSource.dataset.step;
		const optionIndex = Number(actionSource.dataset.index);
		const selected = questionSelections[stepKey];

		if (!selected) {
			return;
		}

		if (selected.has(optionIndex)) {
			selected.delete(optionIndex);
		} else if (selected.size < 3) {
			selected.add(optionIndex);
		}

		renderOnboarding();
		return;
	}

	if (action === "next") {
		if (stepIndex < steps.length - 1) {
			stepIndex += 1;
			renderOnboarding();
			return;
		}

		closeOnboarding();
		return;
	}

	if (action === "finish") {
		stepIndex = steps.indexOf("welcome");
		renderOnboarding();
		return;
	}

	if (action === "go-journey") {
		stepIndex = steps.indexOf("journey");
		renderOnboarding();
		return;
	}

	if (action === "go-apply") {
		stepIndex = steps.indexOf("apply");
		renderOnboarding();
		return;
	}

	if (action === "go-all") {
		stepIndex = steps.indexOf("all");
		renderOnboarding();
		return;
	}

	if (action === "go-eligibility-q1") {
		eligibilityAnswers.q1 = "";
		eligibilityAnswers.q2 = "";
		eligibilityAnswers.q3 = "";
		matchedScholarshipIndex = 0;
		stepIndex = steps.indexOf("elig-q1");
		renderOnboarding();
		return;
	}

	if (action === "elig-select") {
		const stepKey = actionSource.dataset.step;
		const value = actionSource.dataset.value || "";
		if (stepKey === "elig-q1") {
			eligibilityAnswers.q1 = value;
		}
		if (stepKey === "elig-q2") {
			eligibilityAnswers.q2 = value;
		}
		if (stepKey === "elig-q3") {
			eligibilityAnswers.q3 = value;
		}
		renderOnboarding();
		return;
	}

	if (action === "elig-next") {
		const step = steps[stepIndex];
		if (step === "elig-q1") {
			stepIndex = steps.indexOf("elig-q2");
		}
		if (step === "elig-q2") {
			stepIndex = steps.indexOf("elig-q3");
		}
		if (step === "elig-q3") {
			stepIndex = steps.indexOf("elig-loading");
		}
		renderOnboarding();
		return;
	}

	if (action === "elig-back") {
		const step = steps[stepIndex];
		if (step === "elig-q1") {
			stepIndex = steps.indexOf("apply");
		}
		if (step === "elig-q2") {
			stepIndex = steps.indexOf("elig-q1");
		}
		if (step === "elig-q3") {
			stepIndex = steps.indexOf("elig-q2");
		}
		if (step === "elig-loading") {
			stepIndex = steps.indexOf("elig-q3");
		}
		if (step === "elig-list") {
			stepIndex = steps.indexOf("elig-q3");
		}
		if (step === "elig-detail" || step === "elig-detail-expanded") {
			stepIndex = steps.indexOf("elig-list");
		}
		renderOnboarding();
		return;
	}

	if (action === "elig-pick") {
		const pickedIndex = Number(actionSource.dataset.index) || 0;
		if (pickedIndex > 0) {
			return;
		}
		matchedScholarshipIndex = pickedIndex;
		renderOnboarding();
		return;
	}

	if (action === "elig-select-result") {
		stepIndex = steps.indexOf("elig-detail");
		renderOnboarding();
		return;
	}

	if (action === "elig-expand") {
		stepIndex = steps.indexOf("elig-detail-expanded");
		renderOnboarding();
		return;
	}

	if (action === "profile-toggle") {
		const key = actionSource.dataset.key;
		if (!key || !(key in profileNotificationSettings)) {
			return;
		}
		profileNotificationSettings[key] = !profileNotificationSettings[key];
		renderOnboarding();
		return;
	}

	if (action === "back") {
		if (stepIndex > 0) {
			stepIndex -= 1;
			renderOnboarding();
		}
		return;
	}

	if (action === "nav-journey") {
		stepIndex = steps.indexOf("journey");
		renderOnboarding();
		return;
	}

	if (action === "nav-mentors") {
		stepIndex = steps.indexOf("mentors");
		renderOnboarding();
		return;
	}

	if (action === "mentor-open") {
		selectedMentorIndex = Number(actionSource.dataset.index) || 0;
		stepIndex = steps.indexOf("mentor-profile");
		renderOnboarding();
		return;
	}

	if (action === "mentor-back") {
		if (stepIndex === steps.indexOf("mentor-profile")) {
			stepIndex = steps.indexOf("mentors");
		} else if (stepIndex === steps.indexOf("mentor-calendar")) {
			stepIndex = steps.indexOf("mentor-profile");
		} else if (stepIndex === steps.indexOf("mentor-confirm")) {
			stepIndex = steps.indexOf("mentor-profile");
		}
		renderOnboarding();
		return;
	}

	if (action === "mentor-book") {
		stepIndex = steps.indexOf("mentor-calendar");
		renderOnboarding();
		return;
	}

	if (action === "mentor-confirm") {
		stepIndex = steps.indexOf("mentor-confirm");
		renderOnboarding();
		return;
	}

	if (action === "mentor-save-profile") {
		savedMentorIndexes.add(selectedMentorIndex);
		renderOnboarding();
		return;
	}

	if (action === "nav-profile") {
		stepIndex = steps.indexOf("profile");
		renderOnboarding();
	}
});

function updateClock() {
	const now = new Date();
	const hour = now.getHours() % 12 || 12;
	const minute = String(now.getMinutes()).padStart(2, "0");
	const time = `${hour}:${minute}`;
	const date = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric"
	}).format(now);

	displayTime = time;
	if (clockSmall) {
		clockSmall.textContent = time;
	}
	if (clockLarge) {
		clockLarge.textContent = time;
	}
	if (dateLabel) {
		dateLabel.textContent = date;
	}
}

updateClock();
setInterval(updateClock, 1000 * 30);
renderOnboarding();
