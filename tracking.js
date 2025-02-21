<script>
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
    te.init(config);  // ✅ SDK 초기화 완료
    console.log("✅ ThinkingData SDK initialized:", config);

    /* ================================
       📍 ✅ 공통 속성 설정 (모든 이벤트에 자동 추가)
    ================================= */
    const superProperties = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        referrer: document.referrer || "none",
        utm_source: new URLSearchParams(window.location.search).get("utm_source") || "direct",
        utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || "none",
        utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || "none",
        device_type: /mobile|android|iphone|ipad/.test(navigator.userAgent.toLowerCase()) ? "Mobile" : "PC",
        os: navigator.platform || "unknown",
        browser: navigator.userAgent.includes("Chrome") ? "Chrome" :
                 navigator.userAgent.includes("Safari") ? "Safari" :
                 navigator.userAgent.includes("Firefox") ? "Firefox" :
                 navigator.userAgent.includes("Edg") ? "Edge" : "unknown",
        browser_version: navigator.userAgent.match(/(chrome|firefox|safari|edg)\/([\d.]+)/i)?.[2] || "unknown",
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language || "unknown",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
        session_id: sessionStorage.getItem("te_session_id") || (() => {
            const id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
            sessionStorage.setItem("te_session_id", id);
            return id;
        })(),
        first_visit_date: localStorage.getItem("te_first_visit_date") || (() => {
            const date = new Date().toISOString().split('T')[0];
            localStorage.setItem("te_first_visit_date", date);
            return date;
        })(),
        is_new_visitor: localStorage.getItem("te_first_visit_date") === new Date().toISOString().split('T')[0]
    };

    te.setSuperProperties(superProperties);  // ✅ 공통 속성 적용
    console.log("✅ 공통 속성 설정 완료:", superProperties);


    /* ================================
       📍 ✅ 이벤트 추가 지점
       - 여기서 클릭 이벤트를 등록합니다.
    ================================= */

    document.addEventListener('DOMContentLoaded', () => {
        console.log("✅ DOM 로드 완료 - 클릭 이벤트 등록 중...");

        // 모든 버튼에 클릭 이벤트 추가
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function () {
                const elementId = this.id || 'none';
                const elementClass = this.className || 'none';
                const elementText = this.innerText.trim().substring(0, 100);  // 버튼 텍스트 (최대 100자)
                const pageUrl = window.location.href;

                // ✅ 버튼 클릭 추적 전송
                te.track('button_click', {
                    element_id: elementId,
                    element_class: elementClass,
                    element_text: elementText,
                    page_url: pageUrl,
                    timestamp: new Date().toISOString()
                });

                console.log(`✅ 버튼 클릭 이벤트 전송: ${elementText}`);
            });
        });
    });
</script>
