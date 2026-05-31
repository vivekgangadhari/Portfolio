/* ==========================================================================
   Typing Effect for Hero Title
   ========================================================================== */
const roles = ["Full Stack Developer", "AI & Deep Learning Enthusiast", "Problem Solver", "B.Tech CSE Student"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 100;
const erasingDelay = 50;
const newRoleDelay = 2000;
const typingTextElement = document.querySelector(".typing-text");

function typeRole() {
    if (!typingTextElement) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let delay = isDeleting ? erasingDelay : typingDelay;
    
    if (!isDeleting && charIndex === currentRole.length) {
        delay = newRoleDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 500;
    }
    
    setTimeout(typeRole, delay);
}

// Start typing when page loads
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(typeRole, 1000);
});

/* ==========================================================================
   Theme Switcher Logic
   ========================================================================== */
const themeToggleBtn = document.getElementById("theme-toggle");
const bodyElement = document.body;

// Load preferred theme from localStorage
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
    bodyElement.classList.remove("dark-theme");
    bodyElement.classList.add("light-theme");
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
    }
} else {
    bodyElement.classList.remove("light-theme");
    bodyElement.classList.add("dark-theme");
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        if (bodyElement.classList.contains("dark-theme")) {
            bodyElement.classList.remove("dark-theme");
            bodyElement.classList.add("light-theme");
            themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
            localStorage.setItem("theme", "light");
        } else {
            bodyElement.classList.remove("light-theme");
            bodyElement.classList.add("dark-theme");
            themeToggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
            localStorage.setItem("theme", "dark");
        }
        // Force update canvas colors on theme change
        initCanvasColors();
    });
}

/* ==========================================================================
   Interactive Canvas Neural Background
   ========================================================================== */
const canvas = document.getElementById("neural-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];
const particleCount = 65;
let connectionDist = 120;
let particleColor = "rgba(99, 102, 241, 0.4)";
let lineColor = "rgba(99, 102, 241, 0.08)";
let mouse = { x: null, y: null, radius: 150 };

function initCanvasColors() {
    const isLight = document.body.classList.contains("light-theme");
    if (isLight) {
        particleColor = "rgba(79, 70, 229, 0.3)";
        lineColor = "rgba(79, 70, 229, 0.06)";
    } else {
        particleColor = "rgba(99, 102, 241, 0.45)";
        lineColor = "rgba(99, 102, 241, 0.08)";
    }
}

if (canvas && ctx) {
    initCanvasColors();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Adjust node connection distance based on viewport width
        connectionDist = window.innerWidth < 768 ? 90 : 120;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 2.5 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Interact with mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Track mouse
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Drawing connections and animation loop
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update & Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connecting neural lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    // Line opacity based on proximity
                    let opacity = (1 - dist / connectionDist) * 0.85;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = lineColor.replace("0.08", opacity.toString()).replace("0.06", (opacity * 0.8).toString());
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
}

/* ==========================================================================
   Navigation scrolled active links
   ========================================================================== */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'bx bx-x';
        } else {
            icon.className = 'bx bx-menu';
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'bx bx-menu';
        });
    });
}

// Active link highlighting on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= (sectionTop - sectionHeight / 3.5)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function revealElements() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;
    const triggerOffset = 130;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - triggerOffset) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealElements);
// Trigger initial load reveal
revealElements();

/* ==========================================================================
   Projects Dynamic Filter Handler
   ========================================================================== */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Toggle active button class
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const filterValue = btn.getAttribute("data-filter");
        
        projectCards.forEach(card => {
            const categories = card.getAttribute("data-category");
            if (filterValue === "all" || categories.includes(filterValue)) {
                card.classList.remove("hide");
                // Trigger minor fade scale animation
                card.style.animation = "msgFadeIn 0.4s ease forwards";
            } else {
                card.classList.add("hide");
            }
        });
    });
});

/* ==========================================================================
   Project Details Modal Injections
   ========================================================================== */
const projectModal = document.getElementById("project-modal");
const modalDetailsBody = document.getElementById("modal-details-body");
const closeModalBtn = document.querySelector(".close-modal");

const projectDatabase = {
    "object-detection": {
        title: "Enhanced Object Detection System",
        iconClass: "bx bx-scan",
        desc: "Built a state-of-the-art automatic inspection framework coupling deep learning and traditional user control. The pipeline uses CNN-BiLSTM networks to extract spatial-temporal features, aligned with YOLO architecture for swift coordinate localized bounding boxes, delivering 95% identification accuracy.",
        techs: ["Python", "YOLO v8", "TensorFlow", "Tkinter", "Matplotlib"],
        role: "Lead Machine Learning Developer",
        duration: "Jan 2025 - Mar 2025"
    },
    "chatbot": {
        title: "Maya Conversational AI Assistant",
        iconClass: "bx bx-message-rounded-dots",
        desc: "Created a production-grade context-aware chatbot using Google Gemini API. Incorporates dynamic message streaming, complex file attachment indexing, and system prompt engineering to support conversational workflows and structured data queries.",
        techs: ["Python", "Gemini API", "JavaScript", "HTML5", "CSS3"],
        role: "Full Stack Developer",
        duration: "Oct 2025 - Dec 2025"
    },
    "threat-prediction": {
        title: "Medical AI Threat Prediction Engine",
        iconClass: "bx bx-shield-quarter",
        desc: "An analytical cybersecurity research project leveraging Natural Language Processing. It consumes healthcare HIPAA compliance reports and cyber-attack catalogs, maps vulnerability trends, and suggests defense patches to IT personnel, reducing audit delays.",
        techs: ["Python", "NLTK", "Scikit-Learn", "Pandas", "NLP"],
        role: "Security Analyst & ML Programmer",
        duration: "May 2025 - Jul 2025"
    }
};

function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal || !modalDetailsBody) return;
    
    // Inject HTML structured content
    modalDetailsBody.innerHTML = `
        <div class="modal-header-icon"><i class='${data.iconClass}'></i></div>
        <h3 class="modal-project-title">${data.title}</h3>
        <p class="modal-project-desc">${data.desc}</p>
        
        <div class="modal-details-grid">
            <div class="modal-detail-item">
                <h5>My Role</h5>
                <p>${data.role}</p>
            </div>
            <div class="modal-detail-item">
                <h5>Timeline</h5>
                <p>${data.duration}</p>
            </div>
        </div>
        
        <h5 style="color: var(--accent-solid); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem;">Technologies Used</h5>
        <div class="project-tech" style="margin-bottom: 2rem;">
            ${data.techs.map(t => `<span>${t}</span>`).join("")}
        </div>
        
        <div class="modal-buttons">
            <a href="https://github.com/vivekgangadhari" target="_blank" class="btn btn-primary"><i class='bx bxl-github'></i> Code Repo</a>
            <button class="btn btn-secondary" onclick="closeModal()">Close Window</button>
        </div>
    `;
    
    projectModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable background scrolling
}

function closeModal() {
    if (projectModal) {
        projectModal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
}

// Close modal if clicked outside card content
if (projectModal) {
    projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
}

/* ==========================================================================
   Maya AI Chatbot Widget Logic
   ========================================================================== */
const chatbotWidget = document.querySelector(".chatbot-widget");
const chatbotToggle = document.getElementById("theme-toggle") ? document.getElementById("chatbot-toggle") : null;
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSendBtn = document.getElementById("chatbot-send-btn");
const suggestBtns = document.querySelectorAll(".suggest-btn");

if (chatbotWidget && chatbotToggle) {
    chatbotToggle.addEventListener("click", () => {
        chatbotWidget.classList.toggle("active");
        // Scroll messages to bottom on open
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    });
    
    if (chatbotClose) {
        chatbotClose.addEventListener("click", () => {
            chatbotWidget.classList.remove("active");
        });
    }
}

// Dynamic response mapping
const botReplies = {
    "skills": "Vivek has strong skills in **Python, HTML5, CSS3, SQL, Git, and VS Code**. He also specializes in core domains like **Artificial Intelligence, Deep Learning, and Cybersecurity**!",
    "sih": "Vivek won the **Smart India Hackathon (SIH) 2025 Internal Round** at Kommuri Pratap Reddy Institute of Technology (KPRIT) in October 2025! He proposed an automated medical compliance system.",
    "projects": "Vivek has built several innovative projects:\n\n1. **Enhanced Object Detection** (CNN-BiLSTM & YOLO)\n2. **Maya AI-Powered Chatbot** (Gemini API)\n3. **Medical AI Threat Prediction** (NLP)\n\nClick the 'Learn More' buttons in the Projects section to see full details!",
    "contact": "You can reach Vivek directly via:\n\n- **Email**: gangadharivivek6@gmail.com\n- **Phone**: +91 7013363653\n- **LinkedIn**: [Vivek's Profile](https://linkedin.com/in/gangadhari-vivek-0480ba287)"
};

function formatMarkdown(text) {
    // Basic Markdown formatter (for bold, linebreaks, and links)
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-solid); font-weight: 600;">$1</a>');
    return formatted;
}

function addMessage(text, sender) {
    if (!chatbotMessages) return;
    
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = `<p>${formatMarkdown(text)}</p>`;
    chatbotMessages.appendChild(msgDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    if (!chatbotMessages) return null;
    
    const indicatorDiv = document.createElement("div");
    indicatorDiv.className = "message bot-message typing-indicator-container";
    indicatorDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatbotMessages.appendChild(indicatorDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return indicatorDiv;
}

function handleBotResponse(userMsg) {
    const indicator = showTypingIndicator();
    const query = userMsg.toLowerCase().trim();
    
    let reply = "I'm Maya, Vivek's AI. I'm not sure about that specific detail, but Vivek is highly skilled in Python and AI! You can mail him at gangadharivivek6@gmail.com for direct queries.";
    
    // Keyword Matching Router
    if (query.includes("hi") || query.includes("hello") || query.includes("hey")) {
        reply = "Hello there! How can I help you today? You can ask about Vivek's qualifications, skills, achievements, or projects.";
    } else if (query.includes("skills") || query.includes("technologies") || query.includes("languages")) {
        reply = botReplies.skills;
    } else if (query.includes("sih") || query.includes("hackathon") || query.includes("competition")) {
        reply = botReplies.sih;
    } else if (query.includes("projects") || query.includes("work") || query.includes("build")) {
        reply = botReplies.projects;
    } else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach")) {
        reply = botReplies.contact;
    } else if (query.includes("resume") || query.includes("cv") || query.includes("biodata")) {
        reply = "You can download Vivek's complete resume directly using the **'Download CV'** button in the home section! Let me know if you need specific details.";
    } else if (query.includes("education") || query.includes("gpa") || query.includes("cgpa") || query.includes("college") || query.includes("school")) {
        reply = "Vivek is pursuing his **B.Tech in CSE** at KPRIT (Hyderabad) with a CGPA of **9.17**! He completed Intermediate at Sigma Junior College (87.7%) and SSC at Aryabhatta High School (10/10 CGPA).";
    }
    
    // Simulate thinking delay
    setTimeout(() => {
        if (indicator) indicator.remove();
        addMessage(reply, "bot");
    }, 1200);
}

function processUserInput() {
    if (!chatbotInput) return;
    const text = chatbotInput.value.trim();
    if (text === "") return;
    
    addMessage(text, "user");
    chatbotInput.value = "";
    
    handleBotResponse(text);
}

// Event Listeners for Chatbot Input
if (chatbotSendBtn && chatbotInput) {
    chatbotSendBtn.addEventListener("click", processUserInput);
    chatbotInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            processUserInput();
        }
    });
}

// Predefined Suggestion Chips
suggestBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const question = btn.getAttribute("data-question");
        const btnText = btn.textContent;
        
        addMessage(btnText, "user");
        
        const indicator = showTypingIndicator();
        setTimeout(() => {
            if (indicator) indicator.remove();
            addMessage(botReplies[question], "bot");
        }, 1000);
    });
});
