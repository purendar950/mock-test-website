// Supabase adapter. Create tables with docs/schema.sql from README instructions.
// Tables used: quizzes(id text primary key, data jsonb), attempts(id uuid, quiz_id text, student jsonb, answers jsonb, score numeric)

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = window.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const configured = SUPABASE_URL && !SUPABASE_URL.startsWith('YOUR_');
const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export async function loadQuizFromSupabase(quizId){
  if(!supabase) throw new Error('Supabase is not configured. Add your Supabase URL and anon key first.');
  const { data, error } = await supabase.from('quizzes').select('data').eq('id', quizId).single();
  if(error) throw error;
  if(!data) throw new Error(`Quiz not found in Supabase: ${quizId}`);
  return data.data;
}

export async function saveQuizToSupabase(quiz){
  if(!supabase) throw new Error('Supabase is not configured. Add your Supabase URL and anon key first.');
  const { error } = await supabase.from('quizzes').upsert({id: quiz.id, data: quiz, updated_at: new Date().toISOString()});
  if(error) throw error;
  return {ok:true, id: quiz.id};
}

export async function saveAttemptToSupabase(attempt){
  if(!supabase) return {ok:false, skipped:true, reason:'Supabase not configured'};
  const { data, error } = await supabase.from('attempts').insert({
    quiz_id: attempt.quizId,
    student: attempt.student,
    answers: attempt.answers,
    score: attempt.score,
    created_at: new Date().toISOString()
  }).select('id').single();
  if(error) throw error;
  return {ok:true, id:data?.id};
}
