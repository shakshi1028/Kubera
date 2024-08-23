// Mock user data
const user = {
  username: 'user',
  password: 'password'
};

// Transaction data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Utility functions
const getElement = id => document.getElementById(id);
const showPage = page => {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  getElement(page).classList.remove('hidden');
};
const saveTransactions = () => localStorage.setItem('transactions', JSON.stringify(transactions));
const calculateTotals = () => {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  getElement('total-income').textContent = income.toFixed(2);
  getElement('total-expenses').textContent = expenses.toFixed(2);
  getElement('balance').textContent = (income - expenses).toFixed(2);
};

// Event handlers
const login = () => {
  const username = getElement('username').value;
  const password = getElement('password').value;
  if (username === user.username && password === user.password) {
    showPage('dashboard-page');
    renderTransactions();
    calculateTotals();
    updateChart();
  } else {
    alert('Invalid username or password');
  }
};

const showAddTransaction = () => showPage('add-transaction-page');
const showDashboard = () => showPage('dashboard-page');

const addTransaction = () => {
  const type = getElement('type').value;
  const amount = parseFloat(getElement('amount').value);
  const category = getElement('category').value;
  transactions.push({ type, amount, category });
  saveTransactions();
  renderTransactions();
  calculateTotals();
  updateChart();
  showDashboard();
};

const deleteTransaction = index => {
  transactions.splice(index, 1);
  saveTransactions();
  renderTransactions();
  calculateTotals();
  updateChart();
};

const renderTransactions = () => {
  const transactionList = getElement('transaction-list');
  transactionList.innerHTML = transactions.map((t, i) =>
    `<li>${t.category} - $${t.amount.toFixed(2)} <button onclick="deleteTransaction(${i})"><i class="fa fa-trash"></i></button></li>`
  ).join('');
};

// Chart
let chart;
const updateChart = () => {
  const ctx = getElement('expense-chart').getContext('2d');
  if (chart) {
    chart.destroy();
  }
  const categories = transactions.filter(t => t.type === 'expense').map(t => t.category);
  const amounts = transactions.filter(t => t.type === 'expense').map(t => t.amount);
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: amounts.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16))
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += context.raw.toFixed(2);
              return label;
            }
          }
        }
      }
    }
  });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  showPage('login-page');
});
