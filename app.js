import { loadQuizFromFirebase, saveAttemptToFirebase } from './firebase.js';
import { loadQuizFromSupabase, saveAttemptToSupabase } from './supabase.js';

const $ = s => document.querySelector(s);
let quiz, current = 0, answers = {}, secondsLeft = 0, timerId = null, student = {};

$('#themeToggle').onclick = () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $('#themeToggle').textContent = dark ? 'Light' : 'Dark';
};

$('#startForm').addEventListener('submit', async e => {
  e.preventDefault();
  student = { name: $('#studentName').value.trim(), id: $('#studentId').value.trim() };
  const source = $('#sourceSelect').value;
  const quizId = $('#quizId').value.trim() || 'sample-quiz';
  try {
    quiz = await loadQuiz(source, quizId);
    validateQuiz(quiz);
    startQuiz();
  } catch(err) { alert(err.message); }
});

async function loadQuiz(source, quizId){
  if(source === 'firebase') return loadQuizFromFirebase(quizId);
  if(source === 'supabase') return loadQuizFromSupabase(quizId);
  const res = await fetch('./data/sample-quiz.json');
  return res.json();
}

function validateQuiz(q){
  if(!q.id || !q.title || !Array.isArray(q.questions) || !q.questions.length) throw new Error('Invalid quiz file.');
  q.questions.forEach((x,i)=>{
    if(!x.question || !Array.isArray(x.options) || x.correctIndex === undefined) throw new Error(`Invalid question #${i+1}`);
  });
}

function startQuiz(){
  current = 0; answers = {}; secondsLeft = (quiz.durationMinutes || 15) * 60;
  $('#setup').classList.add('hidden'); $('#resultPanel').classList.add('hidden'); $('#quizPanel').classList.remove('hidden');
  $('#quizTitle').textContent = quiz.title;
  $('#quizDesc').textContent = quiz.description || '';
  $('#quizMeta').textContent = `${quiz.questions.length} questions • ${quiz.durationMinutes || 15} minutes`;
  renderQuestion();
  clearInterval(timerId);
  timerId = setInterval(tick, 1000); tick();
}

function tick(){
  const m = String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const s = String(secondsLeft%60).padStart(2,'0');
  $('#timer').textContent = `${m}:${s}`;
  if(secondsLeft-- <= 0) submitQuiz();
}

function renderQuestion(){
  const q = quiz.questions[current];
  $('#progressBar').style.width = `${((current+1)/quiz.questions.length)*100}%`;
  $('#questionBox').innerHTML = `<div class="question"><h3>Question ${current+1} of ${quiz.questions.length}</h3><p>${escapeHtml(q.question)}</p>${q.options.map((o,i)=>`<label class="option ${answers[current]===i?'selected':''}"><input type="radio" name="answer" value="${i}" ${answers[current]===i?'checked':''}/><span>${escapeHtml(o)}</span></label>`).join('')}</div>`;
  document.querySelectorAll('input[name=answer]').forEach(r => r.onchange = e => { answers[current] = Number(e.target.value); renderQuestion(); });
  $('#prevBtn').disabled = current === 0;
  $('#nextBtn').disabled = current === quiz.questions.length-1;
}

$('#prevBtn').onclick = () => { if(current>0){ current--; renderQuestion(); } };
$('#nextBtn').onclick = () => { if(current<quiz.questions.length-1){ current++; renderQuestion(); } };
$('#submitBtn').onclick = () => { if(confirm('Submit this test now?')) submitQuiz(); };
$('#restartBtn').onclick = () => location.reload();

async function submitQuiz(){
  clearInterval(timerId);
  let correct = 0;
  quiz.questions.forEach((q,i)=>{ if(answers[i] === q.correctIndex) correct++; });
  const percent = Math.round((correct / quiz.questions.length) * 100);
  $('#quizPanel').classList.add('hidden'); $('#resultPanel').classList.remove('hidden');
  $('#scoreText').textContent = `${correct}/${quiz.questions.length} correct (${percent}%)`;
  $('#resultSummary').textContent = percent >= (quiz.passingScore || 50) ? 'Passed. Good job!' : 'Keep practicing and review the explanations below.';
  $('#reviewBox').innerHTML = quiz.questions.map((q,i)=>`<div class="review-item"><b>Q${i+1}. ${escapeHtml(q.question)}</b><p>Your answer: <span class="${answers[i]===q.correctIndex?'correct':'wrong'}">${answers[i]!==undefined?escapeHtml(q.options[answers[i]]):'Not answered'}</span></p><p>Correct answer: <span class="correct">${escapeHtml(q.options[q.correctIndex])}</span></p>${q.explanation?`<p>${escapeHtml(q.explanation)}</p>`:''}</div>`).join('');
  const attempt = { quizId: quiz.id, student, answers, score: percent, correct, total: quiz.questions.length };
  try { await saveAttemptToFirebase(attempt); } catch(_) {}
  try { await saveAttemptToSupabase(attempt); } catch(_) {}
}

function escapeHtml(str=''){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
