'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.category-item');
    const products = document.querySelectorAll('.product-card');
    const collectionHeader = document.querySelector('.collection-header h1');

    function filterProducts(category) {
        category = category.toLowerCase();
        
        // Update header
        collectionHeader.textContent = category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)} Headscarves`;
        
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            product.style.display = (category === 'all' || category === '' || title.includes(category)) ? 'block' : 'none';
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('current'));
            link.classList.add('current');
            filterProducts(link.textContent.trim());
        });
    });

    filterProducts('all');
});
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.category-item');
    const products = document.querySelectorAll('.product-card');
    const collectionHeader = document.querySelector('.collection-header h1');
    const breadcrumbCurrent = document.querySelector('.breadcrumb li:last-child span');

    function filterProducts(category) {
        category = category.toLowerCase();
        
        // Update header
        const displayText = category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)} Headscarves`;
        collectionHeader.textContent = displayText;
        
        // Update breadcrumb
        breadcrumbCurrent.textContent = displayText;
        
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            product.style.display = (category === 'all' || category === '' || title.includes(category)) ? 'block' : 'none';
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('current'));
            link.classList.add('current');
            filterProducts(link.textContent.trim());
        });
    });

    filterProducts('all');
});