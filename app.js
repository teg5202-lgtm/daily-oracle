// Web Audio API Sound Generator for Satisfying Temple Atmosphere
        let audioCtx = null;
        const pendingTimers = new Set();
        function schedule(callback, delay) {
            const id = window.setTimeout(() => { pendingTimers.delete(id); callback(); }, delay);
            pendingTimers.add(id);
            return id;
        }
        function saveHistory() {
            try { localStorage.setItem('drawHistory', JSON.stringify(currentHistory)); }
            catch (_) { /* Keep this session usable when browser storage is unavailable. */ }
        }
        function loadHistory() {
            try {
                const data = JSON.parse(localStorage.getItem('drawHistory') || '[]');
                return Array.isArray(data) ? data.filter(item => item && ['rating','quote','timestamp'].every(key => typeof item[key] === 'string')).slice(0, 500) : [];
            } catch (_) { return []; }
        }
        function escapeHtml(value) {
            return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        }

        // 1. Shake wood sound (Cylinder shake)
        function playShakeSound() {
            if (!audioCtx) return;
            try {
                let count = 0;
                const interval = setInterval(() => {
                    if (count > 9) {
                        clearInterval(interval);
                        return;
                    }
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(50 + Math.random() * 50, audioCtx.currentTime);
                    
                    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.1);
                    count++;
                }, 120);
            } catch (e) {
                console.log('Audio error:', e);
            }
        }

        // 2. Chime sound (Success draw)
        function playChimeSound() {
            if (!audioCtx) return;
            try {
                const now = audioCtx.currentTime;
                const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Beautiful C Major chord notes
                
                frequencies.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    
                    gain.gain.setValueAtTime(0.12, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.7);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.7);
                });
            } catch (e) {
                console.log('Audio error:', e);
            }
        }

        // --- DATABASE OF DAILY EXQUISITE GUIDANCES ---
        const FORTUNES_DB = [
            {
                rating: "大吉",
                quote: "「路在前方，心自坦然；泥濘亦是風景。」"
            },
            {
                rating: "大吉",
                quote: "「千江有水千江月，萬里無雲萬里天。踏實前行，無往不利。」"
            },
            {
                rating: "大吉",
                quote: "「乘風破浪會有時，直掛雲帆濟滄海。今日將迎來突破性轉機！」"
            },
            {
                rating: "吉",
                quote: "「順應自然，不徐不疾；心寬之處，便是通途。」"
            },
            {
                rating: "吉",
                quote: "「春來草自青，時至花自開。耐心耕耘，收穫期日可待。」"
            },
            {
                rating: "吉",
                quote: "「常懷感恩心，天道自酬勤。善意與好運正雙向奔赴。」"
            },
            {
                rating: "中吉",
                quote: "「山重水複疑無路，柳暗花明又一村。轉折點即在眼前。」"
            },
            {
                rating: "中吉",
                quote: "「不畏浮雲遮望眼，自緣身在最高層。保持高格局與大視野。」"
            },
            {
                rating: "中吉",
                quote: "「雲開霧散終有時，守得雲開見月明。所盼之事，即將明朗。」"
            },
            {
                rating: "小吉",
                quote: "「積步成千里，滴水成江河。穩健前行，星光不問趕路人。」"
            },
            {
                rating: "小吉",
                quote: "「不求事事如意，但求問心無愧。微小的努力終將匯聚成光。」"
            },
            {
                rating: "小吉",
                quote: "「心若向陽，無懼悲傷。把日常生活過好，就是最大的吉兆。」"
            }
        ];

        // --- APP STATE ---
        let currentHistory = loadHistory();
        let isDrawing = false;

        // --- ANIMATE AND TRIGGER FORTUNE DRAW ---
        function triggerDraw() {
            if (isDrawing) return;
            isDrawing = true;
            
            // Resume Audio Context if suspended (browser security autoplays)
            try {
                const Audio = window.AudioContext || window.webkitAudioContext;
                if (!audioCtx && Audio) audioCtx = new Audio();
                if (audioCtx?.state === 'suspended') audioCtx.resume().catch(() => {});
            } catch (_) { /* Sound is optional. */ }

            // UI feedback
            const drawBtn = document.getElementById('drawBtn');
            drawBtn.disabled = true;

            // Trigger cylinder AND sticks shaking together via wrapper (Perfect Synchronicity)
            const shakeWrapper = document.getElementById('shakeWrapper');
            shakeWrapper.classList.add('shake-active');

            // Trigger audio click feedback
            playShakeSound();

            // Set drawing status in title header
            const titleHeader = document.getElementById('titleHeader');
            titleHeader.innerText = "神明聽聞，正在為您指引天機...";
            titleHeader.classList.add('text-yellow-400');

            // Shake sequence timings
            schedule(() => {
                // Rising stick animation (from completely tucked in)
                const luckyStick = document.getElementById('luckyStick');
                luckyStick.classList.add('stick-rise-active');
                
                schedule(() => {
                    // Success play sound
                    playChimeSound();

                    // Generate Random Result from array
                    const result = FORTUNES_DB[Math.floor(Math.random() * FORTUNES_DB.length)];
                    
                    // Record result in history
                    const nowStr = new Date().toLocaleString('zh-TW', { hour12: false });
                    const record = {
                        rating: result.rating,
                        quote: result.quote,
                        timestamp: nowStr
                    };
                    currentHistory.unshift(record);
                    currentHistory = currentHistory.slice(0, 500);
                    saveHistory();

                    // Show Result Page with simple transitions
                    showResultPage(result);

                }, 1500); // Wait for the stick to fully rise
            }, 1300); // Shaking time before stick emerges
        }

        // --- DISPLAYING THE RESULTS VIEW ---
        function showResultPage(result) {
            // Update UI elements on Result View
            document.getElementById('fortuneBigText').innerText = result.rating;
            document.getElementById('fortuneQuote').innerText = result.quote;
            
            // Setup views
            const cylinderView = document.getElementById('cylinderView');
            const resultView = document.getElementById('resultView');
            const titleHeader = document.getElementById('titleHeader');
            const backBtn = document.getElementById('backBtn');

            // Set Header Transition title
            titleHeader.innerText = "今日您的問卦結果為...";
            titleHeader.classList.remove('text-yellow-400');
            titleHeader.classList.add('text-amber-200/80', 'font-medium');

            // Fade animations
            cylinderView.classList.add('opacity-0', 'scale-95');
            schedule(() => {
                cylinderView.classList.add('hidden');
                
                resultView.classList.remove('hidden');
                resultView.classList.add('opacity-0', 'scale-95');
                
                // Show back button
                backBtn.classList.remove('opacity-0');
                
                schedule(() => {
                    resultView.classList.remove('opacity-0', 'scale-95');
                    resultView.classList.add('opacity-100', 'scale-100');
                }, 50);
            }, 300);
        }

        // --- NAVIGATION RESET back to Draw Screen ---
        function resetToHome() {
            pendingTimers.forEach(clearTimeout);
            pendingTimers.clear();
            const cylinderView = document.getElementById('cylinderView');
            const resultView = document.getElementById('resultView');
            const titleHeader = document.getElementById('titleHeader');
            
            // Clean up animation classes
            const shakeWrapper = document.getElementById('shakeWrapper');
            const luckyStick = document.getElementById('luckyStick');
            const drawBtn = document.getElementById('drawBtn');
            
            shakeWrapper.classList.remove('shake-active');
            luckyStick.classList.remove('stick-rise-active');
            drawBtn.disabled = false;
            isDrawing = false;

            // Reset header subtitle
            titleHeader.innerText = "每日問卦指引 · 虔心誠意 · 解惑前路";
            titleHeader.className = "text-xs font-light text-amber-200/50 tracking-[0.25em] mt-3 transition-all duration-300";

            // Switch view animations
            resultView.classList.add('opacity-0', 'scale-95');
            schedule(() => {
                resultView.classList.add('hidden');
                
                cylinderView.classList.remove('hidden');
                cylinderView.classList.add('opacity-0', 'scale-95');
                
                schedule(() => {
                    cylinderView.classList.remove('opacity-0', 'scale-95');
                    cylinderView.classList.add('opacity-100', 'scale-100');
                }, 50);
            }, 300);
        }

        // --- ACCORDION PRIZE DRAWER TOGGLE ---
        function toggleDetails() {
            const drawer = document.getElementById('detailsDrawer');
            const arrow = document.getElementById('detailsArrow');
            if (drawer.classList.contains('hidden')) {
                drawer.classList.remove('hidden');
                arrow.classList.add('rotate-180');
            } else {
                drawer.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            }
        }

        // --- HISTORY MANAGEMENT MODAL ---
        function openHistoryModal() {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = '';

            if (currentHistory.length === 0) {
                historyList.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                        <i class="fa-solid fa-peace text-4xl text-gray-300 mb-2"></i>
                        <p class="text-sm">尚無歷史求籤紀錄</p>
                    </div>
                `;
            } else {
                currentHistory.forEach(item => {
                    let badgeColor = "bg-red-100 text-red-800";
                    if (item.rating === "吉") badgeColor = "bg-orange-100 text-orange-800";
                    if (item.rating === "中吉") badgeColor = "bg-amber-100 text-amber-800";
                    if (item.rating === "小吉") badgeColor = "bg-yellow-100 text-yellow-800";

                    historyList.innerHTML += `
                        <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-amber-300/40 transition">
                            <div class="space-y-1">
                                <span class="text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor} calligraphy-font">${escapeHtml(item.rating)}</span>
                                <p class="text-xs font-medium text-gray-600 mt-1">${escapeHtml(item.quote)}</p>
                            </div>
                            <span class="text-[9px] text-gray-400 whitespace-nowrap ml-2">${escapeHtml(item.timestamp)}</span>
                        </div>
                    `;
                });
            }

            const modal = document.getElementById('historyModal');
            modal.classList.remove('hidden');
            schedule(() => {
                modal.firstElementChild.classList.add('translate-y-0');
            }, 50);
        }

        // --- CLOSE THE HISTORY MODAL ---
        function closeHistoryModal() {
            const modal = document.getElementById('historyModal');
            modal.classList.add('hidden');
        }

        // --- CLEAR ENTIRE LOCAL HISTORY ---
        function clearHistory() {
            if (confirm("您確定要清除所有求籤歷史紀錄嗎？")) {
                currentHistory = [];
                saveHistory();
                openHistoryModal();
            }
        }
