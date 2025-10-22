<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EventNest – Templates</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="navbar" role="navigation" aria-label="Primary">
    <div class="nav-inner">
      <a class="brand" href="index.html">EVENT NEST - NESTING IDEAS,CRAFTING EXPERIENCE <span class="group">&lt;InnoQuint&gt;</span></a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="nav-links" class="nav-links">
        <a href="index.html#home">Home</a>
        <a href="events.html">Events</a>
        <a href="#dashboard">Dashboard</a>
      </nav>
    </div>
  </header>

  <main class="templates-page" style="max-width:1200px;margin:1rem auto;padding:0 1rem;">
    <section class="about" aria-label="Templates Intro">
      <h1>Community Event Templates</h1>
      <p>Browse, create, and share templates for workshops, festivals, meetups and more.</p>
    </section>

    <section class="templates-toolbar" aria-label="Browse Controls">
      <div class="tabs" role="tablist">
        <button class="tab active" role="tab" aria-selected="true" data-tab="browse">Browse</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="mine">My Templates</button>
      </div>
      <div class="filters" role="group" aria-label="Filters">
        <input type="text" id="tpl-search" placeholder="Search templates..." aria-label="Search">
        <select id="tpl-category" aria-label="Category filter">
          <option value="">All Categories</option>
          <option value="workshop">Workshop</option>
          <option value="festival">Festival</option>
          <option value="meetup">Meetup</option>
          <option value="education">Education</option>
          <option value="community">Community</option>
        </select>
        <input type="date" id="tpl-date" aria-label="Date">
        <input type="text" id="tpl-location" placeholder="Location" aria-label="Location">
        <select id="tpl-sort" aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
        <button class="btn btn-primary" id="create-template-btn" type="button">Create Template</button>
      </div>
    </section>

    <section class="tpl-panels" aria-label="Template Lists">
      <!-- BROWSE -->
      <div class="tpl-panel" data-panel="browse">
        <article class="card create-card" aria-label="Create template card">
          <div class="card-body">
            <h3>Create Template</h3>
            <form id="create-template-card-form" class="login-form compact" novalidate>
              <div class="field"><label for="ctc-title">Title</label><input id="ctc-title" name="title" type="text" required></div>
              <div class="field"><label for="ctc-description">Description</label><textarea id="ctc-description" name="description" rows="3" required></textarea></div>
              <div class="field"><label for="ctc-datetime">Date/Time</label><input id="ctc-datetime" name="datetime" type="datetime-local" required></div>
              <div class="field"><label for="ctc-location">Location</label><input id="ctc-location" name="location" type="text" required></div>
              <div class="field"><label for="ctc-images">Image URL</label><input id="ctc-images" name="images" type="url" placeholder="https://..."></div>
              <div class="field"><label for="ctc-organizer">Organizer</label><input id="ctc-organizer" name="organizer" type="text" required></div>
              <div class="field"><label for="ctc-category">Category</label>
                <select id="ctc-category" name="category" required>
                  <option value="workshop">Workshop</option>
                  <option value="festival">Festival</option>
                  <option value="meetup">Meetup</option>
                  <option value="education">Education</option>
                  <option value="community">Community</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="reset" class="btn btn-ghost">Clear</button>
                <button type="submit" class="btn btn-primary">Add Template</button>
              </div>
            </form>
          </div>
        </article>
        <!-- React-rendered template preview will mount here -->
        <div id="react-template-root" class="card-grid" aria-label="React Template Preview"></div>
        <div class="card-grid" id="tpl-grid"></div>
      </div>
      <!-- MINE -->
      <div class="tpl-panel hidden" data-panel="mine">
        <div class="card-grid" id="mytpl-grid"></div>
      </div>
    </section>
  </main>

  <!-- Create Template Modal -->
  <div class="modal" id="create-template-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="ct-title">
    <div class="modal-backdrop" data-close></div>
    <div class="modal-dialog" role="document">
      <button class="modal-close" aria-label="Close" data-close>✕</button>
      <div class="modal-content">
        <div class="login-select" style="text-align:left">
          <h2 id="ct-title">Create Template</h2>
          <p>Define a reusable event template. You can edit later.</p>
        </div>
        <form class="login-form compact" id="create-template-form" novalidate>
          <div class="field"><label for="ct-title-inp">Title</label><input id="ct-title-inp" name="title" type="text" required></div>
          <div class="field"><label for="ct-desc">Description</label><textarea id="ct-desc" name="description" rows="4" required></textarea></div>
          <div class="field"><label for="ct-datetime">Date/Time</label><input id="ct-datetime" name="datetime" type="datetime-local" required></div>
          <div class="field"><label for="ct-location">Location</label><input id="ct-location" name="location" type="text" required></div>
          <div class="field"><label for="ct-images">Image URL</label><input id="ct-images" name="images" type="url" placeholder="https://..."></div>
          <div class="field"><label for="ct-organizer">Organizer</label><input id="ct-organizer" name="organizer" type="text" required></div>
          <div class="field"><label for="ct-category">Category</label>
            <select id="ct-category" name="category" required>
              <option value="workshop">Workshop</option>
              <option value="festival">Festival</option>
              <option value="meetup">Meetup</option>
              <option value="education">Education</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" data-close>Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Template</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <footer class="footer" aria-label="Footer">
    <div class="footer-grid">
      <div>
        <h3>EVENT NEST - NESTING IDEAS,CRAFTING EXPERIENCE <span class="group">&lt;InnoQuint&gt;</span></h3>
        <p>contact@connecthub.example</p>
        <div class="socials">
          <a href="#" aria-label="Twitter">Twitter</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </div>
      </div>
      <div>
        <h4>Newsletter</h4>
        <form class="newsletter" novalidate>
          <input type="email" placeholder="Your email" aria-label="Email">
          <button class="btn btn-primary" type="submit">Subscribe</button>
        </form>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul class="links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </div>
    </div>
    <p class="copyright">© <span id="year"></span> EVENT NEST - NESTING IDEAS,CRAFTING EXPERIENCE • &lt;InnoQuint&gt;</p>
  </footer>

  <script src="app.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script>
    (function(){
      const previewRootEl = document.getElementById('react-template-root');
      const listRootEl = document.getElementById('tpl-grid');
      if(!previewRootEl || !listRootEl || !window.React || !window.ReactDOM) return;
      const e = React.createElement;
      const API_BASE = 'http://localhost:4000';
      function toDateTime(s){ try{ return new Date(s).toLocaleString([], { dateStyle:'medium', timeStyle:'short' }); }catch{return s||''} }
      function Card(props){
        const img = props.images || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop';
        return e('article', {className:'card reveal'},
          e('img', {src: img, alt: props.title||'Template'}),
          e('div', {className:'card-body'},
            e('h3', null, props.title||'New Template'),
            e('p', {className:'desc'}, props.description||'Preview your template details here.'),
            e('ul', {className:'meta'},
              e('li', null, '📅 ', toDateTime(props.datetime||'')),
              e('li', null, '📍 ', props.location||''),
              e('li', null, '🏷️ ', props.category||'')
            ),
            e('div', {className:'actions'},
              e('button', {className:'btn btn-secondary', type:'button'}, 'Use This Template'),
              e('button', {className:'btn btn-ghost', type:'button'}, '❤ ', String(props.likes||0))
            )
          )
        );
      }
      function Grid({items}){
        return e(React.Fragment, null, items.map((it, idx)=> e(Card, {...it, key: (it.id||idx)})));
      }
      const previewRoot = ReactDOM.createRoot(previewRootEl);
      const listRoot = ReactDOM.createRoot(listRootEl);
      const form = document.getElementById('create-template-card-form');
      const draft = { title:'', description:'', datetime:'', location:'', images:'', organizer:'', category:'' };
      const store = { templates: [] };

      function readDraft(){
        if(!form) return draft;
        draft.title = form.querySelector('#ctc-title')?.value||'';
        draft.description = form.querySelector('#ctc-description')?.value||'';
        draft.datetime = form.querySelector('#ctc-datetime')?.value||'';
        draft.location = form.querySelector('#ctc-location')?.value||'';
        draft.images = form.querySelector('#ctc-images')?.value||'';
        draft.organizer = form.querySelector('#ctc-organizer')?.value||'';
        draft.category = form.querySelector('#ctc-category')?.value||'';
        return draft;
      }
      function renderPreview(){ previewRoot.render(e(Card, readDraft())); }
      function renderList(items){ listRoot.render(e(Grid, {items: items||store.templates})); }

      async function loadTemplates(){
        try{
          const res = await fetch(API_BASE + '/api/templates');
          if(!res.ok) throw new Error('Load failed');
          const data = await res.json();
          store.templates = Array.isArray(data) ? data : (data.items||[]);
        }catch{
          // fallback demo items
          store.templates = [];
        }finally{
          applyFilters();
        }
      }

      async function addTemplate(payload){
        try{
          const res = await fetch(API_BASE + '/api/templates', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
          if(res.ok){
            const created = await res.json();
            store.templates.unshift(created || payload);
          } else {
            store.templates.unshift(payload);
          }
        }catch{
          store.templates.unshift(payload);
        }finally{
          applyFilters();
        }
      }

      // Filtering & search
      const elSearch = document.getElementById('tpl-search');
      const elCategory = document.getElementById('tpl-category');
      const elDate = document.getElementById('tpl-date');
      const elLocation = document.getElementById('tpl-location');
      const elSort = document.getElementById('tpl-sort');

      function normalize(v){ return (v||'').toString().toLowerCase().trim(); }
      function parseDate(v){ const d=new Date(v); return isNaN(d) ? null : d; }
      function sameDay(a,b){ return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

      function applyFilters(){
        let items = [...store.templates];
        const q = normalize(elSearch?.value);
        const cat = normalize(elCategory?.value);
        const loc = normalize(elLocation?.value);
        const d = parseDate(elDate?.value);
        if(q){ items = items.filter(it=> normalize(it.title).includes(q) || normalize(it.description).includes(q)); }
        if(cat){ items = items.filter(it=> normalize(it.category)===cat); }
        if(loc){ items = items.filter(it=> normalize(it.location).includes(loc)); }
        if(d){ items = items.filter(it=> { const id=parseDate(it.datetime); return id && sameDay(id,d); }); }
        const sort = (elSort?.value)||'newest';
        if(sort==='popular'){ items.sort((a,b)=> (b.likes||0)-(a.likes||0)); }
        else { items.sort((a,b)=> (new Date(b.datetime))- (new Date(a.datetime))); }
        renderList(items);
      }

      function debounce(fn, ms){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(null,args), ms); }; }
      const onFilterChange = debounce(applyFilters, 150);

      if(elSearch){ elSearch.addEventListener('input', onFilterChange); }
      [elCategory, elDate, elLocation, elSort].forEach(el=>{ if(el){ el.addEventListener('change', onFilterChange); }});

      // Client-side validation
      function isValidUrl(u){ try{ if(!u) return true; const x=new URL(u); return ['http:','https:'].includes(x.protocol); }catch{return false} }
      function validateDraft(){
        // Use native constraints first
        if(!form.checkValidity()){
          form.reportValidity();
          return false;
        }
        // Image URL optional but must be valid if present
        const imgInp = form.querySelector('#ctc-images');
        if(imgInp){ imgInp.setCustomValidity(''); if(imgInp.value && !isValidUrl(imgInp.value)){ imgInp.setCustomValidity('Please enter a valid image URL (http/https).'); imgInp.reportValidity(); return false; } }
        return true;
      }

      // Init
      renderPreview();
      loadTemplates();
      if(form){
        form.addEventListener('input', renderPreview);
        form.addEventListener('change', renderPreview);
        form.addEventListener('submit', function(ev){
          ev.preventDefault();
          if(!validateDraft()) return;
          const tpl = {...readDraft(), id: Date.now(), likes: 0};
          addTemplate(tpl);
          try{ alert('Template added'); }catch{}
          form.reset();
          renderPreview();
        });
      }
    })();
  </script>
</body>
</html>