module.exports = (site, baseUrl, pass) => {
    describe('👤 Admin Page', () => {
      it('⚙️ Admin Login Page Loads Successfully', () => {
      cy.log('ℹ️ Visiting the Admin Login Page');
    
      cy.visit(`${baseUrl}dashboard-login`);
    
      cy.log('📍 Confirming Login Form is visible')
      cy.get('form').should('be.visible');
    
      //Login page appears with username and password fields
      cy.get('input[type="text"]').should('exist');
      cy.get('input[type="password"]').should('exist');
    });
    });
}
