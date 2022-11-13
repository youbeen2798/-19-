window.addEventListener('message', (e) => {
  const table = document.querySelector('table');
  const tbody = document.createElement('tbody');
  tbody.innerHTML=e.data;
  table.appendChild(tbody)
})

window.addEventListener('load', () => {
  window.opener.postMessage("load", '*')
})
