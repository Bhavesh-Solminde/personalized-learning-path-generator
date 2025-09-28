// Personalized Learning Path Generator JavaScript

// DOM Elements - Selected within each class as needed
let startAssessmentBtn;

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.themeToggle = document.getElementById("themeToggle");
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(this.currentTheme);
    localStorage.setItem("theme", this.currentTheme);
  }

  applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
    if (this.themeToggle) {
      this.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }
}

// Learning Assessment System
class LearningAssessment {
  constructor() {
    this.questions = [
      {
        id: 1,
        question: "What's your current programming experience level?",
        options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        category: "programming",
      },
      {
        id: 2,
        question: "Which area interests you most?",
        options: [
          "Web Development",
          "Data Science",
          "Mobile Apps",
          "Game Development",
        ],
        category: "interest",
      },
      {
        id: 3,
        question: "How much time can you dedicate to learning per week?",
        options: ["1-3 hours", "4-6 hours", "7-10 hours", "10+ hours"],
        category: "commitment",
      },
      {
        id: 4,
        question: "What's your preferred learning style?",
        options: [
          "Visual (videos, diagrams)",
          "Reading (articles, books)",
          "Hands-on (coding, projects)",
          "Interactive (quizzes, games)",
        ],
        category: "style",
      },
    ];
    this.responses = {};
    this.currentQuestion = 0;
  }

  start() {
    this.showAssessmentModal();
  }

  showAssessmentModal() {
    const modal = this.createModal();
    document.body.appendChild(modal);
    this.displayQuestion();
  }

  createModal() {
    const modal = document.createElement("div");
    modal.className = "assessment-modal";
    modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🎯 Personalized Learning Assessment</h2>
                        <button class="close-btn" onclick="this.closest('.assessment-modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: 0%"></div>
                        </div>
                        <div class="question-container">
                            <!-- Questions will be injected here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Add modal styles
    const style = document.createElement("style");
    style.textContent = `
            .assessment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
            }
            .modal-overlay {
                background-color: rgba(0, 0, 0, 0.7);
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .modal-content {
                background-color: var(--card);
                border-radius: var(--radius);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border);
            }
            .modal-header h2 {
                margin: 0;
                color: var(--foreground);
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--muted-foreground);
            }
            .modal-body {
                padding: 1.5rem;
            }
            .progress-bar-container {
                background-color: var(--muted);
                border-radius: calc(var(--radius) / 2);
                height: 6px;
                margin-bottom: 2rem;
                overflow: hidden;
            }
            .progress-bar-fill {
                background-color: var(--primary);
                height: 100%;
                transition: width 0.3s ease;
                border-radius: calc(var(--radius) / 2);
            }
            .question-text {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                color: var(--foreground);
            }
            .options-grid {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .option-btn {
                padding: 1rem;
                border: 2px solid var(--border);
                background-color: var(--card);
                color: var(--foreground);
                border-radius: var(--radius);
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }
            .option-btn:hover {
                border-color: var(--primary);
                background-color: var(--muted);
            }
            .option-btn.selected {
                border-color: var(--primary);
                background-color: var(--primary);
                color: var(--primary-foreground);
            }
            .assessment-actions {
                display: flex;
                justify-content: space-between;
                gap: 1rem;
            }
        `;
    document.head.appendChild(style);

    return modal;
  }

  displayQuestion() {
    const modal = document.querySelector(".assessment-modal");
    const questionContainer = modal.querySelector(".question-container");
    const progressBar = modal.querySelector(".progress-bar-fill");

    const question = this.questions[this.currentQuestion];
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;

    progressBar.style.width = `${progress}%`;

    questionContainer.innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="options-grid">
                ${question.options
                  .map(
                    (option, index) => `
                    <button class="option-btn" data-value="${option}" onclick="learningAssessment.selectOption('${option}')">
                        ${option}
                    </button>
                `
                  )
                  .join("")}
            </div>
            <div class="assessment-actions">
                <button class="btn btn-secondary" onclick="learningAssessment.previousQuestion()" 
                        ${
                          this.currentQuestion === 0 ? "disabled" : ""
                        }>Previous</button>
                <button class="btn btn-primary" id="nextQuestionBtn" onclick="learningAssessment.nextQuestion()" disabled>
                    ${
                      this.currentQuestion === this.questions.length - 1
                        ? "Complete Assessment"
                        : "Next"
                    }
                </button>
            </div>
        `;
  }

  selectOption(value) {
    const question = this.questions[this.currentQuestion];
    this.responses[question.category] = value;

    // Update UI
    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    document.querySelector(`[data-value="${value}"]`).classList.add("selected");
    document.getElementById("nextQuestionBtn").disabled = false;
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.displayQuestion();
    } else {
      this.completeAssessment();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.displayQuestion();
    }
  }

  completeAssessment() {
    const recommendations = this.generateRecommendations();
    this.showResults(recommendations);
    this.updateDashboard(recommendations);
  }

  generateRecommendations() {
    const { programming, interest, commitment, style } = this.responses;
    const recommendations = [];

    // Algorithm to generate personalized recommendations
    if (programming === "Beginner") {
      if (interest === "Web Development") {
        recommendations.push({
          title: "HTML & CSS Fundamentals",
          description: "Start your web development journey",
          difficulty: "Beginner",
          icon: "🌐",
        });
      }
      recommendations.push({
        title: "Programming Logic",
        description: "Learn fundamental programming concepts",
        difficulty: "Beginner",
        icon: "🧠",
      });
    } else if (programming === "Intermediate") {
      if (interest === "Data Science") {
        recommendations.push({
          title: "Python for Data Analysis",
          description: "Master pandas and numpy libraries",
          difficulty: "Intermediate",
          icon: "📊",
        });
      }
    }

    // Add more recommendations based on other factors
    if (commitment === "10+ hours") {
      recommendations.push({
        title: "Advanced Project Workshop",
        description: "Build a comprehensive portfolio project",
        difficulty: "Advanced",
        icon: "🚀",
      });
    }

    return recommendations;
  }

  showResults(recommendations) {
    const modal = document.querySelector(".assessment-modal");
    const modalBody = modal.querySelector(".modal-body");

    modalBody.innerHTML = `
            <div class="results-container">
                <h3>🎉 Your Personalized Learning Path</h3>
                <p>Based on your responses, here are our recommendations:</p>
                <div class="recommendations-results">
                    ${recommendations
                      .map(
                        (rec) => `
                        <div class="result-item">
                            <div class="result-icon">${rec.icon}</div>
                            <div class="result-content">
                                <h4>${rec.title}</h4>
                                <p>${rec.description}</p>
                                <span class="result-difficulty">${rec.difficulty}</span>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="document.querySelector('.assessment-modal').remove(); document.getElementById('dashboard').scrollIntoView()">
                        View Dashboard
                    </button>
                </div>
            </div>
        `;

    // Add results styles
    const style = document.createElement("style");
    style.textContent = `
            .results-container h3 {
                text-align: center;
                margin-bottom: 1rem;
                color: var(--primary);
            }
            .recommendations-results {
                margin: 2rem 0;
            }
            .result-item {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                border: 1px solid var(--border);
                border-radius: var(--radius);
                margin-bottom: 1rem;
            }
            .result-icon {
                font-size: 2rem;
            }
            .result-content h4 {
                margin: 0 0 0.5rem 0;
                color: var(--foreground);
            }
            .result-difficulty {
                background-color: var(--accent);
                color: var(--accent-foreground);
                padding: 0.25rem 0.5rem;
                border-radius: calc(var(--radius) / 2);
                font-size: 0.75rem;
            }
            .results-actions {
                text-align: center;
                margin-top: 2rem;
            }
        `;
    document.head.appendChild(style);
  }

  updateDashboard(recommendations) {
    // Update the recommendations list in the dashboard
    const recommendationsList = document.getElementById("recommendationsList");
    if (recommendationsList && recommendations.length > 0) {
      recommendationsList.innerHTML = recommendations
        .map(
          (rec) => `
                <div class="recommendation-item fade-in">
                    <div class="rec-icon">${rec.icon}</div>
                    <div class="rec-content">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <div class="rec-difficulty">Difficulty: ${rec.difficulty}</div>
                    </div>
                </div>
            `
        )
        .join("");
    }
  }
}

// Course Filter System
class CourseFilter {
  constructor() {
    this.courses = Array.from(document.querySelectorAll(".course-card"));
    this.courseFilters = document.querySelectorAll(".filter-btn");
    this.init();
  }

  init() {
    this.courseFilters.forEach((filter) => {
      filter.addEventListener("click", (e) =>
        this.filterCourses(e.target.dataset.filter)
      );
    });
  }

  filterCourses(filter) {
    // Update active filter
    this.courseFilters.forEach((btn) => btn.classList.remove("active"));
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");

    // Filter courses with animation
    this.courses.forEach((course) => {
      const shouldShow =
        filter === "all" || course.dataset.difficulty === filter;

      if (shouldShow) {
        course.style.display = "block";
        course.classList.add("fade-in");
      } else {
        course.style.display = "none";
        course.classList.remove("fade-in");
      }
    });
  }
}

// Navigation System
class Navigation {
  constructor() {
    this.navLinks = document.querySelectorAll(".nav-link");
    this.init();
  }

  init() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => this.handleNavigation(e));
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", this.smoothScroll);
    });

    // Update active nav on scroll
    window.addEventListener("scroll", () => this.updateActiveNav());
  }

  handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");
      const correspondingNav = document.querySelector(
        `a[href="#${sectionId}"]`
      );

      if (
        correspondingNav &&
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ) {
        this.navLinks.forEach((link) => link.classList.remove("active"));
        correspondingNav.classList.add("active");
      }
    });
  }
}

// Progress Tracking System
class ProgressTracker {
  constructor() {
    this.progress = JSON.parse(localStorage.getItem("learningProgress")) || {
      mathematics: 85,
      programming: 70,
      datascience: 45,
      design: 60,
    };
    this.updateProgressDisplay();
  }

  updateProgress(subject, value) {
    this.progress[subject] = Math.min(100, Math.max(0, value));
    localStorage.setItem("learningProgress", JSON.stringify(this.progress));
    this.updateProgressDisplay();
  }

  updateProgressDisplay() {
    const progressBars = document.querySelectorAll(".progress-fill");
    const progressValues = document.querySelectorAll(".progress-value");

    const subjects = Object.keys(this.progress);

    progressBars.forEach((bar, index) => {
      if (subjects[index]) {
        const progress = this.progress[subjects[index]];
        bar.style.width = `${progress}%`;
        if (progressValues[index]) {
          progressValues[index].textContent = `${progress}%`;
        }
      }
    });
  }

  simulateProgress() {
    // Simulate learning progress over time
    setInterval(() => {
      Object.keys(this.progress).forEach((subject) => {
        if (Math.random() > 0.7) {
          // 30% chance to increase
          this.updateProgress(subject, this.progress[subject] + 1);
        }
      });
    }, 30000); // Every 30 seconds
  }
}

// Initialize all systems
document.addEventListener("DOMContentLoaded", () => {
  // Select DOM elements after DOM is ready
  startAssessmentBtn = document.getElementById("startAssessment");

  // Initialize theme manager
  const themeManager = new ThemeManager();

  // Initialize learning assessment
  const learningAssessment = new LearningAssessment();
  startAssessmentBtn?.addEventListener("click", () =>
    learningAssessment.start()
  );

  // Make learningAssessment globally available for inline event handlers
  window.learningAssessment = learningAssessment;

  // Initialize course filter
  const courseFilter = new CourseFilter();

  // Initialize navigation
  const navigation = new Navigation();

  // Initialize progress tracker
  const progressTracker = new ProgressTracker();
  progressTracker.simulateProgress();

  // Add loading animation to course cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  });

  document.querySelectorAll(".course-card, .dashboard-card").forEach((card) => {
    observer.observe(card);
  });

  console.log(
    "🎓 Personalized Learning Path Generator initialized successfully!"
  );
});

// Classes are available globally for debugging if needed
window.ThemeManager = ThemeManager;
window.LearningAssessment = LearningAssessment;
window.CourseFilter = CourseFilter;
window.Navigation = Navigation;
window.ProgressTracker = ProgressTracker;
