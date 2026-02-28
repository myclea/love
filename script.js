// Initialize AOS
AOS.init({
    duration: 1000,
    once: false
});

// Particles.js Config for falling Sakura
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": ["#ffb7c5", "#ffc0cb", "#ffffff"] },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.7, "random": true },
        "size": { "value": 5, "random": true },
        "line_linked": { "enable": false },
        "move": { "enable": true, "speed": 2, "direction": "bottom", "random": true, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "push" } },
        "modes": { "bubble": { "distance": 200, "size": 10, "duration": 2, "opacity": 0.8, "speed": 3 } }
    }
});

// Password Check
function checkPassword() {
    const input = document.getElementById('password-input').value;
    const error = document.getElementById('password-error');
    
    // Updated password to match the hint: 0607
    if (input === "0607" || input === "0520" || input === "520") {
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        startAnimations();
        // Force AOS refresh after showing main content
        setTimeout(() => { AOS.refresh(); }, 100);
    } else {
        error.innerText = "日期不对哦，再想想？(提示: 0607)";
    }
}

function startAnimations() {
    // Play Music
    const music = document.getElementById('bg-music');
    music.play().catch(e => console.log("Music play blocked by browser. User interaction needed."));

    // Typed.js
    new Typed('#typewriter-text', {
        strings: ['你好呀，刘雨 ❤️', '汪凯华有些话想对你说...'],
        typeSpeed: 100,
        backSpeed: 50,
        loop: false,
        onComplete: (self) => {
            // Show subtext
            document.querySelector('.fade-in-delayed').style.opacity = 1;
        }
    });
}

// --- Section Navigation Control ---
let isScrolling = false;
let touchStartY = 0;

// Prevent manual scrolling between sections, but allow it INSIDE a screen if content overflows
function preventDefault(e) {
    // If navigation is active, block everything
    if (isScrolling) {
        if (e.cancelable) e.preventDefault();
        return;
    }

    const scrollableScreen = e.target.closest('.screen');
    if (scrollableScreen) {
        const isSelfScrollable = scrollableScreen.scrollHeight > scrollableScreen.clientHeight;
        if (isSelfScrollable) {
            let delta = 0;
            if (e.type === 'touchmove') {
                const touchY = e.touches[0].clientY;
                delta = touchStartY - touchY; // Positive = scrolling down
                // Do NOT update touchStartY here, it stays fixed until touchstart
            } else {
                delta = e.deltaY;
            }

            const scrollTop = scrollableScreen.scrollTop;
            const scrollHeight = scrollableScreen.scrollHeight;
            const clientHeight = scrollableScreen.clientHeight;
            
            // Threshold for boundary (5px for reliability on mobile)
            const margin = 5;

            // Allow internal scrolling if:
            // 1. Scrolling down and not yet at bottom
            if (delta > 0 && scrollTop + clientHeight < scrollHeight - margin) return;
            // 2. Scrolling up and not yet at top
            if (delta < 0 && scrollTop > margin) return;
            // 3. Almost at 0 delta (tiny moves)
            if (Math.abs(delta) < 1) return;
        }
    }
    
    // If we reach here, either the screen isn't scrollable or we hit a boundary
    if (e.cancelable) e.preventDefault();
}

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

// AOS and Scroll Hook
document.querySelectorAll('.screen').forEach(screen => {
    screen.addEventListener('scroll', () => {
        AOS.refresh(); 
    }, { passive: true });
});

function preventDefaultForScrollKeys(e) {
    const keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) { preventDefault(e); return false; }
}

function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener('wheel', preventDefault, { passive: false });
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', preventDefault);
    window.onkeydown = null;
}

function navigateTo(id) {
    if (isScrolling) return;
    isScrolling = true;
    
    enableScroll();
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    
    // Lock back after animation
    setTimeout(() => {
        isScrolling = false;
        disableScroll();
        AOS.refresh(); // Refresh AOS to trigger animations in new view
    }, 1000);
}

function scrollToNext() { navigateTo('story'); }
function scrollToQuiz() { navigateTo('quiz'); }
function scrollToGallery() { navigateTo('gallery'); }
function scrollToLetter() { navigateTo('letter'); }
function scrollToFinal() { navigateTo('final'); }

// Quiz Logic
function checkQuiz(btn, answer) {
    const feedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next');
    
    // Correct answer is 'A' (Spring) for this demo
    if (answer === 'A') {
        btn.classList.add('correct');
        feedback.innerText = "答对啦！那时候的你最美 ✨";
        feedback.style.color = "#2ed573";
        nextBtn.style.display = 'block';
        // Disable other buttons
        const buttons = document.querySelectorAll('.quiz-options button');
        buttons.forEach(b => b.disabled = true);
    } else {
        btn.classList.add('wrong');
        feedback.innerText = "不对哦，要不要再想想？";
        feedback.style.color = "#ff4757";
        setTimeout(() => btn.classList.remove('wrong'), 500);
    }
}

// "No" Button Runaway Logic
const btnNo = document.getElementById('btn-no');
btnNo.addEventListener('mouseover', function() {
    const x = Math.random() * (window.innerWidth - this.offsetWidth);
    const y = Math.random() * (window.innerHeight - this.offsetHeight);
    
    this.style.position = 'fixed';
    this.style.left = x + 'px';
    this.style.top = y + 'px';
});

// "Yes" Button Logic
const btnYes = document.getElementById('btn-yes');
btnYes.addEventListener('click', function() {
    // Confetti Effect
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // Show Success Overlay
    setTimeout(() => {
        const success = document.getElementById('success-overlay');
        success.style.display = 'flex';
        success.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, fill: 'forwards' });

        // Create Background Floating Hearts
        const heartContainer = document.querySelector('.bg-hearts');
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.className = 'floating-heart-bg';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 100 + 'vh';
            heart.style.position = 'absolute';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heart.style.animation = `floatHeart ${Math.random() * 10 + 10}s linear infinite`;
            heart.style.animationDelay = `-${Math.random() * 10}s`;
            heartContainer.appendChild(heart);
        }
    }, 500);
});

// --- Love Tree Initialization ---
(function() {
    var canvas = $('#tree-canvas');
    if (!canvas[0] || !canvas[0].getContext) return;

    var width = canvas.width();
    var height = canvas.height();
    canvas.attr("width", width);
    canvas.attr("height", height);

    var opts = {
        seed: {
            x: width / 2 - 20,
            y: height - 20, // 强制设置 y 坐标，确保在底部可见
            color: "rgb(190, 26, 37)",
            scale: 2
        },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ],
        bloom: {
            num: 700,
            width: 1080,
            height: 650,
        },
        footer: {
            width: 1200,
            height: 5,
            speed: 10,
        }
    };

    var tree = new Tree(canvas[0], width, height, opts);
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

    canvas.click(function(e) {
        var offset = canvas.offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        
        // 增加点击判定范围
        if (seed.hover(x, y) || (Math.abs(x - (width/2)) < 50 && y > height - 100)) {
            hold = 0;
            canvas.unbind("click");
            canvas.unbind("mousemove");
            canvas.removeClass('hand');
        }
    }).mousemove(function(e) {
        var offset = canvas.offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        canvas.toggleClass('hand', seed.hover(x, y));
    });

    var seedAnimate = eval(Jscex.compile("async", function() {
        seed.draw();
        while (hold) {
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canScale()) {
            seed.scale(0.95);
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canMove()) {
            seed.move(0, 2);
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
    }));

    var growAnimate = eval(Jscex.compile("async", function() {
        do {
            tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function() {
        do {
            tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function() {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0)) {
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
        foot.draw();
        tree.snapshot("p2", 500, 0, 610, 680);
        canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
        $await(Jscex.Async.sleep(300));
        canvas.css("background", "none");
    }));

    var jumpAnimate = eval(Jscex.compile("async", function() {
        var ctx = tree.ctx;
        while (true) {
            tree.ctx.clearRect(0, 0, width, height);
            tree.jump();
            foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    var textAnimate = eval(Jscex.compile("async", function() {
        var together = new Date();
        // 设置你们相识的时间: 2019年6月7号
        together.setFullYear(2019, 5, 7);
        together.setHours(0);
        together.setMinutes(0);
        together.setSeconds(0);
        together.setMilliseconds(0);

        // 分两部分打印，避免文字重叠和遮盖
        $("#tree-code-left").show().typewriter();
        
        // 延迟 15 秒后开始打印右侧文字
        setTimeout(function() {
            $("#tree-code-right").show().typewriter();
        }, 15000);

        $("#clock-box").fadeIn(500);
        
        while (true) {
            timeElapse(together);
            $await(Jscex.Async.sleep(1000));
        }
    }));
    
    // Show Next Button after some time
    setTimeout(() => {
        $(".tree-next").fadeIn(1000);
    }, 15000);

    var runAsync = eval(Jscex.compile("async", function() {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());
        textAnimate().start();
        $await(jumpAnimate());
    }));

    runAsync().start();
})();

// Active the scroll lock on page load
disableScroll();
