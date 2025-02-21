// ✅ ThinkingData SDK 초기화
var config = {
    appId: "6f1c71dc31fa41ad8022ad41a7cfa4e8",
    serverUrl: "https://te-receiver-naver.thinkingdata.kr/sync_js",
    autoTrack: {
        pageShow: true,  // 페이지 진입 자동 추적
        pageHide: true   // 페이지 이탈 자동 추적
    }
};

window.te = thinkingdata;
te.init(config);  // SDK 초기화
console.log("✅ ThinkingData SDK initialized:", config);

// ✅ UUID 생성 함수
function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// ✅ 세션 및 방문자 정보 수집
const sessionKey = "te_session_id";
let sessionId = sessionStorage.getItem(sessionKey);
if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem(sessionKey, sessionId);
}

const firstVisitKey = "te_first_visit_date";
let firstVisitDate = localStorage.getItem(firstVisitKey);
if (!firstVisitDate) {
    firstVisitDate = new Date().toISOString().split('T')[0];
    localStorage.setItem(firstVisitKey, firstVisitDate);
}

const isNewVisitor = firstVisitDate === new Date().toISOString().split('T')[0];

// ✅ UTM 및 디바이스 정보 수집
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get("utm_source") || "direct";
const utmMedium = urlParams.get("utm_medium") || "none";
const utmCampaign = urlParams.get("utm_campaign") || "none";

const userAgent = navigator.userAgent.toLowerCase();
const deviceType = /mobile|android|iphone|ipad/.test(userAgent) ? "Mobile" : "PC";
const os = navigator.platform || "unknown";
const screenResolution = `${window.screen.width}x${window.screen.height}`;
const browserLanguage = navigator.language || "unknown";
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";

// ✅ 공통 속성 정의 및 설정
const superProperties = {
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: document.referrer || "none",
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    device_type: deviceType,
    os: os,
    screen_resolution: screenResolution,
    language: browserLanguage,
    timezone: timezone,
    session_id: sessionId,
    first_visit_date: firstVisitDate,
    is_new_visitor: isNewVisitor
};

te.setSuperProperties(superProperties);  // 공통 속성 적용
console.log("✅ 공통 속성 설정 완료:", superProperties);

// ✅ 버튼 클릭 추적 (모든 버튼에 적용)
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        te.track('button_click', {
            element_id: this.id || 'none',
            element_text: this.innerText.trim(),
            page_url: window.location.href,
            timestamp: new Date().toISOString()
        });
        console.log(`✅ 버튼 클릭 추적 전송: ${this.innerText}`);
    });
});
