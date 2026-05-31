/**
 * Module Loader
 * Loads HTML sections dynamically into the main page
 */

// Configuration: Define all sections to load
const sections = [
    { id: 'navbar-container', path: 'sections/navbar.html' },
    { id: 'hero-container', path: 'sections/hero.html' },
    { id: 'about-container', path: 'sections/about.html' },
    { id: 'experience-container', path: 'sections/experience.html' },
    { id: 'skills-container', path: 'sections/skills.html' },
    { id: 'projects-container', path: 'sections/projects.html' },
    { id: 'testimonials-container', path: 'sections/testimonials.html' },
    { id: 'contact-container', path: 'sections/contact.html' },
    { id: 'footer-container', path: 'sections/footer.html' }
];

/**
 * Load a single HTML section
 * @param {string} containerId - The ID of the container element
 * @param {string} path - Path to the HTML file
 * @returns {Promise} - Promise that resolves when section is loaded
 */
async function loadSection(containerId, path) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container with ID "${containerId}" not found`);
            return;
        }

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        container.innerHTML = html;
        
        console.log(`✅ Loaded: ${path}`);
    } catch (error) {
        console.error(`❌ Error loading ${path}:`, error);
        // Optionally show error message to user
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div style="padding: 20px; color: red;">Error loading section: ${path}</div>`;
        }
    }
}

/**
 * Load all sections sequentially
 */
async function loadAllSections() {
    console.log('🚀 Starting to load all sections...');
    
    // Show loading indicator (optional)
    document.body.classList.add('loading');
    
    try {
        // Load all sections in parallel for better performance
        await Promise.all(
            sections.map(section => loadSection(section.id, section.path))
        );
        
        console.log('✅ All sections loaded successfully!');
        
        // Dispatch custom event when all sections are loaded
        const event = new CustomEvent('sectionsLoaded');
        document.dispatchEvent(event);
        
        // Explicitly initialize project cards after loading
        if (typeof initProjectCards === 'function') {
            initProjectCards();
        }
        
    } catch (error) {
        console.error('❌ Error loading sections:', error);
    } finally {
        // Remove loading indicator
        document.body.classList.remove('loading');
    }
}

/**
 * Initialize module loader when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllSections);
} else {
    // DOM already loaded
    loadAllSections();
}

/**
 * Reload a specific section
 * This function can be called from anywhere in your code
 * @param {string} sectionName - Name of the section (e.g., 'hero', 'about')
 */
window.reloadSection = async function(sectionName) {
    const section = sections.find(s => s.id.includes(sectionName));
    if (section) {
        console.log(`🔄 Reloading ${sectionName}...`);
        await loadSection(section.id, section.path);
    } else {
        console.warn(`Section "${sectionName}" not found`);
    }
};

/**
 * Get section configuration
 */
window.getSections = function() {
    return sections;
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadSection, loadAllSections, sections };
}
