"use client";
import { useEffect, useMemo, useState } from "react";

type Repo={name:string;html_url:string;description:string|null;language:string|null;stargazers_count:number};
const site={"title": "AI Engineer Portfolio", "kind": "Portfolio", "description": "A living portfolio of AI engineering, automation, research, and software systems.", "tabs": ["All", "Self-Improving Trading Agent", "Mantis AI Security", "Scalecraft", "Agent OS"], "items": ["Self-Improving Trading Agent", "Mantis AI Security", "Scalecraft", "Agent OS"]};
const facts=["Evidence before claims","Responsive by default","Motion with purpose","Human review for risk"];

export default function Home() {
 const [active,setActive]=useState(site.tabs[0]); const [selected,setSelected]=useState<string|null>(null); const [repos,setRepos]=useState<Repo[]>([]); const [reduced,setReduced]=useState(false);
 useEffect(()=>{fetch("https://api.github.com/users/harmanhanjra/repos?sort=updated&per_page=8").then(r=>r.ok?r.json():[]).then(x=>setRepos(x.filter((r:Repo)=>!r.name.toLowerCase().includes("fork")).slice(0,6))).catch(()=>setRepos([]))},[]);
 const filtered=useMemo(()=>site.items.filter((x:string)=>active===site.tabs[0]||x.toLowerCase().includes(active.toLowerCase())),[active]);
 return <main className={reduced?"reduced":undefined}>
  <header className="top"><a className="brand" href="#top">HARMAN<span>.</span></a><nav>{site.tabs.map((tab:string)=><button className={active===tab?"active":""} onClick={()=>setActive(tab)} key={tab}>{tab}</button>)}</nav><button className="motion" onClick={()=>setReduced(!reduced)}>{reduced?"Motion off":"Motion on"}</button></header>
  <section className="hero" id="top"><div className="eyebrow">{site.kind} / HARMAN HANJRA</div><h1>{site.title}</h1><p>{site.description}</p><div className="hero-actions"><a className="primary" href="#workspace">Enter workspace ↓</a><a className="secondary" href="https://github.com/harmanhanjra" target="_blank" rel="noreferrer">GitHub ↗</a></div></section>
  <section className="workspace" id="workspace"><div className="section-line"><span>LIVE WORKSPACE</span><span>{filtered.length} ACTIVE MODULES</span></div><div className="module-grid">{filtered.map((item:string,i:number)=><button className={`module module-${(i%4)+1}`} key={item} onClick={()=>setSelected(item)}><small>0{i+1}</small><strong>{item}</strong><span>Inspect module ↗</span></button>)}</div></section>
  <section className="evidence"><div><div className="eyebrow">SYSTEM PRINCIPLES</div><h2>Useful intelligence, documented.</h2></div><div className="fact-list">{facts.map(f=><div className="fact" key={f}><span>+</span>{f}</div>)}</div></section>
  <section className="github" id="github"><div className="section-line"><span>OPEN SOURCE SIGNAL</span><a href="https://github.com/harmanhanjra" target="_blank" rel="noreferrer">View GitHub ↗</a></div><div className="repo-grid">{repos.length?repos.map(repo=><a className="repo" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}><strong>{repo.name.replaceAll("-"," ")}</strong><p>{repo.description||"Harman Hanjra project repository."}</p><small>{repo.language||"Open source"} · ★ {repo.stargazers_count}</small></a>):<div className="empty">GitHub repositories will appear here when the public API responds.</div>}</div></section>
  <footer><span>© 2026 HARMAN HANJRA</span><span>{site.title} / BUILT WITH NEXT.JS</span></footer>
  {selected&&<div className="modal-backdrop" role="presentation" onClick={()=>setSelected(null)}><section className="modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="Close">×</button><div className="eyebrow">MODULE INSPECTOR</div><h2>{selected}</h2><p>This interactive module is grounded in Harman Hanjra’s project system. Use this surface for architecture, evidence, implementation notes, and verified next actions.</p><a className="primary" href="https://github.com/harmanhanjra" target="_blank" rel="noreferrer">Inspect GitHub ↗</a></section></div>}
 </main>
}
