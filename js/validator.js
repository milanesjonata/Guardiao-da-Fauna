//Mascara de entrada
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
        return mask(value, '(##) ####-####'); //Fixo
    },
    cep: (value) => mask(value, '#####-###')
};

const applyMask = () => {
    document.querySelectorAll('input[data-mask]').forEach(input => {
        const maskType = input.getAttribute('data-mask');

        input.addEventListener('input', (e) => {
            const originalValue = e.target.value.replace(/\D/g,  '');
            let maskedValue = '';

            if (maskedValue[maskType]) {
                maskedValue = mask[maskType](originalValue);
            }
            e.target.value = maskedValue.substring(0, mask(originalValue, mask[maskType](originalValue.padEnd(20, '#'))).length);

            validateInput(e.target);
        });
    });
};

//Validação de consistência
const validateInput = (input) => {
    if (input.dateset.mask === 'cpf' && input.value.replace(/\D/g, '').length < 11) {
        input.setCustomValidity("");
    }
};

const setupValidator = () => {
    applyMask();

    //Logica para mostrar alerta de preenchimento incorreto 

    const form= document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const invalidFields = form.querySelectorAll(':invalid');
            const alertElement = document.querySelector('.alert'); //Aleta do css

            if (invalidFields.length > 0) {
                e.preventDefault();

                if (alertElement) {
                    alertElement.textContent = "Por favor, preencha corretamente os campos destacados.";
                    alertElement.classList.remove('is-hidden');
                    //Rola até o primeiro campo invalido
                    invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center'});
                }
            } else {
                if (alertElement) {
                    alertElement.classList.add('is-hidden');
                }
            }
        });
    }
};
export { setupValidator };