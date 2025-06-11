// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile menu toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    // Function to toggle the menu visibility
    const toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
    };

    // Event listener for the menu button
    mobileMenuButton.addEventListener('click', toggleMenu);

    // Event listener for each link inside the mobile menu to close it on click
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- Theme toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
            themeToggleBtn.innerHTML = sunIcon;
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.classList.remove('dark');
            themeToggleBtn.innerHTML = moonIcon;
            localStorage.setItem('theme', 'light');
        }
    };

    // Initialize theme based on saved preference or system setting
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Event listener for the theme toggle button
    themeToggleBtn.addEventListener('click', () => {
        setTheme(htmlEl.classList.contains('dark') ? 'light' : 'dark');
    });

    // --- Password generator logic ---
    const passwordForm = document.getElementById('password-form');
    const lengthInput = document.getElementById('length');
    const lengthOutput = document.getElementById('length-output');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyMsg = document.getElementById('copy-msg');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Character sets for password generation
    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/~`',
    };

    // Update length output display when the slider is moved
    lengthInput.addEventListener('input', () => {
        lengthOutput.value = lengthInput.value;
    });

    // Main function to generate the password
    const generatePassword = () => {
        const length = parseInt(lengthInput.value, 10);
        let availableChars = '';
        if (uppercaseCheckbox.checked) availableChars += CHAR_SETS.uppercase;
        if (lowercaseCheckbox.checked) availableChars += CHAR_SETS.lowercase;
        if (numbersCheckbox.checked) availableChars += CHAR_SETS.numbers;
        if (symbolsCheckbox.checked) availableChars += CHAR_SETS.symbols;

        if (!availableChars) {
            alert('Please select at least one character type.');
            return '';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
        }
        return password;
    };

    // Function to copy text to the clipboard and show a confirmation message
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            copyMsg.textContent = 'Password copied to clipboard!';
            copyMsg.classList.remove('opacity-0');
            setTimeout(() => copyMsg.classList.add('opacity-0'), 2000);
        }).catch(() => alert('Failed to copy password.'));
    };

    // Event listener for the form submission to generate a password
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = generatePassword();
        if (!password) return;
        passwordOutput.value = password;
        regenerateBtn.disabled = false; // Enable the regenerate button
    });

    // Event listener for the regenerate button
    regenerateBtn.addEventListener('click', () => {
        const password = generatePassword();
        if (password) {
            passwordOutput.value = password;
        }
    });

    // Event listener for the copy button
    copyBtn.addEventListener('click', () => {
        const password = passwordOutput.value;
        if (password) {
            copyToClipboard(password);
        }
    });

    // Event listener for the download button
    downloadBtn.addEventListener('click', () => {
        const password = passwordOutput.value;
        if (!password) {
            alert('Please generate a password first.');
            return;
        }
        const blob = new Blob([password], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-password.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});