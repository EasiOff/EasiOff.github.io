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
const steps = ["splash", "hero", "intro", "q1", "q2", "q3", "lang", "welcome", "journey", "apply", "all", "mentors", "profile"];
let stepIndex = 0;
let primaryLanguage = "";
let displayTime = "9:41";

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
			<span class="ob-map-bubble ob-bonus-bubble">&#10047;</span>
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
				<button type="button" class="ob-primary ob-action-btn" data-action="go-all">Check your Eligibility</button>
				<button type="button" class="ob-outline-btn" data-action="go-all">Browse ALL Scholarships</button>
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

	if (step === "all") {
		renderAllScholarshipsScreen();
		return;
	}

	if (step === "mentors") {
		renderBlankTabScreen("mentors");
		return;
	}

	if (step === "profile") {
		renderBlankTabScreen("profile");
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
