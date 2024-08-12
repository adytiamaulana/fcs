import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('PersonalInfo e2e test', () => {
  const personalInfoPageUrl = '/personal-info';
  const personalInfoPageUrlPattern = new RegExp('/personal-info(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const personalInfoSample = {};

  let personalInfo;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/personal-infos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/personal-infos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/personal-infos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (personalInfo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/personal-infos/${personalInfo.id}`,
      }).then(() => {
        personalInfo = undefined;
      });
    }
  });

  it('PersonalInfos menu should load PersonalInfos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('personal-info');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PersonalInfo').should('exist');
    cy.url().should('match', personalInfoPageUrlPattern);
  });

  describe('PersonalInfo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(personalInfoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PersonalInfo page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/personal-info/new$'));
        cy.getEntityCreateUpdateHeading('PersonalInfo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', personalInfoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/personal-infos',
          body: personalInfoSample,
        }).then(({ body }) => {
          personalInfo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/personal-infos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [personalInfo],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(personalInfoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PersonalInfo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('personalInfo');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', personalInfoPageUrlPattern);
      });

      it('edit button click should load edit PersonalInfo page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PersonalInfo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', personalInfoPageUrlPattern);
      });

      it('edit button click should load edit PersonalInfo page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PersonalInfo');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', personalInfoPageUrlPattern);
      });

      it('last delete button click should delete instance of PersonalInfo', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('personalInfo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', personalInfoPageUrlPattern);

        personalInfo = undefined;
      });
    });
  });

  describe('new PersonalInfo page', () => {
    beforeEach(() => {
      cy.visit(`${personalInfoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PersonalInfo');
    });

    it('should create an instance of PersonalInfo', () => {
      cy.get(`[data-cy="name"]`).type('among wait common');
      cy.get(`[data-cy="name"]`).should('have.value', 'among wait common');

      cy.get(`[data-cy="gender"]`).type('playfully palpitate');
      cy.get(`[data-cy="gender"]`).should('have.value', 'playfully palpitate');

      cy.get(`[data-cy="birthDate"]`).type('of notable');
      cy.get(`[data-cy="birthDate"]`).should('have.value', 'of notable');

      cy.get(`[data-cy="telephone"]`).type('1-203-838-0233 x50510');
      cy.get(`[data-cy="telephone"]`).should('have.value', '1-203-838-0233 x50510');

      cy.get(`[data-cy="createdBy"]`).type('mysterious');
      cy.get(`[data-cy="createdBy"]`).should('have.value', 'mysterious');

      cy.get(`[data-cy="createdAt"]`).type('2024-08-11T15:26');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-08-11T15:26');

      cy.get(`[data-cy="updatedBy"]`).type('worn');
      cy.get(`[data-cy="updatedBy"]`).should('have.value', 'worn');

      cy.get(`[data-cy="updatedAt"]`).type('2024-08-12T07:37');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-08-12T07:37');

      cy.get(`[data-cy="deletedBy"]`).type('near');
      cy.get(`[data-cy="deletedBy"]`).should('have.value', 'near');

      cy.get(`[data-cy="deletedAt"]`).type('2024-08-12T01:28');
      cy.get(`[data-cy="deletedAt"]`).blur();
      cy.get(`[data-cy="deletedAt"]`).should('have.value', '2024-08-12T01:28');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        personalInfo = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', personalInfoPageUrlPattern);
    });
  });
});
