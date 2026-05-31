import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#03050A;--surface:rgba(255,255,255,0.03);--surface2:rgba(255,255,255,0.055);
  --surface3:rgba(255,255,255,0.09);--glass:rgba(10,15,28,0.72);
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);--border3:rgba(255,255,255,0.20);
  --text:#F0F4FF;--text2:#8B95B0;--text3:#454E66;
  --teal:#00D4B8;--teal2:#00A88E;--violet:#7B6EF6;--violet2:#5A50D4;
  --pink:#F062A4;--amber:#FFB547;--red:#FF4668;--green:#22D3A0;--blue:#38BDF8;
  --font-d:'Outfit',sans-serif;--font-b:'Plus Jakarta Sans',sans-serif;--font-m:'JetBrains Mono',monospace;
  --r:10px;--rl:16px;--rxl:22px;
  --mesh1:rgba(0,212,184,0.07);--mesh2:rgba(123,110,246,0.08);--mesh3:rgba(240,98,164,0.05);
  --grid-c:rgba(255,255,255,.013);
}
.light{
  --bg:#F0F4FA;--surface:rgba(0,0,0,0.025);--surface2:rgba(0,0,0,0.05);
  --surface3:rgba(0,0,0,0.08);--glass:rgba(255,255,255,0.85);
  --border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.14);--border3:rgba(0,0,0,0.22);
  --text:#0F1623;--text2:#4A5568;--text3:#94A3B8;
  --teal:#008C78;--teal2:#006B5C;--violet:#5E50E0;--violet2:#4538C0;
  --mesh1:rgba(0,180,160,0.06);--mesh2:rgba(100,85,220,0.06);--mesh3:rgba(220,80,150,0.04);
  --grid-c:rgba(0,0,0,.025);
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-b);font-size:14px;line-height:1.6;overflow:hidden;transition:background .25s,color .25s}
body::before{content:'';position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 10% 0%,var(--mesh1) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 10%,var(--mesh2) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 50% 100%,var(--mesh3) 0%,transparent 60%);pointer-events:none;transition:background .25s}
body::after{content:'';position:fixed;inset:0;z-index:0;background-image:linear-gradient(var(--grid-c) 1px,transparent 1px),linear-gradient(90deg,var(--grid-c) 1px,transparent 1px);background-size:44px 44px;pointer-events:none}
.theme-toggle{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:9px 12px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface);cursor:pointer;transition:all .15s;width:100%;font-family:var(--font-b)}
.theme-toggle:hover{border-color:var(--border2);background:var(--surface2)}
.toggle-label{font-size:12px;color:var(--text2);display:flex;align-items:center;gap:7px}
.toggle-track{width:38px;height:21px;border-radius:20px;background:var(--surface3);border:1px solid var(--border2);position:relative;transition:background .25s;flex-shrink:0}
.light .toggle-track{background:linear-gradient(135deg,var(--teal),var(--violet))}
.toggle-thumb{position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .28s cubic-bezier(.34,1.56,.64,1);box-shadow:0 1px 5px rgba(0,0,0,.35)}
.light .toggle-thumb{transform:translateX(17px)}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
.shell{display:flex;height:100vh;position:relative;z-index:1}
.sidebar{width:228px;flex-shrink:0;background:var(--glass);backdrop-filter:blur(24px);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:10}
.main{flex:1;overflow-y:auto}
.logo-wrap{padding:24px 20px 18px;border-bottom:1px solid var(--border)}
.logo-text{font-family:var(--font-d);font-size:21px;font-weight:800;letter-spacing:-.5px;line-height:1}
.logo-ct{color:var(--text)}
.logo-innvo{background:linear-gradient(135deg,var(--teal),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.logo-id{color:var(--teal)}
.logo-pill{display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:10px;font-family:var(--font-m);color:var(--text3);background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px}
.lpdot{width:5px;height:5px;border-radius:50%;background:var(--teal);animation:lp 2s infinite}
@keyframes lp{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,245,212,.5)}50%{opacity:.5;box-shadow:0 0 0 4px rgba(0,245,212,0)}}
.nav-wrap{flex:1;padding:14px 10px;overflow-y:auto}
.nav-grp{font-size:10px;color:var(--text3);font-family:var(--font-m);letter-spacing:.1em;text-transform:uppercase;padding:14px 10px 6px}
.nbtn{display:flex;align-items:center;gap:11px;width:100%;padding:9px 12px;border-radius:var(--r);border:none;background:transparent;color:var(--text2);font-size:13px;font-family:var(--font-b);cursor:pointer;transition:all .18s;text-align:left;margin-bottom:2px}
.nbtn:hover{background:var(--surface2);color:var(--text)}
.nbtn.active{background:linear-gradient(135deg,rgba(0,245,212,.09),rgba(123,110,246,.09));color:var(--teal);border:1px solid rgba(0,245,212,.15)}
.nicon{width:18px;text-align:center;font-size:15px;flex-shrink:0}
.nbadge{margin-left:auto;font-size:10px;background:rgba(255,70,104,.15);color:var(--red);border-radius:20px;padding:1px 7px;font-family:var(--font-m)}
.sf{padding:14px 16px;border-top:1px solid var(--border)}
.tenant{font-size:11px;font-family:var(--font-m);color:var(--text3);background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:9px 12px}
.tenant strong{color:var(--text2);display:block;margin-bottom:2px;font-size:11px}
.page{padding:32px 36px;min-height:100%;animation:pin .22s ease}
@keyframes pin{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.ph{margin-bottom:30px}
.phtop{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.ptitle{font-family:var(--font-d);font-size:26px;font-weight:700;letter-spacing:-.4px;color:var(--text)}
.ptitle span{background:linear-gradient(135deg,var(--teal),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.psub{font-size:13px;color:var(--text2);margin-top:5px}
.pact{display:flex;gap:8px;flex-shrink:0;margin-top:2px}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--r);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .18s;font-family:var(--font-b);white-space:nowrap}
.btn-p{background:linear-gradient(135deg,var(--teal),var(--teal2));color:#000;font-weight:600}
.btn-p:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,245,212,.22)}
.btn-s{background:var(--surface2);color:var(--text);border:1px solid var(--border2)}
.btn-s:hover{background:var(--surface3);border-color:var(--border3)}
.btn-g{background:transparent;color:var(--text2);border:1px solid var(--border)}
.btn-g:hover{border-color:var(--border2);color:var(--text);background:var(--surface)}
.btn-v{background:linear-gradient(135deg,var(--violet),var(--violet2));color:#fff}
.btn-v:hover{opacity:.9;transform:translateY(-1px)}
.btn-sm{padding:6px 13px;font-size:12px}
.btn-xs{padding:4px 10px;font-size:11px}
.btn:disabled{opacity:.3;cursor:not-allowed;transform:none!important}
.sgrid{display:grid;gap:14px;margin-bottom:26px}
.c4{grid-template-columns:repeat(4,1fr)}.c3{grid-template-columns:repeat(3,1fr)}.c5{grid-template-columns:repeat(5,1fr)}
.sc{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:20px 22px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s}
.sc:hover{border-color:var(--border2);transform:translateY(-2px)}
.sc-glow{position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;filter:blur(28px);opacity:.18;pointer-events:none}
.slbl{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}
.sval{font-family:var(--font-d);font-size:36px;font-weight:700;line-height:1;letter-spacing:-.5px}
.ssub{font-size:12px;color:var(--text3);margin-top:8px}
.gcard{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);overflow:hidden}
.gch{padding:16px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.gct{font-family:var(--font-d);font-size:14px;font-weight:600;color:var(--text)}
.gcs{font-size:12px;color:var(--text3);margin-top:2px}
table{width:100%;border-collapse:collapse}
th{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.07em;text-transform:uppercase;padding:11px 20px;text-align:left;border-bottom:1px solid var(--border);font-weight:400;white-space:nowrap}
td{padding:12px 20px;font-size:13px;color:var(--text2);border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tbody tr{transition:background .12s}
tbody tr:hover td{background:rgba(255,255,255,.02)}
.light tbody tr:hover td{background:rgba(0,0,0,.02)}
.tdp{color:var(--text);font-weight:500}
.tdm{font-family:var(--font-m);font-size:11px;color:var(--text3)}
.chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap;font-family:var(--font-m)}
.ct-t{background:rgba(0,245,212,.1);color:var(--teal);border:1px solid rgba(0,245,212,.2)}
.ct-r{background:rgba(255,70,104,.1);color:var(--red);border:1px solid rgba(255,70,104,.2)}
.ct-a{background:rgba(255,181,71,.1);color:var(--amber);border:1px solid rgba(255,181,71,.2)}
.ct-v{background:rgba(123,110,246,.1);color:var(--violet);border:1px solid rgba(123,110,246,.2)}
.ct-g{background:rgba(34,211,160,.1);color:var(--green);border:1px solid rgba(34,211,160,.2)}
.ct-b{background:rgba(56,189,248,.1);color:var(--blue);border:1px solid rgba(56,189,248,.2)}
.ct-gh{background:var(--surface2);color:var(--text3);border:1px solid var(--border)}
.fbar{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.fc{padding:6px 14px;border-radius:20px;font-size:12px;font-family:var(--font-b);cursor:pointer;border:1px solid var(--border);color:var(--text2);background:transparent;transition:all .15s}
.fc:hover{border-color:var(--border2);color:var(--text)}
.fc.on{border-color:rgba(0,245,212,.4);color:var(--teal);background:rgba(0,245,212,.07)}
.sbox{padding:8px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;width:220px;transition:border .15s}
.sbox::placeholder{color:var(--text3)}
.sbox:focus{border-color:rgba(0,245,212,.4)}
.dbar{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:20px 24px;margin-bottom:20px}
.dbar-lbl{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}
.dbar-track{height:6px;border-radius:4px;overflow:hidden;display:flex;gap:2px;margin-bottom:14px;background:var(--surface)}
.dbar-seg{height:100%;border-radius:3px;transition:flex .6s cubic-bezier(.34,1.56,.64,1)}
.dbar-leg{display:flex;gap:18px;flex-wrap:wrap}
.dleg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text2)}
.dleg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dleg-n{font-family:var(--font-m);font-size:11px;font-weight:500}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.panel{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px}
.panel-title{font-family:var(--font-d);font-size:15px;font-weight:600;color:var(--text);margin-bottom:20px}
.flbl{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px;display:block}
.fi{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;transition:border .15s}
.fi:focus{border-color:rgba(0,245,212,.4);background:var(--surface3)}
.fi::placeholder{color:var(--text3)}
.fsel{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;cursor:pointer;appearance:none}
.fta{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;resize:vertical;min-height:110px;transition:border .15s;line-height:1.6}
.fta:focus{border-color:rgba(0,245,212,.4)}
.fg{margin-bottom:18px}
.code-out{background:#040710;border:1px solid var(--border);border-radius:var(--rl);padding:18px;font-family:var(--font-m);font-size:12px;color:#7EFFD4;min-height:360px;white-space:pre-wrap;overflow-y:auto;line-height:1.7}
.light .code-out{background:#F8FAFF;color:#007A5E;border-color:var(--border)}
.cph{color:var(--text3)}
.cur{display:inline-block;width:7px;height:14px;background:var(--teal);animation:blink .65s infinite;vertical-align:text-bottom;border-radius:1px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.wiz{display:flex;align-items:center;margin-bottom:28px}
.wstep{display:flex;align-items:center;gap:10px}
.wnum{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;border:1px solid var(--border2);color:var(--text3);background:var(--surface);transition:all .3s;font-family:var(--font-m)}
.wstep.done .wnum{background:var(--green);border-color:var(--green);color:#000}
.wstep.active .wnum{background:linear-gradient(135deg,var(--teal),var(--violet));border-color:transparent;color:#000}
.wlbl{font-size:12px;color:var(--text3)}
.wstep.active .wlbl{color:var(--text)}
.wstep.done .wlbl{color:var(--text2)}
.wline{flex:1;height:1px;background:var(--border);margin:0 12px;max-width:48px}
.rcard{background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:var(--rl);padding:18px 22px;display:flex;align-items:center;gap:18px;cursor:pointer;transition:all .2s;margin-bottom:10px}
.rcard:hover{border-color:var(--border2);transform:translateX(3px)}
.rcard.sel{border-color:rgba(0,245,212,.3);background:rgba(0,245,212,.04)}
.ricon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.rinfo{flex:1}
.rname{font-weight:600;color:var(--text);font-family:var(--font-d);font-size:15px}
.rapps{font-size:12px;color:var(--text3);margin-top:2px}
.rstats{display:flex;gap:20px;text-align:right}
.rstat{font-size:11px;color:var(--text3)}
.rstat strong{display:block;font-size:18px;font-weight:700;font-family:var(--font-d);color:var(--text);letter-spacing:-.3px}
.sover{position:fixed;inset:0;background:rgba(3,5,10,.87);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.smod{background:var(--glass);backdrop-filter:blur(24px);border:1px solid var(--border2);border-radius:var(--rxl);padding:40px 48px;width:500px;text-align:center}
.stitle{font-family:var(--font-d);font-size:22px;font-weight:700;margin-bottom:6px}
.ssub2{font-size:13px;color:var(--text2);margin-bottom:32px}
.strk{height:3px;background:var(--surface3);border-radius:2px;overflow:hidden;margin-bottom:12px}
.sfill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--teal),var(--violet));transition:width .4s cubic-bezier(.4,0,.2,1)}
.sstep{font-size:12px;color:var(--text3);font-family:var(--font-m)}
.dots{display:inline-flex;gap:4px;align-items:center}
.dots span{width:5px;height:5px;border-radius:50%;background:currentColor;animation:d 1.2s infinite}
.dots span:nth-child(2){animation-delay:.2s}
.dots span:nth-child(3){animation-delay:.4s}
@keyframes d{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
.fb{display:flex;align-items:center;justify-content:space-between}
.fc2{display:flex;align-items:center;gap:8px}
.gap{margin-bottom:20px}
.tag-row{display:flex;gap:6px;flex-wrap:wrap}
.stream-ind{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--teal);font-family:var(--font-m)}
.stream-ind::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--teal);animation:lp 1.2s infinite}
.dp{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px;position:sticky;top:0;align-self:start}

/* ── LINEAGE ─────────────────────────────────── */
.ltabs{display:flex;gap:4px;margin-bottom:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:4px;width:fit-content}
.ltab{padding:7px 18px;border-radius:10px;font-size:13px;font-family:var(--font-b);cursor:pointer;border:none;background:transparent;color:var(--text2);transition:all .18s;font-weight:500}
.ltab.on{background:var(--glass);color:var(--text);border:1px solid var(--border2);box-shadow:0 2px 8px rgba(0,0,0,.15)}
.light .ltab.on{box-shadow:0 2px 8px rgba(0,0,0,.08)}
.lgraph-wrap{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);overflow:hidden;position:relative}
.lgraph-toolbar{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.lgraph-canvas{width:100%;height:580px;position:relative;overflow:hidden;cursor:grab}
.lgraph-canvas:active{cursor:grabbing}
.lnode{position:absolute;border-radius:12px;border:1.5px solid;padding:10px 14px;cursor:pointer;transition:box-shadow .18s,transform .18s;user-select:none;min-width:130px;backdrop-filter:blur(12px)}
.lnode:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.25)}
.lnode.sel{box-shadow:0 0 0 2px var(--teal),0 8px 24px rgba(0,0,0,.3)}
.lnode-icon{font-size:16px;margin-bottom:4px}
.lnode-label{font-size:12px;font-weight:600;color:var(--text);font-family:var(--font-d);line-height:1.2}
.lnode-sub{font-size:10px;color:var(--text3);margin-top:2px;font-family:var(--font-m)}
.lnode-badge{font-size:9px;padding:1px 6px;border-radius:8px;margin-top:5px;display:inline-block;font-family:var(--font-m);font-weight:500}
svg.ledge-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.ledge{stroke-width:1.5;fill:none;opacity:.5}
.ledge.risk{stroke:var(--red);opacity:.7;stroke-dasharray:4 3}
.ledge.data{stroke:var(--violet);opacity:.55}
.ledge.access{stroke:var(--teal);opacity:.55}
.ledge-arrow{fill:var(--teal);opacity:.6}
.ltree-wrap{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px;overflow-y:auto;max-height:640px}
.ltree-node{display:flex;align-items:flex-start;gap:0;position:relative}
.ltree-indent{width:24px;flex-shrink:0;position:relative}
.ltree-indent::before{content:'';position:absolute;left:11px;top:0;bottom:0;width:1px;background:var(--border2)}
.ltree-indent::after{content:'';position:absolute;left:11px;top:14px;width:10px;height:1px;background:var(--border2)}
.ltree-row{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:var(--r);cursor:pointer;transition:background .12s;flex:1;margin-bottom:2px}
.ltree-row:hover{background:var(--surface2)}
.ltree-row.sel{background:rgba(0,212,184,.08);border:1px solid rgba(0,212,184,.2)}
.ltree-expand{width:16px;height:16px;border-radius:4px;background:var(--surface2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text3);flex-shrink:0;cursor:pointer;transition:all .15s}
.ltree-expand:hover{border-color:var(--teal);color:var(--teal)}
.ltree-icon{font-size:14px;flex-shrink:0}
.ltree-name{font-size:13px;font-weight:500;color:var(--text)}
.ltree-meta{font-size:11px;color:var(--text3);font-family:var(--font-m);margin-left:auto}
.lflow-wrap{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px;overflow-x:auto}
.lflow-stage-row{display:flex;gap:0;align-items:stretch;min-width:900px}
.lflow-stage{flex:1;display:flex;flex-direction:column;align-items:center;position:relative}
.lflow-stage-title{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px;text-align:center}
.lflow-cards{display:flex;flex-direction:column;gap:8px;width:100%;padding:0 8px}
.lflow-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:10px 12px;text-align:center;font-size:12px;color:var(--text);font-weight:500;transition:all .15s;cursor:pointer;position:relative}
.lflow-card:hover{border-color:var(--border2);background:var(--surface3)}
.lflow-card.hl{border-color:rgba(0,212,184,.4);background:rgba(0,212,184,.06)}
.lflow-card.risk-hl{border-color:rgba(255,70,104,.4);background:rgba(255,70,104,.06)}
.lflow-arrow{display:flex;align-items:center;justify-content:center;padding:0 4px;color:var(--text3);font-size:18px;flex-shrink:0;padding-top:32px}
.ldetail{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:20px;margin-top:20px}
.ldetail-title{font-family:var(--font-d);font-size:15px;font-weight:600;margin-bottom:14px;color:var(--text)}
.lpath-row{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);flex-wrap:wrap;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:10px 14px;margin-bottom:8px}
.lpath-arrow{color:var(--text3);font-size:14px}
.lpath-node{padding:2px 8px;border-radius:6px;font-family:var(--font-m);font-size:11px}
.lgraph-legend{display:flex;gap:14px;align-items:center;margin-left:auto}
.lleg-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text3)}
.lleg-line{width:20px;height:2px;border-radius:1px}

.cw{display:flex;flex-direction:column;height:calc(100vh - 56px);overflow:hidden;position:relative}
.cw-header{display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:60px;background:var(--glass);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);flex-shrink:0;gap:16px}
.cw-header-l{display:flex;align-items:center;gap:14px}
.cw-logo{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--teal),var(--violet));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 14px rgba(0,212,184,.25)}
.cw-title{font-family:var(--font-d);font-size:16px;font-weight:700;color:var(--text);letter-spacing:-.2px}
.cw-sub{font-size:11px;color:var(--text3);font-family:var(--font-m);margin-top:1px}
.cw-body{display:flex;flex:1;overflow:hidden}
.cw-nav{width:232px;flex-shrink:0;background:var(--glass);backdrop-filter:blur(20px);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}
.cw-nav-section{padding:14px 16px 6px;font-size:10px;color:var(--text3);font-family:var(--font-m);letter-spacing:.1em;text-transform:uppercase}
.cw-nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;transition:all .15s;border-left:2px solid transparent;position:relative}
.cw-nav-item:hover{background:rgba(255,255,255,.03);color:var(--text)}
.cw-nav-item.on{background:rgba(0,212,184,.06);border-left-color:var(--teal)}
.cw-nav-icon{font-size:16px;width:22px;text-align:center;flex-shrink:0}
.cw-nav-label{font-size:12px;font-weight:500;color:var(--text2);line-height:1.3;display:block}
.cw-nav-item.on .cw-nav-label{color:var(--teal)}
.cw-nav-sub{font-size:10px;color:var(--text3);font-family:var(--font-m);display:block;margin-top:1px}
.cw-nav-divider{margin:6px 16px;border:none;border-top:1px solid var(--border)}
.cw-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;background:var(--bg)}
.cw-msgs{flex:1;overflow-y:auto;padding:32px 36px;display:flex;flex-direction:column;gap:24px}
.cw-msgs::-webkit-scrollbar{width:3px}
.cm{display:flex;gap:14px;align-items:flex-start;animation:pin .22s ease}
.cm.u{flex-direction:row-reverse}
.cm-av{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform .15s}
.cm-av.ai{background:linear-gradient(135deg,rgba(0,212,184,.18),rgba(123,110,246,.18));border:1px solid rgba(0,212,184,.22);box-shadow:0 2px 10px rgba(0,212,184,.1)}
.cm-av.u{background:var(--surface3);border:1px solid var(--border2)}
.cm-body{display:flex;flex-direction:column;max-width:65%}
.cm.u .cm-body{align-items:flex-end}
.cm-bubble{padding:14px 18px;border-radius:18px;font-size:13px;line-height:1.68;color:var(--text);position:relative}
.cm-bubble.ai{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-top-left-radius:4px;box-shadow:0 2px 12px rgba(0,0,0,.12)}
.light .cm-bubble.ai{box-shadow:0 2px 12px rgba(0,0,0,.06)}
.cm-bubble.u{background:linear-gradient(135deg,rgba(0,212,184,.1),rgba(123,110,246,.1));border:1px solid rgba(0,212,184,.16);border-top-right-radius:4px}
.cm-time{font-size:10px;color:var(--text3);font-family:var(--font-m);margin-top:5px;padding:0 2px}
.cm-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.cm-chip{padding:5px 12px;border-radius:20px;font-size:11px;border:1px solid var(--border2);color:var(--text2);background:var(--surface);cursor:pointer;transition:all .15s;font-family:var(--font-b)}
.cm-chip:hover{border-color:var(--teal);color:var(--teal);background:rgba(0,212,184,.06);transform:translateY(-1px)}
.cm-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-top:12px;overflow:hidden}
.cm-card-hd{font-family:var(--font-d);font-weight:600;font-size:13px;color:var(--text);margin-bottom:10px;display:flex;align-items:center;gap:7px}
.cm-card-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px}
.cm-card-row:last-child{border-bottom:none}
.cm-card-k{color:var(--text3)}
.cm-card-v{color:var(--text);font-family:var(--font-m);font-size:11px;font-weight:500}
.cm-card-footer{display:flex;align-items:center;gap:7px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:12px;font-weight:600}
.cm-alert{border-radius:var(--r);padding:13px 15px;margin-top:12px;font-size:12px}
.cm-alert.high{background:rgba(255,70,104,.07);border:1px solid rgba(255,70,104,.2)}
.cm-alert.medium{background:rgba(255,181,71,.07);border:1px solid rgba(255,181,71,.2)}
.cm-alert.low{background:rgba(34,211,160,.07);border:1px solid rgba(34,211,160,.18)}
.cm-alert-hd{font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:7px;font-size:13px}
.cm-alert.high .cm-alert-hd{color:var(--red)}
.cm-alert.medium .cm-alert-hd{color:var(--amber)}
.cm-alert.low .cm-alert-hd{color:var(--green)}
.cm-alert-body{color:var(--text2);line-height:1.55}
.cm-typing{display:flex;align-items:center;gap:5px;padding:14px 18px;background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:18px;border-top-left-radius:4px;width:fit-content;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.cm-typing span{width:6px;height:6px;border-radius:50%;background:var(--teal);animation:d 1.3s infinite}
.cm-typing span:nth-child(2){animation-delay:.22s}
.cm-typing span:nth-child(3){animation-delay:.44s}
.cm-typing-txt{font-size:11px;color:var(--text3);margin-left:4px;font-family:var(--font-m)}
.cw-footer{padding:14px 28px 18px;border-top:1px solid var(--border);background:var(--glass);backdrop-filter:blur(24px);flex-shrink:0}
.cw-suggestions{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.cw-sug{padding:5px 13px;border-radius:20px;font-size:11px;border:1px solid var(--border);color:var(--text3);background:transparent;cursor:pointer;transition:all .15s;font-family:var(--font-b);white-space:nowrap}
.cw-sug:hover{border-color:rgba(0,212,184,.35);color:var(--teal);background:rgba(0,212,184,.05)}
.cw-quick-row{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.cw-quick{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:var(--r);font-size:11px;border:1px solid var(--border);color:var(--text2);background:var(--surface);cursor:pointer;transition:all .15s;font-family:var(--font-b)}
.cw-quick:hover{border-color:var(--border2);color:var(--text);background:var(--surface2);transform:translateY(-1px)}
.cw-input-row{display:flex;gap:10px;align-items:flex-end}
.cw-input{flex:1;padding:14px 20px;border-radius:var(--rxl);border:1.5px solid var(--border2);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;resize:none;min-height:50px;max-height:150px;line-height:1.55;transition:all .2s}
.cw-input:focus{border-color:rgba(0,212,184,.5);background:var(--surface3);box-shadow:0 0 0 4px rgba(0,212,184,.07)}
.cw-input::placeholder{color:var(--text3)}
.cw-send{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--teal),var(--violet));border:none;color:#000;font-size:20px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;box-shadow:0 4px 16px rgba(0,212,184,.25)}
.cw-send:hover{transform:scale(1.1) translateY(-2px);box-shadow:0 8px 24px rgba(0,212,184,.4)}
.cw-send:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none}
.cw-hint{font-size:10px;color:var(--text3);font-family:var(--font-m);margin-top:9px;text-align:center;letter-spacing:.02em}
.cw-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;padding:40px;gap:20px}
.cw-welcome-logo{width:72px;height:72px;border-radius:22px;background:linear-gradient(135deg,rgba(0,212,184,.2),rgba(123,110,246,.2));border:1px solid rgba(0,212,184,.25);display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 8px 32px rgba(0,212,184,.15)}
.cw-welcome-title{font-family:var(--font-d);font-size:22px;font-weight:700;color:var(--text);letter-spacing:-.3px}
.cw-welcome-sub{font-size:14px;color:var(--text2);max-width:440px;line-height:1.6}
.cw-welcome-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:500px}
.cw-welcome-chip{padding:8px 16px;border-radius:var(--r);border:1px solid var(--border2);background:var(--surface2);color:var(--text2);font-size:12px;cursor:pointer;transition:all .18s;font-family:var(--font-b)}
.cw-welcome-chip:hover{border-color:rgba(0,212,184,.4);color:var(--teal);background:rgba(0,212,184,.06);transform:translateY(-2px)}ttps://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#03050A;--surface:rgba(255,255,255,0.03);--surface2:rgba(255,255,255,0.055);
  --surface3:rgba(255,255,255,0.09);--glass:rgba(10,15,28,0.72);
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);--border3:rgba(255,255,255,0.20);
  --text:#F0F4FF;--text2:#8B95B0;--text3:#454E66;
  --teal:#00D4B8;--teal2:#00A88E;--violet:#7B6EF6;--violet2:#5A50D4;
  --pink:#F062A4;--amber:#FFB547;--red:#FF4668;--green:#22D3A0;--blue:#38BDF8;
  --font-d:'Outfit',sans-serif;--font-b:'Plus Jakarta Sans',sans-serif;--font-m:'JetBrains Mono',monospace;
  --r:10px;--rl:16px;--rxl:22px;
  --mesh1:rgba(0,212,184,0.07);--mesh2:rgba(123,110,246,0.08);--mesh3:rgba(240,98,164,0.05);
  --grid-c:rgba(255,255,255,.013);
}
.light{
  --bg:#F0F4FA;--surface:rgba(0,0,0,0.025);--surface2:rgba(0,0,0,0.05);
  --surface3:rgba(0,0,0,0.08);--glass:rgba(255,255,255,0.85);
  --border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.14);--border3:rgba(0,0,0,0.22);
  --text:#0F1623;--text2:#4A5568;--text3:#94A3B8;
  --teal:#008C78;--teal2:#006B5C;--violet:#5E50E0;--violet2:#4538C0;
  --mesh1:rgba(0,180,160,0.06);--mesh2:rgba(100,85,220,0.06);--mesh3:rgba(220,80,150,0.04);
  --grid-c:rgba(0,0,0,.025);
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-b);font-size:14px;line-height:1.6;overflow:hidden;transition:background .25s,color .25s}
body::before{content:'';position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 10% 0%,var(--mesh1) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 10%,var(--mesh2) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 50% 100%,var(--mesh3) 0%,transparent 60%);pointer-events:none;transition:background .25s}
body::after{content:'';position:fixed;inset:0;z-index:0;background-image:linear-gradient(var(--grid-c) 1px,transparent 1px),linear-gradient(90deg,var(--grid-c) 1px,transparent 1px);background-size:44px 44px;pointer-events:none}
.theme-toggle{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:9px 12px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface);cursor:pointer;transition:all .15s;width:100%;font-family:var(--font-b)}
.theme-toggle:hover{border-color:var(--border2);background:var(--surface2)}
.toggle-label{font-size:12px;color:var(--text2);display:flex;align-items:center;gap:7px}
.toggle-track{width:38px;height:21px;border-radius:20px;background:var(--surface3);border:1px solid var(--border2);position:relative;transition:background .25s;flex-shrink:0}
.light .toggle-track{background:linear-gradient(135deg,var(--teal),var(--violet))}
.toggle-thumb{position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .28s cubic-bezier(.34,1.56,.64,1);box-shadow:0 1px 5px rgba(0,0,0,.35)}
.light .toggle-thumb{transform:translateX(17px)}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
.shell{display:flex;height:100vh;position:relative;z-index:1}
.sidebar{width:228px;flex-shrink:0;background:var(--glass);backdrop-filter:blur(24px);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:10}
.main{flex:1;overflow-y:auto}
.logo-wrap{padding:24px 20px 18px;border-bottom:1px solid var(--border)}
.logo-text{font-family:var(--font-d);font-size:21px;font-weight:800;letter-spacing:-.5px;line-height:1}
.logo-ct{color:var(--text)}
.logo-innvo{background:linear-gradient(135deg,var(--teal),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.logo-id{color:var(--teal)}
.logo-pill{display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:10px;font-family:var(--font-m);color:var(--text3);background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px}
.lpdot{width:5px;height:5px;border-radius:50%;background:var(--teal);animation:lp 2s infinite}
@keyframes lp{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,245,212,.5)}50%{opacity:.5;box-shadow:0 0 0 4px rgba(0,245,212,0)}}
.nav-wrap{flex:1;padding:14px 10px;overflow-y:auto}
.nav-grp{font-size:10px;color:var(--text3);font-family:var(--font-m);letter-spacing:.1em;text-transform:uppercase;padding:14px 10px 6px}
.nbtn{display:flex;align-items:center;gap:11px;width:100%;padding:9px 12px;border-radius:var(--r);border:none;background:transparent;color:var(--text2);font-size:13px;font-family:var(--font-b);cursor:pointer;transition:all .18s;text-align:left;margin-bottom:2px}
.nbtn:hover{background:var(--surface2);color:var(--text)}
.nbtn.active{background:linear-gradient(135deg,rgba(0,245,212,.09),rgba(123,110,246,.09));color:var(--teal);border:1px solid rgba(0,245,212,.15)}
.nicon{width:18px;text-align:center;font-size:15px;flex-shrink:0}
.nbadge{margin-left:auto;font-size:10px;background:rgba(255,70,104,.15);color:var(--red);border-radius:20px;padding:1px 7px;font-family:var(--font-m)}
.sf{padding:14px 16px;border-top:1px solid var(--border)}
.tenant{font-size:11px;font-family:var(--font-m);color:var(--text3);background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:9px 12px}
.tenant strong{color:var(--text2);display:block;margin-bottom:2px;font-size:11px}
.page{padding:32px 36px;min-height:100%;animation:pin .22s ease}
@keyframes pin{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.ph{margin-bottom:30px}
.phtop{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.ptitle{font-family:var(--font-d);font-size:26px;font-weight:700;letter-spacing:-.4px;color:var(--text)}
.ptitle span{background:linear-gradient(135deg,var(--teal),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.psub{font-size:13px;color:var(--text2);margin-top:5px}
.pact{display:flex;gap:8px;flex-shrink:0;margin-top:2px}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--r);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .18s;font-family:var(--font-b);white-space:nowrap}
.btn-p{background:linear-gradient(135deg,var(--teal),var(--teal2));color:#000;font-weight:600}
.btn-p:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,245,212,.22)}
.btn-s{background:var(--surface2);color:var(--text);border:1px solid var(--border2)}
.btn-s:hover{background:var(--surface3);border-color:var(--border3)}
.btn-g{background:transparent;color:var(--text2);border:1px solid var(--border)}
.btn-g:hover{border-color:var(--border2);color:var(--text);background:var(--surface)}
.btn-v{background:linear-gradient(135deg,var(--violet),var(--violet2));color:#fff}
.btn-v:hover{opacity:.9;transform:translateY(-1px)}
.btn-sm{padding:6px 13px;font-size:12px}
.btn-xs{padding:4px 10px;font-size:11px}
.btn:disabled{opacity:.3;cursor:not-allowed;transform:none!important}
.sgrid{display:grid;gap:14px;margin-bottom:26px}
.c4{grid-template-columns:repeat(4,1fr)}.c3{grid-template-columns:repeat(3,1fr)}.c5{grid-template-columns:repeat(5,1fr)}
.sc{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:20px 22px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s}
.sc:hover{border-color:var(--border2);transform:translateY(-2px)}
.sc-glow{position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;filter:blur(28px);opacity:.18;pointer-events:none}
.slbl{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}
.sval{font-family:var(--font-d);font-size:36px;font-weight:700;line-height:1;letter-spacing:-.5px}
.ssub{font-size:12px;color:var(--text3);margin-top:8px}
.gcard{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);overflow:hidden}
.gch{padding:16px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.gct{font-family:var(--font-d);font-size:14px;font-weight:600;color:var(--text)}
.gcs{font-size:12px;color:var(--text3);margin-top:2px}
table{width:100%;border-collapse:collapse}
th{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.07em;text-transform:uppercase;padding:11px 20px;text-align:left;border-bottom:1px solid var(--border);font-weight:400;white-space:nowrap}
td{padding:12px 20px;font-size:13px;color:var(--text2);border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tbody tr{transition:background .12s}
tbody tr:hover td{background:rgba(255,255,255,.02)}
.light tbody tr:hover td{background:rgba(0,0,0,.02)}
.tdp{color:var(--text);font-weight:500}
.tdm{font-family:var(--font-m);font-size:11px;color:var(--text3)}
.chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap;font-family:var(--font-m)}
.ct-t{background:rgba(0,245,212,.1);color:var(--teal);border:1px solid rgba(0,245,212,.2)}
.ct-r{background:rgba(255,70,104,.1);color:var(--red);border:1px solid rgba(255,70,104,.2)}
.ct-a{background:rgba(255,181,71,.1);color:var(--amber);border:1px solid rgba(255,181,71,.2)}
.ct-v{background:rgba(123,110,246,.1);color:var(--violet);border:1px solid rgba(123,110,246,.2)}
.ct-g{background:rgba(34,211,160,.1);color:var(--green);border:1px solid rgba(34,211,160,.2)}
.ct-b{background:rgba(56,189,248,.1);color:var(--blue);border:1px solid rgba(56,189,248,.2)}
.ct-gh{background:var(--surface2);color:var(--text3);border:1px solid var(--border)}
.fbar{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.fc{padding:6px 14px;border-radius:20px;font-size:12px;font-family:var(--font-b);cursor:pointer;border:1px solid var(--border);color:var(--text2);background:transparent;transition:all .15s}
.fc:hover{border-color:var(--border2);color:var(--text)}
.fc.on{border-color:rgba(0,245,212,.4);color:var(--teal);background:rgba(0,245,212,.07)}
.sbox{padding:8px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;width:220px;transition:border .15s}
.sbox::placeholder{color:var(--text3)}
.sbox:focus{border-color:rgba(0,245,212,.4)}
.dbar{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:20px 24px;margin-bottom:20px}
.dbar-lbl{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}
.dbar-track{height:6px;border-radius:4px;overflow:hidden;display:flex;gap:2px;margin-bottom:14px;background:var(--surface)}
.dbar-seg{height:100%;border-radius:3px;transition:flex .6s cubic-bezier(.34,1.56,.64,1)}
.dbar-leg{display:flex;gap:18px;flex-wrap:wrap}
.dleg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text2)}
.dleg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dleg-n{font-family:var(--font-m);font-size:11px;font-weight:500}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.panel{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px}
.panel-title{font-family:var(--font-d);font-size:15px;font-weight:600;color:var(--text);margin-bottom:20px}
.flbl{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px;display:block}
.fi{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;transition:border .15s}
.fi:focus{border-color:rgba(0,245,212,.4);background:var(--surface3)}
.fi::placeholder{color:var(--text3)}
.fsel{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;cursor:pointer;appearance:none}
.fta{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;resize:vertical;min-height:110px;transition:border .15s;line-height:1.6}
.fta:focus{border-color:rgba(0,245,212,.4)}
.fg{margin-bottom:18px}
.code-out{background:#040710;border:1px solid var(--border);border-radius:var(--rl);padding:18px;font-family:var(--font-m);font-size:12px;color:#7EFFD4;min-height:360px;white-space:pre-wrap;overflow-y:auto;line-height:1.7}
.light .code-out{background:#F8FAFF;color:#007A5E;border-color:var(--border)}
.cph{color:var(--text3)}
.cur{display:inline-block;width:7px;height:14px;background:var(--teal);animation:blink .65s infinite;vertical-align:text-bottom;border-radius:1px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.wiz{display:flex;align-items:center;margin-bottom:28px}
.wstep{display:flex;align-items:center;gap:10px}
.wnum{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;border:1px solid var(--border2);color:var(--text3);background:var(--surface);transition:all .3s;font-family:var(--font-m)}
.wstep.done .wnum{background:var(--green);border-color:var(--green);color:#000}
.wstep.active .wnum{background:linear-gradient(135deg,var(--teal),var(--violet));border-color:transparent;color:#000}
.wlbl{font-size:12px;color:var(--text3)}
.wstep.active .wlbl{color:var(--text)}
.wstep.done .wlbl{color:var(--text2)}
.wline{flex:1;height:1px;background:var(--border);margin:0 12px;max-width:48px}
.rcard{background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:var(--rl);padding:18px 22px;display:flex;align-items:center;gap:18px;cursor:pointer;transition:all .2s;margin-bottom:10px}
.rcard:hover{border-color:var(--border2);transform:translateX(3px)}
.rcard.sel{border-color:rgba(0,245,212,.3);background:rgba(0,245,212,.04)}
.ricon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.rinfo{flex:1}
.rname{font-weight:600;color:var(--text);font-family:var(--font-d);font-size:15px}
.rapps{font-size:12px;color:var(--text3);margin-top:2px}
.rstats{display:flex;gap:20px;text-align:right}
.rstat{font-size:11px;color:var(--text3)}
.rstat strong{display:block;font-size:18px;font-weight:700;font-family:var(--font-d);color:var(--text);letter-spacing:-.3px}
.sover{position:fixed;inset:0;background:rgba(3,5,10,.87);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.smod{background:var(--glass);backdrop-filter:blur(24px);border:1px solid var(--border2);border-radius:var(--rxl);padding:40px 48px;width:500px;text-align:center}
.stitle{font-family:var(--font-d);font-size:22px;font-weight:700;margin-bottom:6px}
.ssub2{font-size:13px;color:var(--text2);margin-bottom:32px}
.strk{height:3px;background:var(--surface3);border-radius:2px;overflow:hidden;margin-bottom:12px}
.sfill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--teal),var(--violet));transition:width .4s cubic-bezier(.4,0,.2,1)}
.sstep{font-size:12px;color:var(--text3);font-family:var(--font-m)}
.dots{display:inline-flex;gap:4px;align-items:center}
.dots span{width:5px;height:5px;border-radius:50%;background:currentColor;animation:d 1.2s infinite}
.dots span:nth-child(2){animation-delay:.2s}
.dots span:nth-child(3){animation-delay:.4s}
@keyframes d{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
.fb{display:flex;align-items:center;justify-content:space-between}
.fc2{display:flex;align-items:center;gap:8px}
.gap{margin-bottom:20px}
.tag-row{display:flex;gap:6px;flex-wrap:wrap}
.stream-ind{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--teal);font-family:var(--font-m)}
.stream-ind::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--teal);animation:lp 1.2s infinite}
.dp{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px;position:sticky;top:0;align-self:start}

/* ── LINEAGE ─────────────────────────────────── */
.ltabs{display:flex;gap:4px;margin-bottom:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:4px;width:fit-content}
.ltab{padding:7px 18px;border-radius:10px;font-size:13px;font-family:var(--font-b);cursor:pointer;border:none;background:transparent;color:var(--text2);transition:all .18s;font-weight:500}
.ltab.on{background:var(--glass);color:var(--text);border:1px solid var(--border2);box-shadow:0 2px 8px rgba(0,0,0,.15)}
.light .ltab.on{box-shadow:0 2px 8px rgba(0,0,0,.08)}
.lgraph-wrap{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);overflow:hidden;position:relative}
.lgraph-toolbar{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.lgraph-canvas{width:100%;height:580px;position:relative;overflow:hidden;cursor:grab}
.lgraph-canvas:active{cursor:grabbing}
.lnode{position:absolute;border-radius:12px;border:1.5px solid;padding:10px 14px;cursor:pointer;transition:box-shadow .18s,transform .18s;user-select:none;min-width:130px;backdrop-filter:blur(12px)}
.lnode:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.25)}
.lnode.sel{box-shadow:0 0 0 2px var(--teal),0 8px 24px rgba(0,0,0,.3)}
.lnode-icon{font-size:16px;margin-bottom:4px}
.lnode-label{font-size:12px;font-weight:600;color:var(--text);font-family:var(--font-d);line-height:1.2}
.lnode-sub{font-size:10px;color:var(--text3);margin-top:2px;font-family:var(--font-m)}
.lnode-badge{font-size:9px;padding:1px 6px;border-radius:8px;margin-top:5px;display:inline-block;font-family:var(--font-m);font-weight:500}
svg.ledge-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.ledge{stroke-width:1.5;fill:none;opacity:.5}
.ledge.risk{stroke:var(--red);opacity:.7;stroke-dasharray:4 3}
.ledge.data{stroke:var(--violet);opacity:.55}
.ledge.access{stroke:var(--teal);opacity:.55}
.ledge-arrow{fill:var(--teal);opacity:.6}
.ltree-wrap{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px;overflow-y:auto;max-height:640px}
.ltree-node{display:flex;align-items:flex-start;gap:0;position:relative}
.ltree-indent{width:24px;flex-shrink:0;position:relative}
.ltree-indent::before{content:'';position:absolute;left:11px;top:0;bottom:0;width:1px;background:var(--border2)}
.ltree-indent::after{content:'';position:absolute;left:11px;top:14px;width:10px;height:1px;background:var(--border2)}
.ltree-row{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:var(--r);cursor:pointer;transition:background .12s;flex:1;margin-bottom:2px}
.ltree-row:hover{background:var(--surface2)}
.ltree-row.sel{background:rgba(0,212,184,.08);border:1px solid rgba(0,212,184,.2)}
.ltree-expand{width:16px;height:16px;border-radius:4px;background:var(--surface2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text3);flex-shrink:0;cursor:pointer;transition:all .15s}
.ltree-expand:hover{border-color:var(--teal);color:var(--teal)}
.ltree-icon{font-size:14px;flex-shrink:0}
.ltree-name{font-size:13px;font-weight:500;color:var(--text)}
.ltree-meta{font-size:11px;color:var(--text3);font-family:var(--font-m);margin-left:auto}
.lflow-wrap{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:24px;overflow-x:auto}
.lflow-stage-row{display:flex;gap:0;align-items:stretch;min-width:900px}
.lflow-stage{flex:1;display:flex;flex-direction:column;align-items:center;position:relative}
.lflow-stage-title{font-size:11px;color:var(--text3);font-family:var(--font-m);letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px;text-align:center}
.lflow-cards{display:flex;flex-direction:column;gap:8px;width:100%;padding:0 8px}
.lflow-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:10px 12px;text-align:center;font-size:12px;color:var(--text);font-weight:500;transition:all .15s;cursor:pointer;position:relative}
.lflow-card:hover{border-color:var(--border2);background:var(--surface3)}
.lflow-card.hl{border-color:rgba(0,212,184,.4);background:rgba(0,212,184,.06)}
.lflow-card.risk-hl{border-color:rgba(255,70,104,.4);background:rgba(255,70,104,.06)}
.lflow-arrow{display:flex;align-items:center;justify-content:center;padding:0 4px;color:var(--text3);font-size:18px;flex-shrink:0;padding-top:32px}
.ldetail{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rxl);padding:20px;margin-top:20px}
.ldetail-title{font-family:var(--font-d);font-size:15px;font-weight:600;margin-bottom:14px;color:var(--text)}
.lpath-row{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);flex-wrap:wrap;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:10px 14px;margin-bottom:8px}
.lpath-arrow{color:var(--text3);font-size:14px}
.lpath-node{padding:2px 8px;border-radius:6px;font-family:var(--font-m);font-size:11px}
.lgraph-legend{display:flex;gap:14px;align-items:center;margin-left:auto}
.lleg-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text3)}
.lleg-line{width:20px;height:2px;border-radius:1px}
`;

const API = "/api";
// Live data hooks — fetched from Entra ID via backend
async function apiFetch(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
// Fallback static identities (shown while loading)
const IDENTITIES_FALLBACK=[];

const APPS=[
  {id:1,name:"SAP S/4HANA",cat:"ERP",ok:false,method:"—",risk:"critical",owner:"Finance"},
  {id:2,name:"ServiceNow",cat:"ITSM",ok:true,method:"SCIM",risk:"low",owner:"IT Ops"},
  {id:3,name:"Salesforce",cat:"CRM",ok:true,method:"SAML/OIDC",risk:"low",owner:"Sales"},
  {id:4,name:"Oracle HCM",cat:"HRMS",ok:false,method:"—",risk:"critical",owner:"HR"},
  {id:5,name:"Workday",cat:"HR/FIN",ok:false,method:"—",risk:"high",owner:"HR"},
  {id:6,name:"GitHub Enterprise",cat:"DevTools",ok:true,method:"SAML",risk:"medium",owner:"Engineering"},
  {id:7,name:"Jira Software",cat:"DevTools",ok:true,method:"SAML",risk:"low",owner:"Engineering"},
  {id:8,name:"Zoom",cat:"Collab",ok:true,method:"OIDC",risk:"low",owner:"IT"},
  {id:9,name:"Legacy ERP (BAAN)",cat:"ERP",ok:false,method:"RPA needed",risk:"critical",owner:"Operations"},
  {id:10,name:"Oracle DB Console",cat:"Database",ok:false,method:"—",risk:"high",owner:"DBA Team"},
  {id:11,name:"Confluence",cat:"Collab",ok:true,method:"SAML",risk:"low",owner:"Engineering"},
  {id:12,name:"Adobe Creative Cloud",cat:"Design",ok:false,method:"—",risk:"medium",owner:"Marketing"},
  {id:13,name:"NetSuite",cat:"Finance",ok:false,method:"—",risk:"high",owner:"Finance"},
  {id:14,name:"PaloAlto SIEM",cat:"Security",ok:true,method:"API",risk:"low",owner:"SOC"},
  {id:15,name:"Legacy Payroll App",cat:"Finance",ok:false,method:"RPA needed",risk:"critical",owner:"Payroll"},
];
const ROLES=[
  {id:1,name:"Finance Analyst",icon:"💰",color:"#FFB547",members:23,ents:14,sod:false,conf:94,apps:["NetSuite","SAP S/4HANA","Confluence"]},
  {id:2,name:"IT Administrator",icon:"🔧",color:"#38BDF8",members:8,ents:31,sod:true,conf:88,apps:["ServiceNow","GitHub Enterprise","Azure Portal"]},
  {id:3,name:"Sales Executive",icon:"📈",color:"#00F5D4",members:41,ents:9,sod:false,conf:97,apps:["Salesforce","Zoom","Confluence"]},
  {id:4,name:"DevOps Engineer",icon:"⚙️",color:"#7B6EF6",members:12,ents:22,sod:false,conf:91,apps:["GitHub Enterprise","Jira Software","Azure DevOps"]},
  {id:5,name:"HR Business Partner",icon:"👥",color:"#F062A4",members:17,ents:11,sod:false,conf:89,apps:["Workday","Oracle HCM","Confluence"]},
  {id:6,name:"Security Analyst",icon:"🛡️",color:"#FF4668",members:6,ents:18,sod:true,conf:82,apps:["PaloAlto SIEM","Azure Sentinel","ServiceNow"]},
];
const TM={human:{label:"Human",color:"#38BDF8"},service:{label:"Service",color:"#7B6EF6"},machine:{label:"Machine",color:"#00F5D4"},vendor:{label:"Vendor",color:"#FFB547"},local:{label:"Local",color:"#FF4668"}};

const riskChip=r=>{
  if(r==="critical")return <span className="chip ct-r">⬤ Critical</span>;
  if(r==="high")return <span className="chip ct-a">⬤ High</span>;
  if(r==="medium")return <span className="chip ct-v">⬤ Medium</span>;
  return <span className="chip ct-g">⬤ Low</span>;
};
const stChip=s=>s==="dormant"?<span className="chip ct-a">Dormant</span>:<span className="chip ct-t">Active</span>;
const tyChip=t=>{const m=TM[t]||TM.human;return <span className="chip" style={{background:`${m.color}14`,color:m.color,border:`1px solid ${m.color}28`}}>{m.label}</span>;};

const NAV=[{id:"dashboard",icon:"◈",label:"Overview",badge:null},{id:"identities",icon:"◉",label:"Identity Map",badge:null},{id:"apps",icon:"⬡",label:"App Coverage",badge:"7 gaps"},{id:"connector",icon:"⟳",label:"Connector Studio",badge:null},{id:"rpa",icon:"⬟",label:"RPA Builder",badge:null},{id:"roles",icon:"◆",label:"Role Mining",badge:null},{id:"lineage",icon:"⟡",label:"Lineage",badge:null},{id:"discovery",icon:"◎",label:"Discovery",badge:null},{id:"integrations",icon:"⬢",label:"Integration Hub",badge:null},{id:"chatbot",icon:"◌",label:"AI Assistant",badge:"Beta"}];

function Sidebar({page,setPage,dark,setDark,live,loading}){
  return(
    <div className="sidebar">
      <div className="logo-wrap">
        <div className="logo-text"><span className="logo-ct">CT</span><span className="logo-innvo">Innvo</span><span className="logo-id">ID</span></div>
        <div className="logo-pill">
          <span className="lpdot" style={{background:live?"var(--teal)":loading?"var(--amber)":"var(--red)"}}/>
          {loading?"Connecting…":live?"Live · IdenAccess":"Offline · Mock data"}
        </div>
      </div>
      <div className="nav-wrap">
        <div className="nav-grp">Platform</div>
        {NAV.map(n=>(
          <button key={n.id} className={`nbtn ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
            <span className="nicon">{n.icon}</span>{n.label}
            {n.badge&&<span className="nbadge">{n.badge}</span>}
          </button>
        ))}
      </div>
      <div className="sf">
        <button className="theme-toggle" onClick={()=>setDark(d=>!d)}>
          <span className="toggle-label">{dark?"🌙 Dark mode":"☀️ Light mode"}</span>
          <div className="toggle-track"><div className="toggle-thumb"/></div>
        </button>
        <div className="tenant"><strong>Tenant</strong>contoso.onmicrosoft.com</div>
      </div>
    </div>
  );
}

function Dashboard({setPage,scanning,setScanning,liveData,reloadData}){
  const [prog,setProg]=useState(0);const [step,setStep]=useState("");
  const IDENTITIES=liveData?.identities||IDENTITIES_FALLBACK;
  const steps=["Authenticating with Microsoft Graph…","Enumerating user identities…","Discovering service principals…","Scanning enterprise applications…","Analysing sign-in logs…","Classifying dormant accounts…","Computing risk scores…","Scan complete ✓"];
  const runScan=()=>{
    setScanning(true);setProg(0);setStep(steps[0]);
    let i=0;
    const iv=setInterval(()=>{i++;setProg(Math.round(i/steps.length*100));setStep(steps[i]||steps[steps.length-1]);
      if(i>=steps.length){clearInterval(iv);setTimeout(()=>{setScanning(false);reloadData();},700);}
    },650);
  };
  const sum=liveData?.summary||{};
  const tot=sum.total||0,crit=sum.critical||0,dorm=sum.dormant||0,intg=APPS.filter(x=>x.ok).length;
  return(
    <div className="page">
      {scanning&&<div className="sover"><div className="smod"><div className="stitle">Scanning Environment</div><div className="ssub2">Querying Microsoft Entra ID via Graph API</div><div className="strk"><div className="sfill" style={{width:`${prog}%`}}/></div><div className="sstep">{step}</div></div></div>}
      <div className="ph"><div className="phtop"><div><div className="ptitle">Security <span>Overview</span></div><div className="psub">Last scan: 2 min ago · contoso.onmicrosoft.com</div></div><div className="pact"><button className="btn btn-g btn-sm" onClick={()=>setPage("connector")}>+ Connector</button><button className="btn btn-p" onClick={runScan}>⟳ Run Scan</button></div></div></div>
      <div className="sgrid c4 gap">
        <div className="sc" style={{cursor:"pointer"}} onClick={()=>setPage("identities")}><div className="sc-glow" style={{background:"#38BDF8"}}/><div className="slbl">Total Identities</div><div className="sval" style={{color:"#38BDF8"}}>{tot}</div><div className="ssub">All types · Entra ID</div></div>
        <div className="sc" style={{cursor:"pointer"}} onClick={()=>setPage("identities")}><div className="sc-glow" style={{background:"#FF4668"}}/><div className="slbl">Critical Risk</div><div className="sval" style={{color:"#FF4668"}}>{crit}</div><div className="ssub">Immediate action</div></div>
        <div className="sc" style={{cursor:"pointer"}} onClick={()=>setPage("identities")}><div className="sc-glow" style={{background:"#FFB547"}}/><div className="slbl">Dormant Accounts</div><div className="sval" style={{color:"#FFB547"}}>{dorm}</div><div className="ssub">90+ days inactive</div></div>
        <div className="sc" style={{cursor:"pointer"}} onClick={()=>setPage("apps")}><div className="sc-glow" style={{background:"#00F5D4"}}/><div className="slbl">App Coverage</div><div className="sval" style={{color:"#00F5D4"}}>{intg}<span style={{fontSize:20,color:"var(--text3)"}}>/{APPS.length}</span></div><div className="ssub">{APPS.filter(x=>!x.ok).length} gaps remaining</div></div>
      </div>
      <div className="dbar gap">
        <div className="dbar-lbl">Identity distribution</div>
        <div className="dbar-track">{Object.entries(TM).map(([k,m])=>{const c=liveData?.summary?.[k]||IDENTITIES.filter(x=>x.type===k).length;return <div key={k} className="dbar-seg" style={{flex:c||1,background:m.color}}/>;})}</div>
        <div className="dbar-leg">{Object.entries(TM).map(([k,m])=>{const c=liveData?.summary?.[k]||IDENTITIES.filter(x=>x.type===k).length;return(<div key={k} className="dleg"><div className="dleg-dot" style={{background:m.color}}/>{m.label}<span className="dleg-n" style={{color:m.color}}>{c}</span></div>);})}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="gcard"><div className="gch"><div><div className="gct">Critical & High Risk</div><div className="gcs">Requires immediate review</div></div><button className="btn btn-g btn-xs" onClick={()=>setPage("identities")}>View all →</button></div>
          <table><thead><tr><th>Identity</th><th>Type</th><th>Risk</th></tr></thead><tbody>{IDENTITIES.filter(x=>x.risk==="critical"||x.risk==="high").slice(0,5).map(i=>(<tr key={i.id}><td><div className="tdp">{i.name}</div><div className="tdm">{i.upn}</div></td><td>{tyChip(i.type)}</td><td>{riskChip(i.risk)}</td></tr>))}</tbody></table>
        </div>
        <div className="gcard"><div className="gch"><div><div className="gct">Integration Gaps</div><div className="gcs">Apps not in Entra ID</div></div><button className="btn btn-g btn-xs" onClick={()=>setPage("apps")}>View all →</button></div>
          <table><thead><tr><th>Application</th><th>Category</th><th>Risk</th></tr></thead><tbody>{APPS.filter(x=>!x.ok).slice(0,5).map(a=>(<tr key={a.id}><td className="tdp">{a.name}</td><td><span className="chip ct-gh">{a.cat}</span></td><td>{riskChip(a.risk)}</td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
}

function Identities({liveData}){
  const [filter,setFilter]=useState("all");const [search,setSearch]=useState("");
  const IDENTITIES=liveData?.identities||IDENTITIES_FALLBACK;
  const chips=["all","human","service","machine","vendor","local","dormant","critical"];
  const rows=IDENTITIES.filter(i=>{const mf=filter==="all"||i.type===filter||(filter==="dormant"&&i.status==="dormant")||(filter==="critical"&&i.risk==="critical");const ms=!search||i.name.toLowerCase().includes(search.toLowerCase())||i.upn.toLowerCase().includes(search.toLowerCase());return mf&&ms;});
  return(
    <div className="page">
      <div className="ph"><div className="ptitle">Identity <span>Map</span></div><div className="psub">{liveData?.summary?.total||IDENTITIES.length} identities discovered · IdenAccess.onmicrosoft.com <span style={{color:"var(--teal)",fontSize:11,fontFamily:"var(--font-m)",marginLeft:8}}>● Live</span></div></div>
      <div className="sgrid c5 gap">{Object.entries(TM).map(([k,m])=>(<div key={k} className="sc" style={{cursor:"pointer",borderColor:filter===k?`${m.color}50`:""}} onClick={()=>setFilter(filter===k?"all":k)}><div className="sc-glow" style={{background:m.color}}/><div className="slbl">{m.label}</div><div className="sval" style={{color:m.color,fontSize:28}}>{liveData?.summary?.[k]||IDENTITIES.filter(x=>x.type===k).length}</div></div>))}</div>
      <div className="fbar">{chips.map(f=>(<button key={f} className={`fc ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>))}<input className="sbox" placeholder="🔍  Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginLeft:"auto"}}/></div>
      <div className="gcard"><div className="gch"><div className="gct">{rows.length} identities</div></div>
        <table><thead><tr><th>Identity</th><th>Type</th><th>Role</th><th>Dept</th><th>Last Login</th><th>Status</th><th>Risk</th></tr></thead>
          <tbody>{rows.map(i=>(<tr key={i.id}><td><div className="tdp">{i.name}</div><div className="tdm">{i.upn}</div></td><td>{tyChip(i.type)}</td><td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.role}</td><td>{i.dept}</td><td className="tdm">{i.lastLogin}</td><td>{stChip(i.status)}</td><td>{riskChip(i.risk)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AppCoverage({setPage,setSelApp}){
  const [filter,setFilter]=useState("all");
  const [liveApps,setLiveApps]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    apiFetch("/apps")
      .then(data=>{setLiveApps(data);setLoading(false);})
      .catch(()=>setLoading(false));
  },[]);

  // Merge live Entra apps (integrated) with known gap apps
  const KNOWN_GAPS=[
    {id:"g1",name:"SAP S/4HANA",cat:"ERP",ok:false,method:"—",risk:"critical",owner:"Finance"},
    {id:"g2",name:"Oracle HCM",cat:"HRMS",ok:false,method:"—",risk:"critical",owner:"HR"},
    {id:"g3",name:"Workday",cat:"HR/FIN",ok:false,method:"—",risk:"high",owner:"HR"},
    {id:"g4",name:"Legacy ERP (BAAN)",cat:"ERP",ok:false,method:"RPA needed",risk:"critical",owner:"Operations"},
    {id:"g5",name:"Oracle DB Console",cat:"Database",ok:false,method:"—",risk:"high",owner:"DBA Team"},
    {id:"g6",name:"NetSuite",cat:"Finance",ok:false,method:"—",risk:"high",owner:"Finance"},
    {id:"g7",name:"Legacy Payroll App",cat:"Finance",ok:false,method:"RPA needed",risk:"critical",owner:"Payroll"},
  ];

  const entraApps=(liveApps?.apps||[])
    .filter(a=>a.name&&!["Microsoft Graph","Office 365","Azure AD"].includes(a.name))
    .slice(0,20)
    .map(a=>({...a,ok:true,method:"Entra SSO",risk:"low"}));

  const allApps=loading?APPS:[...entraApps,...KNOWN_GAPS];
  const intg=allApps.filter(x=>x.ok).length;
  const rows=allApps.filter(a=>filter==="all"||(filter==="ok"&&a.ok)||(filter==="gap"&&!a.ok));
  return(
    <div className="page">
      <div className="ph"><div className="ptitle">App <span>Coverage</span></div><div className="psub">{loading?"Scanning…":`${intg} of ${allApps.length} applications integrated`} · IdenAccess.onmicrosoft.com <span style={{color:"var(--teal)",fontSize:11,fontFamily:"var(--font-m)",marginLeft:8}}>{!loading&&"● Live"}</span></div></div>
      <div className="sgrid c3 gap">
        <div className="sc"><div className="sc-glow" style={{background:"#00F5D4"}}/><div className="slbl">Integrated</div><div className="sval" style={{color:"#00F5D4"}}>{loading?"…":intg}</div><div className="ssub">Live from Entra ID</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#FF4668"}}/><div className="slbl">Not Integrated</div><div className="sval" style={{color:"#FF4668"}}>{loading?"…":allApps.length-intg}</div><div className="ssub">Manual access risk</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#7B6EF6"}}/><div className="slbl">Coverage Score</div><div className="sval" style={{color:"#7B6EF6"}}>{loading?"…":Math.round(intg/Math.max(allApps.length,1)*100)+"%"}</div><div className="ssub">Target: 100%</div></div>
      </div>
      <div className="fbar">{[["all","All"],["ok","Integrated"],["gap","Gaps Only"]].map(([v,l])=>(<button key={v} className={`fc ${filter===v?"on":""}`} onClick={()=>setFilter(v)}>{l}</button>))}</div>
      <div className="gcard">
        <table><thead><tr><th>Application</th><th>Category</th><th>Owner</th><th>Status</th><th>Method</th><th>Risk</th><th></th></tr></thead>
          <tbody>{rows.map(a=>(<tr key={a.id}><td className="tdp">{a.name}</td><td><span className="chip ct-gh">{a.cat}</span></td><td>{a.owner}</td><td>{a.ok?<span className="chip ct-t">✓ Integrated</span>:<span className="chip ct-r">✗ Gap</span>}</td><td className="tdm">{a.method||"—"}</td><td>{riskChip(a.risk)}</td><td>{!a.ok&&<button className="btn btn-g btn-xs" onClick={()=>{setSelApp(a);setPage("connector");}}>{a.method==="RPA needed"?"🤖 RPA Bot":"⟳ Connect"}</button>}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function ConnectorStudio({selApp,setSelApp}){
  const [name,setName]=useState(selApp?.name||"");const [type,setType]=useState(selApp?.cat||"ERP");const [auth,setAuth]=useState("OAuth2");const [desc,setDesc]=useState(selApp?`${selApp.name} — ${selApp.cat}. Owner: ${selApp.owner}. Risk: ${selApp.risk}.`:"");const [out,setOut]=useState("");const [busy,setBusy]=useState(false);const ref=useRef(null);
  useEffect(()=>{if(selApp){setName(selApp.name);setType(selApp.cat);setDesc(`${selApp.name} — ${selApp.cat}. Owner: ${selApp.owner}. Risk: ${selApp.risk}.`);}},[selApp]);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[out]);
  const gen=async()=>{if(!name)return;setBusy(true);setOut("");const prompt=`You are an IAM integration architect. Generate a complete Microsoft Entra ID SCIM/OAuth2 connector configuration for:\n\nApplication: ${name}\nType: ${type}\nAuth: ${auth}\nContext: ${desc}\n\nProduce detailed production-ready JSON with:\n1. Connector metadata & versioning\n2. OAuth2/SCIM auth config (endpoints, scopes, token handling)\n3. SCIM 2.0 provisioning schema with attribute mappings\n4. Lifecycle handlers (provision/deprovision/update/suspend)\n5. Entitlement sync config\n6. Health check & retry policy\n7. Audit log config\n\nFormat as clean JSON with // comments.`;try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,stream:true,messages:[{role:"user",content:prompt}]})});const reader=r.body.getReader();const dec=new TextDecoder();while(true){const{done,value}=await reader.read();if(done)break;for(const line of dec.decode(value).split("\n")){if(line.startsWith("data:")){try{const d=JSON.parse(line.slice(5));if(d.type==="content_block_delta"&&d.delta?.text)setOut(p=>p+d.delta.text);}catch{}}}}}catch(e){setOut("// Error: "+e.message);}setBusy(false);};
  const dl=()=>{const b=new Blob([out],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`${name.replace(/\s+/g,"-").toLowerCase()}-connector.json`;a.click();};
  return(
    <div className="page">
      <div className="ph"><div className="phtop"><div><div className="ptitle">Connector <span>Studio</span></div><div className="psub">AI-generated Entra ID connectors — download and deploy instantly</div></div>{selApp&&<button className="btn btn-g btn-sm" onClick={()=>setSelApp(null)}>✕ Clear</button>}</div>{selApp&&<div style={{marginTop:10}}><span className="chip ct-a">↳ Pre-loaded: {selApp.name}</span></div>}</div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">Application Details</div>
          <div className="fg"><label className="flbl">Application Name</label><input className="fi" placeholder="e.g. SAP S/4HANA" value={name} onChange={e=>setName(e.target.value)}/></div>
          <div className="fg"><label className="flbl">Application Type</label><select className="fsel" value={type} onChange={e=>setType(e.target.value)}>{["ERP","HRMS","CRM","ITSM","DevTools","Database","Finance","Security","Collaboration","Custom"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="fg"><label className="flbl">Authentication Type</label><select className="fsel" value={auth} onChange={e=>setAuth(e.target.value)}>{["OAuth2","SAML 2.0","SCIM 2.0","Basic Auth","API Key","Certificate"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="fg"><label className="flbl">Integration Notes</label><textarea className="fta" placeholder="Describe API surface, endpoints, special requirements…" value={desc} onChange={e=>setDesc(e.target.value)}/></div>
          <button className="btn btn-p" style={{width:"100%"}} onClick={gen} disabled={busy||!name}>{busy?<><span className="dots"><span/><span/><span/></span> Generating…</>:"⟳ Generate Connector"}</button>
        </div>
        <div className="panel">
          <div className="fb" style={{marginBottom:16}}>
            <div className="panel-title" style={{margin:0}}>Connector Config</div>
            <div className="fc2">{busy&&<span className="stream-ind">Streaming</span>}{out&&!busy&&<button className="btn btn-s btn-sm" onClick={dl}>↓ Download .json</button>}</div>
          </div>
          <div className="code-out" ref={ref}>{out||<span className="cph">{'// Connector config will stream here...\n// Fill in the form and click Generate.'}</span>}{busy&&<span className="cur"/>}</div>
        </div>
      </div>
    </div>
  );
}

function RPABuilder(){
  const [step,setStep]=useState(1);const [app,setApp]=useState("");const [platform,setPlatform]=useState("UiPath");const [uiDesc,setUiDesc]=useState("");const [script,setScript]=useState("");const [busy,setBusy]=useState(false);const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[script]);
  const legacyApps=APPS.filter(a=>a.method==="RPA needed"||!a.ok).map(a=>a.name);
  const genBot=async()=>{setBusy(true);setScript("");setStep(3);const prompt=`You are an RPA architect specialising in IAM automation. Generate a complete, production-ready ${platform} automation script for:\n\nApplication: ${app}\nUI: ${uiDesc||"Standard web login with username/password and role dropdown"}\n\nInclude:\n1. Bot metadata & config\n2. Login automation sequence\n3. User provisioning workflow (create, assign role, notify)\n4. Deprovisioning workflow (disable, remove roles, audit log)\n5. Error handling & retry logic\n6. Audit logging & notifications\n\nBe detailed and production-realistic.`;try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,stream:true,messages:[{role:"user",content:prompt}]})});const reader=r.body.getReader();const dec=new TextDecoder();while(true){const{done,value}=await reader.read();if(done)break;for(const line of dec.decode(value).split("\n")){if(line.startsWith("data:")){try{const d=JSON.parse(line.slice(5));if(d.type==="content_block_delta"&&d.delta?.text)setScript(p=>p+d.delta.text);}catch{}}}}}catch(e){setScript("# Error: "+e.message);}setBusy(false);};
  const dl=()=>{const b=new Blob([script],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`${app.replace(/\s+/g,"-").toLowerCase()}-bot.txt`;a.click();};
  return(
    <div className="page">
      <div className="ph"><div className="ptitle">RPA <span>Builder</span></div><div className="psub">Auto-generate IAM automation bots for legacy apps with no API</div></div>
      <div className="wiz">{[{n:1,l:"Select App"},{n:2,l:"Describe UI"},{n:3,l:"Generated Bot"}].map((s,i)=>(<div key={s.n} style={{display:"flex",alignItems:"center"}}><div className={`wstep ${step>s.n?"done":step===s.n?"active":""}`}><div className="wnum">{step>s.n?"✓":s.n}</div><span className="wlbl">{s.l}</span></div>{i<2&&<div className="wline"/>}</div>))}</div>
      {step===1&&(<div className="panel" style={{maxWidth:540}}><div className="panel-title">Select legacy application</div><div className="fg"><label className="flbl">Application</label><select className="fsel" value={app} onChange={e=>setApp(e.target.value)}><option value="">— Select —</option>{legacyApps.map(a=><option key={a}>{a}</option>)}<option value="Custom Application">Custom application…</option></select></div><div className="fg"><label className="flbl">RPA Platform</label><div className="tag-row">{["UiPath","Power Automate","Automation Anywhere","Blue Prism"].map(p=>(<button key={p} className={`fc ${platform===p?"on":""}`} onClick={()=>setPlatform(p)}>{p}</button>))}</div></div><button className="btn btn-p" onClick={()=>setStep(2)} disabled={!app} style={{marginTop:8}}>Next →</button></div>)}
      {step===2&&(<div className="panel" style={{maxWidth:540}}><div className="panel-title">Describe the application UI</div><div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:18,fontSize:13}}><span style={{color:"var(--text3)"}}>App:</span> <strong style={{color:"var(--teal)"}}>{app}</strong><span style={{color:"var(--text3)",marginLeft:16}}>Platform:</span> <strong style={{color:"var(--violet)"}}>{platform}</strong></div><div className="fg"><label className="flbl">UI / Workflow Description</label><textarea className="fta" style={{minHeight:150}} placeholder={"Describe login screen and provisioning flow.\nE.g: Web app at https://erp.internal — login has Username + Password. Admin → Users → New. Fields: First Name, Last Name, Employee ID, Role dropdown..."} value={uiDesc} onChange={e=>setUiDesc(e.target.value)}/></div><div className="fc2"><button className="btn btn-g" onClick={()=>setStep(1)}>← Back</button><button className="btn btn-v" onClick={genBot}>⚡ Generate Bot Script</button></div></div>)}
      {step===3&&(<div><div className="fb" style={{marginBottom:14}}><div className="fc2"><span className="chip ct-v">{platform}</span><span className="chip ct-gh">{app}</span>{busy&&<span className="stream-ind">Generating</span>}</div><div className="fc2">{script&&!busy&&<button className="btn btn-s btn-sm" onClick={dl}>↓ Download Bot</button>}<button className="btn btn-g btn-sm" onClick={()=>{setStep(1);setScript("");}}>← Start over</button></div></div><div className="code-out" ref={ref} style={{minHeight:440}}>{script||<span className="cph">// Generating bot script…</span>}{busy&&<span className="cur"/>}</div></div>)}
    </div>
  );
}

function RoleMining({liveData}){
  const [sel,setSel]=useState(null);
  const IDENTITIES=liveData?.identities||[];
  const totalIds=liveData?.summary?.total||251;

  // Generate real roles from live identity data grouped by department
  const liveRoles = useMemo(()=>{
    if(!IDENTITIES.length) return ROLES;
    const deptMap={};
    IDENTITIES.forEach(id=>{
      const dept=id.dept&&id.dept!=="—"?id.dept:"Other";
      if(!deptMap[dept]) deptMap[dept]={members:[],roles:new Set()};
      deptMap[dept].members.push(id);
      if(id.role&&id.role!=="User") deptMap[dept].roles.add(id.role);
    });
    const icons={"Engineering":"⚙️","Finance":"💰","Sales":"📈","HR":"👥","IT":"🔧","IT Security":"🛡️","Accounting":"💰","Executive Management":"👑","Operations":"🏭","Marketing":"📣","Other":"👤"};
    const colors=["#00D4B8","#7B6EF6","#FFB547","#38BDF8","#F062A4","#FF4668","#22D3A0"];
    return Object.entries(deptMap)
      .filter(([,v])=>v.members.length>0)
      .sort((a,b)=>b[1].members.length-a[1].members.length)
      .slice(0,8)
      .map(([dept,v],i)=>({
        id:i+1,
        name:dept+" Team",
        icon:icons[dept]||"👤",
        color:colors[i%colors.length],
        members:v.members.length,
        ents:Math.max(v.roles.size,3),
        sod:v.members.some(m=>m.risk==="critical")&&v.members.some(m=>m.risk==="low"),
        conf:Math.min(99,85+Math.floor(v.members.length/3)),
        apps:Array.from(v.roles).slice(0,3).map(r=>r.split(" ")[0])||["Entra ID"]
      }));
  },[IDENTITIES]);

  const totE=liveRoles.reduce((s,r)=>s+r.ents,0);
  return(
    <div className="page">
      <div className="ph"><div className="phtop"><div><div className="ptitle">Role <span>Mining</span></div><div className="psub">AI-suggested roles from entitlement patterns across {IDENTITIES.length} identities</div></div><button className="btn btn-p">Publish All Roles</button></div></div>
      <div className="sgrid c3 gap">
        <div className="sc"><div className="sc-glow" style={{background:"#7B6EF6"}}/><div className="slbl">Suggested Roles</div><div className="sval" style={{color:"#7B6EF6"}}>{liveRoles.length}</div><div className="ssub">From {totE} entitlements</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#FF4668"}}/><div className="slbl">SoD Conflicts</div><div className="sval" style={{color:"#FF4668"}}>{liveRoles.filter(r=>r.sod).length}</div><div className="ssub">Review before publishing</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#00F5D4"}}/><div className="slbl">Identities Analysed</div><div className="sval" style={{color:"#00F5D4"}}>{totalIds}</div><div className="ssub">From IdenAccess tenant</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:sel?"1fr 360px":"1fr",gap:16,alignItems:"start"}}>
        <div>{liveRoles.map(r=>(<div key={r.id} className={`rcard ${sel?.id===r.id?"sel":""}`} onClick={()=>setSel(sel?.id===r.id?null:r)}><div className="ricon" style={{background:`${r.color}18`}}>{r.icon}</div><div className="rinfo"><div className="rname">{r.name}</div><div className="rapps">{r.apps.join(" · ")}</div><div style={{marginTop:6,display:"flex",gap:6}}>{r.sod&&<span className="chip ct-r" style={{fontSize:10}}>⚠ SoD</span>}<span className="chip ct-gh" style={{fontSize:10}}>{r.conf}% conf.</span></div></div><div className="rstats"><div className="rstat"><strong style={{color:r.color}}>{r.members}</strong>members</div><div className="rstat"><strong>{r.ents}</strong>entitlements</div></div></div>))}</div>
        {sel&&(<div className="dp"><div className="fb" style={{marginBottom:18}}><div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:600}}>{sel.icon} {sel.name}</div><button className="btn btn-g btn-xs" onClick={()=>setSel(null)}>✕</button></div><div className="sgrid" style={{gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}><div className="sc" style={{padding:"14px 16px"}}><div className="slbl">Members</div><div className="sval" style={{fontSize:24,color:sel.color}}>{sel.members}</div></div><div className="sc" style={{padding:"14px 16px"}}><div className="slbl">Confidence</div><div className="sval" style={{fontSize:24,color:"var(--green)"}}>{sel.conf}%</div></div></div><div style={{marginBottom:16}}><div className="flbl" style={{marginBottom:8}}>Applications</div><div className="tag-row">{sel.apps.map(a=><span key={a} className="chip ct-b">{a}</span>)}</div></div><div style={{marginBottom:16}}><div className="flbl" style={{marginBottom:8}}>Entitlements ({sel.ents})</div><div className="tag-row">{Array.from({length:sel.ents},(_,i)=><span key={i} className="chip ct-gh" style={{fontSize:10}}>ENT-{String(i+1).padStart(3,"0")}</span>)}</div></div>{sel.sod&&<div style={{background:"rgba(255,70,104,.08)",border:"1px solid rgba(255,70,104,.2)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:16}}><div style={{color:"var(--red)",fontWeight:600,marginBottom:4}}>⚠ SoD Conflict</div><div style={{fontSize:12,color:"var(--text2)"}}>This role violates segregation of duties. Review before publishing.</div></div>}<div className="fc2"><button className="btn btn-p btn-sm" style={{flex:1}}>Publish Role</button><button className="btn btn-g btn-sm">Edit</button></div></div>)}
      </div>
    </div>
  );
}


/* ── LINEAGE DATA ───────────────────────────────────────────────────────── */
const LIN_NODES=[
  // IAM Sources
  {id:"entra",x:60,y:220,icon:"🏛️",label:"Entra ID",sub:"IAM Source",type:"iam",color:"#7B6EF6"},
  // Identities
  {id:"u1",x:240,y:60,icon:"👤",label:"Arjun Mehta",sub:"Global Admin",type:"human",color:"#FF4668",risk:true},
  {id:"u2",x:240,y:160,icon:"👤",label:"Priya Sharma",sub:"Finance User",type:"human",color:"#38BDF8"},
  {id:"u3",x:240,y:260,icon:"⚙️",label:"svc-backup",sub:"Service Acct",type:"service",color:"#7B6EF6"},
  {id:"u4",x:240,y:360,icon:"🖥️",label:"vm-prod-sql",sub:"Machine ID",type:"machine",color:"#00D4B8"},
  {id:"u5",x:240,y:460,icon:"🏢",label:"ext-vendor",sub:"Vendor",type:"vendor",color:"#FFB547"},
  // Groups
  {id:"g1",x:450,y:100,icon:"👥",label:"IT Admins",sub:"Security Group",type:"group",color:"#FF4668",risk:true},
  {id:"g2",x:450,y:220,icon:"👥",label:"Finance Team",sub:"Security Group",type:"group",color:"#38BDF8"},
  {id:"g3",x:450,y:340,icon:"👥",label:"SVC Accounts",sub:"Security Group",type:"group",color:"#7B6EF6"},
  {id:"g4",x:450,y:460,icon:"👥",label:"Infra Devices",sub:"Security Group",type:"group",color:"#00D4B8"},
  // Apps
  {id:"a1",x:660,y:60,icon:"📋",label:"ServiceNow",sub:"ITSM · SCIM",type:"app",color:"#00D4B8"},
  {id:"a2",x:660,y:180,icon:"💰",label:"NetSuite",sub:"Finance · Gap",type:"app",color:"#FFB547",risk:true},
  {id:"a3",x:660,y:300,icon:"💻",label:"GitHub Ent.",sub:"DevTools · SAML",type:"app",color:"#7B6EF6"},
  {id:"a4",x:660,y:420,icon:"🛡️",label:"PaloAlto SIEM",sub:"Security · API",type:"app",color:"#FF4668"},
  // Entitlements
  {id:"e1",x:860,y:60,icon:"🔑",label:"ITSM.Admin",sub:"Entitlement",type:"ent",color:"#00D4B8"},
  {id:"e2",x:860,y:160,icon:"🔑",label:"Finance.Read",sub:"Entitlement",type:"ent",color:"#38BDF8"},
  {id:"e3",x:860,y:260,icon:"🔑",label:"Repo.Write",sub:"Entitlement",type:"ent",color:"#7B6EF6"},
  {id:"e4",x:860,y:360,icon:"🔑",label:"SIEM.View",sub:"Entitlement",type:"ent",color:"#FF4668"},
  {id:"e5",x:860,y:460,icon:"🔑",label:"GlobalAdmin",sub:"Privileged",type:"ent",color:"#FF4668",risk:true},
];
const LIN_EDGES=[
  {s:"entra",t:"u1",k:"access"},{s:"entra",t:"u2",k:"access"},{s:"entra",t:"u3",k:"access"},{s:"entra",t:"u4",k:"access"},{s:"entra",t:"u5",k:"access"},
  {s:"u1",t:"g1",k:"access"},{s:"u2",t:"g2",k:"access"},{s:"u3",t:"g3",k:"access"},{s:"u4",t:"g4",k:"access"},{s:"u5",t:"g2",k:"access"},
  {s:"g1",t:"a1",k:"access"},{s:"g1",t:"a4",k:"access"},{s:"g2",t:"a2",k:"risk"},{s:"g3",t:"a3",k:"access"},{s:"g4",t:"a1",k:"data"},{s:"g2",t:"a3",k:"data"},
  {s:"a1",t:"e1",k:"access"},{s:"a2",t:"e2",k:"risk"},{s:"a3",t:"e3",k:"access"},{s:"a4",t:"e4",k:"access"},{s:"a1",t:"e5",k:"risk"},
];
const TREE_DATA=[
  {id:"entra",icon:"🏛️",label:"Entra ID Tenant",type:"iam",children:[
    {id:"t-u1",icon:"👤",label:"Arjun Mehta",type:"human",meta:"Global Admin · Critical",children:[
      {id:"t-g1",icon:"👥",label:"IT Admins Group",type:"group",meta:"Security Group",children:[
        {id:"t-a1",icon:"📋",label:"ServiceNow",type:"app",meta:"SCIM",children:[{id:"t-e1",icon:"🔑",label:"ITSM.Admin",type:"ent",meta:"Entitlement",children:[]}]},
        {id:"t-e5",icon:"🔑",label:"GlobalAdmin",type:"ent",meta:"⚠ Privileged",children:[]},
      ]},
    ]},
    {id:"t-u2",icon:"👤",label:"Priya Sharma",type:"human",meta:"Finance · Active",children:[
      {id:"t-g2",icon:"👥",label:"Finance Team",type:"group",meta:"Security Group",children:[
        {id:"t-a2",icon:"💰",label:"NetSuite",type:"app",meta:"⚠ Not integrated",children:[{id:"t-e2",icon:"🔑",label:"Finance.Read",type:"ent",meta:"Manual",children:[]}]},
      ]},
    ]},
    {id:"t-u3",icon:"⚙️",label:"svc-backup-agent",type:"service",meta:"Service · Active",children:[
      {id:"t-g3",icon:"👥",label:"SVC Accounts",type:"group",meta:"Security Group",children:[
        {id:"t-a3",icon:"💻",label:"GitHub Enterprise",type:"app",meta:"SAML",children:[{id:"t-e3",icon:"🔑",label:"Repo.Write",type:"ent",meta:"Entitlement",children:[]}]},
      ]},
    ]},
    {id:"t-u4",icon:"🖥️",label:"vm-prod-sql-01",type:"machine",meta:"Machine · Active",children:[
      {id:"t-g4",icon:"👥",label:"Infra Devices",type:"group",meta:"Security Group",children:[
        {id:"t-a1b",icon:"📋",label:"ServiceNow",type:"app",meta:"SCIM",children:[]},
      ]},
    ]},
  ]},
];
const FLOW_STAGES=[
  {label:"IAM Source",items:[{id:"f-entra",label:"Entra ID",icon:"🏛️",color:"#7B6EF6"}]},
  {label:"Identities",items:[
    {id:"f-u1",label:"Arjun Mehta",icon:"👤",color:"#FF4668",risk:true},
    {id:"f-u2",label:"Priya Sharma",icon:"👤",color:"#38BDF8"},
    {id:"f-u3",label:"svc-backup",icon:"⚙️",color:"#7B6EF6"},
    {id:"f-u4",label:"vm-prod-sql",icon:"🖥️",color:"#00D4B8"},
    {id:"f-u5",label:"ext-vendor",icon:"🏢",color:"#FFB547"},
  ]},
  {label:"Groups",items:[
    {id:"f-g1",label:"IT Admins",icon:"👥",color:"#FF4668",risk:true},
    {id:"f-g2",label:"Finance Team",icon:"👥",color:"#38BDF8"},
    {id:"f-g3",label:"SVC Accounts",icon:"👥",color:"#7B6EF6"},
    {id:"f-g4",label:"Infra Devices",icon:"👥",color:"#00D4B8"},
  ]},
  {label:"Applications",items:[
    {id:"f-a1",label:"ServiceNow",icon:"📋",color:"#00D4B8"},
    {id:"f-a2",label:"NetSuite",icon:"💰",color:"#FFB547",risk:true},
    {id:"f-a3",label:"GitHub Ent.",icon:"💻",color:"#7B6EF6"},
    {id:"f-a4",label:"PaloAlto SIEM",icon:"🛡️",color:"#FF4668"},
  ]},
  {label:"Entitlements",items:[
    {id:"f-e1",label:"ITSM.Admin",icon:"🔑",color:"#00D4B8"},
    {id:"f-e2",label:"Finance.Read",icon:"🔑",color:"#38BDF8"},
    {id:"f-e3",label:"Repo.Write",icon:"🔑",color:"#7B6EF6"},
    {id:"f-e4",label:"SIEM.View",icon:"🔑",color:"#FF4668"},
    {id:"f-e5",label:"GlobalAdmin",icon:"🔑",color:"#FF4668",risk:true},
  ]},
];
const ACCESS_PATHS=[
  {label:"Arjun Mehta → GlobalAdmin (Privileged escalation)",risk:true,path:[{n:"Arjun Mehta",c:"#FF4668"},{n:"IT Admins",c:"#FF4668"},{n:"ServiceNow",c:"#00D4B8"},{n:"ITSM.Admin",c:"#00D4B8"},{n:"GlobalAdmin",c:"#FF4668"}]},
  {label:"Priya Sharma → NetSuite (Unintegrated app)",risk:true,path:[{n:"Priya Sharma",c:"#38BDF8"},{n:"Finance Team",c:"#38BDF8"},{n:"NetSuite",c:"#FFB547"},{n:"Finance.Read",c:"#38BDF8"}]},
  {label:"svc-backup → GitHub Enterprise (Service account repo access)",risk:false,path:[{n:"svc-backup",c:"#7B6EF6"},{n:"SVC Accounts",c:"#7B6EF6"},{n:"GitHub Ent.",c:"#7B6EF6"},{n:"Repo.Write",c:"#7B6EF6"}]},
  {label:"vm-prod-sql → ServiceNow (Machine identity app access)",risk:false,path:[{n:"vm-prod-sql",c:"#00D4B8"},{n:"Infra Devices",c:"#00D4B8"},{n:"ServiceNow",c:"#00D4B8"},{n:"ITSM.Admin",c:"#00D4B8"}]},
];

/* ── GRAPH VIEW ─────────────────────────────────────────────────────────── */
function GraphView({nodes}){
  const NODES = (nodes && nodes.length) ? nodes : LIN_NODES;
  const [sel,setSel]=useState(null);
  const [offset,setOffset]=useState({x:0,y:0});
  const [drag,setDrag]=useState(null);
  const canvasRef=useRef(null);

  const getPos=id=>{
    const n=NODES.find(x=>x.id===id);
    return n?{x:n.x+offset.x,y:n.y+offset.y}:null;
  };

  const onMouseDown=e=>{if(e.target===canvasRef.current)setDrag({sx:e.clientX-offset.x,sy:e.clientY-offset.y});};
  const onMouseMove=e=>{if(drag)setOffset({x:e.clientX-drag.sx,y:e.clientY-drag.sy});};
  const onMouseUp=()=>setDrag(null);

  const selNode=NODES.find(n=>n.id===sel);
  const selEdges=sel?LIN_EDGES.filter(e=>e.s===sel||e.t===sel):[];
  const connected=new Set(selEdges.flatMap(e=>[e.s,e.t]));

  return(
    <div>
      <div className="lgraph-wrap">
        <div className="lgraph-toolbar">
          <span style={{fontSize:13,color:"var(--text2)"}}>Click a node to explore · Drag canvas to pan</span>
          {sel&&<button className="btn btn-g btn-xs" onClick={()=>setSel(null)}>✕ Clear</button>}
          <div className="lgraph-legend">
            <div className="lleg-item"><div className="lleg-line" style={{background:"var(--teal)"}}/> Access</div>
            <div className="lleg-item"><div className="lleg-line" style={{background:"var(--violet)"}}/> Data</div>
            <div className="lleg-item"><div className="lleg-line" style={{background:"var(--red)"}}/> Risk</div>
          </div>
        </div>
        <div className="lgraph-canvas" ref={canvasRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <svg className="ledge-layer">
            <defs>
              <marker id="arr-t" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="var(--teal)" opacity=".6"/></marker>
              <marker id="arr-v" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="var(--violet)" opacity=".6"/></marker>
              <marker id="arr-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="var(--red)" opacity=".7"/></marker>
            </defs>
            {LIN_EDGES.map((e,i)=>{
              const s=getPos(e.s),t=getPos(e.t);
              if(!s||!t)return null;
              const mx=(s.x+t.x)/2;
              const faded=sel&&!connected.has(e.s)&&!connected.has(e.t);
              const mid=`M${s.x+130},${s.y+36} C${mx+40},${s.y+36} ${mx-40},${t.y+36} ${t.x},${t.y+36}`;
              const col=e.k==="risk"?"var(--red)":e.k==="data"?"var(--violet)":"var(--teal)";
              const arr=e.k==="risk"?"url(#arr-r)":e.k==="data"?"url(#arr-v)":"url(#arr-t)";
              return <path key={i} d={mid} className={`ledge ${e.k}`} stroke={col} markerEnd={arr} style={{opacity:faded?.15:.5,transition:"opacity .2s"}}/>;
            })}
          </svg>
          {NODES.map(n=>{
            const faded=sel&&!connected.has(n.id)&&n.id!==sel;
            const typeColors={iam:"rgba(123,110,246,.12)",human:"rgba(56,189,248,.1)",service:"rgba(123,110,246,.1)",machine:"rgba(0,212,184,.1)",vendor:"rgba(255,181,71,.1)",group:"rgba(255,255,255,.06)",app:"rgba(0,212,184,.1)",ent:"rgba(255,255,255,.06)"};
            return(
              <div key={n.id} className={`lnode ${sel===n.id?"sel":""}`}
                style={{
                  left:n.x+offset.x,top:n.y+offset.y,
                  background:typeColors[n.type]||"rgba(255,255,255,.06)",
                  borderColor:sel===n.id?n.color:n.risk?"rgba(255,70,104,.4)":"rgba(255,255,255,.12)",
                  opacity:faded?.25:1,
                  transition:"opacity .2s",
                  backdropFilter:"blur(12px)"
                }}
                onClick={ev=>{ev.stopPropagation();setSel(sel===n.id?null:n.id);}}>
                <div className="lnode-icon">{n.icon}</div>
                <div className="lnode-label">{n.label}</div>
                <div className="lnode-sub">{n.sub}</div>
                {n.risk&&<div className="lnode-badge" style={{background:"rgba(255,70,104,.15)",color:"var(--red)"}}>⚠ Risk</div>}
              </div>
            );
          })}
        </div>
      </div>
      {selNode&&(
        <div className="ldetail">
          <div className="ldetail-title">{selNode.icon} {selNode.label} — Connections</div>
          {selEdges.map((e,i)=>{
            const other=NODES.find(n=>n.id===(e.s===sel?e.t:e.s));
            const dir=e.s===sel?"→":"←";
            return(
              <div key={i} className="lpath-row">
                <span className="lpath-node" style={{background:`${selNode.color}18`,color:selNode.color}}>{selNode.label}</span>
                <span className="lpath-arrow">{dir}</span>
                <span className="lpath-node" style={{background:`${other?.color||"#fff"}18`,color:other?.color||"var(--text)"}}>{other?.label}</span>
                <span className="chip ct-gh" style={{marginLeft:"auto",fontSize:10}}>{e.k}</span>
                {e.k==="risk"&&<span className="chip ct-r" style={{fontSize:10}}>⚠ Risk</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TreeNode({node,depth=0,sel,setSel}){
  const [open,setOpen]=useState(depth<2);
  const hasKids=node.children&&node.children.length>0;
  const typeColor={iam:"#7B6EF6",human:"#38BDF8",service:"#7B6EF6",machine:"#00D4B8",vendor:"#FFB547",group:"#8B95B0",app:"#00D4B8",ent:"#FFB547"};
  const c=typeColor[node.type]||"#8B95B0";
  return(
    <div style={{marginLeft:depth>0?0:0}}>
      <div className="ltree-node">
        {depth>0&&<div className="ltree-indent" style={{marginLeft:(depth-1)*20}}/>}
        <div className={`ltree-row ${sel===node.id?"sel":""}`} onClick={()=>setSel(sel===node.id?null:node.id)}>
          {hasKids&&<div className="ltree-expand" onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}>{open?"−":"+"}</div>}
          {!hasKids&&<div style={{width:16,flexShrink:0}}/>}
          <span className="ltree-icon">{node.icon}</span>
          <span className="ltree-name">{node.label}</span>
          {node.meta&&<span className="ltree-meta" style={{color:node.meta.includes("⚠")?"var(--red)":c}}>{node.meta}</span>}
        </div>
      </div>
      {open&&hasKids&&node.children.map(child=><TreeNode key={child.id} node={child} depth={depth+1} sel={sel} setSel={setSel}/>)}
    </div>
  );
}

function TreeView(){
  const [sel,setSel]=useState(null);
  return(
    <div className="ltree-wrap">
      <div style={{marginBottom:16,fontSize:13,color:"var(--text2)"}}>Click any node to highlight · Expand/collapse with ± button</div>
      {TREE_DATA.map(n=><TreeNode key={n.id} node={n} depth={0} sel={sel} setSel={setSel}/>)}
    </div>
  );
}

/* ── FLOW VIEW ──────────────────────────────────────────────────────────── */
function FlowView(){
  const [hl,setHl]=useState(null);
  return(
    <div>
      <div className="lflow-wrap">
        <div style={{fontSize:13,color:"var(--text2)",marginBottom:18}}>Click any node to highlight its access path · <span style={{color:"var(--red)"}}>Red border = risk</span></div>
        <div className="lflow-stage-row">
          {FLOW_STAGES.map((stage,si)=>(
            <div key={si} style={{display:"flex",alignItems:"stretch"}}>
              <div className="lflow-stage">
                <div className="lflow-stage-title">{stage.label}</div>
                <div className="lflow-cards">
                  {stage.items.map(item=>(
                    <div key={item.id} className={`lflow-card ${hl===item.id?"hl":""} ${item.risk?"risk-hl":""}`}
                      style={{borderColor:hl===item.id?item.color:item.risk?"rgba(255,70,104,.3)":"",cursor:"pointer"}}
                      onClick={()=>setHl(hl===item.id?null:item.id)}>
                      <div style={{fontSize:16,marginBottom:3}}>{item.icon}</div>
                      <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>{item.label}</div>
                      {item.risk&&<div style={{fontSize:9,color:"var(--red)",marginTop:3,fontFamily:"var(--font-m)"}}>⚠ Risk</div>}
                    </div>
                  ))}
                </div>
              </div>
              {si<FLOW_STAGES.length-1&&<div className="lflow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="ldetail" style={{marginTop:20}}>
        <div className="ldetail-title">Access Paths with Risk</div>
        {ACCESS_PATHS.map((p,i)=>(
          <div key={i} className="lpath-row" style={{marginBottom:8,borderColor:p.risk?"rgba(255,70,104,.2)":""}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:500,color:p.risk?"var(--red)":"var(--text)",marginBottom:6}}>{p.risk?"⚠":""} {p.label}</div>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                {p.path.map((step,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"center",gap:5}}>
                    <span className="lpath-node" style={{background:`${step.c}18`,color:step.c}}>{step.n}</span>
                    {j<p.path.length-1&&<span className="lpath-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
            {p.risk&&<span className="chip ct-r" style={{fontSize:10,alignSelf:"flex-start"}}>Risk path</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LINEAGE PAGE ───────────────────────────────────────────────────────── */
function Lineage({liveData}){
  const [tab,setTab]=useState("graph");
  const tabs=[{id:"graph",label:"⬡ Node Graph"},{id:"tree",label:"⊞ Tree View"},{id:"flow",label:"→ Flow Diagram"}];
  const sum=liveData?.summary||{};
  // Enrich lineage nodes with real counts from live Entra data
  const liveNodes=LIN_NODES.map(n=>{
    if(n.id==="entra") return {...n,sub:`${sum.total||251} identities`};
    if(n.type==="human"&&n.id==="u1"){
      const match=liveData?.identities?.find(x=>x.risk==="critical"&&x.type==="human");
      return match?{...n,label:match.name,sub:match.role}:n;
    }
    if(n.type==="human"&&n.id==="u2"){
      const match=liveData?.identities?.find(x=>x.type==="human"&&x.dept&&x.dept.includes("Fin"));
      return match?{...n,label:match.name,sub:match.role}:n;
    }
    if(n.type==="service"&&n.id==="u3"){
      const match=liveData?.identities?.find(x=>x.type==="service");
      return match?{...n,label:match.name,sub:match.role}:n;
    }
    if(n.type==="vendor"&&n.id==="u5"){
      const match=liveData?.identities?.find(x=>x.type==="vendor");
      return match?{...n,label:match.name,sub:match.role}:n;
    }
    return n;
  });
  const totalIdentities=sum.total||251;
  return(
    <div className="page">
      <div className="ph">
        <div className="phtop">
          <div>
            <div className="ptitle">Identity & Data <span>Lineage</span></div>
            <div className="psub">Tracing {totalIdentities} identities across groups, apps & entitlements · <span style={{color:"var(--teal)"}}>IdenAccess.onmicrosoft.com</span> <span style={{color:"var(--teal)",fontSize:11,fontFamily:"var(--font-m)",marginLeft:8}}>● Live</span></div>
          </div>
          <div className="pact">
            <div className="sgrid" style={{gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:0}}>
              <div className="sc" style={{padding:"10px 16px"}}><div className="slbl">Identities</div><div className="sval" style={{fontSize:22,color:"var(--violet)"}}>{sum.total||251}</div></div>
              <div className="sc" style={{padding:"10px 16px"}}><div className="slbl">Risk Paths</div><div className="sval" style={{fontSize:22,color:"var(--red)"}}>{LIN_EDGES.filter(e=>e.k==="risk").length}</div></div>
              <div className="sc" style={{padding:"10px 16px"}}><div className="slbl">Critical</div><div className="sval" style={{fontSize:22,color:"var(--teal)"}}>{sum.critical||4}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="ltabs">
        {tabs.map(t=><button key={t.id} className={`ltab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>
      {tab==="graph"&&<GraphView nodes={liveNodes}/>}
      {tab==="tree"&&<TreeView/>}
      {tab==="flow"&&<FlowView/>}
    </div>
  );
}


/* ── DISCOVERY PAGE ─────────────────────────────────────────────────────── */
function Discovery({liveData}){
  const [groups,setGroups]=useState(null);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [selGroup,setSelGroup]=useState(null);
  const [tab,setTab]=useState("groups");

  useEffect(()=>{
    async function load(){
      try{
        setLoading(true);
        const data=await apiFetch("/groups");
        setGroups(data);
      }catch(e){console.error(e);}
      finally{setLoading(false);}
    }
    load();
  },[]);

  const sum=groups?.summary||{};
  const ids=liveData?.identities||[];
  const idSum=liveData?.summary||{};

  const filteredGroups=(groups?.groups||[]).filter(g=>{
    const mf=filter==="all"||g.risk===filter||(filter==="dynamic"&&g.dynamic)||(filter==="security"&&g.type==="Security");
    const ms=!search||g.name.toLowerCase().includes(search.toLowerCase());
    return mf&&ms;
  });

  const riskOrder={critical:0,high:1,medium:2,low:3};
  const sorted=[...filteredGroups].sort((a,b)=>(riskOrder[a.risk]||3)-(riskOrder[b.risk]||3));

  return(
    <div className="page">
      <div className="ph">
        <div className="phtop">
          <div>
            <div className="ptitle">Environment <span>Discovery</span></div>
            <div className="psub">Full scan of groups, roles, departments and risk across IdenAccess.onmicrosoft.com <span style={{color:"var(--teal)",fontSize:11,fontFamily:"var(--font-m)",marginLeft:8}}>● Live</span></div>
          </div>
          <button className="btn btn-p" onClick={()=>{setLoading(true);apiFetch("/groups").then(d=>{setGroups(d);setLoading(false);});}}>⟳ Rescan</button>
        </div>
      </div>

      {/* Top stats */}
      <div className="sgrid gap" style={{gridTemplateColumns:"repeat(6,1fr)"}}>
        <div className="sc"><div className="sc-glow" style={{background:"#38BDF8"}}/><div className="slbl">Total IDs</div><div className="sval" style={{color:"#38BDF8",fontSize:26}}>{idSum.total||0}</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#7B6EF6"}}/><div className="slbl">Groups</div><div className="sval" style={{color:"#7B6EF6",fontSize:26}}>{loading?"…":sum.totalGroups||0}</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#FF4668"}}/><div className="slbl">Critical Groups</div><div className="sval" style={{color:"#FF4668",fontSize:26}}>{loading?"…":sum.criticalGroups||0}</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#FFB547"}}/><div className="slbl">High Risk</div><div className="sval" style={{color:"#FFB547",fontSize:26}}>{loading?"…":sum.highGroups||0}</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#00D4B8"}}/><div className="slbl">Roles</div><div className="sval" style={{color:"#00D4B8",fontSize:26}}>{loading?"…":sum.totalRoles||0}</div></div>
        <div className="sc"><div className="sc-glow" style={{background:"#F062A4"}}/><div className="slbl">Departments</div><div className="sval" style={{color:"#F062A4",fontSize:26}}>{loading?"…":(sum.departments||[]).length}</div></div>
      </div>

      {/* Tab switcher */}
      <div className="ltabs gap">
        {[{id:"groups",label:"🔒 Groups & Roles"},{id:"departments",label:"🏢 Departments"},{id:"riskscore",label:"⚠️ Risk Score"}].map(t=>(
          <button key={t.id} className={`ltab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* GROUPS TAB */}
      {tab==="groups"&&(
        <div>
          <div className="fbar">
            {["all","critical","high","medium","low","security","dynamic"].map(f=>(
              <button key={f} className={`fc ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
            <input className="sbox" placeholder="🔍 Search groups…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginLeft:"auto"}}/>
          </div>
          {loading?(
            <div style={{textAlign:"center",padding:40,color:"var(--text3)"}}>
              <div className="dots"><span/><span/><span/></div>
              <div style={{marginTop:12,fontSize:13}}>Scanning Entra ID groups…</div>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:selGroup?"1fr 360px":"1fr",gap:16,alignItems:"start"}}>
              <div className="gcard">
                <div className="gch">
                  <div><div className="gct">{sorted.length} groups</div><div className="gcs">Sorted by risk</div></div>
                </div>
                <table>
                  <thead><tr><th>Group Name</th><th>Type</th><th>Members</th><th>Risk Score</th><th>Dynamic</th><th>Created</th></tr></thead>
                  <tbody>
                    {sorted.map(g=>(
                      <tr key={g.id} style={{cursor:"pointer"}} onClick={()=>setSelGroup(selGroup?.id===g.id?null:g)}>
                        <td><div className="tdp">{g.name}</div><div className="tdm" style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.description}</div></td>
                        <td><span className="chip ct-gh">{g.type}</span></td>
                        <td><span style={{fontFamily:"var(--font-m)",color:"var(--text)",fontWeight:600}}>{g.memberCount}</span></td>
                        <td>{riskChip(g.risk)}</td>
                        <td>{g.dynamic?<span className="chip ct-t">Dynamic</span>:<span className="chip ct-gh">Static</span>}</td>
                        <td className="tdm">{g.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selGroup&&(
                <div className="dp">
                  <div className="fb" style={{marginBottom:16}}>
                    <div style={{fontFamily:"var(--font-d)",fontSize:15,fontWeight:600}}>{selGroup.name}</div>
                    <button className="btn btn-g btn-xs" onClick={()=>setSelGroup(null)}>✕</button>
                  </div>
                  <div className="sgrid" style={{gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                    <div className="sc" style={{padding:"12px 14px"}}><div className="slbl">Members</div><div className="sval" style={{fontSize:22,color:"var(--teal)"}}>{selGroup.memberCount}</div></div>
                    <div className="sc" style={{padding:"12px 14px"}}><div className="slbl">Risk</div><div style={{marginTop:8}}>{riskChip(selGroup.risk)}</div></div>
                  </div>
                  <div className="fg"><div className="flbl" style={{marginBottom:6}}>Type</div><span className="chip ct-gh">{selGroup.type}</span></div>
                  <div className="fg"><div className="flbl" style={{marginBottom:6}}>Membership</div><span className={`chip ${selGroup.dynamic?"ct-t":"ct-gh"}`}>{selGroup.dynamic?"Dynamic (rule-based)":"Static (manual)"}</span></div>
                  <div className="fg"><div className="flbl" style={{marginBottom:6}}>Created</div><span style={{fontSize:13,color:"var(--text2)"}}>{selGroup.created}</span></div>
                  <div className="fg"><div className="flbl" style={{marginBottom:6}}>Description</div><span style={{fontSize:12,color:"var(--text2)"}}>{selGroup.description}</span></div>
                  {selGroup.risk==="critical"&&(
                    <div style={{background:"rgba(255,70,104,.08)",border:"1px solid rgba(255,70,104,.2)",borderRadius:"var(--r)",padding:"10px 14px",marginBottom:14}}>
                      <div style={{color:"var(--red)",fontWeight:600,marginBottom:4}}>⚠ Critical Risk Group</div>
                      <div style={{fontSize:12,color:"var(--text2)"}}>This group has elevated privileges. Review membership immediately.</div>
                    </div>
                  )}
                  <button className="btn btn-p btn-sm" style={{width:"100%"}}>View Members</button>
                </div>
              )}
            </div>
          )}

          {/* Directory Roles */}
          {!loading&&groups?.roles?.length>0&&(
            <div style={{marginTop:20}}>
              <div className="gcard">
                <div className="gch"><div className="gct">Directory Roles ({groups.roles.length})</div><div className="gcs">Built-in Entra ID roles</div></div>
                <table>
                  <thead><tr><th>Role Name</th><th>Risk</th><th>Description</th></tr></thead>
                  <tbody>
                    {groups.roles.map(r=>(
                      <tr key={r.id}>
                        <td className="tdp">{r.name}</td>
                        <td>{riskChip(/global.admin|privileged|security.admin/i.test(r.name)?"critical":/admin/i.test(r.name)?"high":"low")}</td>
                        <td style={{fontSize:12,color:"var(--text3)",maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.description||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEPARTMENTS TAB */}
      {tab==="departments"&&(
        <div>
          {loading?(
            <div style={{textAlign:"center",padding:40,color:"var(--text3)"}}>
              <div className="dots"><span/><span/><span/></div>
            </div>
          ):(
            <div className="gcard">
              <div className="gch"><div className="gct">Departments ({(sum.departments||[]).length})</div><div className="gcs">Identity distribution by department</div></div>
              <table>
                <thead><tr><th>Department</th><th>Total IDs</th><th>Active</th><th>Disabled</th><th>Coverage</th></tr></thead>
                <tbody>
                  {(sum.departments||[]).map((d,i)=>{
                    const pct=Math.round(d.enabled/d.count*100);
                    return(
                      <tr key={i}>
                        <td className="tdp">{d.name}</td>
                        <td><span style={{fontFamily:"var(--font-m)",fontWeight:600,color:"var(--text)"}}>{d.count}</span></td>
                        <td><span className="chip ct-t">{d.enabled}</span></td>
                        <td>{d.disabled>0?<span className="chip ct-r">{d.disabled}</span>:<span className="chip ct-gh">0</span>}</td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,height:4,background:"var(--surface3)",borderRadius:2,overflow:"hidden"}}>
                              <div style={{width:`${pct}%`,height:"100%",background:pct>90?"var(--green)":pct>70?"var(--amber)":"var(--red)",borderRadius:2}}/>
                            </div>
                            <span className="tdm">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RISK SCORE TAB */}
      {tab==="riskscore"&&(
        <div>
          <div className="sgrid c3 gap">
            <div className="sc">
              <div className="sc-glow" style={{background:"#FF4668"}}/>
              <div className="slbl">Overall Risk Score</div>
              <div className="sval" style={{color:idSum.critical>5?"#FF4668":idSum.critical>2?"#FFB547":"#22D3A0",fontSize:42}}>
                {idSum.critical>5?"HIGH":idSum.critical>2?"MED":"LOW"}
              </div>
              <div className="ssub">Based on {idSum.critical||0} critical identities</div>
            </div>
            <div className="sc">
              <div className="sc-glow" style={{background:"#FFB547"}}/>
              <div className="slbl">Privileged Accounts</div>
              <div className="sval" style={{color:"#FFB547",fontSize:32}}>{idSum.critical||0}</div>
              <div className="ssub">Require immediate review</div>
            </div>
            <div className="sc">
              <div className="sc-glow" style={{background:"#7B6EF6"}}/>
              <div className="slbl">Unmanaged Groups</div>
              <div className="sval" style={{color:"#7B6EF6",fontSize:32}}>{loading?"…":(sum.criticalGroups||0)+(sum.highGroups||0)}</div>
              <div className="ssub">High + critical risk groups</div>
            </div>
          </div>

          <div className="gcard">
            <div className="gch"><div className="gct">Risk Breakdown by Identity Type</div></div>
            <table>
              <thead><tr><th>Identity Type</th><th>Count</th><th>Risk Level</th><th>Recommended Action</th></tr></thead>
              <tbody>
                <tr><td className="tdp">Human Users</td><td>{idSum.human||0}</td><td>{riskChip("low")}</td><td style={{fontSize:12,color:"var(--text2)"}}>Enforce MFA, review privileged accounts</td></tr>
                <tr><td className="tdp">Service Accounts</td><td>{idSum.service||0}</td><td>{riskChip("high")}</td><td style={{fontSize:12,color:"var(--text2)"}}>Audit permissions, rotate credentials</td></tr>
                <tr><td className="tdp">Machine Identities</td><td>{idSum.machine||0}</td><td>{riskChip("medium")}</td><td style={{fontSize:12,color:"var(--text2)"}}>Validate certificate expiry</td></tr>
                <tr><td className="tdp">Vendor / External</td><td>{idSum.vendor||0}</td><td>{riskChip("medium")}</td><td style={{fontSize:12,color:"var(--text2)"}}>Review access scope and expiry</td></tr>
                <tr><td className="tdp">Local Accounts</td><td>{idSum.local||0}</td><td>{riskChip("critical")}</td><td style={{fontSize:12,color:"var(--text2)"}}>Onboard to Entra ID immediately</td></tr>
                <tr><td className="tdp">Disabled Accounts</td><td>{idSum.disabled||0}</td><td>{riskChip("medium")}</td><td style={{fontSize:12,color:"var(--text2)"}}>Remove group memberships and licenses</td></tr>
              </tbody>
            </table>
          </div>

          {!loading&&(sum.departments||[]).length>0&&(
            <div className="gcard" style={{marginTop:16}}>
              <div className="gch"><div className="gct">Department Risk Exposure</div><div className="gcs">Disabled accounts by department</div></div>
              <table>
                <thead><tr><th>Department</th><th>Total</th><th>Disabled</th><th>Risk</th></tr></thead>
                <tbody>
                  {(sum.departments||[]).filter(d=>d.disabled>0).map((d,i)=>(
                    <tr key={i}>
                      <td className="tdp">{d.name}</td>
                      <td>{d.count}</td>
                      <td><span className="chip ct-r">{d.disabled}</span></td>
                      <td>{riskChip(d.disabled>3?"high":"medium")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── INTEGRATION HUB ─────────────────────────────────────────────────────── */
const SIEM_INTEGRATIONS=[
  {id:"sentinel",name:"Microsoft Sentinel",logo:"🔵",vendor:"Microsoft",status:"available",method:"REST API / CEF",color:"#0078D4",desc:"Cloud-native SIEM and SOAR platform built on Azure",features:["UEBA","Threat Intel","Playbooks","KQL Queries","Incident Mgmt"],docs:"https://docs.microsoft.com/en-us/azure/sentinel/"},
  {id:"splunk",name:"Splunk Enterprise",logo:"🟢",vendor:"Splunk",status:"available",method:"REST API / HEC",color:"#65A637",desc:"Market-leading SIEM with powerful SPL query language",features:["SPL Search","Dashboards","Alerts","SOAR","UEBA"],docs:"https://docs.splunk.com/"},
  {id:"qradar",name:"IBM QRadar",logo:"🔷",vendor:"IBM",status:"available",method:"REST API / Syslog",color:"#054ADA",desc:"Enterprise SIEM with advanced threat detection",features:["DSM","Offense Mgmt","Network Analytics","UBA","SOAR"],docs:"https://www.ibm.com/docs/en/qradar-on-cloud"},
  {id:"elastic",name:"Elastic SIEM",logo:"🟡",vendor:"Elastic",status:"available",method:"REST API / ECS",color:"#F04E98",desc:"Open SIEM built on the Elastic Stack",features:["EQL","ML Anomaly","Timeline","Cases","Fleet"],docs:"https://www.elastic.co/security"},
  {id:"cortex",name:"Palo Alto Cortex XSIAM",logo:"🟠",vendor:"Palo Alto",status:"available",method:"REST API",color:"#FA582D",desc:"AI-driven SOC platform with unified data lake",features:["AI Analytics","XSOAR","Attack Surface","CDL","Causality Analysis"],docs:"https://docs.paloaltonetworks.com/cortex"},
  {id:"crowdstrike",name:"CrowdStrike Falcon",logo:"🔴",vendor:"CrowdStrike",status:"available",method:"REST API / Streaming",color:"#E1004B",desc:"Cloud-native endpoint and identity threat detection",features:["Identity Protection","UEBA","Threat Graph","Fusion SOAR","Spotlight"],docs:"https://developer.crowdstrike.com/"},
  {id:"sumologic",name:"Sumo Logic",logo:"⚪",vendor:"Sumo Logic",status:"available",method:"REST API / HTTP Source",color:"#0054A0",desc:"Cloud SIEM with continuous intelligence platform",features:["Cloud SIEM","Log Analytics","Metrics","Traces","Dashboards"],docs:"https://help.sumologic.com/"},
  {id:"chronicle",name:"Google Chronicle",logo:"🟣",vendor:"Google",status:"available",method:"REST API / HTTPS",color:"#4285F4",desc:"Cloud-scale security analytics platform by Google",features:["YARA-L","UDM","Threat Intel","SOAR","Detection Engine"],docs:"https://cloud.google.com/chronicle"},
];

const SIEM_CONN_FIELDS={
  "sentinel":  [{k:"workspaceId",l:"Workspace ID",ph:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"},{k:"tenantId",l:"Tenant ID",ph:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"},{k:"clientId",l:"Client ID",ph:"your-app-client-id"},{k:"clientSecret",l:"Client Secret",ph:"••••••••",type:"password"}],
  "splunk":    [{k:"baseUrl",l:"Splunk URL",ph:"https://splunk.company.com:8089"},{k:"token",l:"HEC Token",ph:"••••••••",type:"password"},{k:"index",l:"Index",ph:"main"}],
  "qradar":    [{k:"baseUrl",l:"QRadar URL",ph:"https://qradar.company.com"},{k:"token",l:"API Token",ph:"••••••••",type:"password"},{k:"version",l:"API Version",ph:"19.0"}],
  "elastic":   [{k:"baseUrl",l:"Elasticsearch URL",ph:"https://elastic.company.com:9200"},{k:"username",l:"Username",ph:"elastic"},{k:"password",l:"Password",ph:"••••••••",type:"password"},{k:"index",l:"Index Pattern",ph:"logs-*"}],
  "cortex":    [{k:"baseUrl",l:"Cortex URL",ph:"https://api.xsiam.paloaltonetworks.com"},{k:"clientId",l:"Client ID",ph:"your-client-id"},{k:"clientSecret",l:"Client Secret",ph:"••••••••",type:"password"}],
  "crowdstrike":[{k:"baseUrl",l:"Base URL",ph:"https://api.crowdstrike.com"},{k:"clientId",l:"Client ID",ph:"your-client-id"},{k:"clientSecret",l:"Client Secret",ph:"••••••••",type:"password"}],
  "sumologic": [{k:"baseUrl",l:"API Endpoint",ph:"https://api.sumologic.com/api"},{k:"accessId",l:"Access ID",ph:"your-access-id"},{k:"accessKey",l:"Access Key",ph:"••••••••",type:"password"}],
  "chronicle": [{k:"region",l:"Region",ph:"us"},{k:"clientEmail",l:"Service Account Email",ph:"svc@project.iam.gserviceaccount.com"},{k:"privateKey",l:"Private Key",ph:"-----BEGIN PRIVATE KEY-----",type:"password"}],
};

const IAM_SYSTEMS=[
  {id:"entra",name:"Microsoft Entra ID",logo:"🏛️",vendor:"Microsoft",type:"iam",status:"connected",method:"OAuth2 / Graph API",color:"#00D4B8",desc:"Cloud-native IAM — SSO, MFA, Conditional Access",features:["SSO","MFA","SCIM","Conditional Access","PIM"],docs:"https://docs.microsoft.com/en-us/graph/"},
  {id:"okta",name:"Okta",logo:"🔐",vendor:"Okta",type:"iam",status:"available",method:"OAuth2 / SCIM 2.0",color:"#007DC1",desc:"Universal directory and identity platform",features:["SSO","MFA","SCIM","Lifecycle Mgmt","API Access Mgmt"],docs:"https://developer.okta.com/"},
  {id:"sailpoint",name:"SailPoint IIQ",logo:"⚓",vendor:"SailPoint",type:"iam",status:"available",method:"REST API / SCIM",color:"#1A8CFF",desc:"Enterprise IGA — provisioning, governance, compliance",features:["IGA","Role Mining","Certification","SOD","Access Request"],docs:"https://developer.sailpoint.com/"},
  {id:"sailpoint-idn",name:"SailPoint IdentityNow",logo:"🧭",vendor:"SailPoint",type:"iam",status:"available",method:"REST API / SCIM 2.0",color:"#1A8CFF",desc:"Cloud IGA platform with AI-driven access recommendations",features:["Cloud IGA","AI Recommendations","SCIM","Lifecycle","Certification"],docs:"https://developer.sailpoint.com/idn/"},
  {id:"cyberark",name:"CyberArk",logo:"🛡️",vendor:"CyberArk",type:"iam",status:"available",method:"REST API / PAM API",color:"#CC0000",desc:"Privileged Access Management — vault, session recording",features:["PAM","Vault","Session Recording","Just-in-time","Secrets Mgmt"],docs:"https://docs.cyberark.com/"},
  {id:"ping",name:"Ping Identity",logo:"🏓",vendor:"Ping",type:"iam",status:"available",method:"OAuth2 / SAML / SCIM",color:"#E1261C",desc:"Intelligent identity platform for enterprise",features:["SSO","MFA","SCIM","API Security","Federation"],docs:"https://docs.pingidentity.com/"},
  {id:"forgerock",name:"ForgeRock",logo:"🌲",vendor:"ForgeRock",type:"iam",status:"available",method:"REST API / OAuth2",color:"#5E9E3E",desc:"AI-driven identity platform for workforce and customers",features:["CIAM","IGA","PAM","AI Risk","Journey Orchestration"],docs:"https://backstage.forgerock.com/"},
  {id:"ldap",name:"Active Directory / LDAP",logo:"🗂️",vendor:"Microsoft",type:"iam",status:"available",method:"LDAP / Kerberos",color:"#0078D4",desc:"On-premises directory services",features:["Directory","Kerberos","Group Policy","DNS","LDAP"],docs:"https://docs.microsoft.com/en-us/windows-server/identity/"},
];

const DOWNSTREAM_APPS=[
  {id:"servicenow",name:"ServiceNow",logo:"📋",cat:"ITSM",status:"connected",method:"SCIM 2.0",color:"#62D84E",desc:"IT Service Management platform"},
  {id:"salesforce",name:"Salesforce",logo:"☁️",cat:"CRM",status:"connected",method:"SAML/OIDC",color:"#00A1E0",desc:"Customer relationship management"},
  {id:"sap",name:"SAP S/4HANA",logo:"🔷",cat:"ERP",status:"pending",method:"Connector needed",color:"#0070F2",desc:"Enterprise resource planning"},
  {id:"workday",name:"Workday",logo:"🏢",cat:"HRMS",status:"gap",method:"Not integrated",color:"#F5832A",desc:"Human capital management"},
  {id:"github",name:"GitHub Enterprise",logo:"🐙",cat:"DevTools",status:"connected",method:"SAML",color:"#24292E",desc:"Code repository and CI/CD"},
  {id:"jira",name:"Jira Software",logo:"📌",cat:"DevTools",status:"connected",method:"SAML",color:"#0052CC",desc:"Project tracking and agile"},
  {id:"oracle-hcm",name:"Oracle HCM",logo:"🔶",cat:"HRMS",status:"gap",method:"Not integrated",color:"#F80000",desc:"Human capital management suite"},
  {id:"zoom",name:"Zoom",logo:"📹",cat:"Collab",status:"connected",method:"OIDC",color:"#2D8CFF",desc:"Video conferencing platform"},
  {id:"slack",name:"Slack",logo:"💬",cat:"Collab",status:"available",method:"SCIM / OAuth2",color:"#4A154B",desc:"Team messaging platform"},
  {id:"aws",name:"AWS IAM",logo:"☁️",cat:"Cloud",status:"available",method:"SAML / SCIM",color:"#FF9900",desc:"Amazon Web Services access management"},
  {id:"gcp",name:"Google Cloud",logo:"🌐",cat:"Cloud",status:"available",method:"SAML / OIDC",color:"#4285F4",desc:"Google Cloud Platform IAM"},
  {id:"confluence",name:"Confluence",logo:"📚",cat:"Collab",status:"connected",method:"SAML",color:"#172B4D",desc:"Team documentation and wiki"},
];

const CONN_FIELDS={
  "OAuth2":[{k:"tenantId",l:"Tenant ID",ph:"your-tenant-id"},{k:"clientId",l:"Client ID",ph:"your-client-id"},{k:"clientSecret",l:"Client Secret",ph:"••••••••",type:"password"},{k:"scope",l:"Scope",ph:"https://graph.microsoft.com/.default"}],
  "SCIM 2.0":[{k:"baseUrl",l:"SCIM Base URL",ph:"https://your-app.com/scim/v2"},{k:"token",l:"Bearer Token",ph:"••••••••",type:"password"}],
  "REST API":[{k:"baseUrl",l:"Base URL",ph:"https://your-iiq.company.com/identityiq"},{k:"username",l:"Username",ph:"admin"},{k:"password",l:"Password",ph:"••••••••",type:"password"}],
  "LDAP":[{k:"host",l:"LDAP Host",ph:"ldap.company.com"},{k:"port",l:"Port",ph:"389"},{k:"baseDn",l:"Base DN",ph:"DC=company,DC=com"},{k:"bindDn",l:"Bind DN",ph:"CN=svc-ldap,OU=Service,DC=company,DC=com"},{k:"password",l:"Password",ph:"••••••••",type:"password"}],
  "SAML":[{k:"entityId",l:"Entity ID",ph:"https://your-app.com/saml"},{k:"acsUrl",l:"ACS URL",ph:"https://your-app.com/saml/acs"},{k:"metadataUrl",l:"Metadata URL",ph:"https://your-idp.com/metadata"}],
  "REST API / PAM API":[{k:"baseUrl",l:"Base URL",ph:"https://cyberark.company.com"},{k:"username",l:"Username",ph:"admin"},{k:"password",l:"Password",ph:"••••••••",type:"password"},{k:"appId",l:"App ID",ph:"CTInnvoID"}],
  "REST API / SCIM":[{k:"baseUrl",l:"IIQ Base URL",ph:"https://iiq.company.com/identityiq"},{k:"username",l:"Admin Username",ph:"admin"},{k:"password",l:"Password",ph:"••••••••",type:"password"},{k:"clientId",l:"OAuth Client ID",ph:"optional"}],
  "OAuth2 / SCIM 2.0":[{k:"domain",l:"Okta Domain",ph:"your-org.okta.com"},{k:"apiToken",l:"API Token",ph:"••••••••",type:"password"},{k:"clientId",l:"Client ID",ph:"your-client-id"},{k:"clientSecret",l:"Client Secret",ph:"••••••••",type:"password"}],
};

function IntegrationHub(){
  const [tab,setTab]=useState("iam");
  const [selSystem,setSelSystem]=useState(null);
  const [connForm,setConnForm]=useState({});
  const [testing,setTesting]=useState(false);
  const [testResult,setTestResult]=useState(null);
  const [generating,setGenerating]=useState(false);
  const [genOutput,setGenOutput]=useState("");
  const [connections,setConnections]=useState({entra:"connected",servicenow:"connected",salesforce:"connected",github:"connected",jira:"connected",zoom:"connected",confluence:"connected"});
  const genRef=useRef(null);

  useEffect(()=>{if(genRef.current)genRef.current.scrollTop=genRef.current.scrollHeight;},[genOutput]);

  const statusChipConn=s=>{
    if(s==="connected") return <span className="chip ct-t">✓ Connected</span>;
    if(s==="pending")   return <span className="chip ct-a">⟳ Pending</span>;
    if(s==="error")     return <span className="chip ct-r">✗ Error</span>;
    if(s==="gap")       return <span className="chip ct-r">✗ Not integrated</span>;
    return <span className="chip ct-gh">Available</span>;
  };

  const handleSelect=sys=>{
    setSelSystem(sys);setConnForm({});setTestResult(null);setGenOutput("");
  };

  const handleTest=async()=>{
    setTesting(true);setTestResult(null);
    await new Promise(r=>setTimeout(r,2000));
    const success=Object.keys(connForm).length>=2;
    setTestResult(success?{ok:true,msg:"Connection successful — credentials verified"}:{ok:false,msg:"Missing required fields — please fill in all credentials"});
    setTesting(false);
  };

  const handleSave=()=>{
    if(!selSystem)return;
    setConnections(prev=>({...prev,[selSystem.id]:"connected"}));
    setTestResult({ok:true,msg:`${selSystem.name} saved and connected successfully`});
  };

  const generateConnector=async()=>{
    if(!selSystem)return;
    setGenerating(true);setGenOutput("");
    const method=selSystem.method?.split(" / ")[0]||"REST API";
    const prompt=`You are an IAM/SIEM integration architect. Generate a complete CTInnvoID middleware connector configuration for integrating ${selSystem.name} as ${tab==="iam"?"an IAM source":tab==="siem"?"a SIEM integration for security event streaming and identity threat detection":"a downstream application"}.

System: ${selSystem.name}
Vendor: ${selSystem.vendor}
Integration Method: ${selSystem.method}
Type: ${tab==="iam"?"IAM Source — provides identity data to CTInnvoID":"Downstream App — receives provisioning from CTInnvoID"}
Features: ${selSystem.features?.join(", ")||""}

Generate a complete production-ready connector config including:
1. Connector metadata (name, version, type, vendor)
2. Authentication configuration for ${selSystem.method}
3. Identity sync settings (users, groups, roles)
4. ${tab==="iam"?"Source connector — how CTInnvoID pulls identity data":"Target connector — how CTInnvoID pushes provisioning events"}
5. Event handlers (provision, deprovision, update, suspend)
6. Attribute mapping schema
7. Health check and retry policy
8. Sample API calls with real endpoints

Format as clean JSON with // comments. Make it production-realistic.`;

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,stream:true,messages:[{role:"user",content:prompt}]})
      });
      const reader=res.body.getReader();const dec=new TextDecoder();
      while(true){
        const{done,value}=await reader.read();if(done)break;
        for(const line of dec.decode(value).split("\n")){
          if(line.startsWith("data:")){
            try{const d=JSON.parse(line.slice(5));if(d.type==="content_block_delta"&&d.delta?.text)setGenOutput(p=>p+d.delta.text);}catch{}
          }
        }
      }
    }catch(e){setGenOutput("// Error: "+e.message);}
    setGenerating(false);
  };

  const dlConnector=()=>{
    const b=new Blob([genOutput],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(b);
    a.download=`${selSystem?.id||"connector"}-ctinnvoid-config.json`;
    a.click();
  };

  const systems=tab==="iam"?IAM_SYSTEMS:tab==="siem"?SIEM_INTEGRATIONS:DOWNSTREAM_APPS;
  const connectedCount=tab==="iam"
    ?IAM_SYSTEMS.filter(s=>connections[s.id]==="connected").length
    :DOWNSTREAM_APPS.filter(s=>connections[s.id]==="connected").length;

  const fields=SIEM_CONN_FIELDS[selSystem?.id]||CONN_FIELDS[selSystem?.method]||CONN_FIELDS[selSystem?.method?.split(" / ")[0]]||[
    {k:"baseUrl",l:"Base URL",ph:"https://your-system.com/api"},
    {k:"apiKey",l:"API Key / Token",ph:"••••••••",type:"password"},
  ];

  return(
    <div className="page">
      <div className="ph">
        <div className="phtop">
          <div>
            <div className="ptitle">Integration <span>Hub</span></div>
            <div className="psub">Connect IAM systems and downstream applications to CTInnvoID middleware</div>
          </div>
          <div className="pact">
            <div className="sgrid" style={{gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:0}}>
              <div className="sc" style={{padding:"10px 16px"}}><div className="slbl">IAM Systems</div><div className="sval" style={{fontSize:22,color:"var(--teal)"}}>{IAM_SYSTEMS.filter(s=>connections[s.id]==="connected").length}/{IAM_SYSTEMS.length}</div></div>
              <div className="sc" style={{padding:"10px 16px"}}><div className="slbl">Apps</div><div className="sval" style={{fontSize:22,color:"var(--violet)"}}>{DOWNSTREAM_APPS.filter(s=>connections[s.id]==="connected").length}/{DOWNSTREAM_APPS.length}</div></div>
              <div className="sc" style={{padding:"10px 16px"}}><div className="slbl">SIEM</div><div className="sval" style={{fontSize:22,color:"var(--red)"}}>{SIEM_INTEGRATIONS.filter(s=>connections[s.id]==="connected").length}/{SIEM_INTEGRATIONS.length}</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="ltabs gap">
        <button className={`ltab ${tab==="iam"?"on":""}`} onClick={()=>{setTab("iam");setSelSystem(null);}}>🏛️ IAM Systems</button>
        <button className={`ltab ${tab==="downstream"?"on":""}`} onClick={()=>{setTab("downstream");setSelSystem(null);}}>⬡ Downstream Apps</button>
        <button className={`ltab ${tab==="siem"?"on":""}`} onClick={()=>{setTab("siem");setSelSystem(null);}}>🛡️ SIEM Systems</button>
        <button className={`ltab ${tab==="flow"?"on":""}`} onClick={()=>setTab("flow")}>→ Integration Flow</button>
      </div>

      {/* FLOW TAB */}
      {tab==="flow"&&(
        <div>
          <div style={{background:"var(--glass)",backdropFilter:"blur(20px)",border:"1px solid var(--border)",borderRadius:"var(--rxl)",padding:28,marginBottom:20}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:15,fontWeight:600,marginBottom:20,color:"var(--text)"}}>CTInnvoID Middleware Architecture</div>
            <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",paddingBottom:12}}>

              {/* IAM Sources */}
              <div style={{flexShrink:0,minWidth:160}}>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:12,textTransform:"uppercase",letterSpacing:".08em"}}>IAM Sources</div>
                {IAM_SYSTEMS.slice(0,4).map(s=>(
                  <div key={s.id} style={{background:connections[s.id]==="connected"?`${s.color}12`:"var(--surface2)",border:`1px solid ${connections[s.id]==="connected"?s.color+"40":"var(--border)"}`,borderRadius:"var(--r)",padding:"8px 12px",marginBottom:6,fontSize:12,color:"var(--text)"}}>
                    {s.logo} {s.name}
                    {connections[s.id]==="connected"&&<span style={{float:"right",color:"var(--teal)",fontSize:10}}>✓</span>}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px",flexShrink:0}}>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:8,textTransform:"uppercase"}}>Sync</div>
                <div style={{height:2,width:"100%",background:`linear-gradient(90deg,var(--teal),var(--violet))`,borderRadius:2,position:"relative"}}>
                  <div style={{position:"absolute",right:-6,top:-4,color:"var(--violet)",fontSize:12}}>▶</div>
                </div>
              </div>

              {/* CTInnvoID Core */}
              <div style={{flexShrink:0,background:"linear-gradient(135deg,rgba(0,212,184,.12),rgba(123,110,246,.12))",border:"2px solid rgba(0,212,184,.3)",borderRadius:"var(--rl)",padding:"20px 24px",textAlign:"center",minWidth:200}}>
                <div style={{fontFamily:"var(--font-d)",fontSize:18,fontWeight:800,marginBottom:6}}>
                  <span style={{color:"var(--text)"}}>CT</span><span style={{background:"linear-gradient(135deg,var(--teal),var(--violet))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Innvo</span><span style={{color:"var(--teal)"}}>ID</span>
                </div>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:12}}>MIDDLEWARE PLATFORM</div>
                <div className="tag-row" style={{justifyContent:"center",gap:4}}>
                  {["Connectors","RPA Bots","Role Mining","Lineage","Discovery","SIEM"].map(f=>(
                    <span key={f} className="chip ct-t" style={{fontSize:9,padding:"2px 6px"}}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Arrow to SIEM */}
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px",flexShrink:0}}>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:8,textTransform:"uppercase"}}>Alerts</div>
                <div style={{height:2,width:"100%",background:"linear-gradient(90deg,var(--red),var(--amber))",borderRadius:2,position:"relative"}}>
                  <div style={{position:"absolute",right:-6,top:-4,color:"var(--amber)",fontSize:12}}>▶</div>
                </div>
              </div>

              {/* SIEM Systems */}
              <div style={{flexShrink:0,minWidth:160}}>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:12,textTransform:"uppercase",letterSpacing:".08em"}}>SIEM Systems</div>
                {SIEM_INTEGRATIONS.slice(0,4).map(a=>(
                  <div key={a.id} style={{background:connections[a.id]==="connected"?`${a.color}12`:"var(--surface2)",border:`1px solid ${connections[a.id]==="connected"?a.color+"40":"var(--border)"}`,borderRadius:"var(--r)",padding:"8px 12px",marginBottom:6,fontSize:12,color:"var(--text)"}}>
                    {a.logo} {a.name}
                    {connections[a.id]==="connected"&&<span style={{float:"right",color:"var(--teal)",fontSize:10}}>✓</span>}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px",flexShrink:0}}>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:8,textTransform:"uppercase"}}>Provision</div>
                <div style={{height:2,width:"100%",background:`linear-gradient(90deg,var(--violet),var(--pink))`,borderRadius:2,position:"relative"}}>
                  <div style={{position:"absolute",right:-6,top:-4,color:"var(--pink)",fontSize:12}}>▶</div>
                </div>
              </div>

              {/* Downstream Apps */}
              <div style={{flexShrink:0,minWidth:160}}>
                <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginBottom:12,textTransform:"uppercase",letterSpacing:".08em"}}>Downstream Apps</div>
                {DOWNSTREAM_APPS.slice(0,4).map(a=>(
                  <div key={a.id} style={{background:connections[a.id]==="connected"?`${a.color}12`:"var(--surface2)",border:`1px solid ${connections[a.id]==="connected"?a.color+"40":"var(--border)"}`,borderRadius:"var(--r)",padding:"8px 12px",marginBottom:6,fontSize:12,color:"var(--text)"}}>
                    {a.logo} {a.name}
                    {connections[a.id]==="connected"&&<span style={{float:"right",color:"var(--teal)",fontSize:10}}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration summary table */}
          <div className="gcard">
            <div className="gch"><div className="gct">All Integrations</div><div className="gcs">Current connection status</div></div>
            <table>
              <thead><tr><th>System</th><th>Type</th><th>Method</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {[...IAM_SYSTEMS,...DOWNSTREAM_APPS,...SIEM_INTEGRATIONS].map(s=>(
                  <tr key={s.id}>
                    <td><div className="tdp">{s.logo} {s.name}</div><div className="tdm">{s.vendor||s.cat}</div></td>
                    <td><span className="chip ct-gh">{s.type==="iam"?"IAM Source":s.id&&SIEM_INTEGRATIONS.find(x=>x.id===s.id)?"SIEM":s.cat||"App"}</span></td>
                    <td className="tdm">{s.method}</td>
                    <td>{statusChipConn(connections[s.id]||s.status)}</td>
                    <td>
                      {connections[s.id]!=="connected"&&s.status!=="connected"&&(
                        <button className="btn btn-g btn-xs" onClick={()=>{setTab(s.type==="iam"?"iam":"downstream");handleSelect(s);}}>Configure</button>
                      )}
                      {(connections[s.id]==="connected"||s.status==="connected")&&(
                        <span style={{fontSize:11,color:"var(--teal)",fontFamily:"var(--font-m)"}}>● Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IAM / DOWNSTREAM TABS */}
      {(tab==="iam"||tab==="downstream"||tab==="siem")&&(
        <div style={{display:"grid",gridTemplateColumns:selSystem?"1fr 480px":"1fr",gap:16,alignItems:"start"}}>
          {/* System cards grid */}
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              {systems.map(s=>{
                const status=connections[s.id]||s.status;
                return(
                  <div key={s.id}
                    className={selSystem?.id===s.id?"rcard sel":"rcard"}
                    style={{flexDirection:"column",alignItems:"flex-start",padding:"18px 20px",cursor:"pointer"}}
                    onClick={()=>handleSelect(s)}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginBottom:10}}>
                      <div style={{fontSize:28}}>{s.logo}</div>
                      {statusChipConn(status)}
                    </div>
                    <div style={{fontFamily:"var(--font-d)",fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>{s.name}</div>
                    <div style={{fontSize:11,color:"var(--text3)",marginBottom:10}}>{s.vendor||s.cat} · {s.method}</div>
                    <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.5,marginBottom:10}}>{s.desc}</div>
                    <div className="tag-row">
                      {(s.features||[]).slice(0,3).map(f=><span key={f} className="chip ct-gh" style={{fontSize:9,padding:"1px 6px"}}>{f}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Config panel */}
          {selSystem&&(
            <div className="dp" style={{top:0}}>
              <div className="fb" style={{marginBottom:16}}>
                <div>
                  <div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700}}>{selSystem.logo} {selSystem.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-m)",marginTop:2}}>{selSystem.method}</div>
                </div>
                <button className="btn btn-g btn-xs" onClick={()=>{setSelSystem(null);setGenOutput("");}}>✕</button>
              </div>

              {/* Status */}
              <div style={{marginBottom:14}}>{statusChipConn(connections[selSystem.id]||selSystem.status)}</div>

              {/* Features */}
              <div style={{marginBottom:16}}>
                <div className="flbl" style={{marginBottom:6}}>Capabilities</div>
                <div className="tag-row">{(selSystem.features||[]).map(f=><span key={f} className="chip ct-b" style={{fontSize:10}}>{f}</span>)}</div>
              </div>

              <hr style={{border:"none",borderTop:"1px solid var(--border)",margin:"16px 0"}}/>

              {/* Connection form */}
              <div style={{fontFamily:"var(--font-d)",fontSize:13,fontWeight:600,marginBottom:14,color:"var(--text)"}}>Connection Settings</div>
              {fields.map(f=>(
                <div key={f.k} className="fg">
                  <label className="flbl">{f.l}</label>
                  <input className="fi" type={f.type||"text"} placeholder={f.ph} value={connForm[f.k]||""} onChange={e=>setConnForm(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}

              {/* Test result */}
              {testResult&&(
                <div style={{background:testResult.ok?"rgba(34,211,160,.08)":"rgba(255,70,104,.08)",border:`1px solid ${testResult.ok?"rgba(34,211,160,.25)":"rgba(255,70,104,.25)"}`,borderRadius:"var(--r)",padding:"10px 14px",marginBottom:14}}>
                  <div style={{fontSize:13,color:testResult.ok?"var(--green)":"var(--red)",fontWeight:500}}>{testResult.ok?"✓":"✗"} {testResult.msg}</div>
                </div>
              )}

              {/* Action buttons */}
              <div className="fc2" style={{marginBottom:16}}>
                <button className="btn btn-g btn-sm" style={{flex:1}} onClick={handleTest} disabled={testing}>
                  {testing?<><span className="dots"><span/><span/><span/></span> Testing…</>:"⟳ Test Connection"}
                </button>
                <button className="btn btn-p btn-sm" style={{flex:1}} onClick={handleSave}>✓ Save & Connect</button>
              </div>

              <hr style={{border:"none",borderTop:"1px solid var(--border)",margin:"16px 0"}}/>

              {/* AI Connector generator */}
              <div style={{fontFamily:"var(--font-d)",fontSize:13,fontWeight:600,marginBottom:10,color:"var(--text)"}}>AI Connector Generator</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:12,lineHeight:1.5}}>Generate a production-ready CTInnvoID connector config for {selSystem.name} using AI</div>
              <button className="btn btn-v btn-sm" style={{width:"100%",marginBottom:12}} onClick={generateConnector} disabled={generating}>
                {generating?<><span className="dots"><span/><span/><span/></span> Generating…</>:"⚡ Generate Connector Config"}
              </button>
              {genOutput&&(
                <>
                  <div className="code-out" ref={genRef} style={{minHeight:200,fontSize:11}}>
                    {genOutput}
                    {generating&&<span className="cur"/>}
                  </div>
                  {!generating&&(
                    <button className="btn btn-s btn-sm" style={{width:"100%",marginTop:8}} onClick={dlConnector}>↓ Download Connector</button>
                  )}
                </>
              )}

              {/* Docs link */}
              <div style={{marginTop:14,textAlign:"center"}}>
                <a href={selSystem.docs} target="_blank" rel="noreferrer" style={{fontSize:12,color:"var(--teal)",textDecoration:"none"}}>📖 View {selSystem.name} docs →</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ── AI ASSISTANT CHATBOT ───────────────────────────────────────────────── */
const CHAT_TOPICS=[
  {id:"identity",icon:"👤",label:"Identity Management",sub:"Create, update, disable accounts",prompts:["Create a new user account","Disable a dormant account","Reset user permissions","List all privileged accounts","Show me all vendor accounts"]},
  {id:"access",icon:"🔐",label:"Access & Entitlements",sub:"Manage roles and access rights",prompts:["Who has access to SAP?","Show me all Global Admins","Review access for Finance team","Find over-privileged accounts","Check SoD conflicts"]},
  {id:"iam-config",icon:"🏛️",label:"IAM Configuration",sub:"Configure IAM systems",prompts:["How do I connect Okta to CTInnvoID?","Configure SailPoint IIQ connector","Set up CyberArk PAM integration","Show Entra ID configuration","Test my IAM connection"]},
  {id:"app-config",icon:"⬡",label:"App Integration",sub:"Connect downstream applications",prompts:["Generate a ServiceNow SCIM connector","How do I integrate SAP with Entra?","Configure Workday provisioning","Set up Salesforce SSO","Build RPA bot for legacy app"]},
  {id:"siem",icon:"🛡️",label:"SIEM & Security",sub:"Security alerts and threat intel",prompts:["Show recent security alerts","Any suspicious login attempts?","Check for privileged access abuse","SIEM summary for today","Identify high-risk activities"]},
  {id:"reports",icon:"📊",label:"Reports & Audit",sub:"Compliance and audit reports",prompts:["Generate access review report","Show dormant accounts report","Compliance status summary","Export identity inventory","Certification campaign status"]},
];

const SIEM_SYSTEMS=["Splunk","Microsoft Sentinel","IBM QRadar","Elastic SIEM","Palo Alto Cortex","CrowdStrike","Sumo Logic"];

const QUICK_ACTIONS=[
  {icon:"👤",label:"Create User"},
  {icon:"🚫",label:"Disable Account"},
  {icon:"🔑",label:"Reset Access"},
  {icon:"📋",label:"Access Review"},
  {icon:"🛡️",label:"SIEM Alerts"},
  {icon:"⟳",label:"Sync Identities"},
];

function buildSystemPrompt(liveData){
  const sum=liveData?.summary||{};
  return `You are the CTInnvoID AI Assistant — an intelligent IAM security platform assistant. You help security administrators manage identities, configure integrations, and respond to security events.

CURRENT ENVIRONMENT (IdenAccess.onmicrosoft.com):
- Total identities: ${sum.total||251}
- Human users: ${sum.human||0}
- Service accounts: ${sum.service||0} 
- Critical risk identities: ${sum.critical||0}
- Disabled accounts: ${sum.disabled||0}

PLATFORM CAPABILITIES:
1. Identity CRUD — create, read, update, disable/enable user accounts
2. Access management — assign/revoke roles, entitlements, group memberships
3. IAM configuration — connect Okta, SailPoint IIQ, CyberArk, Ping, ForgeRock, Active Directory
4. App integration — configure SCIM/SAML/OAuth2 connectors for downstream apps
5. RPA bots — generate automation bots for legacy apps with no API
6. SIEM integration — connect Splunk, Microsoft Sentinel, QRadar, Elastic SIEM
7. Role mining — suggest roles from entitlement patterns
8. Compliance reports — access reviews, certifications, audit logs

RESPONSE STYLE:
- Be concise and action-oriented
- For CRUD operations: confirm what you will do, show the operation result as a structured card
- For configuration: provide step-by-step guidance with real config snippets
- For SIEM: show alert summaries with severity, affected users, recommended actions
- For reports: show summary stats with key findings
- Use emojis sparingly for clarity
- If asked to perform an action (create user, disable account etc.), simulate the operation and show a realistic result card
- Always mention if an action requires admin approval or has security implications

You have read access to the identity data above. For write operations, confirm the action and show what would happen.`;
}

function ChatMessage({msg,onAction}){
  const isUser=msg.role==="user";
  const time=new Date(msg.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const sev=msg.siem?.severity||"low";
  return(
    <div className={`cm ${isUser?"u":""}`}>
      <div className={`cm-av ${isUser?"u":"ai"}`}>{isUser?"👤":"🤖"}</div>
      <div className="cm-body">
        <div className={`cm-bubble ${isUser?"u":"ai"}`}>
          <div style={{whiteSpace:"pre-wrap"}}>{msg.content}</div>
          {msg.card&&(
            <div className="cm-card">
              <div className="cm-card-hd">📋 {msg.card.title}</div>
              {msg.card.rows?.map((r,i)=>(
                <div key={i} className="cm-card-row">
                  <span className="cm-card-k">{r.k}</span>
                  <span className="cm-card-v" style={{color:r.color||"var(--text)"}}>{r.v}</span>
                </div>
              ))}
              {msg.card.status&&(
                <div className="cm-card-footer" style={{color:msg.card.status==="success"?"var(--green)":msg.card.status==="warning"?"var(--amber)":"var(--red)"}}>
                  {msg.card.status==="success"?"✓":msg.card.status==="warning"?"⚠":"✗"}
                  <span style={{fontWeight:400,color:"var(--text2)"}}>{msg.card.statusMsg}</span>
                </div>
              )}
            </div>
          )}
          {msg.siem&&(
            <div className={`cm-alert ${sev}`}>
              <div className="cm-alert-hd">
                {sev==="high"||sev==="critical"?"🚨":sev==="medium"?"⚠️":"✅"} {msg.siem.title}
                <span className="chip" style={{fontSize:9,padding:"1px 6px",background:sev==="high"?"rgba(255,70,104,.12)":sev==="medium"?"rgba(255,181,71,.12)":"rgba(34,211,160,.12)",color:sev==="high"?"var(--red)":sev==="medium"?"var(--amber)":"var(--green)",border:"none"}}>{sev.toUpperCase()}</span>
              </div>
              <div className="cm-alert-body">{msg.siem.body}</div>
              {msg.siem.actions&&(
                <div className="cm-chips" style={{marginTop:8}}>
                  {msg.siem.actions.map((a,i)=><button key={i} className="cm-chip" onClick={()=>onAction&&onAction(a)}>{a}</button>)}
                </div>
              )}
            </div>
          )}
          {msg.actions&&(
            <div className="cm-chips">
              {msg.actions.map((a,i)=><button key={i} className="cm-chip" onClick={()=>onAction&&onAction(a)}>{a}</button>)}
            </div>
          )}
        </div>
        <div className="cm-time">{time}</div>
      </div>
    </div>
  );
}

function Chatbot({liveData}){
  const [topic,setTopic]=useState("identity");
  const [messages,setMessages]=useState([{
    id:1,role:"assistant",ts:Date.now(),
    content:`Hello! I'm the CTInnvoID AI Assistant. I can help you manage identities, configure IAM systems, integrate applications, and monitor security alerts across your IdenAccess.onmicrosoft.com tenant.\n\nI currently see ${liveData?.summary?.total||251} identities, ${liveData?.summary?.critical||0} critical risks, and can access your connected systems. What would you like to do?`,
    actions:["Show critical identities","Configure a new IAM system","Generate SIEM report","Create a user account"]
  }]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [siemSystem,setSiemSystem]=useState("Microsoft Sentinel");
  const msgEndRef=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{msgEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  const send=async(text)=>{
    const userMsg=text||input.trim();
    if(!userMsg||loading)return;
    setInput("");
    const userM={id:Date.now(),role:"user",ts:Date.now(),content:userMsg};
    setMessages(p=>[...p,userM]);
    setLoading(true);

    try{
      const history=messages.slice(-8).map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content}));
      const sysPrompt=buildSystemPrompt(liveData);

      // Detect intent for special handling
      const lower=userMsg.toLowerCase();
      const isCrud=/create|add|new user|disable|enable|delete|remove|reset|update|modify|change/.test(lower);
      const isSiem=/siem|alert|threat|suspicious|attack|anomaly|incident|splunk|sentinel|qradar|security event/.test(lower);
      const isConfig=/connect|configure|setup|integrate|connector|okta|sailpoint|cyberark|ping|forgerock/.test(lower);

      let extraInstruction="";
      if(isCrud) extraInstruction=`This is an identity CRUD request. Simulate and show a RESULT_CARD block.`;
      if(isSiem) extraInstruction=`

This is a SIEM query against ${siemSystem}. Include a SIEM_ALERT:{"title":"...","severity":"high|medium|low","body":"...","actions":["Investigate","Block user","Create ticket"]} block.`;
      if(isConfig) extraInstruction=`This is a config request. Provide step-by-step instructions.`;
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:sysPrompt+extraInstruction,
          max_tokens:1000,
          messages:[...history,{role:"user",content:userMsg}]
        })
      });
      const data=await res.json();
      let content=data.content?.[0]?.text||"Sorry, I could not process that request.";

      // Parse special blocks
      let card=null,siem=null,actions=null;
      const cardMatch=content.match(/RESULT_CARD:(\{[\s\S]*?\})/);
      if(cardMatch){try{card=JSON.parse(cardMatch[1]);content=content.replace(/RESULT_CARD:\{[\s\S]*?\}/,"").trim();}catch{}}
      const siemMatch=content.match(/SIEM_ALERT:(\{[\s\S]*?\})/);
      if(siemMatch){try{siem=JSON.parse(siemMatch[1]);content=content.replace(/SIEM_ALERT:\{[\s\S]*?\}/,"").trim();}catch{}}

      // Add follow-up actions based on topic
      if(!card&&!siem){
        if(lower.includes("show")||lower.includes("list")||lower.includes("find"))
          actions=["Export results","Create ticket","Send report"];
        else if(isCrud)
          actions=["Confirm action","View audit log","Notify user"];
      }

      const aiM={id:Date.now()+1,role:"assistant",ts:Date.now(),content,card,siem,actions};
      setMessages(p=>[...p,aiM]);
    }catch(e){
      setMessages(p=>[...p,{id:Date.now()+1,role:"assistant",ts:Date.now(),content:"Sorry, I encountered an error. Please try again."}]);
    }
    setLoading(false);
  };

  const currentTopic=CHAT_TOPICS.find(t=>t.id===topic)||CHAT_TOPICS[0];

  return(
    <div className="cw">
      {/* Top bar */}
      <div className="cw-header">
        <div className="cw-header-l">
          <div className="cw-logo">🤖</div>
          <div>
            <div className="cw-title">CTInnvoID AI Assistant</div>
            <div className="cw-sub">Powered by Claude · {liveData?.summary?.total||251} identities in scope · IdenAccess.onmicrosoft.com</div>
          </div>
        </div>
        <div className="fc2">
          <span className="chip ct-t" style={{fontSize:10}}>● Live</span>
          <span className="chip ct-gh" style={{fontSize:10}}>Configure SIEM in Integration Hub</span>
        </div>
      </div>

      <div className="cw-body">
        {/* Sidebar */}
        <div className="cw-nav">
          <div className="cw-nav-section">Capabilities</div>
          <div style={{flex:1,overflowY:"auto"}}>
            {CHAT_TOPICS.map(t=>(
              <div key={t.id} className={`chat-topic ${topic===t.id?"active":""}`} onClick={()=>setTopic(t.id)}>
                <span className="cw-nav-icon">{t.icon}</span>
                <div className="chat-topic-info">
                  <span className="cw-nav-label">{t.label}</span>
                  <span className="cw-nav-sub">{t.sub}</span>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Main */}
        <div className="cw-main">
          <div className="cw-msgs">
            {messages.map(m=><ChatMessage key={m.id} msg={m} onAction={send}/>)}
            {loading&&(
              <div className="cm">
                <div className="chat-avatar ai">🤖</div>
                <div className="cm-typing">
                  <span/><span/><span/>
                  <span style={{fontSize:11,color:"var(--text3)",marginLeft:4,fontFamily:"var(--font-m)"}}>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={msgEndRef}/>
          </div>

          <div className="cw-footer">
            <div className="cw-suggestions">
              {currentTopic.prompts.slice(0,5).map((p,i)=>(
                <button key={i} className="cw-sug" onClick={()=>send(p)}>{p}</button>
              ))}
            </div>
            <div className="cw-quick-row">
              {QUICK_ACTIONS.map((a,i)=>(
                <button key={i} className="cw-quick" onClick={()=>send(a.label)}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
            <div className="cw-input-row">
              <textarea
                ref={inputRef}
                className="cw-input"
                placeholder={`Ask about identities, configure ${siemSystem}, manage access, integrate apps…`}
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                rows={1}
              />
              <button className="cw-send" onClick={()=>send()} disabled={loading||!input.trim()}>↑</button>
            </div>
            <div className="cw-hint">Enter to send · Shift+Enter for new line · Actions require admin confirmation</div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function App(){
  const [page,setPage]=useState("dashboard");
  const [scanning,setScanning]=useState(false);
  const [selApp,setSelApp]=useState(null);
  const [dark,setDark]=useState(true);
  const [liveData,setLiveData]=useState(null);
  const [loading,setLoading]=useState(true);

  const reloadData=useCallback(async()=>{
    try{
      setLoading(true);
      const data=await apiFetch("/identities");
      setLiveData(data);
    }catch(e){
      console.error("Backend not reachable:",e.message);
    }finally{
      setLoading(false);
    }
  },[]);

  useEffect(()=>{ reloadData(); },[]);
  useEffect(()=>{ document.body.classList.toggle("light",!dark); },[dark]);

  return(
    <>
      <style>{CSS}</style>
      <div className={`shell${dark?"":" light"}`}>
        <Sidebar page={page} setPage={setPage} dark={dark} setDark={setDark} live={!!liveData} loading={loading}/>
        <div className="main">
          {page==="dashboard"&&<Dashboard setPage={setPage} scanning={scanning} setScanning={setScanning} liveData={liveData} reloadData={reloadData}/>}
          {page==="identities"&&<Identities liveData={liveData}/>}
          {page==="apps"&&<AppCoverage setPage={setPage} setSelApp={setSelApp}/>}
          {page==="connector"&&<ConnectorStudio selApp={selApp} setSelApp={setSelApp}/>}
          {page==="rpa"&&<RPABuilder/>}
          {page==="roles"&&<RoleMining liveData={liveData}/>}
          {page==="lineage"&&<Lineage liveData={liveData}/>}
          {page==="discovery"&&<Discovery liveData={liveData}/>}
          {page==="integrations"&&<IntegrationHub/>}
          {page==="chatbot"&&<Chatbot liveData={liveData}/>}
        </div>
      </div>
    </>
  );
}/* ── CHATBOT ─────────────────────────────────────────────────────────────── */
