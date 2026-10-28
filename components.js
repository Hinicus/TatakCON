// Automatically switch between local development and live production
window.API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://constay.onrender.com";

//Global Helper: Automatically compress and resize Cloudinary images
window.optimizeImageUrl = function (url, width = 900) {
  if (!url || typeof url !== "string") return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};

// Automatically inject the TatakCON Favicons into any page's <head> if not already present
if (!document.querySelector('link[rel="icon"]')) {
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
    <link rel="manifest" href="/favicon/site.webmanifest" />
  `,
  );
}

// get year
const currentYear = new Date().getFullYear();

// Check sessionStorage for active Admin/Author session
const currentUserId = sessionStorage.getItem("currentUserId");
const userRole = sessionStorage.getItem("userRole");
const userName = sessionStorage.getItem("userName");
const isLoggedIn = Boolean(currentUserId && userRole);

// Detect if the user is currently viewing a single public article (article.html?id=...)
const urlParams = new URLSearchParams(window.location.search);
const currentArticleId = urlParams.get("id");
const isArticlePage =
  window.location.pathname.includes("/pages/article/article.html") &&
  currentArticleId;

// 1. CMS Quick-Access Top Ribbon (Only visible when logged in as Admin or Author)
const adminRibbonHTML = isLoggedIn
  ? `
  <div class="bg-[#001331] text-surface border-b border-white/10 text-xs">
    <div class="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-2 flex flex-wrap items-center justify-between gap-2">
      <!-- Left: Active User & Role Indicator -->
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          userRole === "admin"
            ? "bg-tertiary-fixed text-on-tertiary-fixed"
            : "bg-secondary-fixed text-on-secondary-fixed"
        }">
          <span class="material-symbols-outlined text-[13px]">verified_user</span>
          ${userRole}
        </span>
        <span class="text-slate-300 hidden sm:inline">
          Signed in as <strong class="text-white">${userName || "Contributor"}</strong>
        </span>
      </div>

      <!-- Right: Quick Action Links -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
        ${
          isArticlePage
            ? `<a id="ribbon-edit-btn" href="/pages/admin/edit.html?id=${currentArticleId}" 
                  class="hidden items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-tertiary-fixed-dim font-bold transition-colors">
                 <span class="material-symbols-outlined text-[15px]">edit_document</span>
                 <span>Edit This Article</span>
               </a>`
            : ""
        }
        <a href="/pages/admin/manage.html" 
           class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
          <span class="material-symbols-outlined text-[15px]">dashboard</span>
          <span>Manage Articles</span>
        </a>
        <a href="/pages/admin/create.html" 
           class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-secondary hover:bg-[#3472a5] text-white font-bold transition-colors shadow-sm">
          <span class="material-symbols-outlined text-[15px]">post_add</span>
          <span>New Article</span>
        </a>
      </div>
    </div>
  </div>
`
  : "";

// 2. Main Header Component
const headerHTML = `
  ${adminRibbonHTML}
  <header
      class="bg-primary-container text-surface shadow-[0_4px_20px_rgba(0,19,49,0.25)]">
      <div
        class="h-20 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-space-md">
        <a href="/" class="flex items-center gap-space-sm flex-shrink-0">
          <img
            alt="TatakCON Logo"
            class="h-20 rounded w-auto object-contain"
            src="/images/logo/tatakcon_icon_transparent.png" />
        </a>
        <nav
          class="hidden lg:flex items-center gap-space-lg h-full"
          data-active-classes="text-tertiary-fixed-dim border-b-2 border-tertiary-fixed-dim font-bold">
          <a
            class="text-surface-variant hover:text-surface transition-colors flex items-center h-full px-space-xs font-label-md text-label-md"
            data-path="home-dashboard"
            href="/"
            >Home</a
          ><a
            class="text-surface-variant hover:text-surface transition-colors flex items-center h-full px-space-xs font-label-md text-label-md"
            data-path="our-story"
            href="/pages/our-story/our-story.html"
            >Our Story</a
          ><a
            class="text-surface-variant hover:text-surface transition-colors flex items-center h-full px-space-xs font-label-md text-label-md"
            data-path="con-community"
            href="/pages/con-community/con-community.html"
            >CON Community</a
          ><a
            class="text-surface-variant hover:text-surface transition-colors flex items-center h-full px-space-xs font-label-md text-label-md"
            data-path="traditions-culture"
            href="/pages/traditions-culture/traditions-culture.html"
            >Traditions &amp; Culture</a
          ><a
            class="text-surface-variant hover:text-surface transition-colors flex items-center h-full px-space-xs font-label-md text-label-md"
            data-path="about"
            href="/pages/about/about.html"
            >About</a
          >
          <!-- Portal Button (Adapts based on login state) -->
          <a
            href="${isLoggedIn ? "/pages/admin/manage.html" : "/pages/admin/login.html"}"
            class="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/15 bg-white/5 hover:bg-secondary hover:border-secondary text-surface transition-all">
            <span class="material-symbols-outlined text-[16px]">${
              isLoggedIn ? "space_dashboard" : "login"
            }</span>
            <span>${isLoggedIn ? "Portal" : "Staff Login"}</span>
          </a>
        </nav>
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
          class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-secondary text-surface transition-colors focus:outline-none"
          type="button">
          <span
            id="mobile-menu-icon"
            class="material-symbols-outlined text-[24px]"
            >menu</span
          >
        </button>
      </div>
      <div
        id="mobile-nav-menu"
        class="hidden lg:hidden border-t border-on-primary-fixed-variant/30 bg-primary-container px-margin-mobile md:px-margin-tablet py-space-lg shadow-xl">
        <nav class="flex flex-col gap-space-xs">
          <a
            class="text-surface-variant hover:text-surface hover:bg-primary transition-all py-space-sm px-space-md rounded-DEFAULT font-label-md text-label-md flex items-center justify-between"
            data-path="home-dashboard"
            href="/"
            ><span class="">Home</span
            ><span
              class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim"
              >chevron_right</span
            ></a
          ><a
            class="text-surface-variant hover:text-surface hover:bg-primary transition-all py-space-sm px-space-md rounded-DEFAULT font-label-md text-label-md flex items-center justify-between"
            data-path="our-story"
            href="/pages/our-story/our-story.html"
            ><span class="">Our Story</span
            ><span
              class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim"
              >chevron_right</span
            ></a
          ><a
            class="text-surface-variant hover:text-surface hover:bg-primary transition-all py-space-sm px-space-md rounded-DEFAULT font-label-md text-label-md flex items-center justify-between"
            data-path="con-community"
            href="/pages/con-community/con-community.html"
            ><span class="">CON Community</span
            ><span
              class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim"
              >chevron_right</span
            ></a
          ><a
            class="text-surface-variant hover:text-surface hover:bg-primary transition-all py-space-sm px-space-md rounded-DEFAULT font-label-md text-label-md flex items-center justify-between"
            data-path="traditions-culture"
            href="/pages/traditions-culture/traditions-culture.html"
            ><span class="">Traditions &amp; Culture</span
            ><span
              class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim"
              >chevron_right</span
            ></a
          ><a
            class="text-surface-variant hover:text-surface hover:bg-primary transition-all py-space-sm px-space-md rounded-DEFAULT font-label-md text-label-md flex items-center justify-between"
            data-path="about"
            href="/pages/about/about.html"
            ><span class="">About</span
            ><span
              class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim"
              >chevron_right</span
            ></a
          >
          <!-- Mobile Portal / Login Link -->
          <div class="pt-2 mt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              class="text-white bg-secondary hover:bg-[#3472a5] transition-all py-space-sm px-space-md rounded-DEFAULT font-label-md text-label-md flex items-center justify-between"
              href="${isLoggedIn ? "/pages/admin/manage.html" : "/pages/admin/login.html"}">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">${
                  isLoggedIn ? "space_dashboard" : "login"
                }</span>
                ${isLoggedIn ? "Manage Articles" : "Contributor Login"}
              </span>
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
`;

// 3. Footer Component
const footerHTML = `
  <footer class="bg-[#12284b] text-white pt-14 pb-8 border-t border-white/10 mt-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Brand header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 mb-8 border-b border-white/10">
      <div>
        <span class="block text-xs font-bold uppercase tracking-wider text-clear-skies mb-1">Bulacan State University • College of Nursing</span>
        <h3 class="font-headline-md text-headline-md text-surface tracking-tight font-serif">"TO SAVE AND TO SERVICE"</h3>
      </div>
      <div class="flex items-center gap-4 self-start md:self-auto bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
        <img alt="Bulacan State University Logo" class="w-14 h-14 object-contain rounded-full bg-white/10 p-1" src="/images/logo/bulsu_logo.png">
        <div class="w-px h-10 bg-white/10"></div>
        <img alt="College of Nursing Logo" class="w-14 h-14 object-contain rounded-full bg-white/10 p-1" src="/images/con-org-logo/college-of-nursing.jpg">
      </div>
    </div>

    <!-- Affiliated organizations -->
    <div class="pb-8 mb-8 border-b border-white/10">
      <div class="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-clear-skies">
        <span class="material-symbols-outlined text-[18px]">groups</span>
        <span>Affiliated Organizations &amp; Student Guilds</span>
      </div>
      <div class="flex flex-wrap items-start justify-center gap-3 sm:gap-4">
        <a href="/pages/con-community/organizations/knightingale-society.html" title="Knightingale Society" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="Knightingale Society" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/knightingale-society.png">
          </div>
        </a>
        <a href="/pages/con-community/organizations/cortex.html" title="CORTEX" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="Cortex - The CON Academic Society" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/cortex-the-con-academic-society.jpg">
          </div>
        </a>
        <a href="/pages/con-community/organizations/the-nurses-notes.html" title="The Nurses' Notes" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="The Nurses' Notes" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/the-nurses-notes.jpg">
          </div>
        </a>
        <a href="/pages/con-community/organizations/red-cross-youth-council.html" title="Red Cross Youth Council" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="Red Cross Youth Council" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/red-cross-youth-council.jpg">
          </div>
        </a>
        <a href="/pages/con-community/organizations/pacemaker-all-stars.html" title="Pacemaker All-Stars" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="Pacemaker All-Stars" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/pacemaker-all-stars.jpg">
          </div>
        </a>
        <a href="/pages/con-community/organizations/lungs.html" title="LUNGS" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="LUNGS" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/lungs-lydians-united-nursing-giocoso-singers.png">
          </div>
        </a>
        <a href="/pages/con-community/organizations/unang-hakbang.html" title="Unang Hakbang" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="Unang Hakbang" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/unang-hakbang.jpg">
          </div>
        </a>
        <a href="/pages/con-community/organizations/local-student-council.html" title="Local Student Council" class="flex flex-col items-center text-center group cursor-pointer">
          <div class="w-14 h-14 rounded-full bg-white/10 p-1 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-clear-skies group-hover:bg-white/20 shadow-sm">
            <img alt="Local Student Council" class="w-full h-full object-contain rounded-full" src="/images/con-org-logo/local-student-council.jpg">
          </div>
        </a>
      </div>
    </div>


<!-- Quick links (inside footerHTML in components.js) -->
    <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 mb-8">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a class="hover:text-white transition-colors" href="/">Home</a>
        <a class="hover:text-white transition-colors" href="/pages/our-story/our-story.html">Our Story</a>
        <a class="hover:text-white transition-colors" href="/pages/con-community/con-community.html">CON Community</a>
        <a class="hover:text-white transition-colors" href="/pages/traditions-culture/traditions-culture.html">Traditions &amp; Culture</a>
        <a class="hover:text-white transition-colors" href="/pages/about/about.html">About</a>
        <a class="hover:text-clear-skies transition-colors inline-flex items-center gap-1" href="https://www.facebook.com/bulsu.con" target="_blank" rel="noopener noreferrer">
          <span>BulSU CON Facebook</span>
          <span class="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
        <a class="hover:text-clear-skies transition-colors inline-flex items-center gap-1" href="https://bulsu.edu.ph" target="_blank" rel="noopener noreferrer">
          <span>bulsu.edu.ph</span>
          <span class="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <p>© ${currentYear} #TatakCON Research Project &amp; BulSU College of Nursing. All rights reserved. <span class="text-clear-skies"> TatakCON </span></p>
      <div class="flex items-center space-x-4">
        <a class="hover:text-white transition-colors flex items-center gap-1" href="${
          isLoggedIn ? "/pages/admin/manage.html" : "/pages/admin/login.html"
        }" title="Editorial Portal">
          <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
          <span>${isLoggedIn ? "Editorial Dashboard" : "Contributor Portal"}</span>
        </a>
      </div>
    </div>

  </div>
</footer>
`;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inject Header
  const headerContainer = document.getElementById("header-placeholder");
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;

    // Initialize mobile menu AFTER header exists in DOM
    const menuBtn = document.getElementById("mobile-menu-toggle");
    const menuDrawer = document.getElementById("mobile-nav-menu");
    const menuIcon = document.getElementById("mobile-menu-icon");

    if (menuBtn && menuDrawer && menuIcon) {
      menuBtn.addEventListener("click", function () {
        const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
        menuBtn.setAttribute("aria-expanded", !isExpanded);

        if (isExpanded) {
          menuDrawer.classList.add("hidden");
          menuIcon.textContent = "menu";
        } else {
          menuDrawer.classList.remove("hidden");
          menuIcon.textContent = "close";
        }
      });
    }

    // Highlight the active navigation link for Desktop & Mobile
    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage =
      currentPath === "/" || currentPath.endsWith("/index.html");

    // Desktop Nav Highlighting
    const desktopNav = headerContainer.querySelector(
      "header nav.hidden.lg\\:flex",
    );
    if (desktopNav) {
      const activeClasses = (
        desktopNav.getAttribute("data-active-classes") || ""
      )
        .split(" ")
        .filter(Boolean);

      desktopNav.querySelectorAll("a[data-path]").forEach((link) => {
        const linkPath = link.getAttribute("data-path");
        const linkHref = link.getAttribute("href");

        const isMatch =
          (isHomePage && linkPath === "home-dashboard") ||
          (!isHomePage &&
            ((linkHref &&
              linkHref !== "#" &&
              linkHref !== "/" &&
              currentPath.includes(linkHref.toLowerCase())) ||
              currentPath.includes(linkPath)));

        if (isMatch) {
          link.classList.remove("text-surface-variant");
          link.classList.add(...activeClasses);
        }
      });
    }

    // Mobile Nav Highlighting
    if (menuDrawer) {
      menuDrawer.querySelectorAll("a[data-path]").forEach((link) => {
        const linkPath = link.getAttribute("data-path");
        const linkHref = link.getAttribute("href");

        const isMatch =
          (isHomePage && linkPath === "home-dashboard") ||
          (!isHomePage &&
            ((linkHref &&
              linkHref !== "#" &&
              linkHref !== "/" &&
              currentPath.includes(linkHref.toLowerCase())) ||
              currentPath.includes(linkPath)));

        if (isMatch) {
          link.classList.remove("text-surface-variant");
          link.classList.add(
            "bg-primary",
            "text-tertiary-fixed-dim",
            "font-bold",
          );
        }
      });
    }
  }

  // 2. Inject Footer
  const footerContainer = document.getElementById("footer-placeholder");
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }

  // SITE BUILDING REMINDER
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      alert(
        "This section is currently under construction for the next phase. Stay tuned!",
      );
    });
  });
});

// Automatically inject Official Facebook Page buttons on Organization Subpages
document.addEventListener("DOMContentLoaded", () => {
  const orgFacebookLinks = {
    "local-student-council.html": "https://www.facebook.com/BulSUCONLSC",
    "knightingale-society.html": "https://www.facebook.com/ks.bulsucon",
    "cortex.html": "https://www.facebook.com/profile.php?id=61591587331259",
    "the-nurses-notes.html":
      "https://www.facebook.com/TheNursesNotesPublication",
    "red-cross-youth-council.html":
      "https://www.facebook.com/profile.php?id=61559999584745",
    "pacemaker-all-stars.html": "https://www.facebook.com/PMASCON",
    "lungs.html": "https://www.facebook.com/bulsuconlungs",
    "unang-hakbang.html":
      "https://www.facebook.com/profile.php?id=61552913007532",
  };

  const currentFile = window.location.pathname.split("/").pop();
  const fbUrl = orgFacebookLinks[currentFile];

  if (fbUrl) {
    // 1. Add Facebook button to the top Hero Banner breadcrumb row
    const backLink = document.querySelector(
      'main section a[href*="con-community.html"]',
    );
    if (backLink && backLink.parentElement) {
      backLink.parentElement.classList.remove("justify-start");
      backLink.parentElement.classList.add(
        "justify-between",
        "flex-wrap",
        "gap-3",
      );
      backLink.insertAdjacentHTML(
        "afterend",
        `
        <a
          href="${fbUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold tracking-wide transition-all shadow-md ring-1 ring-white/20 group">
          <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Official Facebook Page</span>
          <span class="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">open_in_new</span>
        </a>
      `,
      );
    }

    // 2. Add Facebook button inside the bottom Quick Action Card
    const bottomBackBtn = document.querySelector(
      'main section div.bg-primary-container a[href*="con-community.html"]',
    );
    if (bottomBackBtn) {
      bottomBackBtn.insertAdjacentHTML(
        "beforebegin",
        `
        <a
          href="${fbUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-between px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all ring-1 ring-white/15 group">
          <span class="inline-flex items-center gap-2">
            <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Visit Facebook Page</span>
          </span>
          <span class="material-symbols-outlined text-[15px]">open_in_new</span>
        </a>
      `,
      );
    }
  }
});

// 5. Global Floating "Back to Top" Button
function initBackToTop() {
  const backToTopBtn = document.createElement("button");
  backToTopBtn.type = "button";
  backToTopBtn.setAttribute("aria-label", "Back to top");

  backToTopBtn.className =
    "fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary-container hover:bg-secondary text-white shadow-lg border border-white/15 flex items-center justify-center opacity-0 translate-y-4 pointer-events-none transition-all duration-300";
  backToTopBtn.innerHTML =
    '<span class="material-symbols-outlined text-[20px]">arrow_upward</span>';

  document.body.appendChild(backToTopBtn);

  // Track state to prevent DOM manipulation spam on every scroll pixel
  let isVisible = false;

  window.addEventListener(
    "scroll",
    () => {
      const shouldShow = window.scrollY > 450;

      // Only toggle classes if the visibility state actually needs to change
      if (shouldShow !== isVisible) {
        isVisible = shouldShow;
        backToTopBtn.classList.toggle("opacity-100", isVisible);
        backToTopBtn.classList.toggle("translate-y-0", isVisible);
        backToTopBtn.classList.toggle("opacity-0", !isVisible);
        backToTopBtn.classList.toggle("translate-y-4", !isVisible);
        backToTopBtn.classList.toggle("pointer-events-none", !isVisible);
      }
    },
    { passive: true },
  );

  backToTopBtn.addEventListener("click", () => {
    // The CSS scroll-smooth class on your <html> tags handles the animation automatically
    window.scrollTo(0, 0);
  });
}

// Safely execute whether the DOM is still loading or has already finished
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBackToTop);
} else {
  initBackToTop();
}

// 6. Global Image Lightbox (Click-to-Zoom)
function initImageLightbox() {
  const overlay = document.createElement("div");
  overlay.id = "global-lightbox";
  overlay.style.cssText =
    "position: fixed; inset: 0; z-index: 10000; background-color: rgba(0, 19, 49, 0.92); backdrop-filter: blur(6px); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; opacity: 0; pointer-events: none; transition: opacity 0.25s ease;";

  overlay.innerHTML = `
    <button
      type="button"
      aria-label="Close image preview"
      id="lightbox-close"
      style="position: absolute; top: 1.25rem; right: 1.25rem; width: 2.75rem; height: 2.75rem;"
      class="rounded-full bg-white/10 hover:bg-secondary text-white border border-white/20 flex items-center justify-center transition-colors shadow-lg">
      <span class="material-symbols-outlined text-[22px]">close</span>
    </button>
    <img
      id="lightbox-img"
      src=""
      alt=""
      style="max-width: 92vw; max-height: 82vh; transform: scale(0.95); transition: transform 0.25s ease;"
      class="w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/15 bg-primary" />
    <p
      id="lightbox-caption"
      class="mt-3 text-xs sm:text-sm text-surface-variant font-medium text-center max-w-2xl px-4 empty:hidden"></p>
  `;

  document.body.appendChild(overlay);

  const lightboxImg = overlay.querySelector("#lightbox-img");
  const lightboxCaption = overlay.querySelector("#lightbox-caption");

  function openLightbox(src, altText) {
    if (!src || src.endsWith("/...")) return;

    const highResSrc = window.optimizeImageUrl
      ? window.optimizeImageUrl(src, 1600)
      : src;

    lightboxImg.src = highResSrc;
    lightboxImg.alt = altText || "Expanded view";
    lightboxCaption.textContent = altText || "";

    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    lightboxImg.style.transform = "scale(1)";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    lightboxImg.style.transform = "scale(0.95)";
    document.body.style.overflow = "";
  }

  // Handle clicks on images (including images covered by gradient overlays)
  document.addEventListener("click", (e) => {
    // Ignore clicks on links or buttons
    if (e.target.closest("a, button")) return;

    let img = e.target.closest("main img");

    // If user clicked a decorative gradient overlay div covering an image, grab the sibling img
    if (!img) {
      const figureOrCard = e.target.closest("main figure, main .relative");
      if (figureOrCard) {
        const candidate = figureOrCard.querySelector("img");
        if (candidate && figureOrCard.querySelectorAll("img").length === 1) {
          img = candidate;
        }
      }
    }

    // Allow hero badges (72px+) while ignoring tiny UI icons
    if (!img || img.clientWidth < 48) return;

    openLightbox(img.src, img.alt);
  });

  // Show zoom-in cursor on all non-link images inside <main>
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    main img:not(a img):not(button img) {
      cursor: zoom-in;
    }
  `;
  document.head.appendChild(styleTag);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("#lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.pointerEvents === "auto") {
      closeLightbox();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initImageLightbox);
} else {
  initImageLightbox();
}
