// DOM元素选择器
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const ctaButtons = document.querySelectorAll('.cta-btn');
const modal = document.getElementById('demo-modal');
const modalClose = document.getElementById('modal-close');
const scrollIndicator = document.querySelector('.scroll-indicator');
const resultCards = document.querySelectorAll('.result-card');
const abstractCards = document.querySelectorAll('.abstract-card');
const resourceCards = document.querySelectorAll('.resource-card');
const authorLinks = document.querySelectorAll('.author-link');
const langButtons = document.querySelectorAll('.lang-btn');
const backToTopBtn = document.getElementById('back-to-top');

// 全局语言变量
let currentLanguage = 'en'; // 默认英文

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupEventListeners();
    createParticleEffect();
    setupScrollEffects();
    initializeLanguage();
    initializeComparisonSliders();
    initializeLazyLoading();
});

// 初始化动画效果
function initializeAnimations() {
    // 添加页面加载动画
    document.body.classList.add('loaded');
    
    // 设置交错动画延迟
    abstractCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + index * 0.2}s`;
    });
    
    resultCards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 + index * 0.2}s`;
    });
    
    resourceCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + index * 0.2}s`;
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 导航链接平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScrollTo);
    });
    
    // CTA按钮事件
    const paperBtn = document.getElementById('paper-btn');
    const arxivBtn = document.getElementById('arxiv-btn');
    const codeBtn = document.getElementById('code-btn');
    const demoBtn = document.getElementById('demo-btn');
    
    if (paperBtn) {
        paperBtn.addEventListener('click', showPaperAlert);
    }
    
    if (arxivBtn) {
        arxivBtn.addEventListener('click', showArxivAlert);
    }
    
    if (codeBtn) {
        codeBtn.addEventListener('click', showCodeAlert);
    }
    
    if (demoBtn) {
        demoBtn.addEventListener('click', showDemoModal);
    }
    
    // 模态框事件
    if (modalClose) {
        modalClose.addEventListener('click', closeDemoModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDemoModal();
            }
        });
    }
    
    // 滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 结果卡片点击事件
    resultCards.forEach(card => {
        card.addEventListener('click', handleResultCardClick);
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
    
    // 作者链接悬停效果
    authorLinks.forEach(link => {
        link.addEventListener('mouseenter', handleAuthorLinkHover);
        link.addEventListener('mouseleave', handleAuthorLinkLeave);
    });
    
    // 资源按钮事件
    document.querySelectorAll('.resource-btn').forEach(btn => {
        btn.addEventListener('click', handleResourceClick);
    });
    
    // 滚动指示器点击事件
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', scrollToAbstract);
    }
    
    // 键盘事件
    document.addEventListener('keydown', handleKeyPress);
    
    // 鼠标移动效果
    document.addEventListener('mousemove', handleMouseMove);
    
    // 语言切换按钮事件
    langButtons.forEach(btn => {
        btn.addEventListener('click', handleLanguageSwitch);
    });
    
    // 复制BibTeX按钮事件
    const copyBibtexBtn = document.getElementById('copy-bibtex');
    if (copyBibtexBtn) {
        copyBibtexBtn.addEventListener('click', copyBibtexToClipboard);
    }
    
    // 回到顶部按钮事件
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
}

// 平滑滚动功能
function smoothScrollTo(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // 导航栏高度补偿
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // 添加激活状态
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    }
}

// 滚动到摘要部分
function scrollToAbstract() {
    const abstractSection = document.getElementById('abstract');
    if (abstractSection) {
        abstractSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 回到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // 显示通知
    const messages = {
        'en': '⬆️ Scrolled to top',
        'zh': '⬆️ 已回到顶部'
    };
    showNotification(messages[currentLanguage], 'success');
}

// 处理滚动事件
function handleScroll() {
    const scrollY = window.scrollY;
    
    // 导航栏背景变化
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // 滚动指示器显隐
    if (scrollIndicator) {
        if (scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
    }
    
    // 视差效果
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05);
        shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // 元素进入视窗动画
    const animateElements = document.querySelectorAll('.abstract-card, .result-card, .resource-card');
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
    
    // 回到顶部按钮显隐控制
    if (backToTopBtn) {
        if (scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
}

// 这些函数已在文件末尾重新定义以支持多语言

function showDemoModal() {
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeDemoModal() {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// 这个函数已在文件末尾重新定义以支持多语言

// 卡片悬停效果
function handleCardHover() {
    this.style.transform = 'translateY(-15px) scale(1.02)';
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

function handleCardLeave() {
    this.style.transform = '';
}

// 作者链接交互
function handleAuthorLinkHover() {
    this.style.transform = 'scale(1.05)';
    this.style.transition = 'all 0.3s ease';
}

function handleAuthorLinkLeave() {
    this.style.transform = '';
}

// 这个函数已在文件末尾重新定义以支持多语言

// 键盘事件处理
function handleKeyPress(e) {
    // ESC键关闭模态框
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeDemoModal();
    }
    
    // 空格键滚动到下一部分
    if (e.key === ' ' && !modal.classList.contains('show')) {
        e.preventDefault();
        scrollToNext();
    }
}

// 滚动到下一部分
function scrollToNext() {
    const sections = ['#abstract', '#results', '#code'];
    const currentScroll = window.scrollY;
    
    for (let section of sections) {
        const element = document.querySelector(section);
        if (element && element.offsetTop > currentScroll + 100) {
            element.scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}

// 鼠标移动效果
function handleMouseMove(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        createCustomCursor();
    }
    
    // 更新光标位置
    updateCursorPosition(e.clientX, e.clientY);
    
    // 视差效果
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.02;
        shape.style.transform += ` translate(${x * speed * 20}px, ${y * speed * 20}px)`;
    });
}

// 创建自定义光标
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(240, 147, 251, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
}

// 更新光标位置
function updateCursorPosition(x, y) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = x - 10 + 'px';
        cursor.style.top = y - 10 + 'px';
    }
}

// 创建粒子效果
function createParticleEffect() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer);
    }
    
    document.body.appendChild(particleContainer);
}

// 创建单个粒子
function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: particleFloat ${duration}s infinite linear;
    `;
    
    container.appendChild(particle);
    
    // 粒子动画
    const keyframes = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
}

// 设置滚动效果
function setupScrollEffects() {
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察需要动画的元素
    const elementsToAnimate = document.querySelectorAll('.abstract-card, .result-card, .resource-card, .section-title');
    elementsToAnimate.forEach(el => observer.observe(el));
}



// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 1rem 1.5rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    `;
    
    // 设置通知内容样式
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    // 设置关闭按钮样式
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
    `;
    
    // 关闭按钮悬停效果
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.color = 'rgba(255, 255, 255, 1)';
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
        closeBtn.style.color = 'rgba(255, 255, 255, 0.8)';
        closeBtn.style.transform = 'scale(1)';
    });
    
    if (type === 'success') {
        notification.style.background = 'rgba(76, 175, 80, 0.95)';
        notification.style.color = 'white';
    } else if (type === 'info') {
        notification.style.background = 'rgba(33, 150, 243, 0.95)';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 关闭按钮事件
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // 自动关闭
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

// 关闭通知
function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 页面性能优化
function optimizePerformance() {
    // 延迟加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 防抖滚动事件
    let scrollTimeout;
    const originalScrollHandler = handleScroll;
    handleScroll = function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(originalScrollHandler, 16); // 60fps
    };
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', optimizePerformance);

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面可见时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// 语言切换功能
function initializeLanguage() {
    // 检查本地存储中是否有语言偏好
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        // 只有当保存的语言不是默认英文时才更新内容
        if (savedLanguage !== 'en') {
            updateLanguageContent(currentLanguage);
        }
    }
    
    // 设置语言按钮状态
    updateLanguageButtons(currentLanguage);
}

function handleLanguageSwitch() {
    const targetLanguage = this.getAttribute('data-lang');
    
    if (targetLanguage !== currentLanguage) {
        currentLanguage = targetLanguage;
        
        // 保存语言偏好到本地存储
        localStorage.setItem('preferred-language', currentLanguage);
        
        // 更新内容和按钮状态
        updateLanguageContent(currentLanguage);
        updateLanguageButtons(currentLanguage);
        
        // 显示切换通知
        const messages = {
            'en': '🌍 Language switched to English',
            'zh': '🌍 语言已切换为中文'
        };
        showNotification(messages[currentLanguage], 'success');
    }
}

function updateLanguageContent(lang) {
    // 获取所有有多语言数据的元素
    const multiLangElements = document.querySelectorAll('[data-en][data-zh]');
    
    multiLangElements.forEach(element => {
        const content = element.getAttribute(`data-${lang}`);
        if (content) {
            // 直接替换内容，避免重复
            if (content.includes('<')) {
                element.innerHTML = content;
            } else {
                element.textContent = content;
            }
        }
    });
    
    // 更新页面标题
    const titles = {
        'en': 'Depth Anything At Any Condition - Research Paper',
        'zh': 'Depth Anything At Any Condition - 研究论文'
    };
    document.title = titles[lang];
    
    // 更新HTML语言属性
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
}

function updateLanguageButtons(lang) {
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

// 更新按钮点击消息
function showPaperAlert() {
    const messages = {
        'en': '📄 Paper PDF will be released soon, stay tuned!',
        'zh': '📄 论文PDF即将发布，敬请关注！'
    };
    showNotification(messages[currentLanguage], 'info');
}

function showArxivAlert() {
    const messages = {
        'en': '📚 arXiv preprint will be available soon, stay tuned!',
        'zh': '📚 arXiv预印本即将发布，敬请关注！'
    };
    showNotification(messages[currentLanguage], 'info');
}

function showCodeAlert() {
    const messages = {
        'en': '💻 GitHub repository will be open sourced soon, stay tuned!',
        'zh': '💻 GitHub代码库即将开源，敬请期待！'
    };
    showNotification(messages[currentLanguage], 'info');
}

// 更新结果卡片点击消息
function handleResultCardClick() {
    const resultType = this.getAttribute('data-result');
    const messages = {
        'en': {
            'indoor': '🏠 Indoor Depth Estimation: High-precision 3D perception in complex indoor environments',
            'outdoor': '🌳 Outdoor Depth Estimation: Adapts to various outdoor lighting and weather conditions',
            'night': '🌙 Night Depth Estimation: Stable performance under extremely low lighting conditions',
            'weather': '⛈️ Adverse Weather: Robust performance under extreme weather conditions like rain, snow, and fog'
        },
        'zh': {
            'indoor': '🏠 室内深度估计：在复杂室内环境中实现高精度3D感知',
            'outdoor': '🌳 户外深度估计：适应各种户外光照和天气条件',
            'night': '🌙 夜间深度估计：在极低光照条件下保持稳定性能',
            'weather': '⛈️ 恶劣天气：在雨雪雾等极端天气下的鲁棒性表现'
        }
    };
    
    const message = messages[currentLanguage][resultType] || 'Experimental result details';
    showNotification(message, 'success');
    
    // 添加点击动画
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
}

// 更新资源按钮点击消息
function handleResourceClick(e) {
    e.preventDefault();
    const resourceType = this.querySelector('span').textContent;
    
    const messages = {
        'en': {
            'Visit GitHub': '🚀 GitHub repository will be online soon, stay tuned!',
            'Download Data': '📊 Dataset download links will be provided soon!',
            'Download Models': '🧠 Pre-trained models will be released soon!'
        },
        'zh': {
            '访问 GitHub': '🚀 GitHub代码库即将上线，敬请关注！',
            '下载数据': '📊 数据集下载链接即将提供！',
            '下载模型': '🧠 预训练模型即将发布！'
        }
    };
    
    const langMessages = messages[currentLanguage];
    const message = langMessages[resourceType] || langMessages[Object.keys(langMessages)[0]];
    showNotification(message, 'info');
    
    // 按钮点击动画
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
}

// 复制BibTeX到剪贴板
function copyBibtexToClipboard() {
    const bibtexText = document.getElementById('bibtex-text');
    const copyBtn = document.getElementById('copy-bibtex');
    const copyBtnSpan = copyBtn.querySelector('span');
    
    if (bibtexText) {
        // 创建一个临时文本区域
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = bibtexText.textContent;
        document.body.appendChild(tempTextArea);
        
        // 选择并复制文本
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // 移动端兼容
        
        try {
            document.execCommand('copy');
            
            // 更新按钮状态
            copyBtn.classList.add('copied');
            const originalText = copyBtnSpan.textContent;
            copyBtnSpan.setAttribute('data-en', 'Copied!');
            copyBtnSpan.setAttribute('data-zh', '已复制！');
            
            // 根据当前语言更新文本
            if (currentLanguage === 'zh') {
                copyBtnSpan.textContent = '已复制！';
            } else {
                copyBtnSpan.textContent = 'Copied!';
            }
            
            // 显示成功通知
            const messages = {
                'en': '📋 BibTeX citation copied to clipboard!',
                'zh': '📋 BibTeX引用已复制到剪贴板！'
            };
            showNotification(messages[currentLanguage], 'success');
            
            // 3秒后恢复按钮状态
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtnSpan.setAttribute('data-en', 'Copy');
                copyBtnSpan.setAttribute('data-zh', '复制');
                
                if (currentLanguage === 'zh') {
                    copyBtnSpan.textContent = '复制';
                } else {
                    copyBtnSpan.textContent = 'Copy';
                }
            }, 3000);
            
        } catch (err) {
            // 复制失败时的处理
            const errorMessages = {
                'en': '❌ Failed to copy. Please select and copy manually.',
                'zh': '❌ 复制失败，请手动选择并复制。'
            };
            showNotification(errorMessages[currentLanguage], 'info');
        }
        
        // 移除临时文本区域
        document.body.removeChild(tempTextArea);
    }
}

// 初始化对比滑块功能
function initializeComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        setupSliderInteraction(slider);
    });
    
    // 检查是否需要显示提示
    checkAndShowSliderHints(sliders);
}

function setupSliderInteraction(slider) {
    const handle = slider.querySelector('.slider-handle');
    const afterImage = slider.querySelector('.after-image');
    let isHovering = false;
    let sliderRect = slider.getBoundingClientRect();
    
    // 更新滑块边界
    function updateSliderRect() {
        sliderRect = slider.getBoundingClientRect();
    }
    
    // 更新滑块位置
    function updateSlider(x) {
        const rect = sliderRect;
        const relativeX = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        const percentage = relativeX * 100;
        
        // 更新滑块手柄位置
        handle.style.left = `${percentage}%`;
        
        // 更新after图片的裁剪路径
        afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`;
        
        // 更新标签显示状态
        updateLabelsVisibility(percentage);
    }
    
    // 更新标签可见性
    function updateLabelsVisibility(percentage) {
        const labels = slider.querySelector('.comparison-labels');
        if (!labels) return;
        
        const leftLabel = labels.querySelector('.label-left');
        const rightLabel = labels.querySelector('.label-right');
        
        if (leftLabel && rightLabel) {
            // 当滑块位置大于75%时隐藏左标签（滑块覆盖左标签区域）
            if (percentage < 25) {
                leftLabel.style.opacity = '0';
                leftLabel.style.transform = 'translateY(-10px)';
            } else {
                leftLabel.style.opacity = '1';
                leftLabel.style.transform = 'translateY(0)';
            }
            
            // 当滑块位置小于25%时隐藏右标签（滑块覆盖右标签区域）
            if (percentage > 75) {
                rightLabel.style.opacity = '0';
                rightLabel.style.transform = 'translateY(-10px)';
            } else {
                rightLabel.style.opacity = '1';
                rightLabel.style.transform = 'translateY(0)';
            }
        }
    }
    
    // 鼠标进入事件
    function handleMouseEnter(e) {
        isHovering = true;
        updateSliderRect();
        slider.style.cursor = 'ew-resize';
        
        // 立即更新滑块位置到鼠标位置
        updateSlider(e.clientX);
    }
    
    // 鼠标移动事件（悬停模式）
    function handleMouseMove(e) {
        if (!isHovering) return;
        
        // 实时跟随鼠标位置
        updateSlider(e.clientX);
    }
    
    // 鼠标离开事件
    function handleMouseLeave() {
        isHovering = false;
        
        // 可选：鼠标离开后保持当前位置，或重置到中心位置
        // 这里选择保持当前位置，让用户看到最后的对比效果
        slider.style.cursor = 'default';
    }
    
    // 触摸事件处理（移动端支持）
    function handleTouchStart(e) {
        updateSliderRect();
        const touch = e.touches[0];
        updateSlider(touch.clientX);
        e.preventDefault();
    }
    
    function handleTouchMove(e) {
        const touch = e.touches[0];
        updateSlider(touch.clientX);
        e.preventDefault();
    }
    
    // 绑定鼠标悬停事件（替代原来的拖拽事件）
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('mouseleave', handleMouseLeave);
    
    // 绑定触摸事件（移动端支持）
    slider.addEventListener('touchstart', handleTouchStart, { passive: false });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // 响应式处理 - 窗口大小改变时更新边界
    window.addEventListener('resize', updateSliderRect);
    
    // 防止图片拖拽
    const images = slider.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
    });
    
    // 初始化标签状态（滑块默认在50%位置，两个标签都显示）
    updateLabelsVisibility(50);
}

// 检查并显示滑块提示
function checkAndShowSliderHints(sliders) {
    const HINT_KEY = 'sliderHintShown';
    const hintShown = localStorage.getItem(HINT_KEY);
    
    // 如果是第一次访问，显示提示
    if (!hintShown) {
        // 给所有滑块添加显示提示的类
        sliders.forEach(slider => {
            slider.classList.add('show-hint');
        });
        
        // 4秒后标记为已显示，防止页面刷新时重复显示
        setTimeout(() => {
            localStorage.setItem(HINT_KEY, 'true');
            
            // 移除提示类
            sliders.forEach(slider => {
                slider.classList.remove('show-hint');
            });
        }, 4000);
    }
}

// 初始化懒加载功能
function initializeLazyLoading() {
    // 检查浏览器是否支持 Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // 提前50px开始加载
        });

        // 观察所有懒加载图片
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理：直接加载所有图片
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => loadImage(img));
    }
}

// 加载单个图片
function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // 显示加载状态
    const placeholder = img.parentElement.querySelector('.image-placeholder');
    if (placeholder) {
        placeholder.textContent = 'Loading...';
    }

    // 创建新图片对象进行预加载
    const imageLoader = new Image();
    
    imageLoader.onload = function() {
        // 图片加载完成后设置src并添加loaded类
        img.src = src;
        img.classList.add('loaded');
        
        // 隐藏占位符
        if (placeholder) {
            setTimeout(() => {
                placeholder.style.display = 'none';
            }, 300);
        }
        
        // 显示加载成功通知（仅teaser图片）
        if (img.classList.contains('teaser-image')) {
            const messages = {
                'en': '🖼️ Teaser image loaded successfully!',
                'zh': '🖼️ 预告图片加载成功！'
            };
            showNotification(messages[currentLanguage], 'success');
        }
    };
    
    imageLoader.onerror = function() {
        // 图片加载失败处理
        if (placeholder) {
            placeholder.textContent = 'Failed to load';
            placeholder.style.color = '#ff6b6b';
        }
        
        const messages = {
            'en': '❌ Failed to load image',
            'zh': '❌ 图片加载失败'
        };
        showNotification(messages[currentLanguage], 'error');
    };
    
    // 开始加载图片
    imageLoader.src = src;
}

// 预加载关键图片（可选）
function preloadCriticalImages() {
    const criticalImages = [
        'image/teaser.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// 导出主要函数（如果需要在其他地方使用）
window.PageInteractions = {
    showNotification,
    scrollToAbstract,
    scrollToTop,
    showDemoModal,
    closeDemoModal,
    switchLanguage: handleLanguageSwitch,
    getCurrentLanguage: () => currentLanguage,
    copyBibtex: copyBibtexToClipboard,
    initializeComparisonSliders,
    initializeLazyLoading,
    preloadCriticalImages
}; 