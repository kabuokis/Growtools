
async function updateVisitorCount() {
    try {
        const now = new Date();
        const monthYear = `${now.getMonth()}-${now.getFullYear()}`;
        let monthlyCount = localStorage.getItem(`visits-${monthYear}`);
        if (!monthlyCount) {
            monthlyCount = 0;
        } else {
            monthlyCount = parseInt(monthlyCount);
        }
        monthlyCount++;
        localStorage.setItem(`visits-${monthYear}`, monthlyCount);
        document.getElementById('visitorCount').textContent = monthlyCount.toLocaleString();
        await fetch('https://api.countapi.xyz/hit/growtools/visits');
    } catch (error) {
        console.error('Error handling visitor count:', error);
        const monthlyCount = localStorage.getItem(`visits-${monthYear}`) || "1,000+";
        document.getElementById('visitorCount').textContent = monthlyCount;
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-custom');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href')?.split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function ensureItemBrowserLink() {
    const navList = document.querySelector('.nav-links-flowbite');
    if (!navList) return;
    if (navList.querySelector('a[href*="item-browser.html"]')) {
        // update icon to cube
        const existing = navList.querySelector('a[href*="item-browser.html"] i');
        if (existing) existing.className = 'fas fa-cube icon-item-browser';
        return;
    }
    const li = document.createElement('li');
    const isRootLevel = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || !window.location.pathname.includes('/pages/');
    const href = isRootLevel ? 'pages/item-browser.html' : 'item-browser.html';
    li.innerHTML = `
        <a href="${href}" class="nav-link-custom block">
            <i class="fas fa-cube icon-item-browser"></i> Item Browser
        </a>
    `;
    // try to insert before data mining link if present
    const dmLink = navList.querySelector('a[href*="data-mining.html"]');
    if (dmLink) {
        const dmLi = dmLink.closest('li');
        navList.insertBefore(li, dmLi);
    } else {
        const moreToolsLi = Array.from(navList.children).find(li => li.querySelector('#dropdownNavbarLink'));
        if (moreToolsLi) {
            navList.insertBefore(li, moreToolsLi);
        } else {
            navList.appendChild(li);
        }
    }
}

function reorderNav() {
    const navList = document.querySelector('.nav-links-flowbite');
    if (!navList) return;
    const dmLink = navList.querySelector('a[href*="data-mining.html"]');
    const ibLink = navList.querySelector('a[href*="item-browser.html"]');
    if (dmLink && ibLink) {
        const dmLi = dmLink.closest('li');
        const ibLi = ibLink.closest('li');
        if (dmLi && ibLi && ibLi !== dmLi) {
            navList.insertBefore(ibLi, dmLi);
        }
    }
}

function ensureItemFooterLink() {
    const toolsSection = document.querySelector('footer .footer-section:nth-child(2)');
    if (!toolsSection) return;
    if (toolsSection.querySelector('a[href*="item-browser.html"]')) return;
    const a = document.createElement('a');
    const isRootLevel = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || !window.location.pathname.includes('/pages/');
    a.href = isRootLevel ? 'pages/item-browser.html' : 'item-browser.html';
    a.innerHTML = '<i class="fas fa-cube"></i> Item Browser';
    toolsSection.appendChild(a);
}

document.addEventListener('DOMContentLoaded', function() {
    updateVisitorCount();
    ensureItemBrowserLink();
    ensureItemFooterLink();
    reorderNav();
    setActiveNavLink();
    // Add any other initialization code here
});
