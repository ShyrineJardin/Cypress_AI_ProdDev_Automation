// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('handlePopups', () => {
    const popUps = ['#hp-popup']; // Add more popup selectors if needed

    cy.then(() => {
        let popupFound = false;

        popUps.forEach((selector) => {
            cy.get('body').then(($body) => {
                if ($body.find(selector).length > 0) {
                    popupFound = true;
                    cy.log(`🔍 Popup found: ${selector}, attempting to close it.`);

                     
                     if ($body.find(selector).find('.aiosp-close').length > 0) { // if .aiosp-close is inside the selector
                        cy.get(selector)
                            .find('.aiosp-close')
                            .first()
                            .click({ force: true });
                    } else {
                        cy.get('.aiosp-close').first().click({ force: true }); // if .aiosp-close is outside the selector
                    }

                    cy.wait(500); // Small delay to ensure popup is closed
                }
            });
        });

        if (!popupFound) {
            cy.log('✅ No popup found.');
        }
    });
});
