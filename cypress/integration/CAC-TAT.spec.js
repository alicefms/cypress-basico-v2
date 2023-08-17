/// <reference types="Cypress" />
beforeEach(() => {
    cy.visit('./src/index.html')
});


describe('Central de Atendimento ao Cliente TAT', function() {
    
    it('verifica o título da aplicação', function() {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    });
    
    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.get('#firstName').type('Alice')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('alice@email.com')
        cy.get('#phone').type('8199999999')
        cy.get('#open-text-area').type('eita, eita, vamos ver se agora demora menos pra digitar por causa do delay', {"delay": 0})
        cy.get('.button').click()
        cy.get('.success').should('be.visible')
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Alice')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('alice@hotmailcom')
        cy.get('#phone').type('8199999999')
        cy.get('#open-text-area').type('eita, eita')
        cy.get('.button').click()
        cy.get('.error').should('be.visible')
    });

    it('não permite digitação de valor não numérico no telefone', () => {
        cy.get('#phone').type('teste string').should('be.empty')
    });

    it.only('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Alice')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('alice@email.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('eita, eita')
        cy.get('.button').click()
        cy.get('.error').should('be.visible')
    });
    
});