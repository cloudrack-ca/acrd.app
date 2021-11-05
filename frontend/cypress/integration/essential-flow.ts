import { Chance } from 'chance';
const chance = new Chance();

describe('essential navigation flow', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  const email = chance.email();
  const username = chance.name();
  const password = chance.string({ length: 16 });

  before(() => cy.visit('http://localhost:4200'));

  it('register user, redirects to app', () => {
    cy.get('a[href*="/login"]').first().click();
    cy.contains('Register').click();
    cy.get('input[name=email]').type(email);
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.contains('Register').click();
    cy.wait(2000);

    cy.url().should('equal', 'http://localhost:4200/channels/@me');
  });

  it('update username, username appears different in sidebar', () => {
    cy.get('#userSettingsButton').click();
    const newUsername = chance.name();
    cy.get('input[name=username]')
      .type(newUsername)
      .trigger('keydown', { keyCode: KeyCode.Esc });

    cy.contains(newUsername);
  });

  it('logout user, redirects to home page', () => {
    cy.contains('Logout').click();
    cy.url().should('equal', 'http://localhost:4200/');
  });

  it('login user, redirects to home page', () => {
    cy.get('a[href*="/login"]').first().click();
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.contains('Login').click();
    cy.wait(2000);

    cy.url().should('equal', 'http://localhost:4200/channels/@me');
  });

  it('create guild, redirects to guild', () => {
    cy.get('#escButton').click();
    cy.get('#createGuildButton').click();
    cy.get('input[name=name]').type(chance.tv());
    cy.get('button').contains('Create').click();
    cy.wait(1000);

    cy.url().should('not.equal', 'http://localhost:4200/channels/@me');
  });

  it('update guild, guild name appears different in sidebar', () => {
    cy.get('#sidebarHeader').click();
    cy.contains('Guild settings').click();
    const newGuildName = chance.tv();
    cy.get('input[name=name]').type(newGuildName);
    cy.contains('Save').click();
    cy.wait(1000);
    cy.get('form').trigger('keydown', { keyCode: KeyCode.Esc });

    cy.contains(newGuildName).should('be.visible');
  });

  it('create message, messages appears in chat', () => {
    const content = chance.string({ length: 6 });
    cy.get('#messageBox')
      .type(content)
      .trigger('keydown', { keyCode: KeyCode.Enter });
    cy.wait(500);

    cy.contains(content).should('be.visible');
  });

  it('update message, message is updated in chat', () => {
    cy.get('.message').first().trigger('mouseenter');
    cy.get('.message [data-icon="pencil-alt"]').click();
    const newContent = chance.string({ length: 6 });
    cy.get('#messageBox').first().type(newContent);
    cy.contains('save').click();

    cy.contains(newContent).should('be.visible');
  });

  it('delete message, messages disappears from chat', () => {
    cy.get('.message')
      .first()
      .trigger('mouseenter');
    cy.get('.message [data-icon="times"]').click();
    cy.wait(500);
    cy.get('.message').should('not.exist');
  });

  it('delete user, redirects to home page', () => {
    cy.get('#userSettingsButton').click();
    cy.contains('Delete').click();
    cy.on('window:confirm', () => true);
    cy.wait(1000);
    cy.url().should('equal', 'http://localhost:4200/');
  });
});

enum KeyCode {
  Esc = 27,
  Enter = 13,
}