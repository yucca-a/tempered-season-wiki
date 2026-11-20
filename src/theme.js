(() => {
 const root=document.documentElement;
 let theme=null,font=null;
 try { theme=localStorage.getItem('tempered-wiki-theme'); font=localStorage.getItem('tempered-wiki-font'); } catch {}
 // No saved choice: follow the system setting.
 root.dataset.theme=theme||(matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light');
 root.dataset.font=font||'normal';
})();
