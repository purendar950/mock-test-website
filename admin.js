import { saveQuizToFirebase } from './firebase.js';
import { saveQuizToSupabase } from './supabase.js';

const $ = s => document.querySelector(s);
let quiz = emptyQuiz();

$('#themeToggle').onclick = () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $('#themeToggle').textContent = dark ? 'Light' : 'Dark';
};

function emptyQuiz(){ return { id:'sample-quiz', title:'General Knowledge Mock Test', description:'A sample test for practice.', durationMinutes:15, passingScore:50, questions:[] }; }
function syncMeta(){ quiz.id=$('#adminQuizId').value.trim(); quiz.title=$('#adminTitle').value.trim(); quiz.description=$('#adminDesc').value.trim(); quiz.durationMinutes=Number($('#adminDuration').value)||15; quiz.passingScore=Number($('#adminPass').value)||50; }
function render(){ syncMeta(); $('#jsonEditor').value = JSON.stringify(quiz,null,2); $('#questionList').innerHTML = quiz.questions.map((q,i)=>`<div class="review-item"><b>${i+1}. ${escapeHtml(q.question)}</b><p>${q.options.map((o,idx)=>`${idx===q.correctIndex?'✅':'○'} ${escapeHtml(o)}`).join('<br>')}</p><button data-del="${i}" type="button">Delete</button></div>`).join(''); document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{quiz.questions.splice(Number(b.dataset.del),1);render();}); }
function fromEditor(){ quiz = JSON.parse($('#jsonEditor').value); validate(quiz); $('#adminQuizId').value=quiz.id; $('#adminTitle').value=quiz.title; $('#adminDesc').value=quiz.description||''; $('#adminDuration').value=quiz.durationMinutes||15; $('#adminPass').value=quiz.passingScore||50; }
function validate(q){ if(!q.id||!q.title||!Array.isArray(q.questions)) throw new Error('Quiz must have id, title, and questions array.'); q.questions.forEach((x,i)=>{ if(!x.question||!Array.isArray(x.options)||x.options.length<2||x.correctIndex<0) throw new Error(`Invalid question ${i+1}`); }); return true; }
function log(msg){ $('#adminLog').textContent = `[${new Date().toLocaleTimeString()}] ${msg}\n` + $('#adminLog').textContent; }

$('#quizForm').addEventListener('input', render);
$('#questionForm').addEventListener('submit', e=>{ e.preventDefault(); syncMeta(); const opts=[$('#opt0').value,$('#opt1').value,$('#opt2').value,$('#opt3').value].map(x=>x.trim()).filter(Boolean); quiz.questions.push({ question:$('#qText').value.trim(), options:opts, correctIndex:Number($('#correctIndex').value), explanation:$('#explanation').value.trim() }); e.target.reset(); render(); log('Question added.'); });
$('#fileInput').addEventListener('change', async e=>{ const file=e.target.files[0]; if(!file) return; $('#jsonEditor').value = await file.text(); try{ fromEditor(); render(); log('Quiz file imported.'); }catch(err){ log(err.message); } });
$('#loadSampleBtn').onclick = async()=>{ const res=await fetch('./data/sample-quiz.json'); quiz=await res.json(); $('#adminQuizId').value=quiz.id; $('#adminTitle').value=quiz.title; $('#adminDesc').value=quiz.description; $('#adminDuration').value=quiz.durationMinutes; $('#adminPass').value=quiz.passingScore; render(); log('Sample quiz loaded.'); };
$('#validateBtn').onclick=()=>{ try{ fromEditor(); render(); log('Quiz JSON is valid.'); }catch(err){ log(err.message); } };
$('#downloadBtn').onclick=()=>{ try{ fromEditor(); const blob=new Blob([JSON.stringify(quiz,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${quiz.id}.json`; a.click(); log('Quiz JSON downloaded.'); }catch(err){ log(err.message); } };
$('#publishBtn').onclick=async()=>{ try{ fromEditor(); const target=$('#adminTarget').value; if(target==='download') return log('Choose Firebase or Supabase to publish, or use Download JSON.'); if(target==='firebase') await saveQuizToFirebase(quiz); if(target==='supabase') await saveQuizToSupabase(quiz); log(`Published ${quiz.id} to ${target}.`); }catch(err){ log(err.message); } };

function escapeHtml(str=''){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
render();
