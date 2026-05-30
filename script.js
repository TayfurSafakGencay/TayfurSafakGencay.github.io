/**
 * Initialize all event listeners and functionality
 */
function initializeApp() {
    if (window.__portfolioInitialized) return;
    window.__portfolioInitialized = true;

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize other components
    initNavbar();
    initMobileMenu();
    initSkillBars();
    initScrollAnimations();
    initContactForm();
    initParallax();
    initFloatingIcons();
    initStatsCounter();
    initProjectCards();
    initSectionReveal();
    init3DCarousel();
    initKonamiCode();

    console.log('✅ App initialized successfully!');
}

// Use a more reliable way to wait for all content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // The module loader dispatches 'sectionsLoaded'
    document.addEventListener('sectionsLoaded', initializeApp);
});


// Navbar scroll effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let current = '';
    const navHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Animate skill bars on scroll
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                if (progress) {
                    entry.target.style.width = `${progress}%`;
                }
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.45});

    bars.forEach(bar => observer.observe(bar));
}

// Scroll animations for sections
function initScrollAnimations() {
    const targets = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
    if (targets.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    targets.forEach(target => {
        target.classList.add('scroll-animate');
        observer.observe(target);
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Tesekkurler! Mesajin alindi. En kisa surede donus yapacagim.');
        contactForm.reset();
    });
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - scrolled / 700;
        }
    });
}

// Floating icons animation enhancement
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');

    floatingIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.3) rotate(360deg)';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Add cursor trail effect (single curved ribbon)
function initCursorTrail() {
    document.querySelectorAll('.cursor-circle').forEach(node => node.remove());

    const existingCanvas = document.getElementById('cursor-trail-canvas');
    if (existingCanvas) existingCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail-canvas';
    canvas.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = 1;
    let w = 0;
    let h = 0;

    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const pointCount = 18;
    const points = Array.from({length: pointCount}, () => ({x: w / 2, y: h / 2}));
    const target = {x: w / 2, y: h / 2};
    let initialized = false;

    function updateTargetFromPointer(e) {
        target.x = e.clientX;
        target.y = e.clientY;

        if (!initialized) {
            points.forEach(p => {
                p.x = target.x;
                p.y = target.y;
            });
            initialized = true;
        }
    }

    window.addEventListener('pointermove', updateTargetFromPointer, {passive: true});
    window.addEventListener('mousemove', updateTargetFromPointer, {passive: true});

    function animateTrail() {
        ctx.clearRect(0, 0, w, h);

        if (!initialized) {
            requestAnimationFrame(animateTrail);
            return;
        }

        points[0].x = target.x;
        points[0].y = target.y;

        for (let i = 1; i < points.length; i++) {
            const follow = i === 1 ? 0.9 : i === 2 ? 0.72 : Math.max(0.46 - i * 0.015, 0.16);
            points[i].x += (points[i - 1].x - points[i].x) * follow;
            points[i].y += (points[i - 1].y - points[i].y) * follow;
        }

        for (let i = 0; i < points.length - 2; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const p2 = points[i + 2];
            const t = i / (points.length - 1);

            const alpha = 0.48 * (1 - t);
            const lineWidth = 11 * (1 - t) + 1;

            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            const cx = (p1.x + p2.x) / 2;
            const cy = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, cx, cy);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = 'rgba(236, 72, 153, 0.55)';
        ctx.arc(target.x, target.y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// Add typing effect to hero title (optional)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Animate stats numbers
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-item h4');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text);

                if (!isNaN(number)) {
                    let current = 0;
                    const increment = number / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            target.textContent = text;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + text.replace(/\d+/g, '');
                        }
                    }, 30);
                }

                statsObserver.unobserve(target);
            }
        });
    }, {threshold: 0.5});

    stats.forEach(stat => statsObserver.observe(stat));
}

// Add project card click handlers
function initProjectCards() {
    const projectGrid = document.querySelector('.projects-grid');
    const modal = document.getElementById('projectDetailModal');
    const closeBtn = document.getElementById('projectDetailClose');
    const accordionContainer = document.getElementById('modalAccordion');
    const accordionWrapper = accordionContainer ? accordionContainer.parentElement : null;
    if (!accordionContainer) {
        console.warn('modalAccordion bulunamadı! DOM henüz hazır olmayabilir.');
    } else {
        console.log('modalAccordion bulundu:', accordionContainer);
    }

    if (!projectGrid || !modal || !closeBtn) {
        console.warn('Project cards, modal, or close button not found. Aborting initProjectCards.');
        return;
    }

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    const projectDetailsData = {
        'money-simulator': {
            title: 'Money Simulator',
            subtitle: 'An immersive simulation and management game with 40,000+ Wishlists',
            overview: 'Money Simulator is an immersive simulation game where players navigate financial challenges. Starting from the struggles of Brokeville, players must make strategic decisions to build a successful financial empire. The project emphasizes deep economic systems, engaging core mechanics, and a polished user experience.',
            videoEmbed: '',
            accordion: [
                {
                    icon: '📋',
                    title: 'Summary',
                    content: `<ul>
                <li><b>Shop Systems:</b> Scalable market and coffee shop architectures with event-driven lifecycle management, employee AI state machines, cleanliness systems, decor scoring, storage handling, financial simulation, dynamic customer behavior, background simulation, and progression systems.</li>

                <li><b>Market Simulation:</b> Automated cashier, stocker, and cleaner workflows powered by state machines, customer satisfaction systems, shelf management, and fully simulated employee behaviors.</li>

                <li><b>Coffee Shop Systems:</b> Advanced barista AI, coffee brewing and recipe validation, dessert serving mechanics, dine-in and takeaway customer flows, dual-queue POS systems, tray assembly validation, IK slot interactions, and full customer AI state machines.</li>

                <li><b>Economy & Finance:</b> Banking systems, credit score simulation, recurring loans and bills, AutoPay protection, dynamic due-date events, crypto mining simulation, GPU temperature and power management, and asset confiscation mechanics.</li>

                <li><b>Estate & Property Management:</b> Property ownership systems with finance controllers, house simulation, saveable customization data, and scalable ScriptableObject-driven estate infrastructure.</li>

                <li><b>Product & Logistics:</b> Full supply-chain ecosystem including product databases, delivery trucks, supplier ordering systems, barcode scanning, Addressable asset loading, warehouse handling, and physical delivery workflows.</li>

                <li><b>Missions & Jobs:</b> Complete quest framework with TaskManagers, dynamic objective indicators, cutscene triggers, active job restrictions, shift-based supermarket jobs, delivery missions, and NPC-driven work systems.</li>

                <li><b>NPC & Dialogue Systems:</b> Interactive NPCs powered by FinalIK, NavMesh locomotion, dynamic look-at systems, dialogue bubbles, companion NPC behaviors, and ambient wandering NPC simulation.</li>

                <li><b>UI & Infrastructure:</b> Centralized PanelManager architecture, gameplay restriction handling, computer and phone application systems, in-game mail services, and modular UI workflows.</li>

                <li><b>Audio & Ambiance:</b> Addressable-based audio management, dynamic ambiance transitions, day/night sound systems, NPC reaction audio, environmental sound triggers, and automated memory cleanup systems.</li>

                <li><b>Vehicle & Simulation Systems:</b> Detailed vehicle damage simulation, value depreciation, mileage tracking, repair history systems, dirt and wash mechanics, and persistent physical vehicle states.</li>

                <li><b>Additional Gameplay Systems:</b> Ad agency popularity systems, fainting and energy-drink mechanics, recurring contract systems, lockdown events, technology shops, mining PC infrastructure, and advanced simulation gameplay loops.</li>
            </ul>`
                },
                {
                    icon: '📦',
                    title: 'Addressable',
                    content: `<ul>
                                <li><b>AddressablePackageLoaderManager:</b> Asynchronously loads/unloads asset packages (e.g., shop, bank, mechanic) in bulk.</li>
                                <li><b>AddressableZoneLoader & AddressableZoneReferenceHolder:</b> Dynamically loads meshes, sounds, etc. for a zone when the player enters, and releases them when the player leaves.</li>
                                <li><b>AdressableLoaderManager:</b> Loads, caches, and manages individual assets (sprites, prefabs, audio, materials) by enum key.</li>
                                <li><b>NPCAddressableLoadManager:</b> Loads and instantiates NPC prefabs by addressable key, manages their lifecycle.</li>
                                <li><b>Product System (ProductAssetManager, ProductDistanceChecker, ProductLoader, IProductCollector, IProductLoader):</b> Loads market products near the player and automatically releases them when far.</li>
                            </ul>`
                },
                {
                    icon: '🏦',
                    title: 'Advanced Banking & Finance System',
                    content: `<ul>
                                <li>Central banking logic is managed via a <strong>ScriptableObject</strong>, ensuring persistent and centralized player financial data.</li>
                                <li>Supports multiple loan types (Credit, Bill, Rent, Salary) with <strong>type-specific payment</strong>, due date, and notification logic.</li>
                                <li>All player loans and financial operations are handled through a robust <strong>PlayerBankDTO</strong> structure.</li>
                                <li><strong>Daily event hooks</strong> process loan interests, auto-pay, due dates, and salary notifications automatically.</li>
                                <li>Implements <strong>asset confiscation</strong>: motorcycles, cars, and houses are liquidated in order if debts are unpaid.</li>
                                <li><strong>Credit score system</strong> dynamically updates based on payment behavior and owned assets, affecting loan eligibility.</li>
                                <li>All money operations (increase/decrease) include <strong>overflow/underflow protection</strong>, event callbacks, and UI/sound feedback.</li>
                                <li><strong>AutoPay feature</strong> enables automatic loan payments if enabled by the player.</li>
                                <li>Integrates with external managers (EnviroManager, PlayerManager, GameManager) for time, player, and transaction history.</li>
                                <li><strong>Serialization and event-driven design</strong> ensure data safety, UI synchronization, and extensibility for future features.</li>
                            </ul>`
                },
                {
                    icon: '💻',
                    title: 'Computer Systems',
                    content: `<ul>
                                <li>The computer system is modular, using <strong>ScriptableObjects (ComputerAppDataConfig)</strong> to define and manage available applications dynamically.</li>
                                <li>Computer UI (PCCanvas) is loaded asynchronously via <strong>Addressables</strong>, supporting efficient memory usage and fast scene transitions.</li>
                                <li>Applications are instantiated as UI items (ComputerAppItem) and panels, each with their own icon, name, and logic, supporting extensibility.</li>
                                <li>The system supports a <strong>taskbar and multi-window management</strong>, allowing users to open, minimize, and close multiple apps simultaneously.</li>
                                <li>Player interaction is handled through PCTable, enabling sitting, getting up, and immersive <strong>camera/IK transitions</strong> for realistic computer use.</li>
                                <li>Application access is <strong>permission-based</strong>; only allowed apps are shown depending on the player's estate or progress.</li>
                                <li>All UI and app state changes are <strong>event-driven</strong>, ensuring responsive updates and smooth user experience.</li>
                                <li>The architecture supports <strong>localization</strong> for app names and UI, making the system ready for multi-language support.</li>
                                <li>Integrates with external managers (PlayerManager, CameraManager, EnviroManager) for time, player state, and environmental feedback.</li>
                                <li>Designed for <strong>extensibility</strong>: new apps, UI panels, or interaction types can be added with minimal changes to the core system.</li>
                            </ul>`
                },
                {
                    icon: '🛒',
                    title: 'Computer App Panels',
                    content: `<ul>
                                <li>All panels use a modular, <strong>event-driven UI architecture</strong>, enabling dynamic updates and seamless integration with shop and player systems.</li>
                                <li>Product and Supplier panels feature <strong>advanced basket systems</strong> for multi-item selection, real-time cost calculation, and batch purchasing.</li>
                                <li>Product panel includes a <strong>license management system</strong>, requiring players to obtain licenses for certain product categories before purchase.</li>
                                <li><strong>Auto Contract system</strong> in the Product panel allows players to automate recurring product deliveries with customizable intervals.</li>
                                <li>Supplier panel dynamically calculates <strong>delivery times and costs</strong> based on region and supplier category, enhancing realism.</li>
                                <li>Establishment panel provides comprehensive shop management: <strong>employee hiring/firing</strong>, financial summaries, upgrades, and shop type selection.</li>
                                <li><strong>Employee management</strong> in Establishment panel supports role assignment and performance tracking for operational optimization.</li>
                                <li><strong>Mail panel</strong> centralizes all in-game communications, displaying messages, notifications, and mission-related emails in a unified inbox.</li>
                                <li>All panels support <strong>localization</strong>, ensuring multi-language compatibility for UI and content.</li>
                                <li>UI/UX is optimized for clarity and speed, with responsive feedback, clear notifications, and intuitive navigation across all panels.</li>
                            </ul>`
                },
                {
                    icon: '⛏️',
                    title: 'Crypto Mining System',
                    content: `<ul>
                                <li>Players can build and customize their own <strong>MiningPCs</strong>, adding GPUs and DockBoards to boost mining performance.</li>
                                <li>Each GPU has its own stats <strong>temperature, power usage, and stability</strong> which affect its risk of breaking down during mining.</li>
                                <li><strong>DockBoards</strong> let you manage multiple GPUs at once, making large-scale mining setups possible and efficient.</li>
                                <li>You can switch between <strong>Eco, Balanced, and Overclock</strong> mining modes, each changing your profit, power costs, and hardware risk.</li>
                                <li>The system uses <strong>dynamic coefficients</strong> to calculate profit, electricity consumption, and failure chances in real time.</li>
                                <li>The mining panel UI gives <strong>live feedback</strong> on hash rate, profits, electricity use, and even room temperature.</li>
                                <li>If your GPUs overheat or lose stability, they can break and will need repairs <strong>maintenance is key</strong> for long-term success.</li>
                                <li>All mining actions are <strong>event-driven and use async operations</strong> for smooth, lag-free gameplay.</li>
                                <li>The system is fully integrated with suppliers and repair services, so you can upgrade or fix your mining rigs as needed.</li>
                                <li>Mining directly impacts your in-game economy balancing investment, running costs, and profits is part of the challenge.</li>
                            </ul>`
                },
                {
                    icon: '🚚',
                    title: 'Delivery & Mission System',
                    content: `<ul>
                                <li><strong>DeliveryManager</strong> handles all delivery missions, tracks active deliveries, and manages delivery-related NPCs and premises.</li>
                                <li><strong>TimerManager</strong> provides countdown functionality for delivery tasks, with UI updates and event callbacks when time runs out.</li>
                                <li><strong>DeliveryNPC</strong> represents the in-game character who receives deliveries, managing interaction and animation states.</li>
                                <li><strong>DeliveryNPC_Trigger</strong> detects when a delivery box enters the NPC's trigger zone and triggers the box handover logic.</li>
                                <li><strong>DeliveryPoint</strong> is the target location for deliveries, responsible for spawning and initializing the NPC at the correct spot.</li>
                                <li><strong>NewDeliveryBox</strong> defines the interactable delivery box, supporting pickup, throw, and release actions with physics and input handling.</li>
                                <li><strong>Premise</strong> represents a delivery location, manages multiple delivery points, and spawns delivery boxes for missions.</li>
                                <li><strong>DeliveryApp</strong> is the in-game phone app UI for listing available deliveries and tracking current delivery status.</li>
                                <li><strong>DeliveryItem and DeliveryPremiseItem</strong> are UI components that display delivery details, rewards, and allow selection of missions.</li>
                                <li><strong>CurrentDeliveryPanel</strong> shows real-time info about the active delivery, including reward, progress, and cancellation option.</li>
                            </ul>`
                },
                {
                    icon: '💬',
                    title: 'Dialogue System',
                    content: `<ul>
                                <li><strong>Centralized Orchestration:</strong> A single DialogueManager controls all dialogue flow, UI, and choices.</li>
                                <li><strong>NPC Triggers:</strong> DialogueNPC components on characters initiate conversations upon player interaction.</li>
                                <li><strong>Data-Driven Content:</strong> Dialogue and branching are stored in ScriptableObjects for code-free content creation.</li>
                                <li><strong>Modular & Scalable:</strong> The separated design (manager, trigger, data) allows for easy expansion.</li>
                                <li><strong>Gameplay-Integrated Actions:</strong> Choices can directly trigger game events, like assigning employee roles.</li>
                                <li><strong>Conditional Branching:</strong> Dialogue dynamically changes based on game state, such as quest progression.</li>
                            </ul>`
                },
                {
                    icon: '🏠',
                    title: 'Estate Management System',
                    content: `<ul>
                                <li><strong>Centralized State Management:</strong> EstateManager acts as a singleton, providing a global access point for all estate-related operations and data retrieval.</li>
                                <li><strong>Base Class Inheritance:</strong> The system uses a BaseEstate class, establishing a common interface and functionality for all property types (like houses and shops).</li>
                                <li><strong>Data Persistence via ScriptableObjects:</strong> EstateDataConfig is a ScriptableObject that holds all persistent estate data, ensuring it's saved and loaded as a single asset.</li>
                                <li><strong>Decoupled Data and Logic:</strong> The system cleanly separates data (EstateDataConfig) from runtime logic (EstateManager), making it easier to manage and debug.</li>
                                <li><strong>Dynamic Property Instantiation:</strong> The EstateManager likely handles the dynamic instantiation of estate prefabs and applies their saved data at runtime.</li>
                                <li><strong>Financial System Integration:</strong> The estate system is tightly coupled with the banking system to manage purchases, sales, rents, and associated debts like bills and taxes.</li>
                                <li><strong>Player Ownership Tracking:</strong> The system tracks whether a property is owned, rented, or available, which dictates player interaction options.</li>
                                <li><strong>Scalable Architecture:</strong> Adding new property types is straightforward, likely requiring only a new class inheriting from BaseEstate and registration within the manager.</li>
                                <li><strong>Scene-Independent Data:</strong> By storing data in a ScriptableObject, the system ensures that player estate information is independent of any specific game scene.</li>
                                <li><strong>Event-Driven Updates:</strong> The system likely uses events to notify other game systems (like UI or objectives) when the state of a property changes.</li>
                            </ul>`
                },
                {
                    icon: '🏠',
                    title: 'House Estate System',
                    content: `<ul>
                                <li><strong>Core Component Structure:</strong> The House script likely acts as the main controller for a house prefab, referencing other specialized components.</li>
                                <li><strong>Data-Driven Design:</strong> HouseEstateData defines the specific data structure for houses, including state like ownership, which is managed by the broader EstateDataConfig.</li>
                                <li><strong>Decoupled Financial Logic:</strong> HouseFinanceController exclusively handles all financial transactions for a house, such as buying, selling, and rent processing.</li>
                                <li><strong>Player Interaction Entry Points:</strong> BuyHouseSign serves as a simple trigger for initiating the purchase process, keeping interaction logic separate from the house itself.</li>
                                <li><strong>Scene Transition Management:</strong> HouseEntryExitSystem manages player transitions between the main game world and the interior of a house scene.</li>
                                <li><strong>Stateful Simulation Control:</strong> HouseSimulationController is responsible for managing the house's internal state, such as object placement or resident NPCs.</li>
                                <li><strong>Initialization Logic:</strong> InitialHouse likely handles the setup for the player's first house, applying special conditions or tutorials.</li>
                                <li><strong>Customization Persistence:</strong> Paintsaveautoid suggests a system for saving and loading player-driven customizations, like wall paint, by assigning unique IDs.</li>
                                <li><strong>Inheritance from Base System:</strong> The house system inherits from BaseEstate, ensuring it integrates seamlessly with the main EstateManager.</li>
                                <li><strong>Clear Separation of Concerns:</strong> The use of multiple controller scripts (Finance, Simulation, EntryExit) demonstrates a strong separation of concerns, making the system robust and maintainable.</li>
                            </ul>`
                },
                {
                    icon: '🏪',
                    title: 'Shop - Modular Shop Simulation Architecture',
                    content: `<ul>
                                <li><strong>Specialized Shop Controllers:</strong> MarketShop and CoffeeShop act as specialized controllers for each shop type, inheriting from a common base class to manage type-specific logic.</li>
                                <li><strong>Shared Simulation Architecture:</strong> Both shop types utilize an identical simulation folder structure (Manager, Customer, Employee), indicating a robust, reusable core simulation engine.</li>
                                <li><strong>Modular Simulation Components:</strong> The simulation is broken down into three distinct modules: Manager for overall control, Customer for AI behavior, and Employee for staff management.</li>
                                <li><strong>Centralized Simulation Management:</strong> The Manager module within each simulation likely acts as the central coordinator, orchestrating interactions between customers and employees.</li>
                                <li><strong>Independent Customer AI:</strong> The Customer module contains the logic for customer AI, including pathfinding, product selection, and purchasing behavior, which can be customized per shop type.</li>
                                <li><strong>Reusable Employee Logic:</strong> The Employee module handles all staff-related actions, such as performing tasks and managing schedules, using a logic base that is shared across different shop types.</li>
                                <li><strong>Data-Driven Customization:</strong> While the structure is shared, the specific behaviors (e.g., products sold, employee tasks) are likely defined by data assets like ScriptableObjects, allowing for easy customization.</li>
                                <li><strong>Scalable for New Shop Types:</strong> This architecture makes it highly efficient to add new shop types; a developer would only need to create a new main controller (e.g., BakeryShop) and configure its specific data.</li>
                                <li><strong>Clear Separation of Concerns:</strong> The design clearly separates the high-level shop logic (MarketShop) from the complex, low-level simulation behaviors (Customer, Employee modules).</li>
                                <li><strong>Integration with Core Systems:</strong> These shops are deeply integrated with the main Estate and Bank systems for purchase, financial tracking, and employee salary payments.</li>
                            </ul>`
                },
                {
                    icon: '🛠️',
                    title: 'Advanced Shop & Quest Architecture',
                    content: `<ul>
                                <li><strong>Event-Driven Shop Core:</strong> I designed an abstract base class to act as the core controller for all shop properties, using an event-driven model. It subscribes to global time events to manage hourly and daily logic for finances, employees, and suppliers, while using UniTask for non-blocking async data loading.</li>
                                <li><strong>Dynamic Trash & Mess System:</strong> I developed a dynamic trash system that distinguishes between initial, pre-placed trash and messes generated by customers. For easier level design, I also added custom editor gizmos to visualize trash spawn points and related objects directly in the Unity editor.</li>
                                <li><strong>Flexible Branding & Customization:</strong> I created a flexible branding system that allows players to customize a shop's sign, text, and logo, persisting these choices in a DTO. It also supports loading custom logos directly from the file system, providing a flexible way to extend branding options without needing new art assets.</li>
                                <li><strong>Modular & Migratable Quest System:</strong> I engineered a modular task management system that handles all shop-related quests, displaying them based on the shop's level. A key feature is a data migration system I implemented to seamlessly transition legacy task data into the new structure, ensuring players don't lose progress.</li>
                                <li><strong>Performance-Optimized Presence Management:</strong> I implemented a robust system to manage the shop's state based on the player's presence, automatically switching between an active mode and a background "simulation" mode. To optimize performance, it uses a non-allocating physics overlap check to manage all interactive objects within the shop's area without generating garbage.</li>
                                <li><strong>Centralized Shop Lifecycle & Cleanliness:</strong> I built a central MonoBehaviour to act as the primary hub for all shop-related systems, managing the entire lifecycle from acquisition to selling. It also calculates a "cleanliness" score by combining data from both the trash system and a procedural dirt decal system, providing a comprehensive metric for store maintenance.</li>
                                <li><strong>Scalable Shop Factory:</strong> I implemented a factory pattern to dynamically instantiate and initialize different types of shops at runtime. It uses a list of ScriptableObject matchers that link a shop type to a specific prefab, allowing for a scalable way to add new shop variations without modifying core logic.</li>
                                <li><strong>Dynamic & Context-Aware Quest Progression:</strong> I designed a class to bridge the gap between in-game actions (like cleaning) and the questing system, translating events into progress updates. It dynamically selects the correct set of tasks based on the current shop type using a data-driven catalog and can operate in a different mode if the player is an employee.</li>
                                <li><strong>Data-Driven Quest Catalog:</strong> I created a ScriptableObject to serve as a centralized, data-driven catalog that maps different shop types to their corresponding quest data. This decouples the quest system from shop logic, allowing designers to assign unique quests for each store type directly in the Unity Inspector.</li>
                                <li><strong>Comprehensive Financial Simulation:</strong> I developed a comprehensive financial management system that handles all time-based expenses, including bills, rent, and salaries. It uses UniTask to sequence daily checks and applies escalating consequences for non-payment, from warnings to property confiscation, creating a realistic economic simulation.</li>
                            </ul>`
                },
                {
                    icon: '🧑‍🤝‍🧑',
                    title: 'Deep Dive: Shop & Economic Systems - 1',
                    content: `<ul>
                                <li><strong>Customer Behavior and Interaction:</strong> This service governs customer behavior, from their purchasing power to their interactions with in-store objects like shelves and cash registers. It calculates a "wealth factor" influenced by shop popularity to determine if a customer can afford a product and manages lists of all interactable points, such as shelves and tables, that customers can use.</li>
                                <li><strong>Coffee Shop Customer Specialization:</strong> This service extends the base CustomerService with specialized logic for a coffee shop, managing unique customer interactions like ordering from dessert displays. It also maintains a list of active customers and their current orders, providing a real-time view of all pending coffee and food requests that need to be fulfilled.</li>
                                <li><strong>Employee and Recruitment Management:</strong> This abstract service forms the foundation for all employee-related operations, managing the entire lifecycle from recruitment to termination. It handles the spawning of new job applicants, tracks their application validity, and manages the data for all hired employees, including their work schedules, morale, and skills.</li>
                                <li><strong>Coffee Shop Employee Specialization:</strong> This service extends the base EmployeeService with logic specific to a coffee shop, primarily by managing the state and inventory of coffee machines. It tracks the ingredients (like milk, water, and beans) available in each machine and provides methods to check for and consume stock when an employee prepares an order.</li>
                                <li><strong>Supermarket Financial Service:</strong> This class provides a concrete implementation of the FinanceService tailored for a supermarket, managing a dictionary of DailyReportDTO objects to track financial performance over time. It overrides base methods to handle the recording of individual product sales and expenses, ensuring that all financial data is correctly attributed to the appropriate day's report.</li>
                                <li><strong>Supermarket Product Service:</strong> This class serves as a specialized ProductService for the supermarket, inheriting all the base functionality for managing product data, inventory, and supply chains. By creating this distinct type, the system can later add market-specific product rules or logic without altering the core service.</li>
                                <li><strong>Supermarket Employee Service:</strong> This class is a specialized EmployeeService for the supermarket, inheriting the core functionalities for managing recruitment, scheduling, and employee data. This structure allows for the future implementation of market-specific employee roles or behaviors, such as stockers or cashiers, without affecting other shop types.</li>
                                <li><strong>Coffee Shop Financial Service:</strong> This class provides a concrete FinanceService for a coffee shop, using a dictionary of daily reports to track financial performance over time. It implements the logic for recording sales of individual items like coffee and pastries, and correctly attributes all income and expenses to the corresponding day's financial summary.</li>
                                <li><strong>Coffee Shop Product and Recipe Service:</strong> This class extends the base ProductService with functionality tailored for a coffee shop, including the management of dessert displays and coffee recipes. It tracks the contents of each dessert plate on the shelves and holds the recipe data required to prepare different coffee drinks, ensuring employees have the information they need.</li>
                            </ul>`
                },
                {
                    icon: '📈',
                    title: 'Deep Dive: Shop & Economic Systems - 2',
                    content: `<ul>
                                <li><strong>Daily Financial Report Data:</strong> This class serves as a data container for a shop's daily financial performance, tracking income, expenses, and customer metrics. It includes methods to calculate gross and net income from a list of individual sale records, ensuring an accurate financial summary at the end of each day.</li>
                                <li><strong>Shop Decoration Scoring:</strong> This service calculates a shop's overall "decor score" by evaluating three key factors: the presence of required functional items, the aesthetic value of decorative objects, and the quality of the wall paint. Each factor is weighted and combined to produce a final score, which directly impacts gameplay metrics like customer attraction and employee satisfaction.</li>
                                <li><strong>Player Progression and Leveling:</strong> This service manages the shop's experience points (XP) and leveling progression, acting as the central authority for player advancement. It processes XP gains from various in-game actions and automatically handles level-ups when XP thresholds are met, triggering events that other systems can subscribe to for rewards and unlocks.</li>
                                <li><strong>Cryptocurrency Mining Simulation:</strong> This service provides the core logic for a detailed cryptocurrency mining simulation, managing all mining-related hardware like GPUs, motherboards, and cooling systems. It calculates and updates the room's temperature based on GPU heat and cooler efficiency, and it simulates hourly mining profits and electricity consumption based on the collective hash rate and operational state of the hardware.</li>
                                <li><strong>Abstract Financial Management:</strong> This abstract service defines the foundational structure for managing a shop's finances, tracking key metrics like cash balance, customer counts, and various reasons for lost sales. It provides a standardized interface for recording sales, adding expenses, and calculating profits over different time periods, which concrete implementations can then tailor to specific shop types.</li>
                                <li><strong>Shop Level and Experience Configuration:</strong> This ScriptableObject defines the complete level progression and experience reward structure for a shop. It holds a list of all levels and the XP required to reach them, as well as a separate list that maps specific in-game actions (like selling a product or cleaning) to a corresponding XP reward amount, making the entire leveling system easily configurable from the Unity Inspector.</li>
                                <li><strong>Core Shop Data and Service Container:</strong> This abstract ScriptableObject and its corresponding Data Transfer Object (DTO) serve as the central data container for any shop, defining its core properties and holding references to all its essential services. The DTO calculates the shop's overall "general score" and resulting "popularity" by weighting inputs from customer satisfaction, cleanliness, and decor, which in turn influences customer traffic and wealth.</li>
                                <li><strong>Shop Configuration and Persistent State:</strong> This ScriptableObject and its associated DTO define the complete configuration and persistent state for a single store, from its name and purchase price to the exact position of every piece of furniture. It serializes all crucial data, including placed objects, financial expenses, wall customizations, and quest progress, ensuring the entire state of the shop can be saved and loaded.</li>
                                <li><strong>Supermarket Data Configuration:</strong> This ScriptableObject defines the specific data configuration for a supermarket-type shop, inheriting from the base ShopEstateData. It composes the shop's functionality by instantiating and holding references to the specialized market versions of the core services, such as MarketFinanceService and MarketProductService.</li>
                                <li><strong>Coffee Shop Data Configuration:</strong> This ScriptableObject provides the specific data configuration for a coffee shop, inheriting from the base ShopEstateData. It assembles the shop's unique behavior by creating and holding references to the specialized coffee shop versions of the core services, such as CoffeeShopFinanceService and CoffeeShopEmployeeService.</li>
                                <li><strong>Competitor Company Data:</strong> This ScriptableObject defines the data for a single rival company, including its pricing strategy for various products. It uses a dictionary to store price multipliers for specific products and generates a random multiplier within a defined range for any products not explicitly listed, simulating a dynamic and unpredictable market competitor.</li>

                            </ul>`
                },
                {
                    icon: '🛒',
                    title: 'Deep Dive: Shop & Economic Systems - 3',
                    content: `<ul>
                                <li><strong>Product and Inventory Management:</strong> This abstract service acts as the backbone for all product-related logic, managing everything from product unlocking and pricing to inventory tracking on shelves. It also handles the entire supply chain, including manual truck orders and automated, recurring contract deliveries, ensuring that the shop remains stocked.</li>
                                <li><strong>Competitor Pricing and Market Analysis:</strong> This service simulates a competitive market by managing data for rival companies and their pricing strategies. It calculates an average market price for any given product by aggregating data from all competitors, which is then used to determine a fair market value and influence the player's own pricing decisions.</li>
                                <li><strong>Warehouse and Storage Management:</strong> This service manages the data for all storage systems within a shop, including shelves and warehouse racks. It handles the serialization of stored items, tracking whether a slot contains a product supply box or a placeable object, and ensures that the correct items are loaded and saved with the game state.</li>
                                <li><strong>Shop Upgrade Parameters:</strong> This service acts as a simple data container for defining various upgrade-related parameters and level requirements for the shop. It centralizes key values, such as the minimum level required to hire new staff, making them easily accessible and modifiable for balancing purposes.</li>
                                <li><strong>Furniture and Equipment Supply Chain:</strong> This service manages the entire supply chain for non-product items like furniture, shelves, and equipment. It tracks ordered items that are currently in a delivery truck as well as items held in storage, ensuring a clear distinction between in-transit and on-site assets.</li>
                                <li><strong>Special Shop Status Management:</strong> This service tracks and manages special operational states or "situations" that can affect a shop, such as a debt-related lockdown or a utility service cutoff. It provides a simple system for adding, removing, and checking active situations, allowing other game systems to react accordingly and alter gameplay.</li>
                                <li><strong>In-Game Email Communication:</strong> This service manages the in-game email system for a specific shop, handling the addition, removal, and state changes of mail messages. It triggers notifications for new mail and provides methods to retrieve sorted lists of messages, ensuring all communication is properly saved and displayed to the player.</li>
                                <li><strong>Supermarket Data Configuration:</strong> This ScriptableObject defines the specific data configuration for a supermarket-type shop, inheriting from the base ShopEstateData. It composes the shop's functionality by instantiating and holding references to the specialized market versions of the core services, such as MarketFinanceService and MarketProductService.</li>
                            </ul>`
                },
                {
                    icon: '📈',
                    title: 'Deep Dive: Coffee Shop Systems',
                    content: `<ul>
                                <li><strong>Coffee Shop Customer Specialization:</strong> This service extends the base CustomerService with specialized logic for a coffee shop, managing unique customer interactions like ordering from dessert displays. It also maintains a list of active customers and their current orders, providing a real-time view of all pending coffee and food requests that need to be fulfilled.</li>
                                <li><strong>Coffee Shop Employee Specialization:</strong> This service extends the base EmployeeService with logic specific to a coffee shop, primarily by managing the state and inventory of coffee machines. It tracks the ingredients (like milk, water, and beans) available in each machine and provides methods to check for and consume stock when an employee prepares an order.</li>
                                <li><strong>Coffee Shop Financial Service:</strong> This class provides a concrete FinanceService for a coffee shop, using a dictionary of daily reports to track financial performance over time. It implements the logic for recording sales of individual items like coffee and pastries, and correctly attributes all income and expenses to the corresponding day's financial summary.</li>
                                <li><strong>Coffee Shop Product and Recipe Service:</strong> This class extends the base ProductService with functionality tailored for a coffee shop, including the management of dessert displays and coffee recipes. It tracks the contents of each dessert plate on the shelves and holds the recipe data required to prepare different coffee drinks, ensuring employees have the information they need.</li>
                                <li><strong>Coffee Shop Business Logic:</strong> This class serves as the main controller for a coffee shop, inheriting from the base ShopEstate and implementing coffee-shop-specific business logic. It is responsible for initializing the shop with the correct data, such as coffee recipes, and manages the transition between real-time and simulated gameplay modes by activating or deactivating a dedicated simulation manager. It also defines the specific conditions required to open the shop, such as the presence of cash registers and customer interaction points.</li>
                                <li><strong>Coffee Shop Simulation Orchestrator:</strong> This class orchestrates the entire background simulation for a coffee shop, inheriting from a base SimulationManager and managing all simulation-related components like employee and customer simulators. It is responsible for initializing the simulation, checking the conditions required to open or close the shop (such as available cashiers and product stock), and triggering notifications to inform the player of these state changes. This manager ensures that the coffee shop continues to operate realistically even when the player is not present.</li>
                                <li><strong>Coffee Simulation Component Base:</strong> This abstract class serves as a simple and standardized base for all components that participate in the coffee shop simulation. By requiring every simulation component to implement an Initialize method, it ensures that each part of the simulation is properly set up and linked to the main CoffeeSimulationManager. This promotes a modular and organized structure for the simulation system.</li>
                                <li><strong>Coffee Shop Customer Simulation:</strong> This class manages the behavior of simulated customers in a coffee shop, from their arrival to their purchasing decisions. It calculates customer spawn rates based on the time of day and shop popularity, and for each customer, it simulates their journey, including selecting products, checking affordability based on their "wealth factor," and determining their overall satisfaction based on factors like price, cleanliness, and wait time. This component is crucial for driving the shop's simulated economy and providing realistic performance feedback.</li>
                                <li><strong>Barista Employee Simulation:</strong> This simulation component manages the behavior of barista employees, ensuring they operate the coffee machines effectively. It tracks the number of available baristas and coffee machines, determines the operational capacity, and simulates hourly tasks like refilling machine ingredients from available supply boxes. This ensures that the coffee-making process continues realistically in the background, directly impacting the shop's ability to serve customers.</li>
                            </ul>`
                },
                {
                    icon: '🛒',
                    title: 'Deep Dive: Supermarket Systems',
                    content: `<ul>
                                <li><strong>Supermarket Financial Service:</strong> This class provides a concrete implementation of the FinanceService tailored for a supermarket, managing a dictionary of DailyReportDTO objects to track financial performance over time. It overrides base methods to handle the recording of individual product sales and expenses, ensuring that all financial data is correctly attributed to the appropriate day's report.</li>
                                <li><strong>Supermarket Product Service:</strong> This class serves as a specialized ProductService for the supermarket, inheriting all the base functionality for managing product data, inventory, and supply chains. By creating this distinct type, the system can later add market-specific product rules or logic without altering the core service.</li>
                                <li><strong>Supermarket Employee Service:</strong> This class is a specialized EmployeeService for the supermarket, inheriting the core functionalities for managing recruitment, scheduling, and employee data. This structure allows for the future implementation of market-specific employee roles or behaviors, such as stockers or cashiers, without affecting other shop types.</li>
                                <li><strong>Supermarket Business Logic:</strong> This class serves as the main controller for a supermarket, inheriting from the base ShopEstate and implementing market-specific business logic. It is responsible for initializing the shop with the correct data and manages the transition between real-time and simulated gameplay modes by activating or deactivating a dedicated simulation manager. It also defines the specific conditions required to open the shop, such as the presence of cash registers and shelves.</li>
                                <li><strong>Supermarket Simulation Orchestrator:</strong> This class orchestrates the entire background simulation for a supermarket, inheriting from a base SimulationManager and managing all simulation-related components. It is responsible for initializing the simulation, checking the conditions required to open or close the shop (such as available cashiers and product stock), and triggering notifications to inform the player of these state changes. This manager ensures that the supermarket continues to operate realistically even when the player is not present.</li>
                                <li><strong>Supermarket Simulation Component Base:</strong> This abstract class serves as a simple and standardized base for all components that participate in the supermarket simulation. By requiring every simulation component to implement an Initialize method, it ensures that each part of the simulation is properly set up and linked to the main MarketSimulationManager. This promotes a modular and organized structure for the simulation system.</li>
                                <li><strong>Supermarket Customer Simulation:</strong> This class manages the behavior of simulated customers in a supermarket, from their arrival to their purchasing decisions. It calculates customer spawn rates based on the time of day and shop popularity, and for each customer, it simulates their shopping trip, including selecting products, checking affordability based on their "wealth factor," and determining their overall satisfaction based on factors like price, cleanliness, and checkout wait time. This component is crucial for driving the shop's simulated economy and providing realistic performance feedback.</li>
                                <li><strong>Supermarket Cleaner Employee Simulation:</strong> This simulation component manages the behavior of cleaner employees in a supermarket, ensuring the store remains tidy even when the player is away. It automatically directs cleaners to collect all trash and progressively clean up procedural dirt decals, with the cleaning speed determined by the combined efficiency and morale of all available cleaners. This creates a dynamic and realistic background cleaning process that directly impacts the shop's overall cleanliness score.</li>
                                <li><strong>Supermarket Cashier Employee Simulation:</strong> This simulation component is responsible for managing cashier employees and tracking the number of available cash registers in the supermarket. It maintains an updated list of all employees assigned to cashier duty, allowing the main simulation manager to accurately determine the shop's checkout capacity. This is crucial for calculating customer wait times and overall service efficiency during the background simulation.</li>
                                <li><strong>Supermarket Shelf Stocker Employee Simulation:</strong> This simulation component manages the behavior of shelf-stocking employees in a supermarket, ensuring that products are moved from storage or delivery trucks to the shop's shelves. It identifies empty or partially filled shelves that match a product's category and directs employees to restock them, with the number of boxes they can handle per hour determined by their collective skill and morale. This process is crucial for maintaining product availability for simulated customers.</li>
                            </ul>`
                },
                {
                    icon: '🧑‍💼',
                    title: 'Deep Dive: Shop & Other Systems',
                    content: `<ul>
                                <li><strong>Shop Purchase Sign Interaction:</strong> This class implements the interaction logic for a "For Sale" sign placed in front of a shop, allowing the player to initiate the purchase process. When the player interacts with the sign, it retrieves the shop's data, maps it to a generic commerce DTO, and then opens a UI panel to confirm the purchase or rental of the property. This component acts as the primary trigger for acquiring new shop estates.</li>
                                <li><strong>Shop Open/Close Sign Interaction:</strong> This class manages the interaction logic for the "Open/Close" sign, allowing the player or an employee to change the operational state of the shop. It checks for necessary conditions before opening, such as ownership and the absence of debt-related lockdowns, and then triggers a visual sign flip animation and notifies other systems of the state change. This component serves as the central control for opening and closing the shop to customers.</li>
                                <li><strong>Shop Simulation Mode Controller:</strong> This class acts as a trigger to automatically switch a shop between its real-time and simulated states based on the player's proximity. It uses a BoxCollider to detect when the player enters or leaves the shop's vicinity, calling the appropriate methods on the ShopEstate to enable or disable simulation mode. This ensures that the shop operates efficiently in the background when the player is far away but transitions seamlessly to a fully interactive state when they are nearby.</li>
                                <li><strong>Abstract Background Simulation Manager:</strong> This abstract class provides the core framework and foundational logic for running a shop's background simulation. It hooks into the game's time system to advance the simulation on an hourly basis, manages the list of active employees, and checks their work schedules to determine when they should start or end their shifts. By defining a standardized structure with abstract methods for opening and closing the shop, it allows for specialized implementations (like for a market or gallery) while handling all the common, underlying simulation mechanics.</li>
                            </ul>`
                },
                {
                    icon: '🧑‍💼',
                    title: 'Faint',
                    content: `<ul>
                                <li><strong>Abstract Drink Interaction:</strong> This abstract class provides the foundational logic for any drinkable item in the game, managing the entire interaction from picking it up to consuming it. It handles player input for starting and stopping the drinking action, animates the object to the player's mouth, and simulates the depletion of the liquid using a shader property. By defining abstract methods like OnDrink and OnDrinkCompleted, it allows derived classes to implement specific effects, such as restoring energy or causing intoxication.</li>
                                <li><strong>Fainting System Interface:</strong> This interface defines a simple contract for any object that can participate in the game's fainting system. It ensures that any class implementing it provides methods to RegisterFaint and UnregisterFaint, allowing a central manager to track all objects that can trigger or be affected by a fainting event. This promotes a clean, decoupled architecture for the fainting mechanic.</li>
                                <li><strong>Energy Drink Item:</strong> This class implements the specific logic for an energy drink, inheriting from the base Drink class. When consumed, it restores the player's energy level and triggers a temporary "boost" effect, which increases movement speed and applies a field-of-view (FOV) animation to enhance the feeling of speed. The class carefully manages the application and removal of this boost, ensuring it lasts for a set duration before smoothly returning the player's state to normal.</li>
                                <li><strong>Fainting State Manager:</strong> This static class acts as a centralized manager for the game's fainting mechanic, tracking whether the player is currently prevented from fainting. It maintains a collection of "faint blockers," and other systems can check its IsFaintingBlocked property to determine if a fainting event should be suppressed. This provides a simple, global system for controlling the fainting state without requiring direct communication between different gameplay components.</li>
                                <li><strong>Vending Machine Interaction:</strong> This class implements the logic for a vending machine that dispenses energy drinks. When the player interacts with it and can afford the price, it plays a multi-stage animation of a drink falling from the display shelf, then spawns an energy drink prefab in the collection slot. The class carefully manages the animation state to prevent multiple purchases while a transaction is in progress, ensuring a smooth and visually appealing user experience.</li>
                                <li><strong>Player Fainting and Recovery Behavior:</strong> This class manages the entire process of the player fainting from exhaustion, handling the visual effects, animations, and gameplay consequences. It uses a post-processing vignette to signal low energy, triggers a fainting animation, and then teleports the player to a safe location to "sleep" for a set number of hours. Upon waking, it restores the player's state and applies a penalty by deducting a percentage of their cash, creating a complete and impactful gameplay loop for the fainting mechanic.</li>
                                <li><strong>Vending Machine Button Interaction:</strong> This class provides the specific interaction logic for the button on a vending machine. When the player interacts with it, it simply calls the TryGetDrink method on its associated VendingMachine component, effectively delegating the core vending logic. This component acts as a simple, focused trigger that connects the player's interaction to the machine's functionality.</li>
                            </ul>`
                },
                {
                    icon: '🏪',
                    title: 'Job System',
                    content: `<ul>
                                <li><strong>Supermarket Job System:</strong> This class manages the entire supermarket job experience, from scheduling and tasks (restocking, cashiering, cleaning) to payouts. It also controls the store's operational state and handles boss meetings during the player's shift.</li>
                                <li><strong>Job System Boss NPC:</strong> Defines the behavior of a boss NPC who offers jobs to the player. It handles pathfinding to meeting points, dialogue interactions, and includes a timeout mechanic if the player ignores the meeting.</li>
                                <li><strong>Job Data and State Management:</strong> A ScriptableObject and its WorkDTO that act as the central data hub for a job. It tracks work hours, calculates performance-based earnings, manages shift states, and schedules boss meetings.</li>
                                <li><strong>Active Job Type Enumeration:</strong> An enumeration listing all available active jobs. It helps the job manager ensure the player is only engaged in one active job at a time to prevent gameplay conflicts.</li>
                                <li><strong>Job Card Reader Interaction:</strong> Manages the card reader interaction used to clock in and out of shifts. It triggers a cinematic camera shift and an animation sequence, providing an immersive physical interface for starting and ending work.</li>
                                <li><strong>Job Icon UI Helper:</strong> A static helper class that controls the visibility of job-related icons on the main map and minimap. It updates the UI dynamically based on active shifts and scheduled meetings to guide the player.</li>
                                <li><strong>Active Job State Manager:</strong> A global manager that ensures the player only takes on one active job at a time. It tracks the current job state and displays warning notifications if the player attempts to start conflicting jobs.</li>
                                <li><strong>Active Job System Interface:</strong> A standard interface (IActiveJobSystem) for all active job systems. It requires them to expose their job type, active status, and display name, allowing the ActiveJobManager to control them uniformly.</li>
                                <li><strong>Player Proximity Detector for Jobs:</strong> Uses a BoxCollider to detect when the player enters or leaves the work area. It automatically triggers the loading or unloading of job-specific objects and data based on the player's proximity.</li>
                                <li><strong>Job-Related Truck Spawning Logic:</strong> Determines what products should be delivered by trucks during a shift. It checks shelf stock levels and prioritizes low-inventory items to generate relevant restocking tasks for the player.</li>
                                <li><strong>Job Task Object Outliner:</strong> Highlights relevant objects in the environment to guide the player during their shift. It identifies the highest-priority task and adds visual outlines to target objects like delivery trucks or cash registers.</li>
                             </ul>`
                },
                {
                    icon: '📜',
                    title: 'Mission System',
                    content: `<ul>
                                <li><strong>Mission Data and Structure:</strong> The TaskData.cs, TaskGroupsData.cs, and TaskInstance.cs scripts form the core data model for the quest system. They use ScriptableObjects to define individual tasks and group them into logical sets (like general story or specific jobs), while TaskInstance tracks real-time player progress against these definitions during gameplay.</li>
                                <li><strong>Quest Target Map Icon:</strong> This component (QuestTargetMapIconBehaviour.cs) manages the visibility of objective icons on the main map and minimap. It subscribes to task list updates and only displays its associated icon if the related task is currently the player's highest-priority active objective.</li>
                                <li><strong>Quest Target Outline Indicator:</strong> This component (QuestTargetOutlineBehaviour.cs) provides in-world visual guidance by highlighting relevant interactable objects. It constantly checks the active quest list and activates an outline effect on its attached object only when it is the primary target of the player's current task.</li>
                                <li><strong>Mission Management and Logic:</strong> TaskManager.cs is the execution engine that tracks active tasks and handles progress updates, while QuestManager.cs acts as the higher-level coordinator. QuestManager manages the flow of quests by registering new tasks, handling dependencies (connected quests), and interfacing with the save system to ensure player progression is preserved.</li>
                                <li><strong>Mission Flow and Automation:</strong> QuestFlow.cs contains the hardcoded logic for specific narrative sequences, automatically triggering cutscenes and spawning companion NPCs when certain tasks are initialized or completed. QuestHelper.cs acts as a utility to map generalized in-game actions (like placing a shelf) to specific quest event types depending on the player's current context (e.g., in a market vs. a coffee shop).</li>
                                <li><strong>Mission User Interface:</strong> QuestPanel.cs, TaskItemUI.cs, and TaskPanelUI.cs handle the visual representation of quests. QuestPanel displays the main, high-priority objective with animated text reveals, while TaskPanelUI manages a stack of secondary tasks, creating individual TaskItemUI elements to show specific progress bars or counters, ensuring the player always knows their current objectives.</li>
                            </ul>`
                },
                {
                    icon: '🧍',
                    title: 'NPC System',
                    content: `<ul>
                                <li><strong>Base Interactive NPC:</strong> This abstract class (Interaction_NPC.cs) serves as the foundational framework for all interactive NPCs in the game, providing core functionalities for movement, animation, and complex interactions like holding objects and shaking hands. It integrates with Unity's FinalIK to manage procedural animations, ensuring that NPCs can dynamically look at the player, manipulate objects with their hands, and engage in believable, physically-grounded interactions.</li>
                                <li><strong>NPC Dialogue Bubble UI:</strong> This component (AgentTalk.cs) manages the visual representation of an NPC's thoughts or speech using a UI canvas and TextMeshPro. It provides methods to easily display localized text bubbles above the NPC's head for a specified duration, enhancing the narrative experience without interrupting gameplay.</li>
                                <li><strong>NPC Dynamic Look At:</strong> This script (NPC_LookAt.cs) utilizes FinalIK to create responsive and realistic head-tracking behavior for NPCs. When the player enters a defined trigger zone, the NPC smoothly transitions its gaze to focus on the player's camera, creating a more engaging and lifelike interaction.</li>
                                <li><strong>NPC NavMesh Locomotion:</strong> This class (NPC_Locomotion.cs) acts as a bridge between Unity's NavMeshAgent and the NPC's animator. It handles basic pathfinding to given destinations and automatically updates the NPC's animation state (Idle, Walking, Communicating) based on its current movement velocity and distance to the target.</li>
                                <li><strong>Story Companion NPC:</strong> This specialized class (CompanionNPC.cs) controls the NPC that guides the player during the initial tutorial and story quests. It features custom logic to follow the player, interact with a bicycle, and trigger dialogue sequences or quest completions when reaching specific destinations, acting as an active participant in the mission flow.</li>
                                <li><strong>Shop Customer Base:</strong> This class (ShopCustomer.cs) currently acts as a concrete implementation of the Interaction_NPC base class. While its specific logic is abstracted or commented out in this version, it serves as the foundational type identifier for characters that enter the player's store to browse and purchase items.</li>
                                <li><strong>Wandering NPC AI:</strong> This component (WanderNPC.cs) provides simple, ambient AI behavior for background characters. Given a list of predefined waypoints, it continuously directs the NPC to walk to a random point, wait for a specified idle time, and then pick a new destination, bringing life and movement to the city streets.</li>
                                <li><strong>Proximity-Based NPC Spawner:</strong> This optimization script (NPCSpawner.cs) manages the population of background NPCs by spawning and despawning them based on their distance from the player. By only instantiating wandering NPCs when the player is nearby and destroying them when they leave the area, it significantly reduces the game's overall performance overhead.</li>
                            </ul>`
                },
                {
                    icon: '📱',
                    title: 'Phone Applications',
                    content: `<ul>
                                <li><strong>Bank App and Loan Management:</strong> The BankApp.cs script manages the in-game phone's banking application. It displays the player's current cash and bank balances and provides detailed transaction histories for different categories (vehicles, crypto, shops). Crucially, it also manages the player's active loans and contracts (rent, bills, employee salaries, taxes), displaying upcoming payments and allowing the player to view detailed breakdowns for each debt type using specialized UI components (like RentLoanDetails.cs or TaxLoanDetails.cs).</li>
                                <li><strong>Business Management App:</strong> The Business App.cs script powers the phone's business application, acting as a central hub for managing owned properties and finding new jobs. In the "My Businesses" section, players can manage employee recruitment (adjusting wages, setting max hours, reviewing applicants) and view individual employee performance and schedules using BusinessAppChart. In the " Jobs" section, players can browse available job listings (WorkDTOs), apply for positions, or review and resign from their currently active jobs.</li>
                                <li><strong>Messaging and Mail Applications:</strong> The MessageApp.cs and MailAppMobile.cs scripts handle the game's primary communication systems. MessageApp manages text messages from NPCs (like boss notifications or bank alerts), supports location-based messages that can set the player's GPS, and includes specialized logic for interactive negotiations during vehicle trades (allowing the player to select meeting times directly in the chat). MailAppMobile connects to a global MailDataConfig to display more formal, longer-form emails, such as end-of-day reports or official notices.</li>
                            </ul>`
                },
                {
                    icon: '🏗️',
                    title: 'Placement System',
                    content: `<ul>
                                <li><strong>Base Placeable Object:</strong> This abstract class (PlaceableObject.cs) serves as the core foundation for all objects that can be placed, edited, or destroyed by the player. It integrates with the building system, manages the object's save/load state, and handles physical interactions, placement animations, and destruction logic.</li>
                                <li><strong>Build Mode Manager:</strong> This class (PlaceableManager.cs) acts as a central state manager for the player's building modes (Place, Edit, Destroy, None). It listens to state changes and coordinates the UI, input configurations, and tutorial popups based on the player's current interaction.</li>
                                <li><strong>Placeable Object Box:</strong> This class (PlaceableObjectBox.cs) represents the physical cardboard box containing a placeable item. It includes logic for the player to pick it up, carry it on a hand truck, throw it with physics, or open it to transition directly into the placement mode for that specific item.</li>
                                <li><strong>Placeable Type Identifier:</strong> A lightweight component (PlaceableIdentifier.cs) that attaches an enum-based key to a building part. This allows other systems to easily identify and search for specific types of placeable objects (like a computer desk) without relying on strings.</li>
                                <li><strong>Asynchronous Model Loader:</strong> This static manager (PlaceableModelManager in PlaceableModelLoader.cs) handles the asynchronous loading of 3D models for placeable objects using Unity Addressables. It caches the loaded assets to optimize performance and memory usage during gameplay.</li>
                                <li><strong>Placeable Reference Holder:</strong> A simple utility component (PlaceableObjectHolder.cs) that acts as a bridge, holding direct references to both the PlaceableObject script and its underlying BuildingPart component for quick access by other systems.</li>
                                <li><strong>Placement Input Configuration:</strong> This ScriptableObject (PlacementSystemConfig.cs) centralizes all input actions and key bindings used during the building process. It manages the input states (like enabling rotation or snapping) depending on the current build mode and handles the logic for restoring an object if its placement is canceled.</li>
                                <li><strong>Placement Object Mapping:</strong> A ScriptableObject (PlacementSystemObjects.cs) that holds a list of PlaceableIdentifiers. It provides a quick lookup method to find the specific string-based building identifier associated with a given PlaceableIdentifierKey enum.</li>
                                <li><strong>Box Collider Reference:</strong> A small utility script (PlaceableObjectBoxSaver.cs) used to reference the main PlaceableObjectBox component from child colliders, aiding in raycast detection and interaction logic.</li>
                                <li><strong>Model Transform Data:</strong> This component (PlaceableObjectModelReference.cs) stores specific local position, rotation, and scale offsets for a placeable object's 3D model. It ensures that when a model is asynchronously loaded via Addressables, it spawns with the correct transform adjustments.</li>
                            </ul>`
                },
                {
                    icon: '📢',
                    title: 'Ad Agency System',
                    content: `<ul>
                                <li><strong>Ad Agency Teller Interaction:</strong> This script (AdAgencyTeller.cs) provides the interaction logic for the NPC or desk at the advertising agency. When the player interacts with it, it triggers the opening of the main Ad Agency UI panel, serving as the entry point for purchasing marketing campaigns.</li>
                                <li><strong>Ad Campaign Data Models:</strong> This file (AdCampaignModels.cs) defines the core data structures and enumerations used by the advertising system, including campaign aggressiveness levels, preset packages, and active campaign selections. It also provides the logic to calculate the active popularity bonus based on the remaining hours of a campaign.</li>
                                <li><strong>Shop Selection UI View:</strong> This component (AdAgencyShopItemView.cs) manages the visual representation of an individual shop within the Ad Agency's selection list. It displays the shop's name and any currently active campaign duration, and it handles the button click event to select that specific shop for a new marketing push.</li>
                                <li><strong>Ad Agency UI Controller:</strong> This class (AdAgencyPanelController.cs) is the main orchestrator for the advertising agency interface. It manages the flow of selecting an owned or rented shop, choosing between custom campaign durations and aggressiveness levels, or selecting pre-made packages, and handles the financial transaction before applying the popularity boost to the chosen business.</li>
                                <li><strong>Ad Campaign Preset UI View:</strong> This script (AdAgencyReadyPackageCardView.cs) controls the UI display for ready-made marketing packages. It formats and presents the package's duration, expected customer intensity bonus, and total cost, allowing the player to quickly purchase a standardized advertising campaign with a single click.</li>
                            </ul>`
                },
                {
                    icon: '☕',
                    title: 'Coffee Shop Customer AI',
                    content: `<ul>
                                <li><strong>Base Customer Class:</strong> Encapsulates the core behaviors of coffee shop patrons. It manages the general flow based on customer types (Dine-in, Takeaway, Normal) and stores the shopping cart data for selected items.</li>
                                <li><strong>Entering and Deciding (Initial States):</strong> Represents the moment customers first enter the cafe. At this stage, they decide whether to simply grab ready-made items from the shelves or approach the counter to place a specific order with a barista.</li>
                                <li><strong>Normal Shopping Flow (Normal States):</strong> Manages the behavior of self-service customers, guiding them to navigate between shelves, approach specific product locations, and search for available items.</li>
                                <li><strong>Standard Checkout Queue (Queue States):</strong> Controls the logic for customers who only picked up ready-made items as they enter the checkout line, wait for the person in front of them, and proceed to make their payment.</li>
                                <li><strong>Ordering Phase (First Stage):</strong> Handles customers who want custom-prepared coffee or desserts. It manages their wait in the specific order queue, communicating their request to the cashier, and completing the initial payment.</li>
                                <li><strong>Waiting for Order and Pickup (Second Stage):</strong> Covers the process where customers who have already ordered move to the pickup area, wait for their preparation to finish, and collect their tray once the order is ready.</li>
                                <li><strong>Looking For Chair:</strong> Includes the logic for Dine-In customers who, after picking up their tray, scan the cafe environment to find an available empty table and chair.</li>
                                <li><strong>Sitting and Consuming (Sitting State):</strong> Controls the customer sitting down at the table, triggering the appropriate Inverse Kinematics (IK) animations, and spending time consuming their purchased food and drinks.</li>
                                <li><strong>Leaving and Forced Removal (Leaving States):</strong> Encompasses the exit behaviors for customers who have finished shopping, leave happy or frustrated, or are forced out because the shop is closing.</li>
                            </ul>`
                },
                {
                    icon: '☕',
                    title: 'Coffee Shop Systems (Desserts • Register • Slots • Trays)',
                    content: `<ul>
                                <li><strong>Dessert and Portion Management:</strong> Manages the logic of dividing a whole dessert product (like a large cake) into individual portions or slices, tracking each piece logically within the inventory.</li>
                                <li><strong>Plate and Presentation Logic:</strong> Handles the transfer of sliced desserts onto serving plates, playing visual animations to place them on customer trays, and presenting them for player or employee interaction.</li>
                                <li><strong>Display and Shelf System:</strong> Tracks the capacity and stock levels of the cafe's dessert display cases, coordinates employees to restock new items into the displays, and determines which specific products customers can select.</li>
                
                                <li><strong>Advanced POS Station:</strong> Functions not just as a standard barcode scanner for off-the-shelf items, but also serves as a comprehensive order-taking hub for custom barista drinks and served desserts.</li>
                                <li><strong>Advanced Queue Management (Dual Queue):</strong> Independently manages multiple distinct lines—separating the checkout queue for standard shoppers from the order/pickup queues for cafe patrons—ensuring smooth traffic flow.</li>
                                <li><strong>Employee and Register Integration:</strong> Seamlessly coordinates between the player operating the register manually and cashier NPCs taking over the station to punch in orders, process payments, and clear the customer queues automatically.</li>
                
                                <li><strong>Interactive Component Architecture:</strong> The Slot system establishes modular snap-to-fit interaction zones across cafe equipment, governing precise placement and alignment of objects like cups and tools.</li>
                                <li><strong>Bipedal IK & Hand Management:</strong> Integrates with the IK system to bind player hands to machine slots during interaction, differentiating inputs and ensuring smooth attachment and release animations.</li>
                                <li><strong>Visual & Physical State Toggling:</strong> Automatically manages renderers and colliders, disabling visuals and triggers when objects are placed to prevent clipping and physics issues.</li>
                                <li><strong>Prerequisite Triggers:</strong> Machine logic is gated by required physical components (like cups or handles), ensuring brewing systems only activate when all slots are correctly filled.</li>
                
                                <li><strong>Physical Order Assembly:</strong> Transforms customer orders into tangible tray-based systems with IK-supported carrying and modular product placement slots.</li>
                                <li><strong>Takeaway Bag Mechanics:</strong> Animates to-go orders using tweening, transferring items into bags and updating order state automatically.</li>
                                <li><strong>Strict Order Validation Checkpoints:</strong> Validates every item against the customer's order data before allowing completion of the transaction.</li>
                                <li><strong>Automated Customer Release & Payout:</strong> Processes payment, grants rewards, and transitions customer AI states after successful order validation.</li>
                                <li><strong>Physics-Based Trash Disposal:</strong> Allows full order disposal with animated cleanup sequences for trays and contents.</li>
                            </ul>`
                },
                {
                    icon: '☕',
                    title: 'Coffee Shop Machines & Recipe System',
                    content: `<ul>
                                <li><strong>Dynamic Brewing Simulation:</strong> The CoffeeShopMachine.cs script governs the physical and visual process of making coffee. By calculating time segments based on ingredient ratios, it seamlessly changes the particle system's colors in real-time (e.g., brown for chocolate, white for milk, light blue for water) to visually represent exactly what is being poured into the cup.</li>
                                <li><strong>Volume & Quality Control Check:</strong> Before dispensing a drink, the machine strictly validates both the final liquid volume (milliliters) and the ingredient mixture against the target recipe. If the player makes a mistake on the UI sliders, it rejects the cup, wastes the resources, and displays a warning notification.</li>
                                <li><strong>Automated Stock Management:</strong> The machine actively monitors multiple internal ingredient reservoirs via CoffeeMachineStock components. It automatically deducts the exact required amounts during brewing, halts operation if a specific stock (like coffee beans or milk) runs out, and automatically saves the updated stock values to the persistent save file.</li>
                                <li><strong>Employee Automation Hooks:</strong> The machine exposes specific operational methods that interface directly with the CoffeeBaristaEmployeeSimulation. This allows AI employees to autonomously check stock levels, refill ingredients from storage boxes, and operate the machine during the background simulation mode.</li>
                
                                <li><strong>Recipe Validation Engine:</strong> The CoffeeRecipeData.cs ScriptableObject acts as the definitive rulebook for coffee brewing. It utilizes exact dictionary mapping to compare the current mixture of ingredients in a cup against predefined recipes, ensuring strict quality control.</li>
                                <li><strong>License-Gated Progression:</strong> The data system is deeply intertwined with the game's business progression. It directly links specific ingredient types (such as advanced milk types or chocolate) to purchasable LicenceKeys, dynamically expanding the cafe's menu and UI only when the player unlocks new upgrades.</li>
                                <li><strong>Modular Data Structures:</strong> By utilizing separate serializable structs, the system decouples ingredient definitions from recipe quantities, making the entire menu highly modular and easily adjustable from the Unity Inspector without touching code.</li>
                            </ul>`
                },
                {
                    icon: '📦',
                    title: 'Product System (Database • Logistics • Runtime Representation)',
                    content: `<ul>
                                <li><strong>Product Database and Configuration:</strong> The AllProductsData.cs and ProductConfig.cs files form the central database for all sellable products in the game. Critical commercial data such as the purchase cost, profit multiplier, packet size, required shelf type, and associated license for each product are managed through these ScriptableObjects.</li>
                                <li><strong>License and Category System:</strong> Products are restricted based on the shop type they are sold in (Market, Cafe) and specific license keys. This structure ensures that the product variety dynamically expands as the player upgrades their shop and purchases new licenses.</li>
                                <li><strong>Centralized Cargo and Order System:</strong> ProductManager.cs manages the logistics infrastructure that delivers the player's product orders to the shop. When an order is placed, it spawns a delivery truck on the shop's predetermined cargo route and initiates the transportation of boxes to the store.</li>
                                <li><strong>Asynchronous Loading and Optimization:</strong> Instead of keeping product models and UI icons constantly in memory, the system loads them asynchronously using Unity Addressables. This ensures that only the required product data is loaded into RAM, providing significant memory optimization.</li>
                                <li><strong>Save & Load System:</strong> It ensures that product boxes in the shop or storage are accurately recreated from saved game data at their exact coordinates, with the correct internal item counts, and in their proper open/closed states.</li>
                                <li><strong>Physical Product Representation:</strong> ProductObject.cs acts as the physical and logical 3D world representation of each specific product found on store shelves or in customers' hands. It internally holds data regarding its product type and price.</li>
                                <li><strong>Barcode Scanning System:</strong> ProductBarcode.cs forms the core logic of the checkout register and tracks whether products have been scanned. When a cashier or player scans a product, it changes the highlight color on the product from red to green, providing immediate visual feedback to the player.</li>
                            </ul>`
                },
                {
                    icon: '🤝',
                    title: 'Shop Interaction & Shelf System',
                    content: `<ul>
                                <li><strong>IShopInteraction:</strong> This interface defines the contract for how players, employees, or customers interact with shelves and other interaction points in the shop. It enforces essential methods for querying available product types, grabbing items, checking for empty slots, and determining the appropriate behavioral state (e.g., Dine-In, Normal) for a customer interacting with the object. It also mandates the methods required for NPC employees to handle their shelf-restocking logic.</li>
                
                                <li><strong>ShopInteractable:</strong> This abstract class (ShopInteractable.cs) inherits from PlaceableObject and implements the IShopInteraction interface. It encapsulates the common behaviors for all shelves or interactive cabinets in the store. By managing a list of InteractPoints, it dynamically calculates exactly where a customer should stand (finding the nearest empty spot) when approaching a shelf. It also manages shared operations like triggering door open/close animations (for coolers) and manual shelf-filling logic.</li>
                
                                <li><strong>ShelfCabinet:</strong> This class (ShelfCabinet.cs) is a concrete implementation of ShopInteractable and acts as the manager for large cabinets containing multiple individual shelves (e.g., supermarket aisles). It aggregates data from its child NewShelf objects, calculating total occupancy rates, identifying which product types are currently stocked, and determining the exact number of empty or filled slots available. Crucially, it includes logic to handle the destruction of the object—if the cabinet is removed, it automatically converts any remaining products back into physical supply boxes (SupplyBox) and drops them into the world to prevent data loss.</li>
                            </ul>`
                },
                {
                    icon: '🧑‍🏭',
                    title: 'Employee Base & Control System',
                    content: `<ul>
                                <li><strong>Abstract Base Foundation (BaseEmployee.cs):</strong> Acts as the core framework for every employee in the game. It manages essential data such as morale, daily work hours, dialogue triggers, and Inverse Kinematics (IK) targeting. This ensures all employees share a standardized method for pathfinding, animating, and interacting with physical objects.</li>
                                <li><strong>Robust State Machine Architecture:</strong> Utilizes the IEmployeeState interface to enforce a strict state machine (EnterState, UpdateState, ExitState). This allows an employee to safely and cleanly transition between complex behaviors—such as dropping a mop to immediately take over a busy cash register without causing logic conflicts or animation glitches.</li>
                                <li><strong>Centralized Lifecycle Manager (ShopEmployeeController.cs):</strong> This component oversees all staff within a specific shop. It constantly monitors the in-game clock against each employee's schedule, determining exactly when they should clock in. It handles spawning them at designated staff points and despawning them when their shift concludes.</li>
                                <li><strong>Asynchronous Addressable Spawning:</strong> To heavily optimize memory, the employee controller dynamically loads 3D character models at runtime using Unity Addressables. It intelligently evaluates the employee's gender and assigned primary task to spawn them with the correct visual prefab (e.g., assigning a barista apron versus a janitor uniform).</li>
                                <li><strong>Environmental Morale System:</strong> Employees are deeply reactive to their workplace. Every in-game hour, the base script evaluates the shop's overall cleanliness and decor rating. If the player forces them to work in a dirty or poorly decorated store, their morale slowly drains, which dynamically reduces their task efficiency and can eventually lead to them quitting.</li>
                            </ul>`
                },
                {
                    icon: '🏪',
                    title: 'Market Employee System',
                    content: `<ul>
                                <li><strong>Market Employee Initialization (MarketEmployee.cs & MarketInitialState.cs):</strong> Provides the concrete implementation for supermarket staff. When a shift starts, the initial state directs the employee to navigate to the staff room, equip themselves, evaluate their assigned role (Stocker, Cashier, Cleaner), and find the nearest station requiring their attention.</li>
                                <li><strong>Automated Cashier Workflow (MarketRegisterState.cs):</strong> This state fully automates the checkout process. The AI takes ownership of an empty CashRegister, detects when a customer arrives, and sequentially triggers barcode scanning animations for every item in the customer's cart. The speed of scanning is directly calculated based on the employee's specific "Register" skill level and current morale.</li>
                                <li><strong>Aisle & Shelf Stocking Logic:</strong> Market stockers actively scan the shop's ShelfSaveDTOs to identify empty slots. They automatically locate the correct supply boxes in the storage room or delivery truck, carry them to the aisles using IK hands, and play stocking animations until the shelf is full or the box is empty.</li>
                                <li><strong>Safe Exit Protocol (MarketEmployeeExitState.cs):</strong> Ensures a bug-free end to a shift. If an employee's time is up while they are holding a box or operating a register, this state forces them to safely place the item down, unregister themselves from the interaction point, and walk out of the store before being destroyed by the system.</li>
                            </ul>`
                },
                {
                    icon: '☕',
                    title: 'Cafe Employee System',
                    content: `<ul>
                                <li><strong>Cafe Employee Specialization (CafeEmployee.cs):</strong> A tailored version of the employee system built for the intricate, multi-step workflows of a coffee shop. It acts as the brain for specialized roles like Baristas, who must interact with complex machinery rather than just simple shelves.</li>
                                <li><strong>Advanced Barista Mechanics:</strong> The barista states manage the entire drink preparation pipeline. The AI employee receives the order data, walks to the CoffeeShopMachine, verifies that all necessary ingredients (milk, water, beans) are adequately stocked, triggers the brewing process, and waits for the specific recipe timer to finish.</li>
                                <li><strong>Dessert & Tray Assembly:</strong> Unlike market stockers, cafe employees must handle serving mechanics. They are programmed to interact with dessert display cases, slice cakes, and assemble multiple items (like a coffee and a pastry) onto a physical Tray object using two-handed IK, before delivering it to the customer pickup point.</li>
                                <li><strong>Cafe-Specific Cleaning Routines:</strong> The cleaning states in the cafe are adapted to handle Dine-In customers. In addition to mopping procedural dirt decals from the floor and taking out the trash, cafe cleaners monitor customer tables, clearing away empty coffee cups and plates left behind after a customer finishes their meal.</li>
                            </ul>`
                },
                {
                    icon: '🔊',
                    title: 'Sound System & Asset Management',
                    content: `<ul>
                                <li><strong>Central Sound Manager (SoundManager.cs):</strong> A singleton system that coordinates all audio in the game (music, ambient sounds, and one-shot effects) and persists across scenes using DontDestroyOnLoad. It also provides specialized methods for configuring 3D spatial audio behavior such as distance-based attenuation.</li>
                                <li><strong>Asynchronous Audio Loading with Addressables:</strong> The SoundManager does not preload all audio assets into memory. Instead, it loads grouped audio assets on demand using Unity Addressables based on SoundPacketKeys, ensuring efficient runtime memory usage.</li>
                                <li><strong>Automated Memory Cleanup (Garbage Collection):</strong> Audio assets are monitored over in-game time. Sounds that are not used for a defined duration (e.g., 2 in-game hours) are automatically released via Addressables.Release to prevent memory bloat and optimize performance.</li>
                                <li><strong>Flexible Audio Configuration (SoundDataConfig.cs):</strong> Audio settings such as volume, loop behavior, and AudioMixer group assignments are stored in ScriptableObject-based configurations. This allows designers to balance and tune audio behavior without modifying code.</li>
                            </ul>`
                },
                {
                    icon: '🌆',
                    title: 'Ambiance & Dynamic Audio',
                    content: `<ul>
                                <li><strong>Dynamic Ambient Sound Manager (AmbianceManager.cs):</strong> A system that dynamically switches background audio based on the player's location. When the player enters different sound zones (Triggers), it selects the highest-priority ambient sound, smoothly fading out the previous audio and fading in the new one.</li>
                                <li><strong>Day/Night Reactive Triggers (AmbianceTrigger.cs):</strong> Components placed in specific map regions (Forest, City, Bank, etc.) that detect player presence via colliders. They switch between DaySound and NightSound depending on the in-game time, creating a time-aware ambient system.</li>
                                <li><strong>NPC Reaction and Dialogue Sounds (AgentSounds.cs):</strong> A helper system that plays randomized audio effects for NPCs based on gender (Male/Female), including coughing, sneezing, thanking, and yawning. It enhances immersion by making NPCs feel more alive within the environment.</li>
                            </ul>`
                },
                {
                    icon: '🚚',
                    title: 'Supplier Manager & Ordering System',
                    content: `<ul>
                                <li><strong>Supplier Config & Initialization (SuppliersConfig.cs):</strong> A ScriptableObject that acts as the central registry for all purchasable non-consumable items (furniture, electronics, shelves, PC parts). It caches these items in a dictionary for rapid lookup by their SupplierName enum, ensuring that the system can instantly retrieve costs, decor values, and required player levels.</li>
                                <li><strong>Centralized Ordering Hub (SupplierManager.cs):</strong> A Singleton manager responsible for handling the logistical flow of purchasing equipment. When the player orders furniture, it dynamically spawns a SupplierTruck prefab at a designated delivery point, assigns the purchased items to it, and dispatches it along a predefined AI path to the player's shop.</li>
                                <li><strong>Asynchronous UI & Memory Optimization:</strong> To keep memory usage low, the manager asynchronously loads the UI icons for supplier items via Unity Addressables (LoadIcon, ReleaseIcon). It utilizes a reference-counting system (IconEntry) to ensure that an icon is only unloaded from RAM when no active UI elements are currently displaying it.</li>
                                <li><strong>Save & Load State Restoration:</strong> Includes critical logic for reconstructing the game state. Upon loading a save file, the manager reads a list of SupplierBoxSaveDTOs and re-instantiates all unopened supplier cardboard boxes precisely where the player left them, maintaining their physical coordinates and rotation in the world.</li>
                
                                <li><strong>Supplier Object Data (SupplierObject.cs & SupplierDTO):</strong> Every piece of equipment in the game has a SupplierObject component attached to its prefab. This component holds a SupplierDTO (Data Transfer Object) that defines all its commercial attributes: price, delivery time, aesthetic decor points, and structural type (e.g., whether it is a customer-interactable shelf or a cash register).</li>
                                <li><strong>Modular Categorization:</strong> Items are strictly categorized using flag-based enums like SupplierCategoryKey (Market, CoffeeShop, Car) and TypeOfPlaceableObject. This architecture allows the shop UI and quest systems to easily filter items, ensuring players can only buy items relevant to their current business type.</li>
                            </ul>`
                },
                {
                    icon: '🚚',
                    title: 'Logistics, Tech Shop & Physical Delivery Systems',
                    content: `<ul>
                                <li><strong>Supplier Delivery Truck (SupplierTruck.cs):</strong> Inheriting from a base CargoTruck class, this script manages the physical delivery vehicle. Upon receiving an order manifest (List&lt;SupplierDTO&gt;), it instantiates physical cardboard boxes (PlaceableObjectBox) in the truck's bed, assigning the correct product data to each box.</li>
                                <li><strong>AI Navigation Integration:</strong> The truck integrates directly with the OmniVehicleAi system (AIVehicleController). Once fully loaded, it follows a designated spline path (FirstPath) towards the shop's unloading zone. After unloading, it switches to a departure path (SecondPath) to exit the map, completing the supply chain loop seamlessly.</li>
                
                                <li><strong>Tech Shop Part DTO:</strong> The ShopPartDTO.cs defines a lightweight data structure used for purchasing items in the tech shop (like GPUs, coolers, or full mining PCs). It holds commercial data such as part type, payload, supplier name, price, and Addressable UI icon keys, enabling unified handling of all hardware types in the shop system.</li>
                
                                <li><strong>Phone Store Controller:</strong> The PhoneShopManager.cs orchestrates the in-game smartphone purchasing experience. It handles camera transitions into a dedicated shop view, manages 3D phone displays, processes payments, applies quest-based discounts (e.g., tutorial free phone), and swaps the player's held phone model after purchase.</li>
                
                                <li><strong>GPU Store Trigger:</strong> The GPUShopInteractionSystem.cs is a simple world interactable that opens the GPU shop UI. When the player interacts with a physical terminal or object, it delegates control to the UI PanelManager, opening the GPUShopPanel where mining hardware can be browsed and purchased.</li>
                            </ul>`
                },
                {
                    icon: '🖥️',
                    title: 'Central UI Orchestrator (Panel Manager System)',
                    content: `<ul>
                                <li><strong>Central UI Orchestrator (PanelManager.cs):</strong> This script acts as the global Singleton manager for opening and closing all User Interface panels in the game. Rather than keeping direct references to dozens of UI objects, it uses a PanelKey enum to dynamically fetch panels from a PanelManagerReferenceHolder, keeping the codebase clean and modular.</li>
                                <li><strong>Player Restriction System:</strong> When a panel opens, the manager automatically applies specific gameplay restrictions (PanelRestriction) to the player. It can restrict movement, camera look, or both (FullRestriction). If multiple panels are open simultaneously, it dynamically calculates and applies the strictest necessary restriction to prevent unwanted player actions while navigating menus.</li>
                                <li><strong>Cursor and HUD Control:</strong> The manager handles hiding and showing the mouse cursor based on the current UI state, automatically unlocking the cursor when menus are active and hiding it during normal gameplay. It also includes logic to temporarily hide the main in-game HUD (e.g., money, minimap) when full-screen panels are opened, ensuring a clean interface.</li>
                            </ul>`
                },
                {
                    icon: '🚗',
                    title: 'Vehicle Damage & Value System',
                    content: `<ul>
                                <li><strong>Multi-Point Vehicle Damage System:</strong> Vehicles feature a detailed damage model where overall damage is calculated based on multiple independent mesh regions. Each hit area contributes differently to the total damage value, resulting in a more realistic and dynamic condition system.</li>
                                <li><strong>Value Degradation Based on Condition:</strong> As damage increases across the vehicle, its market value decreases proportionally. Each damage component has its own weighted impact, meaning not all parts affect resale value equally.</li>
                                <li><strong>Segmented Damage Structure (Cars & Bikes):</strong> Cars are divided into 11 distinct damage zones, while motorcycles are divided into 4. Each zone has its own coefficient that influences both visual deformation and overall valuation loss.</li>
                                <li><strong>Mileage-Based Depreciation:</strong> Every kilometer driven contributes to long-term vehicle depreciation. Even without visible damage, usage alone gradually reduces the vehicle's resale value over time.</li>
                                <li><strong>Persistent Repair System:</strong> When a vehicle is repaired, its condition is visually restored; however, replaced parts remain permanently flagged as "changed," preserving historical wear data for deeper simulation realism.</li>
                                <li><strong>Wash & Dirt Decal System:</strong> Vehicles feature a dynamic cleanliness system where dirt accumulates over time and is represented through decal layers. Washing the vehicle removes dirt visually but does not affect underlying wear or damage values.</li>
                            </ul>`
                },
            ],
            tech: ['Unity', 'C#', 'Simulation', 'Economy Systems', 'Addressables'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/MoneySimulator_Img1',
                'https://res.cloudinary.com/dqglovh7w/image/upload/MoneySimulator_Thumbnail'
            ],
            links: [
                {
                    type: 'steam',
                    label: 'Play Demo (Brokeville)',
                    url: 'https://store.steampowered.com/app/3555430/Money_Simulator_Brokeville_Free_Prologue/'
                },
                {
                    type: 'steam',
                    label: 'View Full Game on Steam',
                    url: 'https://store.steampowered.com/app/2994190/Money_Simulator/'
                }
            ]
        },
        'first-person-shooter': {
            title: 'First Person Shooter',
            subtitle: 'Comprehensive FPS game with custom-built systems and advanced mechanics',
            overview: 'A detailed and immersive First Person Shooter game built entirely from scratch using custom systems and code. This project showcases deep technical expertise across multiple game systems including advanced gameplay mechanics, sophisticated AI, environmental interactions, and performance optimization. Every system was developed to enhance both technical skills and create a polished, enjoyable gaming experience.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/Y_QqOmzNLzQ?si=bTY2aoJLR0RuabB8',
            features: [
                'FPS Gameplay Mechanics: Smooth shooting with camera shake, weapon recoil, reload and run animations',
                'Advanced Weapon System: Scriptable Object-based weapons with customizable bullet trails, spray patterns, and dynamic sound variations',
                'Optimized Zombie AI: Object Pooling spawn system with proximity-based activation, ragdoll limb detachment, and sound-reactive behaviors',
                'Intelligent Damage System: Body-part-specific damage calculation with distance-based scaling',
                'Dynamic Day & Night System: Immersive Post Processing effects that change with time of day',
                'Realistic Audio Design: Position-based water sounds and surface-dependent footstep audio',
                'Survival Mechanics: Fatigue system, low-health heartbeat audio, and item recovery animations',
                'Atmospheric Gameplay: Ambient zombie sounds, radar system for tracking enemies, and helicopter extraction endgame',
                'Loot and Inventory: Functional resource collection system with inventory management for survival strategy',
                'Performance Optimization: Addressables for asset management and Object Pooling for efficient resource usage'
            ],
            tech: ['Unity', 'C#', 'Scriptable Objects', 'Object Pooling', 'Addressables', 'Post Processing', 'Ragdoll Physics', 'Audio Management', 'AI Systems', 'Inventory Systems'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/FPS_Thumbnail'
            ],
            links: [
                {
                    type: 'github',
                    label: 'GitHub Repository',
                    url: 'https://github.com/TayfurSafakGencay/First-Person-Shooter'
                },
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=Y_QqOmzNLzQ'},
                {type: 'itch', label: 'Play on Itch.io', url: 'https://safak-gencay.itch.io/first-person-shooter'}
            ]
        },
        'tile-busters-clone': {
            title: 'Tile Busters (Clone)',
            subtitle: 'Under-one-week clone project with progression-focused systems',
            overview: 'In under a week, I successfully developed a clone of the widely popular mobile game Tile Busters. The project focused on recreating the core puzzle loop while integrating retention-oriented systems in a clean architecture.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/tKGh7rNmHRs',
            features: [
                'Singleton-based manager structure for consistent gameplay flow',
                'Battle Pass system foundation for player progression tracking',
                'Basic skin system for cosmetic customization',
                'Rapid clone delivery with maintainable code organization'
            ],
            tech: ['Unity', 'C#', 'Singleton', 'Battle Pass System', 'Basic Skin System'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/TileBustersClone_Thumbnail'
            ],
            links: [
                {type: 'github', label: 'GitHub Repository', url: 'https://github.com/TayfurSafakGencay/TileBusters'},
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=tKGh7rNmHRs'}
            ]
        },
        'royal-match-clone': {
            title: 'Royal Match (Clone)',
            subtitle: '4-person company case study with clear role distribution and production delivery',
            overview: 'Our team of four successfully completed this company-assigned case project by dividing responsibilities across gameplay, art, UI polish, and backend systems. Tayfur Safak Gencay handled gameplay mechanics, Hulya Senol focused on art design, Emre Demirci delivered UI and visual improvements, and Tamer Erdogan implemented login-register flow, data saving, leaderboard systems, and player stats.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/TKk2-FOAemo',
            features: [
                'Firebase-backed login/register flow, save data, and persistent player stats',
                'Leaderboard system for competitive progression and replay motivation',
                'Gameplay mechanics and custom interactions designed for match-3 readability',
                'Different level designs with escalating challenge and pacing control',
                'Custom pieces including vertical rocket, horizontal rocket, bomb, rainbow, and obstacle',
                'UI and visual polish pass for stronger feedback and better clarity'
            ],
            tech: ['Unity', 'C#', 'Firebase', 'Leaderboard System', 'Login & Register', 'Singleton', 'Custom Interactions'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/RoyalMatchClone_Thumbnail'
            ],
            links: [
                {
                    type: 'github',
                    label: 'GitHub Repository',
                    url: 'https://github.com/TayfurSafakGencay/Velo-Games-Case-3-Match-3'
                },
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=TKk2-FOAemo'}
            ]
        },
        'ball-blast-clone': {
            title: 'Ball Blast (Clone)',
            subtitle: 'Under-one-week clone project focused on fast execution and clean core loop',
            overview: 'Ball Blast (Clone) was completed in under a week as a compact mobile clone exercise. The main focus was to recreate the addictive core loop with stable game flow and rapid content iteration.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/8x0wWxZsJKo',
            features: [
                'Singleton-based managers for streamlined game state flow',
                'Dynamic level system for scalable pacing and progression',
                'Fast clone production with maintainable architecture',
                'Mobile-friendly balancing focused on short sessions'
            ],
            tech: ['Unity', 'C#', 'Singleton', 'Dynamic Level System'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/BallBlastClone_Thumbnail'
            ],
            links: [
                {
                    type: 'github',
                    label: 'GitHub Repository',
                    url: 'https://github.com/TayfurSafakGencay/Ball-Blast-Clone'
                },
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=8x0wWxZsJKo'}
            ]
        },
        'parking-order-clone': {
            title: 'Parking Order (Clone)',
            subtitle: 'Learning-focused clone project built to explore new systems and animation techniques',
            overview: 'Parking Order (Clone) was developed as an experimentation project to learn and apply new concepts in a production-like setup. The work focused on system design, rich animation flow, and polished UX feedback loops.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/WQJfEn1-JRo',
            features: [
                'Singleton architecture for predictable runtime flow',
                'Spline-driven movement and path control',
                'Chest opening animation sequences with layered feedback',
                '3D objects integrated into UI for richer presentation',
                'Advanced DOTween animation orchestration',
                'Cinemachine-based camera dynamics',
                'Animated shop interface and transitions'
            ],
            tech: ['Unity', 'C#', 'Singleton', 'Splines', 'DOTween', 'Cinemachine', 'StrangeIoC'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/ParkingOrderClone_Thumbnail'
            ],
            links: [
                {type: 'github', label: 'GitHub Repository', url: 'https://github.com/TayfurSafakGencay/ParkingOrder'},
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=WQJfEn1-JRo'}
            ]
        },
        'army-runner': {
            title: 'Army Runner',
            subtitle: 'Runner case project with weapon systems, formations, and performance-focused architecture',
            overview: 'Army Runner is a distinct runner-genre project that focuses on scalable systems and clean performance. It combines a flexible gun setup, formation logic, and pooled runtime objects to keep gameplay smooth across long sessions.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/3QhUjTna_6U',
            features: [
                'Singleton-based managers for coordinated gameplay flow',
                'Advanced ScriptableObject gun system for modular weapon behavior',
                'Object Pooling across recurring entities and effects',
                'Optimization through manager-based lifecycle control',
                'Multiple weapon types with distinct gameplay roles',
                'Formation mechanics for grouped unit behavior',
                'Animation system with layer-based blending'
            ],
            tech: ['Unity', 'C#', 'Singleton', 'ScriptableObjects', 'Object Pooling', 'Animation Layers', 'Formation Systems'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/ArmyRunnerCoverPhoto'
            ],
            links: [
                {type: 'github', label: 'GitHub Repository', url: 'https://github.com/TayfurSafakGencay/ArmyRunner'},
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=3QhUjTna_6U'}
            ]
        },
        'nuts-and-bolts': {
            title: 'Nuts & Bolts',
            subtitle: 'Two-person production project with handcrafted levels and custom bolt tooling',
            overview: 'Nuts & Bolts was successfully completed by a two-person team. We used mathematical structures such as Bezier Curve formulas and built a dedicated internal tool to quickly produce bolts in desired shapes. The project includes around 20 handcrafted levels.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/CSf8yAY2sx0',
            features: [
                'Bezier Curve based shape logic integrated into puzzle flow',
                'In-house bolt creation tool for fast iteration and content production',
                'Approximately 20 handcrafted levels with curated difficulty pacing',
                'Collaborative two-person workflow with clear ownership and delivery'
            ],
            tech: ['Unity', 'C#', 'Bezier Curve Formulas', 'StrangeIoC', 'Bolt Creation Tool'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/NutsAndBolts_Thumbnail'
            ],
            links: [
                {type: 'github', label: 'GitHub Repository', url: 'https://github.com/TayfurSafakGencay/NutPuzzle'},
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=CSf8yAY2sx0'}
            ]
        },
        'subway-surfers-prototype': {
            title: 'Subway Surfers (Prototype)',
            subtitle: '1-week case project built with StrangeIoC and limited assets',
            overview: 'This prototype was requested by a company as a one-week case project. The goal was to replicate the core loop of Subway Surfers under asset constraints while keeping architecture maintainable and iteration-friendly through StrangeIoC.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/jBqorRJgC-Y',
            features: [
                'StrangeIoC-based dependency structure for gameplay systems',
                'Highest score tracking and persistent score flow',
                'Enhanced garbage collector awareness for stable long sessions',
                'Object Pooling for recurring obstacles and pickups',
                'Infinite continuously running gameplay loop',
                'Randomly generated map segments for replayability'
            ],
            tech: ['Unity', 'C#', 'StrangeIoC', 'Object Pooling', 'Infinite Runner Systems', 'Procedural Map Generation'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/SubwaySurfersPrototype_yegtxl'
            ],
            links: [
                {
                    type: 'github',
                    label: 'GitHub Repository',
                    url: 'https://github.com/TayfurSafakGencay/Subway-Surf-Clone'
                },
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=jBqorRJgC-Y'}
            ]
        },
        'city-jam': {
            title: 'City Jam',
            subtitle: '4-day case project for a company evaluation process',
            overview: 'City Jam is a compact production-focused prototype completed in four days. The project demonstrates quick iteration, clear architecture decisions under time pressure, and practical feature delivery with clean gameplay flow.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/O9KSWeHabVA',
            features: [
                'Singleton-based manager structure for core game flow',
                'Render Texture usage for camera-driven gameplay visuals',
                'Rapid prototype delivery within a strict four-day deadline',
                'Focused scope with polished core interaction loop'
            ],
            tech: ['Unity', 'C#', 'Singleton', 'Render Texture'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/CityJam_Thumbnail'
            ],
            links: [
                {type: 'github', label: 'GitHub Repository', url: 'https://github.com/TayfurSafakGencay/CityJam'},
                {type: 'youtube', label: 'YouTube Short', url: 'https://www.youtube.com/shorts/O9KSWeHabVA'}
            ]
        },
        'blitz-busters-clone': {
            title: 'Blitz Busters (Clone)',
            subtitle: 'Clone project completed in about five days with a fast delivery target',
            overview: 'I completed Blitz Busters, a popular game in the mobile market, in about five days. This project focused on replicating a proven game concept efficiently within a short development window while keeping gameplay flow readable and stable.',
            videoEmbed: 'https://www.youtube-nocookie.com/embed/WGLQqhfnk50',
            features: [
                'Singleton-based architecture for core game flow and managers',
                'Dynamic level system for scalable progression and quick tuning',
                'Smooth transitions from 3D gameplay objects to 2D presentation layers',
                'Short-cycle production workflow optimized for rapid delivery'
            ],
            tech: ['Unity', 'C#', 'Singleton', 'Dynamic Level System', '3D to 2D Transitions'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/BlitzBustersClone_Thumbnail'
            ],
            links: [
                {type: 'github', label: 'GitHub Repository', url: 'https://github.com/TayfurSafakGencay/Blitz-Busters'},
                {type: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=WGLQqhfnk50'}
            ]
        },
        'polity': {
            title: 'Polity',
            subtitle: 'Strategic political simulation game with deep governance systems',
            overview: 'Polity is a strategic simulation game revolving around political management and governance. Set in a dynamically evolving world, players take on the role of a leader tasked with shaping the future of their nation. The game offers a deep and complex political system where decisions on policies, diplomacy, and economics significantly impact the game\'s outcome. Players navigate through various challenges such as managing internal conflicts, forging alliances, and addressing economic crises. Working on this major professional project allowed me to discover and develop skills in asset management, tool creation, FMOD integration, ScriptableObject systems, Addressables, Sprite Atlas, the StrangeIoC framework, multiplayer architectures, and server-client communications with asset bundles.',
            videoEmbed: '',
            features: [
                'Deep political management system with policy decisions affecting nation outcomes',
                'Complex diplomatic mechanics for alliance forming and conflict resolution',
                'Advanced economic systems with crisis management and resource allocation',
                'Dynamic world evolution responding to player decisions',
                'Multiplayer architecture for cooperative and competitive gameplay',
                'Server-Client communication with optimized asset delivery',
                'Professional asset management pipeline with Addressables',
                'FMOD audio integration for dynamic soundscapes',
                'StrangeIoC framework for modular system design',
                'Sprite Atlas optimization for performance',
                'Custom tool creation for development efficiency'
            ],
            tech: ['Unity', 'C#', 'FMOD', 'ScriptableObjects', 'Addressables', 'Asset Bundles', 'Sprite Atlas', 'StrangeIoC', 'Networking', 'Tool Development'],
            gallery: [
                'https://res.cloudinary.com/dqglovh7w/image/upload/Polity_Thumbnail',
                'https://res.cloudinary.com/dqglovh7w/image/upload/ClothGif_rtc9nx',
                'https://res.cloudinary.com/dqglovh7w/image/upload/PolityFarming_g5eztb',
                'https://res.cloudinary.com/dqglovh7w/image/upload/PolityJobs_vceoet',
                'https://res.cloudinary.com/dqglovh7w/image/upload/PolityDisco_lsmzna',
                'https://res.cloudinary.com/dqglovh7w/image/upload/PolityBuildCity_wih3pn',
                'https://res.cloudinary.com/dqglovh7w/image/upload/PolityChooseYourPath_vefn6g'
            ],
            links: [
                {
                    type: 'apple',
                    label: 'Apple App Store',
                    url: 'https://apps.apple.com/us/app/polity-online-role-playing/id1623977845'
                },
                {
                    type: 'steam',
                    label: 'Steam Store',
                    url: 'https://store.steampowered.com/app/1479480/Polity__Online_Role_Playing/'
                },
                {
                    type: 'google',
                    label: 'Google Play Store',
                    url: 'https://play.google.com/store/apps/details?id=com.jib.polity'
                },
                {type: 'website', label: 'Official Website', url: 'https://polityonline.com/'}
            ]
        },
        'strattle': {
            title: 'Strattle',
            subtitle: 'Ambitious multiplayer party game with full networked architecture (~28K LOC)',
            overview: 'Strattle is an ambitious multiplayer party game that merges two different game concepts. Despite a small team size, we developed a complete architecture including dedicated Client, Server, Database, and AI server entirely from scratch. The project encompasses ~28,044 lines of code with advanced networking, modular system design, and sophisticated editor tools for production efficiency.',
            videoEmbed: '',
            features: [
                'Riptide Networking for real-time multiplayer communication',
                'Protobuf serialization for efficient data transfer',
                'Complete Client-Server-Database-AI architecture',
                'StrangeIoC framework for modular system design',
                'MongoDB database integration on Digital Ocean',
                'Custom editor tools for Cursor, Sprite, Sound, Icon, Panel, Localization, Prefab Creation',
                'Asset Management with Addressables and Asset Bundles',
                'Sprite Atlas optimization for memory efficiency',
                'Discord Integration with Rich Presence and channel messaging',
                'Basic AI implementation for gameplay variety',
                'Async/Await patterns throughout codebase',
                'Assembly Definitions for organized project structure',
                'DOTween animation system for smooth visual effects'
            ],
            tech: ['Unity', 'C#', 'Riptide Networking', 'Protobuf', 'StrangeIoC', 'MongoDB', 'Digital Ocean', 'Swagger', 'Discord API', 'DOTween', 'Addressables', 'Asset Bundles', 'Sprite Atlas'],
            gallery: [],
            links: []
        }
    };

    const titleEl = document.getElementById('projectDetailTitle');
    const subtitleEl = document.getElementById('projectDetailSubtitle');
    const descEl = document.getElementById('projectDetailDescription');
    const videoWrapEl = document.getElementById('projectDetailVideoWrapper');
    // accordionContainer zaten yukarıda tanımlandı
    const techEl = document.getElementById('projectDetailTech');
    const galleryEl = document.getElementById('projectDetailGallery');
    const linksEl = document.getElementById('projectDetailLinks');
    const galleryWrapEl = galleryEl ? galleryEl.closest('.project-detail-gallery-wrap') : null;
    const featuresEl = document.getElementById('projectDetailFeatures');

    let lastFocusedCard = null;
    let lightboxLastFocused = null;

    const lightbox = document.createElement('div');
    lightbox.className = 'project-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
        <button class="project-lightbox-close" aria-label="Close image preview">&times;</button>
        <img class="project-lightbox-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="Full size screenshot preview" />
    `;
    document.body.appendChild(lightbox);

    const lightboxImageEl = lightbox.querySelector('.project-lightbox-image');
    const lightboxCloseEl = lightbox.querySelector('.project-lightbox-close');

    function openLightbox(src, alt, sourceElement) {
        if (!lightboxImageEl) return;
        lightboxLastFocused = sourceElement || null;
        lightboxImageEl.src = src;
        lightboxImageEl.alt = alt || 'Project screenshot';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        lightboxCloseEl.focus();
    }

    function closeLightbox() {
        if (!lightbox.classList.contains('active')) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImageEl) lightboxImageEl.src = '';
        if (lightboxLastFocused) {
            lightboxLastFocused.focus();
        }
    }

    function createYouTubeFrame(src, title) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = `${title} video preview`;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        return iframe;
    }

    function getProjectLinkIcon(link) {
        const kind = (link.type || '').toLowerCase();
        const url = (link.url || '').toLowerCase();

        if (kind === 'github' || url.includes('github.com')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
        }

        if (kind === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
        }

        if (kind === 'itch' || url.includes('itch.io')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM11 6h2v2h-2V6zm0 3h2v2h-2V9zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2z"/></svg>';
        }

        if (kind === 'apple' || url.includes('apps.apple.com')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
        }

        if (kind === 'steam' || url.includes('steampowered.com')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.255 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.497 1.009 2.455-.397.957-1.497 1.41-2.455 1.007zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.662 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/></svg>';
        }

        if (kind === 'google' || url.includes('play.google.com')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.18 23.76c.3.17.64.22.99.14l13.23-7.25-2.87-2.87-11.35 9.98zM.35 1.22C.13 1.57 0 2.01 0 2.54v18.92c0 .53.13.97.35 1.32l.07.07 10.6-10.6v-.25L.42 1.15l-.07.07zm20.41 9.7l-2.99-1.64-3.22 3.22 3.22 3.22 3-1.65c.86-.47.86-1.68-.01-2.15zM3.18.24L16.41 7.5l-2.87 2.87L2.19.39c.3-.17.65-.21.99-.15z"/></svg>';
        }

        if (kind === 'website' || url.includes('polityonline.com') || url.includes('.com')) {
            return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.02a15.65 15.65 0 00-1.38-5.01A8.03 8.03 0 0119.93 11zM12 4c.98 1.36 1.7 3.18 2.04 5H9.96C10.3 7.18 11.02 5.36 12 4zM4.07 13h3.02c.2 1.83.73 3.57 1.38 5.01A8.03 8.03 0 014.07 13zM4.07 11A8.03 8.03 0 018.47 5.99 15.65 15.65 0 007.09 11H4.07zm7.93 9c-.98-1.36-1.7-3.18-2.04-5h4.08c-.34 1.82-1.06 3.64-2.04 5zm3.53-1.99c.65-1.44 1.18-3.18 1.38-5.01h3.02a8.03 8.03 0 01-4.4 5.01z"/></svg>';
        }

        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 14L21 3"/><path d="M21 3h-7"/><path d="M21 3v7"/><path d="M21 14v7H3V3h7"/></svg>';
    }

    function fillProjectModal(project) {
        if (!titleEl || !subtitleEl || !descEl || !videoWrapEl || !techEl || !galleryEl || !linksEl) return;

        titleEl.textContent = project.title;
        subtitleEl.textContent = project.subtitle;
        descEl.textContent = project.overview;

        videoWrapEl.innerHTML = '';
        const videoSection = videoWrapEl.closest('.project-detail-video');
        if (project.videoEmbed) {
            videoWrapEl.appendChild(createYouTubeFrame(project.videoEmbed, project.title));
            if (videoSection) videoSection.style.display = '';
        } else {
            if (videoSection) videoSection.style.display = 'none';
        }

        const featuresContainer = featuresEl ? featuresEl.parentElement : null;
        // accordionWrapper ve accordionContainer fonksiyon başında tanımlı

        if (project.accordion) {
            if (featuresContainer) featuresContainer.style.display = 'none';
            if (accordionWrapper) accordionWrapper.style.display = '';

            accordionContainer.innerHTML = '';
            project.accordion.forEach((item, idx) => {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                if (idx === 0) accordionItem.classList.add('active');

                accordionItem.innerHTML = `
                    <div class="accordion-header">
                        <div class="accordion-title">
                            <div class="accordion-icon">${item.icon}</div>
                            <h5>${item.title}</h5>
                        </div>
                        <div class="accordion-arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="accordion-content">
                        <div class="accordion-body">
                            ${item.content}
                        </div>
                    </div>
                `;

                const header = accordionItem.querySelector('.accordion-header');
                header.addEventListener('click', () => {
                    accordionItem.classList.toggle('active');
                });

                accordionContainer.appendChild(accordionItem);
            });
        } else {
            if (featuresContainer) featuresContainer.style.display = '';
            if (accordionWrapper) accordionWrapper.style.display = 'none';

            if (featuresEl) {
                featuresEl.innerHTML = '';
                if (project.features) {
                    project.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        featuresEl.appendChild(li);
                    });
                }
            }
        }

        techEl.innerHTML = '';
        project.tech.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'project-detail-chip';
            chip.textContent = item;
            techEl.appendChild(chip);
        });

        galleryEl.innerHTML = '';
        if (!project.gallery || project.gallery.length === 0) {
            if (galleryWrapEl) {
                galleryWrapEl.style.display = 'none';
            }
        } else {
            if (galleryWrapEl) {
                galleryWrapEl.style.display = '';
            }

            project.gallery.forEach((src, index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'project-gallery-item';
                button.setAttribute('aria-label', `Open ${project.title} screenshot ${index + 1} in full screen`);

                const img = document.createElement('img');
                img.src = src;
                img.alt = `${project.title} screenshot ${index + 1}`;
                img.loading = 'lazy';

                button.appendChild(img);
                button.addEventListener('click', () => {
                    openLightbox(src, img.alt, button);
                });
                galleryEl.appendChild(button);
            });
        }

        linksEl.innerHTML = '';
        const linksSection = linksEl.closest('.project-detail-links-wrap');
        if (project.links && project.links.length > 0) {
            project.links.forEach(link => {
                const anchor = document.createElement('a');
                anchor.href = link.url;
                anchor.className = 'project-detail-link';
                anchor.innerHTML = `${getProjectLinkIcon(link)}<span class="sr-only">${link.label}</span>`;
                anchor.title = link.label;
                anchor.setAttribute('aria-label', link.label);
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                linksEl.appendChild(anchor);
            });
            if (linksSection) linksSection.style.display = '';
        } else {
            if (linksSection) linksSection.style.display = 'none';
        }
    }

    function openProjectModal(projectId, sourceCard) {
        const project = projectDetailsData[projectId];
        if (!project) return;

        fillProjectModal(project);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lastFocusedCard = sourceCard || null;
        closeBtn.focus();
    }

    function closeProjectModal() {
        if (!modal.classList.contains('active')) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        const iframe = modal.querySelector('iframe');
        if (iframe) iframe.src = '';

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }
    }

    projectGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card[data-project-id]');
        if (card) {
            if (e.target.closest('a') || e.target.closest('.project-card-action-link')) {
                return;
            }
            const projectId = card.getAttribute('data-project-id');
            openProjectModal(projectId, card);
        }
    });

    closeBtn.addEventListener('click', closeProjectModal);
    lightboxCloseEl.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
            return;
        }

        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

// Add smooth reveal animation for sections
function initSectionReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(section);
    });

    // Hero section should be visible from start
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }
}

// 3D Carousel functionality
function init3DCarousel() {
    const carousel = document.getElementById('carousel3d');
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const container = document.querySelector('.carousel-3d-container');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (!carousel || items.length === 0) return;

    let currentIndex = 0;
    let isAutoRotating = true;
    let autoRotateInterval;

    // Testimonial data
    const testimonialsData = [
        {
            name: 'Ahmet Yılmaz',
            position: 'CEO',
            company: 'TechStart',
            avatar: '👨‍💼',
            rating: '⭐⭐⭐⭐⭐',
            testimonial: 'Harika bir deneyim! Projeyi zamanında ve beklentilerimizin ötesinde teslim etti. Teknik bilgisi ve iletişimi mükemmeldi. Her aşamada düzenli bilgilendirme yaptı ve önerilerle projeyi daha da iyileştirdi. Kesinlikle tekrar çalışmak isterim ve herkese tavsiye ederim.',
            date: 'Ocak 2024',
            projectType: 'E-Ticaret Platformu',
            duration: '3 Ay',
            result: 'Başarılı - %150 Performans Artışı',
            technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Redis'],
            accordion: [
                {
                    icon: '🎯',
                    title: 'Proje Kapsamı',
                    content: `<p>Sıfırdan modern bir e-ticaret platformu geliştirdik. Platform şunları içeriyor:</p>
                    <ul>
                        <li><strong>Ürün Yönetimi:</strong> Admin paneli ile kolay ürün ekleme/düzenleme</li>
                        <li><strong>Sepet Sistemi:</strong> Gerçek zamanlı sepet güncellemeleri</li>
                        <li><strong>Ödeme Entegrasyonu:</strong> Stripe ve iyzico entegrasyonu</li>
                        <li><strong>Kullanıcı Yönetimi:</strong> JWT tabanlı güvenli authentication</li>
                        <li><strong>Sipariş Takibi:</strong> Detaylı sipariş takip sistemi</li>
                    </ul>`
                },
                {
                    icon: '⚡',
                    title: 'Teknik Özellikler',
                    content: `<p>Performans ve güvenlik odaklı geliştirme yapıldı:</p>
                    <ul>
                        <li><strong>Performance:</strong> Lazy loading, code splitting, image optimization</li>
                        <li><strong>SEO:</strong> Server-side rendering, meta tags, sitemap</li>
                        <li><strong>Security:</strong> XSS koruması, CSRF tokens, rate limiting</li>
                        <li><strong>Caching:</strong> Redis ile hızlı data caching</li>
                        <li><strong>Monitoring:</strong> Error tracking ve analytics entegrasyonu</li>
                    </ul>
                    <div class="accordion-highlight">
                        <p>💡 Sayfa yükleme süresi 3 saniyeden 0.8 saniyeye düştü!</p>
                    </div>`
                },
                {
                    icon: '📊',
                    title: 'Sonuçlar',
                    content: `<p>Proje başarıyla tamamlandı ve şu sonuçlar elde edildi:</p>
                    <ul>
                        <li><strong>Performans:</strong> %150 hız artışı</li>
                        <li><strong>Conversion:</strong> %85 daha fazla satış</li>
                        <li><strong>Kullanıcı Memnuniyeti:</strong> 4.8/5 yıldız</li>
                        <li><strong>Mobile Traffic:</strong> %120 artış</li>
                        <li><strong>SEO:</strong> Google'da ilk sayfada yer alma</li>
                    </ul>`
                }
            ]
        },
        {
            name: 'Zeynep Kaya',
            position: 'Kurucu',
            company: 'ShopHub',
            avatar: '👩‍💻',
            rating: '⭐⭐⭐⭐⭐',
            testimonial: 'Profesyonel yaklaşımı ve yaratıcı çözümleri sayesinde e-ticaret sitemiz harika oldu. Kullanıcı deneyimi çok iyi tasarlanmış. Modern ve responsive bir tasarım ile müşteri memnuniyetimiz arttı. Proje yönetimi konusunda da çok başarılıydı. Çok teşekkürler!',
            date: 'Şubat 2024',
            projectType: 'Web Uygulaması',
            duration: '2.5 Ay',
            result: 'Mükemmel - %200 Satış Artışı',
            technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Stripe', 'Docker'],
            accordion: [
                {
                    icon: '🎨',
                    title: 'UI/UX Tasarımı',
                    content: `<p>Kullanıcı odaklı modern tasarım geliştirdik:</p>
                    <ul>
                        <li><strong>User Research:</strong> Hedef kitle analizi ve persona oluşturma</li>
                        <li><strong>Wireframing:</strong> Low-fi ve high-fi prototipler</li>
                        <li><strong>Design System:</strong> Tutarlı component kütüphanesi</li>
                        <li><strong>Responsive:</strong> Tüm cihazlarda mükemmel görünüm</li>
                        <li><strong>Accessibility:</strong> WCAG 2.1 standartlarına uygun</li>
                    </ul>`
                },
                {
                    icon: '💼',
                    title: 'İş Sonuçları',
                    content: `<p>Platform işletmeye önemli değer kattı:</p>
                    <ul>
                        <li><strong>Satış Artışı:</strong> İlk 3 ayda %200 artış</li>
                        <li><strong>Müşteri Memnuniyeti:</strong> %95 pozitif geri bildirim</li>
                        <li><strong>Sipariş İşleme:</strong> %60 daha hızlı süreç</li>
                        <li><strong>Müşteri Geri Dönüşü:</strong> %75 tekrar alışveriş</li>
                    </ul>
                    <div class="accordion-highlight">
                        <p>🎉 Platform lansmanından sonra ilk 24 saatte 500+ sipariş!</p>
                    </div>`
                },
                {
                    icon: '🔧',
                    title: 'Entegrasyonlar',
                    content: `<p>Güçlü üçüncü parti entegrasyonlar:</p>
                    <ul>
                        <li><strong>Payment:</strong> Stripe ve iyzico ödeme sistemleri</li>
                        <li><strong>Shipping:</strong> Kargo firmaları API entegrasyonu</li>
                        <li><strong>CRM:</strong> Müşteri ilişkileri yönetimi</li>
                        <li><strong>Email:</strong> Otomatik email kampanyaları</li>
                        <li><strong>Analytics:</strong> Google Analytics ve custom dashboards</li>
                    </ul>`
                }
            ]
        },
        {
            name: 'Mehmet Demir',
            position: 'CTO',
            company: 'AppLab',
            avatar: '👨‍🎨',
            rating: '⭐⭐⭐⭐⭐',
            testimonial: 'Mobil uygulamamızı geliştirirken gösterdiği özveri ve kalite odaklı çalışması bizi çok etkiledi. Clean code prensiplerine bağlı kalarak, maintainable bir kod yazdı. Performance optimization konusunda da harika çözümler sundu. Sonuç gerçekten harika oldu!',
            date: 'Mart 2024',
            projectType: 'Mobil Uygulama',
            duration: '4 Ay',
            result: 'Olağanüstü - 4.8 Yıldız',
            technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript', 'Jest'],
            accordion: [
                {
                    icon: '📱',
                    title: 'Mobil Özellikler',
                    content: `<p>Cross-platform mobil uygulama özellikleri:</p>
                    <ul>
                        <li><strong>Native Performance:</strong> 60 FPS smooth animasyonlar</li>
                        <li><strong>Offline Mode:</strong> İnternet olmadan çalışabilme</li>
                        <li><strong>Push Notifications:</strong> Gerçek zamanlı bildirimler</li>
                        <li><strong>Biometric Auth:</strong> Touch ID / Face ID entegrasyonu</li>
                        <li><strong>Camera Integration:</strong> Fotoğraf ve video çekimi</li>
                        <li><strong>Location Services:</strong> GPS tracking özellikleri</li>
                    </ul>`
                },
                {
                    icon: '🧪',
                    title: 'Test & Quality',
                    content: `<p>Yüksek kalite standartları:</p>
                    <ul>
                        <li><strong>Unit Tests:</strong> %95 kod coverage</li>
                        <li><strong>Integration Tests:</strong> E2E test senaryoları</li>
                        <li><strong>UI Tests:</strong> Automated screenshot testing</li>
                        <li><strong>Performance Tests:</strong> Load ve stress testleri</li>
                        <li><strong>Code Review:</strong> Peer review süreci</li>
                    </ul>
                    <div class="accordion-highlight">
                        <p>✅ Crash-free rate: %99.8 - Industry best practices!</p>
                    </div>`
                },
                {
                    icon: '🚀',
                    title: 'Deployment & Updates',
                    content: `<p>Sorunsuz dağıtım ve güncelleme süreci:</p>
                    <ul>
                        <li><strong>CI/CD Pipeline:</strong> Otomatik build ve deployment</li>
                        <li><strong>Beta Testing:</strong> TestFlight ve Firebase App Distribution</li>
                        <li><strong>OTA Updates:</strong> CodePush ile anında güncellemeler</li>
                        <li><strong>Store Optimization:</strong> ASO ve listing optimization</li>
                        <li><strong>Analytics:</strong> Crashlytics ve user behavior tracking</li>
                    </ul>`
                }
            ]
        },
        {
            name: 'Ayşe Şahin',
            position: 'Proje Müdürü',
            company: 'DataViz',
            avatar: '👩‍💼',
            rating: '⭐⭐⭐⭐⭐',
            testimonial: 'Dashboard uygulamamız için yaptığı tasarım ve kodlama çok başarılıydı. Ekibimizle mükemmel uyum sağladı. Complex data visualization konusunda expertise\'i sayesinde çok güçlü bir ürün ortaya çıktı. Deadline\'lara sadık kaldı. Kesinlikle tavsiye ederim!',
            date: 'Nisan 2024',
            projectType: 'Dashboard & Analytics',
            duration: '3.5 Ay',
            result: 'Harika - Kullanıcı Sayısı 5x',
            technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'WebSocket'],
            accordion: [
                {
                    icon: '📊',
                    title: 'Veri Görselleştirme',
                    content: `<p>İnteraktif ve anlaşılır data visualization:</p>
                    <ul>
                        <li><strong>Charts:</strong> Bar, line, pie, scatter plots</li>
                        <li><strong>Real-time:</strong> WebSocket ile canlı data updates</li>
                        <li><strong>Interactive:</strong> Drill-down ve filtering özellikleri</li>
                        <li><strong>Custom Widgets:</strong> Özelleştirilebilir dashboard bileşenleri</li>
                        <li><strong>Export:</strong> PDF, Excel, CSV export seçenekleri</li>
                    </ul>`
                },
                {
                    icon: '⚙️',
                    title: 'Backend & API',
                    content: `<p>Güçlü ve ölçeklenebilir backend altyapısı:</p>
                    <ul>
                        <li><strong>FastAPI:</strong> Hızlı ve modern Python framework</li>
                        <li><strong>Data Processing:</strong> Pandas ve NumPy ile analiz</li>
                        <li><strong>Caching:</strong> Redis ile query optimization</li>
                        <li><strong>Real-time:</strong> WebSocket connections</li>
                        <li><strong>Authentication:</strong> OAuth2 ve JWT security</li>
                    </ul>
                    <div class="accordion-highlight">
                        <p>⚡ API response time: Ortalama 150ms!</p>
                    </div>`
                },
                {
                    icon: '🎯',
                    title: 'Kullanıcı Etkisi',
                    content: `<p>Dashboard kullanıcılara sağladığı değerler:</p>
                    <ul>
                        <li><strong>Karar Verme:</strong> %70 daha hızlı analiz</li>
                        <li><strong>Verimlilik:</strong> Manuel işler %80 azaldı</li>
                        <li><strong>Görünürlük:</strong> Tüm metriklere tek yerden erişim</li>
                        <li><strong>Kullanıcı Sayısı:</strong> İlk ayda 5x artış</li>
                        <li><strong>Memnuniyet:</strong> %92 kullanıcı memnuniyeti</li>
                    </ul>`
                }
            ]
        }
    ];

    // Set initial positions
    function updateCarousel() {
        items.forEach((item, index) => {
            // Calculate position relative to current index
            let position = index - currentIndex;

            // Normalize position to -2 to 2 range
            if (position > 2) position -= items.length;
            if (position < -2) position += items.length;

            item.setAttribute('data-position', position);

            // Add active class to center item
            if (position === 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Navigation functions
    function goToNext() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
        stopAutoRotate();
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
        stopAutoRotate();
    }

    function stopAutoRotate() {
        isAutoRotating = false;
        clearInterval(autoRotateInterval);

        // Restart auto-rotation after 5 seconds of inactivity
        clearTimeout(container.inactivityTimeout);
        container.inactivityTimeout = setTimeout(() => {
            isAutoRotating = true;
            startAutoRotate();
        }, 5000);
    }

    // Arrow button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToNext();
        });
    }

    // Click handler for items
    items.forEach((item, index) => {
        // Single click - navigate or open modal
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            // If clicking the active item, open modal
            if (item.classList.contains('active')) {
                console.log('Opening modal for active item, index:', index);
                openModal(index);
            } else {
                // Otherwise, navigate to that item
                console.log('Navigating to index:', index);
                currentIndex = index;
                updateCarousel();
                stopAutoRotate();
            }
        });

        // Double click - always open modal for that item
        item.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            console.log('Double click - opening modal for index:', index);

            // If not already active, navigate first
            if (!item.classList.contains('active')) {
                currentIndex = index;
                updateCarousel();
            }

            // Then open modal
            setTimeout(() => {
                openModal(index);
            }, 100);
        });
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            stopAutoRotate();
        });
    });

    // Auto-rotate functionality
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (isAutoRotating) {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            }
        }, 5000);
    }

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    });

    // Mouse wheel navigation
    let wheelTimeout;
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        clearTimeout(wheelTimeout);

        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }, 50);
    }, {passive: false});

    // Modal functionality
    function openModal(index) {
        console.log('openModal called with index:', index);
        const modal = document.getElementById('testimonialModal');
        const data = testimonialsData[index];

        console.log('Modal element:', modal);
        console.log('Data:', data);

        if (!modal) {
            console.error('Modal element not found!');
            return;
        }

        if (!data) {
            console.error('Data not found for index:', index);
            return;
        }

        // Populate modal with data
        const modalAvatar = document.getElementById('modalAvatar');
        const modalName = document.getElementById('modalName');
        const modalPosition = document.getElementById('modalPosition');
        const modalRating = document.getElementById('modalRating');
        const modalTestimonial = document.getElementById('modalTestimonial');
        const modalDate = document.getElementById('modalDate');
        const modalProjectType = document.getElementById('modalProjectType');
        const modalDuration = document.getElementById('modalDuration');
        const modalResult = document.getElementById('modalResult');

        if (modalAvatar) modalAvatar.textContent = data.avatar;
        if (modalName) modalName.textContent = data.name;
        if (modalPosition) modalPosition.textContent = `${data.position}, ${data.company}`;
        if (modalRating) modalRating.textContent = data.rating;
        if (modalTestimonial) modalTestimonial.textContent = data.testimonial;
        if (modalDate) modalDate.textContent = data.date;
        if (modalProjectType) modalProjectType.textContent = data.projectType;
        if (modalDuration) modalDuration.textContent = data.duration;
        if (modalResult) modalResult.textContent = data.result;

        // Populate technologies
        const techContainer = document.getElementById('modalTech');
        if (techContainer) {
            techContainer.innerHTML = '';
            data.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techContainer.appendChild(tag);
            });
        }

        // Populate accordion
        const accordionContainer = document.getElementById('modalAccordion');
        if (accordionContainer && data.accordion) {
            accordionContainer.innerHTML = '';
            data.accordion.forEach((item, idx) => {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                if (idx === 0) accordionItem.classList.add('active'); // First item open by default

                accordionItem.innerHTML = `
                    <div class="accordion-header">
                        <div class="accordion-title">
                            <div class="accordion-icon">${item.icon}</div>
                            <h5>${item.title}</h5>
                        </div>
                        <div class="accordion-arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="accordion-content">
                        <div class="accordion-body">
                            ${item.content}
                        </div>
                    </div>
                `;

                // Add click handler for accordion
                const header = accordionItem.querySelector('.accordion-header');
                header.addEventListener('click', () => {
                    accordionItem.classList.toggle('active');
                });

                accordionContainer.appendChild(accordionItem);
            });
        }

        // Show modal with animation
        console.log('Showing modal...');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Stop auto rotation when modal is open
        isAutoRotating = false;
        clearInterval(autoRotateInterval);

        console.log('Modal should be visible now');
    }

    function closeModal() {
        const modal = document.getElementById('testimonialModal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Restart auto rotation after modal closes
        setTimeout(() => {
            isAutoRotating = true;
            startAutoRotate();
        }, 1000);
    }

    // Modal close button
    const modalCloseBtn = document.getElementById('modalClose');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('testimonialModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('testimonialModal');
            if (modal && modal.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // Initialize
    updateCarousel();
    startAutoRotate();

    // Expose test function globally for debugging
    window.testModal = function (index) {
        console.log('Test modal called with index:', index);
        openModal(index);
    };

    console.log('🎠 3D Carousel initialized with arrow controls and modal!');
    console.log('💡 Modal test butonlarını kullanabilirsiniz!');
    console.log('💡 Veya aktif karta tıklayın / herhangi bir karta çift tıklayın');
}

// Add Easter egg: Konami code
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rainbow 2s infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
}

console.log('%c🚀 Portfolio Website', 'color: #6366f1; font-size: 24px; font-weight: bold;');
// console.log('%cBu site sevgiyle kodlandı ❤️', 'color: #8b5cf6; font-size: 16px;');
