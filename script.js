console.log("✅ 스크립트 로드 완료");

// Hero 버튼 클릭 시 반응
document.querySelector(".hero-button").addEventListener("click", () => {
    alert("데모 신청 버튼 클릭됨!");
});

// 가격 카드 가입 버튼 반응
document.querySelectorAll(".pricing-button").forEach(button => {
    button.addEventListener("click", () => alert(`${button.previousElementSibling.previousElementSibling.textContent} 플랜 가입 클릭됨!`));
});
