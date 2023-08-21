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
        cy.clock()
        cy.contains('.button', 'Enviar').click()
        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
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
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('eita, eita')
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    Cypress._.times(5, ()=>
    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Alice').should('have.value', 'Alice').clear().should('have.value', '')
        cy.get('#lastName').type('Souza').should('have.value', 'Souza').clear().should('have.value', '')
        cy.get('#email').type('alice@email.com').should('have.value', 'alice@email.com').clear().should('have.value', '')
        cy.get('#phone').type('8199999999').should('have.value', '8199999999').clear().should('have.value', '')
    })
    );

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
    
    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('#support-type > label:nth-child(4) > input[type=radio]').check().should('have.value', 'feedback')
    });

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]').each(($el) => cy.wrap($el).check().should('be.checked'))
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('#email-checkbox').check().should('be.checked')
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('input[type="checkbox"]').last().uncheck().should('not.be.checked')
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload').should('not.have.value')
        .selectFile('./cypress/fixtures/example.json').should(($el)=>
        expect($el[0].files[0].name).to.equal('example.json'))
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
        .selectFile('./cypress/fixtures/example.json', {action: "drag-drop"}).should(($el)=>
        expect($el[0].files[0].name).to.equal('example.json'))
    });


    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as("file")
        cy.get('#file-upload').should('not.have.value')
        .selectFile('@file').should(($el)=>
        expect($el[0].files[0].name).to.equal('example.json'))
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a').should(($el) => expect($el[0].attributes[1].value).to.equal('_blank'))
    });// tbm pode ser .should('have.attr', 'target', '_blank')

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a').invoke('removeAttr', 'target').click()
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    });

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
        cy.get('.success').should('not.be.visible')
        .invoke('show').should('be.visible').and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide').should('not.be.visible')
        cy.get('.error').should('not.be.visible')
        .invoke('show').should('be.visible').and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide').should('not.be.visible')
    });

    it('preenche a area de texto usando o comando invoke', () => {
        const conteudo = Cypress._.repeat("texto a ser repetido \n", 5)
        cy.get('#open-text-area').invoke('val',conteudo).should('have.value', conteudo)
    });
    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').should((response)=>{
        const {status, statusText, body} = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).contains('CAC TAT')
    })
    });
});


describe('Página da política de privacidade', () => {
    it('testa a página da política de privacidade de forma independente', () => {
        cy.visit('./src/privacy.html')
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    });
});