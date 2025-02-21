// 버튼 클릭 이벤트
document.getElementById('testButton').addEventListener('click', () => {
  alert("버튼이 클릭되었습니다!");
});

// 링크 클릭 이벤트
document.getElementById('testLink').addEventListener('click', () => {
  console.log("링크 클릭 이벤트 발생");
});

// 폼 제출 이벤트
document.getElementById('testForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert("폼이 제출되었습니다!");
});

// 모달 열기 및 닫기
function openModal() {
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.modal-overlay').style.display = 'block';
}

function closeModal() {
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.modal-overlay').style.display = 'none';
}
