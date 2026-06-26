import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const url=window.SUPABASE_URL||'YOUR_SUPABASE_URL', key=window.SUPABASE_ANON_KEY||'YOUR_SUPABASE_ANON_KEY';
const sb=url.startsWith('YOUR_')?null:createClient(url,key);
export async function loadQuizFromSupabase(id){if(!sb)throw Error('Supabase not configured');const {data,error}=await sb.from('quizzes').select('data').eq('id',id).single();if(error)throw error;return data.data}
export async function saveQuizToSupabase(q){if(!sb)throw Error('Supabase not configured');const {error}=await sb.from('quizzes').upsert({id:q.id,data:q,updated_at:new Date().toISOString()});if(error)throw error;return true}
export async function saveAttemptToSupabase(a){if(!sb)return;await sb.from('attempts').insert({quiz_id:a.quizId,student:a.student,answers:a.answers,score:a.score,created_at:new Date().toISOString()})}
