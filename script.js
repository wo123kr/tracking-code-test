// ✅ 버튼 클릭 시 알림 표시
document.getElementById('testButton').addEventListener('click', () => {
  alert("버튼이 클릭되었습니다!");
});

// ✅ 링크 클릭 시 로그
document.getElementById('testLink').addEventListener('click', () => {
  console.log("링크 클릭 이벤트 발생");
});

// ✅ 폼 제출 시 알림 및 초기화
document.getElementById('testForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert("폼이 제출되었습니다!");
  e.target.reset();
});

// ✅ 모달 열기 및 닫기 기능
function openModal() {
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.modal-overlay').style.display = 'block';
}

function closeModal() {
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.modal-overlay').style.display = 'none';
}
