import { setupSPA } from './spa.js';
import { setupValidator } from "./validator.js";

document.addEventListener('DOMContentLoaded', () => {
    setupSPA();

    setupValidator();
});