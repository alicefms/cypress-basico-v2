/// <reference types="Cypress" />
describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(() => {
        cy.visit('./src/index.html')
    });

    it('verifica o título da aplicação', function() {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    });
    
    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.get('#firstName').type('Alice')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('alice@email.com')
        cy.get('#phone').type('8199999999')
        cy.get('#open-text-area').type('eita, eita, vamos ver se agora demora menos pra digitar por causa do delay', {"delay": 0})
        cy.contains('.button', 'Enviar').click()
        cy.get('.success').should('be.visible')
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Alice')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('alice@hotmailcom')
        cy.get('#phone').type('8199999999')
        cy.get('#open-text-area').type('eita, eita')
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('não permite digitação de valor não numérico no telefone', () => {
        cy.get('#phone').type('teste string').should('be.empty')
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Alice')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('alice@email.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('eita, eita')
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Alice').should('have.value', 'Alice').clear().should('have.value', '')
        cy.get('#lastName').type('Souza').should('have.value', 'Souza').clear().should('have.value', '')
        cy.get('#email').type('alice@email.com').should('have.value', 'alice@email.com').clear().should('have.value', '')
        cy.get('#phone').type('8199999999').should('have.value', '8199999999').clear().should('have.value', '')
    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('select').select('YouTube').should('have.value', 'youtube')
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('select').select('mentoria').should('have.value', 'mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('select').select(1).should('have.value', 'blog')
    });
    
    it.only('marca o tipo de atendimento "Feedback"', () => {
        cy.get('#support-type > label:nth-child(4) > input[type=radio]').check()
    });
});