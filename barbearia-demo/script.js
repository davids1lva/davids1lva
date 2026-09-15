const services = [
  { id: 'corte-classico', name: 'Corte clássico', detail: 'Tesoura ou máquina, acabamento e styling.', price: 18, duration: 45 },
  { id: 'degrade', name: 'Degradê', detail: 'Transição precisa e contornos definidos.', price: 22, duration: 45 },
  { id: 'barba', name: 'Barba', detail: 'Desenho, aparagem e toalha quente.', price: 14, duration: 30 },
  { id: 'corte-barba', name: 'Corte + barba', detail: 'O ritual completo, num só atendimento.', price: 29, duration: 75 },
  { id: 'corte-crianca', name: 'Corte criança', detail: 'Até aos 12 anos, com toda a calma.', price: 15, duration: 45 },
  { id: 'tratamento', name: 'Tratamento capilar', detail: 'Lavagem, cuidado do couro cabeludo e styling.', price: 20, duration: 45 },
];
const exampleSlots = ['10:00', '11:30', '14:00', '15:30', '17:00'];
let selectedService = services[0].id;
let selectedDate = '';
let selectedTime = '';
const today = new Date();
today.setHours(0, 0, 0, 0);
let shownMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDay = new Date(today);
lastDay.setDate(lastDay.getDate() + 30);

function chooseService(id) {
  selectedService = id;
  const service = services.find(item => item.id === id);
  document.getElementById('summaryService').innerHTML = `${service.name} <small>${service.duration} min · pagamento no local</small>`;
  document.getElementById('summaryPrice').textContent = `${service.price} €`;
  document.querySelectorAll('[data-service]').forEach(button => {
    const active = button.dataset.service === id;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

document.getElementById('serviceGrid').innerHTML = services.map((item, index) => `
  <button class="service-card" type="button" data-service="${item.id}" aria-pressed="false">
    <span class="service-number">0${index + 1}</span><span class="service-price">${item.price} €</span>
    <strong>${item.name}</strong><span class="service-detail">${item.detail}</span>
    <span class="service-bottom"><span>${item.duration} min</span><span>EXPLORAR ↗</span></span>
  </button>`).join('');
document.getElementById('serviceOptions').innerHTML = services.map(item => `
  <button class="service-option" type="button" data-service="${item.id}" aria-pressed="false">
    <span>${item.name}</span><strong>${item.price} €</strong>
  </button>`).join('');
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
  chooseService(button.dataset.service);
  if (button.classList.contains('service-card')) document.getElementById('marcacao').scrollIntoView({ behavior: 'smooth' });
}));
chooseService(selectedService);

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function renderSlots() {
  document.getElementById('slotOptions').innerHTML = exampleSlots.map(time => `
    <button class="slot-option${time === selectedTime ? ' selected' : ''}" type="button" data-time="${time}" aria-pressed="${time === selectedTime}">${time}</button>`).join('');
  document.querySelectorAll('[data-time]').forEach(button => button.addEventListener('click', () => {
    selectedTime = button.dataset.time;
    renderSlots();
  }));
}

function renderCalendar() {
  document.getElementById('calendarMonth').textContent = new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(shownMonth);
  const start = (shownMonth.getDay() + 6) % 7;
  const days = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 0).getDate();
  let markup = '<span></span>'.repeat(start);
  for (let day = 1; day <= days; day++) {
    const date = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), day);
    const disabled = date < today || date > lastDay || date.getDay() === 0 || date.getDay() === 1;
    const key = dateKey(date);
    markup += `<button type="button" data-date="${key}" aria-label="${new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full' }).format(date)}" aria-pressed="${key === selectedDate}" class="${key === selectedDate ? 'selected' : ''}" ${disabled ? 'disabled' : ''}>${day}</button>`;
  }
  document.getElementById('calendarGrid').innerHTML = markup;
  document.querySelectorAll('[data-date]').forEach(button => button.addEventListener('click', () => {
    selectedDate = button.dataset.date;
    selectedTime = '';
    renderCalendar();
    renderSlots();
  }));
  document.getElementById('previousMonth').disabled = shownMonth.getFullYear() === today.getFullYear() && shownMonth.getMonth() === today.getMonth();
  document.getElementById('nextMonth').disabled = shownMonth.getFullYear() === lastDay.getFullYear() && shownMonth.getMonth() === lastDay.getMonth();
}

document.getElementById('previousMonth').addEventListener('click', () => {
  shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() - 1, 1);
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1);
  renderCalendar();
});
renderCalendar();
renderSlots();
