import {emailLogin,googleLogin,logout,watchUser} from './auth.js'; const $=s=>document.querySelector(s); const log=x=>$('#status').textContent=x;
watchUser((u,p)=>log(u?`Logged in: ${u.email}
Premium: ${!!p?.isPremium}`:'Not logged in'));
$('#authForm').onsubmit=async e=>{e.preventDefault();try{await emailLogin($('#email').value,$('#password').value,$('#mode').value)}catch(err){log(err.message)}};
$('#google').onclick=async()=>{try{await googleLogin()}catch(err){log(err.message)}}; $('#out').onclick=async()=>{try{await logout()}catch(err){log(err.message)}};
