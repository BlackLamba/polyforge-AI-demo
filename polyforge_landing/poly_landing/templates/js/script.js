// Анимация появления элементов при скролле
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
            
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
                    
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
            
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);
            
    // Кнопка генерации результатов
    const generateBtn = document.getElementById('generateBtn');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const resultsContainer = document.getElementById('resultsContainer');
    const mainFormulasContainer = document.getElementById('mainFormulas');
    const alternativeFormulasContainer = document.getElementById('alternativeFormulas');

    generateBtn.addEventListener('click', async function() {
        // Получаем данные от пользователя
        const query = document.getElementById('polymerDescription').value;
        const polymerType = document.getElementById('polymerType').value;
        const synthesisMethod = document.getElementById('synthesisMethod').value;
        const costLimit = document.getElementById('costLimit').checked;
    
        // Показать анимацию загрузки
        loadingAnimation.style.display = 'block';
        resultsContainer.style.display = 'none';
    
        try {
            // Имитация запроса к ИИ (в будущем заменить на реальный запрос)
            const polymersData = await simulateAIRequest(query, {
                polymerType,
                synthesisMethod,
                costLimit
            });
        
            // Очищаем контейнеры
            mainFormulasContainer.innerHTML = '';
            alternativeFormulasContainer.innerHTML = '';
        
            // Удаляем старые модальные окна
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.id.startsWith('synthesisModal')) {
                    modal.remove();
                }
            });
        
            // Добавляем основные формулы
            polymersData.main.forEach(polymer => {
                mainFormulasContainer.innerHTML += createPolymerCard(polymer);
            
                // Создаем модальное окно для синтеза
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = createSynthesisModal(polymer);
                document.body.appendChild(modalContainer.firstElementChild);
            });
        
            // Добавляем альтернативные формулы
            polymersData.alternatives.forEach(polymer => {
                alternativeFormulasContainer.innerHTML += createPolymerCard(polymer, true);
            
                // Создаем модальное окно для синтеза
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = createSynthesisModal(polymer);
                document.body.appendChild(modalContainer.firstElementChild);
            });
        
            // Инициализируем Bootstrap модальные окна
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                new bootstrap.Modal(modal);
            });
        
            // Добавляем обработчики для кнопок скачивания
            document.querySelectorAll('.download-protocol').forEach(btn => {
                btn.addEventListener('click', function() {
                    const polymerId = this.getAttribute('data-polymer-id');
                    downloadSynthesisProtocol(polymerId);
                });
            });
        
            // Показываем результаты
            loadingAnimation.style.display = 'none';
            resultsContainer.style.display = 'block';
        
            // Плавная прокрутка к результатам
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        } catch (error) {
            console.error('Ошибка при генерации формул:', error);
            loadingAnimation.style.display = 'none';
            alert('Произошла ошибка при обработке запроса. Попробуйте еще раз.');
        }
    });

    // Функция для скачивания протокола синтеза
    function downloadSynthesisProtocol(polymerId) {
        // В реальном приложении здесь будет запрос к бэкенду
        alert(`Скачивание протокола для полимера ${polymerId} (в разработке)`);
    }
            
    // Кнопка отправки сообщения
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    sendMessageBtn.addEventListener('click', function() {
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
                
        if (!name || !email || !message) {
            alert('Пожалуйста, заполните все поля формы');
            return;
        }
                
        // Имитация отправки сообщения
        sendMessageBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Отправка...';
        sendMessageBtn.disabled = true;
                
        setTimeout(function() {
            alert('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactMessage').value = '';
                    
            sendMessageBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Отправить сообщение';
            sendMessageBtn.disabled = false;
        }, 1500);
    });
            
    // Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
                    
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
                    
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
            
    // Изменение навигационной панели при скролле
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
            
    // Пример предзаполненных запросов для демонстрации
    const exampleQueries = [
        "гибкий, термостойкий до 200°C, биоразлагаемый",
        "прочный, легкий, для 3D-печати",
        "прозрачный, ударопрочный, низкая стоимость",
        "гидрофобный, устойчивый к УФ-излучению"
    ];
            
    const descriptionField = document.getElementById('polymerDescription');
    let queryIndex = 0;
            
    // Функция для смены примеров запросов
    function changeExampleQuery() {
        descriptionField.placeholder = `Например: ${exampleQueries[queryIndex]}`;
        queryIndex = (queryIndex + 1) % exampleQueries.length;
    }
            
    // Меняем пример каждые 5 секунд
    changeExampleQuery();
    setInterval(changeExampleQuery, 5000);
            
    // Добавляем подсказку при фокусе на поле ввода
    descriptionField.addEventListener('focus', function() {
        this.setAttribute('title', 'Опишите свойства полимера на естественном языке. Например: "гибкий материал с температурой плавления не ниже 150°C, устойчивый к химическим реагентам"');
    });
});

// Функция для создания карточки полимера
function createPolymerCard(polymer, isAlternative = false) {
    const cardId = `polymer-${polymer.id}`;
    
    return `
        <div class="formula-card" id="${cardId}">
            <div class="formula-name">${polymer.name}</div>
            <div class="formula-structure">${polymer.structure}</div>
            <div class="properties-container">
                ${polymer.properties.map(prop => 
                    `<span class="property-badge">${prop}</span>`
                ).join('')}
            </div>
            <button class="btn synthesis-btn" 
                    data-polymer-id="${polymer.id}" 
                    data-bs-toggle="modal" 
                    data-bs-target="#synthesisModal${polymer.id}">
                <i class="fas fa-vial me-2"></i> Как синтезировать
            </button>
        </div>
    `;
}

// Функция для создания модального окна где описывается синтез
function createSynthesisModal(polymer) {
    return `
        <div class="modal fade" id="synthesisModal${polymer.id}" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Синтез ${polymer.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="formula-structure text-center mb-4">${polymer.structure}</div>
                        
                        <h6 class="mb-3">Пошаговый метод синтеза:</h6>
                        
                        ${polymer.synthesis.steps.map((step, index) => `
                            <div class="synthesis-step">
                                <strong>Шаг ${index + 1}:</strong>
                                <p>${step}</p>
                            </div>
                        `).join('')}
                        
                        ${polymer.synthesis.reagents.length > 0 ? `
                            <div class="mt-4">
                                <h6>Необходимые реагенты:</h6>
                                <ul>
                                    ${polymer.synthesis.reagents.map(reagent => 
                                        `<li>${reagent}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${Object.keys(polymer.synthesis.conditions).length > 0 ? `
                            <div class="mt-3">
                                <h6>Условия реакции:</h6>
                                <ul>
                                    ${Object.entries(polymer.synthesis.conditions).map(([key, value]) => 
                                        `<li><strong>${key}:</strong> ${value}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary-custom download-protocol" 
                                data-polymer-id="${polymer.id}">
                            <i class="fas fa-download me-2"></i> Скачать протокол синтеза
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}