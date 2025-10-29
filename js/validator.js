// Mascara de entrada
const mask = (value, pattern) => {
    let i = 0;
    const v = value.toString().replace(/\D/g, '');
    return pattern.replace(/#/g, () => v[i++] || '');
};

const masks = {
    cpf: (value) => mask(value, '###.###.###-##'),
    phone: (value) => {
        const numbers = value.toString().replace(/\D/g, '');
        if (numbers.length > 10) {
            return mask(value, '(##) #####-####'); // Celular
        }
        return mask(value, '(##) ####-####'); // Fixo
    },
    cep: (value) => mask(value, '#####-###')
};

const applyMask = () => {
    document.querySelectorAll('input[data-mask]').forEach(input => {
        const maskType = input.getAttribute('data-mask');

        input.addEventListener('input', (e) => {
            const originalValue = e.target.value.replace(/\D/g, '');
            let maskedValue = '';

            if (masks[maskType]) {
                maskedValue = masks[maskType](originalValue);
            }
            e.target.value = maskedValue;

            validateInput(e.target);
        });
        
        if (input.value) {
            const originalValue = input.value.replace(/\D/g, '');
            if (masks[maskType]) {
                input.value = masks[maskType](originalValue);
            }
        }
    });
};
const validateInput = (input) => {
    if (input.dataset.mask === 'cpf') {
        if (input.value.replace(/\D/g, '').length < 11) {
            input.setCustomValidity("CPF incompleto. Por favor, preencha todos os 11 dígitos.");
        } else {
            input.setCustomValidity(""); 
        }
    }

    if (input.dataset.mask === 'phone') {
        const digits = input.value.replace(/\D/g, '').length;
        if (digits !== 10 && digits !== 11) {
            input.setCustomValidity("Telefone incompleto. Preencha o DDD e o número completo.");
        } else {
            input.setCustomValidity("");
        }
    }

    if (input.dataset.mask === 'cep') {
        if (input.value.replace(/\D/g, '').length < 8) {
            input.setCustomValidity("CEP incompleto. Preencha os 8 dígitos.");
        } else {
            input.setCustomValidity("");
        }
    }
};

const setupValidator = () => {
    applyMask();
 
    const form = document.querySelector('.form-grid');
    if (form) {
        form.addEventListener('submit', (e) => {
            const invalidFields = form.querySelectorAll(':invalid');
            const alertElement = document.querySelector('.alert');

            if (!form.checkValidity() || invalidFields.length > 0) {
                e.preventDefault();
                
                if (alertElement) {
                    alertElement.textContent = "Por favor, preencha corretamente os campos destacados.";
                    alertElement.classList.remove('is-hidden');
                    alertElement.classList.remove('alert-success');
                    invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                e.preventDefault();

                if (alertElement) {
                    alertElement.textContent = "Cadastro enviado com sucesso! Redirecionando para página inicial.";
                    alertElement.classList.add('alert-success');
                    alertElement.classList.remove('is-hidden');
                }

                form.reset();

                setTimeout(() => {
                    history.pushState(null, '', '/index.html');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }, 1500);
            }
        });
    }
};

export { setupValidator };