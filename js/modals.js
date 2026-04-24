function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('keydown', function(e) { if(e.key==='Escape') { document.querySelectorAll('.legal-modal-overlay.open').forEach(m=>{ m.classList.remove('open'); document.body.style.overflow=''; }); } });
