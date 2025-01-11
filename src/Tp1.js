let TableauTaches = [];
let TableauTermine = [];

const appContainer = document.getElementById('app');

// Création du champ de saisie pour l'intitulé de la tâche
const inputField = document.createElement('input');
inputField.type = 'text';
inputField.id = 'taskInput';
inputField.placeholder = 'Entrez la description de la tâche';
appContainer.appendChild(inputField);  // Ajout du champ de saisie au conteneur

// Création du bouton pour ajouter une tâche
const addButton = document.createElement('button');
addButton.textContent = 'Ajouter une tâche';
addButton.id = 'addTaskButton';
appContainer.appendChild(addButton);

// Création du menu de filtrage
const filterSelect = document.createElement('select');
filterSelect.id = 'filterSelect';

const optionAll = document.createElement('option');
optionAll.value = 'all';
optionAll.textContent = 'Toutes les tâches';

const optionCompleted = document.createElement('option');
optionCompleted.value = 'completed';
optionCompleted.textContent = 'Tâches terminées';

const optionUncompleted = document.createElement('option');
optionUncompleted.value = 'uncompleted';
optionUncompleted.textContent = 'Tâches non terminées';

filterSelect.appendChild(optionAll);
filterSelect.appendChild(optionCompleted);
filterSelect.appendChild(optionUncompleted);
appContainer.appendChild(filterSelect);

// Ajout de l'événement pour ajouter une tâche
addButton.addEventListener('click', AjouterTache);

// Ajout de l'événement pour filtrer les tâches
filterSelect.addEventListener('change', () => {
  const filterType = filterSelect.value;
  filterTasks(filterType);
});

// Fonction pour ajouter une tâche
function AjouterTache() {
  const taskDescription = inputField.value.trim();

  if (taskDescription === '') {
    alert('Veuillez entrer une description pour la tâche.');
    return;
  }

  TableauTaches.push(taskDescription);
  TableauTermine.push(false);

  console.log('Tableau des tâches:', TableauTaches);
  console.log('Tableau des états terminés:', TableauTermine);

  AjouterTacheHTML(taskDescription);

  inputField.value = '';
}

// Fonction pour ajouter la tâche au tableau HTML
function AjouterTacheHTML(item) {
  let table = document.querySelector('table');

  if (!table) {
    table = document.createElement('table');
    table.border = '1';
    table.style.width = '100%';

    const caption = document.createElement('caption');
    caption.textContent = 'Liste des tâches';
    table.appendChild(caption);

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headerCell1 = document.createElement('th');
    headerCell1.textContent = 'Terminée';
    headerCell1.style.width = '50px';

    const headerCell2 = document.createElement('th');
    headerCell2.textContent = 'Numéro';

    const headerCell3 = document.createElement('th');
    headerCell3.textContent = 'Libellé';

    const headerCell4 = document.createElement('th');
    headerCell4.textContent = 'Supprimer';

    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    document.body.appendChild(table);
  }

  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.dataset.index = TableauTaches.length - 1;

  const cellCheckbox = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = TableauTermine.length;
  checkbox.addEventListener('change', Cocher);
  cellCheckbox.appendChild(checkbox);
  cellCheckbox.style.textAlign = 'center';

  const cellNumero = document.createElement('td');
  cellNumero.textContent = TableauTaches.length;
  cellNumero.style.textAlign = 'center';
  cellNumero.style.verticalAlign = 'middle';

  const cellLibelle = document.createElement('td');
  cellLibelle.textContent = item;

  const cellDelete = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Supprimer';
  deleteButton.dataset.index = TableauTaches.length - 1;
  deleteButton.addEventListener('click', SupprimerTache);
  cellDelete.appendChild(deleteButton);

  newRow.appendChild(cellCheckbox);
  newRow.appendChild(cellNumero);
  newRow.appendChild(cellLibelle);
  newRow.appendChild(cellDelete);
  tbody.appendChild(newRow);
}

// Fonction pour marquer une tâche comme terminée
function Cocher(event) {
  const idCase = parseInt(event.target.id, 10) - 1;
  TableauTermine[idCase] = event.target.checked;

  console.log(`Tâche ${idCase + 1} : ${TableauTermine[idCase] ? 'Terminée' : 'Non terminée'}`);

  const table = document.querySelector('table');
  const libelleCell = table.rows[idCase + 1].cells[2];

  if (event.target.checked) {
    libelleCell.innerHTML = `<s>${TableauTaches[idCase]}</s>`;
  } else {
    libelleCell.innerHTML = TableauTaches[idCase];
  }

  filterTasks(filterSelect.value);
}

// Fonction pour supprimer une tâche
function SupprimerTache(event) {
  const taskIndex = parseInt(event.target.dataset.index, 10);

  TableauTaches.splice(taskIndex, 1);
  TableauTermine.splice(taskIndex, 1);

  console.log('Tâche supprimée:', taskIndex);
  console.log('Nouveau tableau des tâches:', TableauTaches);
  console.log('Nouveau tableau des états terminés:', TableauTermine);

  const tableRow = event.target.closest('tr');
  tableRow.remove();

  document.querySelectorAll('table tbody tr').forEach((row, index) => {
    row.dataset.index = index;
    row.cells[1].textContent = index + 1;
    row.querySelector('button').dataset.index = index;
    row.querySelector('input[type="checkbox"]').id = index + 1;
  });
}

// Fonction pour filtrer les tâches
function filterTasks(filterType) {
  const tableRows = document.querySelectorAll('table tbody tr');

  tableRows.forEach((row) => {
    const taskIndex = parseInt(row.dataset.index, 10);
    const isCompleted = TableauTermine[taskIndex];

    switch (filterType) {
      case 'all':
        row.style.display = '';
        break;
      case 'completed':
        row.style.display = isCompleted ? '' : 'none';
        break;
      case 'uncompleted':
        row.style.display = !isCompleted ? '' : 'none';
        break;
    }
  });
}
