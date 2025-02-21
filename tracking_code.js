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
te.init(config);  // ✅ SDK 초기화 완료 후 추가
console.log("✅ ThinkingData SDK initialized:", config);


/* ================================
   📍 ✅ 공통 속성 설정 (모든 이벤트에 자동 추ㅁ가)
   - 목적 : 이벤트마다 반복적으로 입력할 필요 없이 공통 속성을 자동 추가
   - 수집 항목 : 페이지 정보, 디바이스 정보, 브라우저 정보, 방문자 정보 등
================================= */

/* -----------------------------
📌 세션 및 방문자 정보 설정
----------------------------- */

// ✅ UUID 생성 함수 
// 고유한 세션 식별자(session_id)를 생성합니다.
function generateUUID() {     
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>         
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)         ); 
}

// ✅ 세션 ID 설정
// 같은 세션 동안 고유 session_id를 유지하기 위해 sessionStorage 사용
const sessionKey = "te_session_id";
let sessionId = sessionStorage.getItem(sessionKey);
if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem(sessionKey, sessionId);
}

// ✅ 첫 방문 날짜 설정
// LocalStorage에 저장하여 방문자 구분
const firstVisitKey = "te_first_visit_date";
let firstVisitDate = localStorage.getItem(firstVisitKey);
if (!firstVisitDate) {
    firstVisitDate = new Date().toISOString().split('T')[0];  // YYYY-MM-DD 형식
    localStorage.setItem(firstVisitKey, firstVisitDate);
}

// ✅ 신규 방문 여부 
// 첫 방문 날짜가 오늘인지 확인하여 Boolean 값 반환
const isNewVisitor = firstVisitDate === new Date().toISOString().split('T')[0];

/* -----------------------------
📌 UTM 파라미터 및 유입 경로 수집
----------------------------- */

// ✅ URL 파라미터에서 UTM 값 추출 (마케팅 채널 분석 목적)
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get("utm_source") || "direct";
const utmMedium = urlParams.get("utm_medium") || "none";
const utmCampaign = urlParams.get("utm_campaign") || "none";

/* -----------------------------
📌 디바이스 및 브라우저 정보 수집
----------------------------- */

// ✅ 디바이스 유형 파악 (모바일/PC 구분)
const userAgent = navigator.userAgent.toLowerCase();
const deviceType = /mobile|android|iphone|ipad/.test(userAgent) ? "Mobile" : "PC";

// ✅ 운영체제(OS) 정보 추출
const os = navigator.platform || "unknown";

// ✅ 브라우저 및 버전 정보 추출 함수
function getBrowserInfo() {
    if (/chrome/.test(userAgent)) return { browser: "Chrome", browser_version: userAgent.match(/chrome\/([\d.]+)/)?.[1] || "unknown" };
    if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) return { browser: "Safari", browser_version: userAgent.match(/version\/([\d.]+)/)?.[1] || "unknown" };
    if (/firefox/.test(userAgent)) return { browser: "Firefox", browser_version: userAgent.match(/firefox\/([\d.]+)/)?.[1] || "unknown" };
    if (/edg/.test(userAgent)) return { browser: "Edge", browser_version: userAgent.match(/edg\/([\d.]+)/)?.[1] || "unknown" };
    return { browser: "unknown", browser_version: "unknown" };
}

const { browser, browser_version } = getBrowserInfo(); // 브라우저 이름과 버전 추출

/* -----------------------------
📌 페이지 및 화면 정보 수집
----------------------------- */
const pageUrl = window.location.href;  // 현재 페이지 URL
const pagePath = window.location.pathname;  // 도메인 제외 경로
const referrer = document.referrer || "none";  // 이전 방문 페이지 URL
const screenResolution = `${window.screen.width}x${window.screen.height}`;  // 화면 해상도
const browserLanguage = navigator.language || "unknown";  // 브라우저 언어
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";  // 사용자 시간대


// 공통 속성 정의
const superProperties = {
    page_url: pageUrl,                // 현재 페이지 전체 URL
    page_path: pagePath,              // URL 경로 (예: /about, /contact)
    referrer: referrer,               // 유입 페이지 URL
    utm_source: utmSource,            // UTM 소스 (예: google, naver)
    utm_medium: utmMedium,            // UTM 미디엄 (예: cpc, organic)
    utm_campaign: utmCampaign,        // UTM 캠페인 이름

    device_type: deviceType,          // 디바이스 유형 (PC/Mobile)
    os: os,                           // 운영체제 이름
    browser: browser,                 // 브라우저 이름
    browser_version: browser_version, // 브라우저 버전
    screen_resolution: screenResolution, // 화면 해상도
    language: browserLanguage,        // 브라우저 언어
    timezone: timezone,               // 사용자 시간대(타임존)

    session_id: sessionId,            // 세션 식별자
    first_visit_date: firstVisitDate, // 사용자의 첫 방문 날짜
    is_new_visitor: isNewVisitor      // 신규 방문 여부 (true/false)
};

// 이후 모든 te.track 이벤트에 자동 포함됩니다.
te.setSuperProperties(superProperties);  // 공통 속성 적용
console.log("✅ 공통 속성 설정 완료:", superProperties);


/* ================================
   📍 [이벤트 추가 지점]
================================= */
// 모든 <button> 요소 선택
document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", function(event) {
    te.track("Button_Click", {
      element_id: button.id || "no-id",               // 버튼 ID (없으면 "no-id")
      element_text: button.innerText.trim(),         // 버튼 텍스트
      clicked_at: new Date().toISOString(),          // 클릭 시각 (ISO 형식)
      click_position: {
        x: event.clientX,                             // 클릭 시 X 좌표
        y: event.clientY                              // 클릭 시 Y 좌표
      }
    });

    console.log(`✅ 클릭 이벤트 전송됨: ${button.id || "no-id"}`);
  });
});
