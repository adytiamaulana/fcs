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

describe('ApplicationStatus e2e test', () => {
  const applicationStatusPageUrl = '/application-status';
  const applicationStatusPageUrlPattern = new RegExp('/application-status(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const applicationStatusSample = {};

  let applicationStatus;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/application-statuses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/application-statuses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/application-statuses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (applicationStatus) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/application-statuses/${applicationStatus.id}`,
      }).then(() => {
        applicationStatus = undefined;
      });
    }
  });

  it('ApplicationStatuses menu should load ApplicationStatuses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('application-status');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ApplicationStatus').should('exist');
    cy.url().should('match', applicationStatusPageUrlPattern);
  });

  describe('ApplicationStatus page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(applicationStatusPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ApplicationStatus page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/application-status/new$'));
        cy.getEntityCreateUpdateHeading('ApplicationStatus');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationStatusPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/application-statuses',
          body: applicationStatusSample,
        }).then(({ body }) => {
          applicationStatus = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/application-statuses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/application-statuses?page=0&size=20>; rel="last",<http://localhost/api/application-statuses?page=0&size=20>; rel="first"',
              },
              body: [applicationStatus],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(applicationStatusPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ApplicationStatus page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('applicationStatus');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationStatusPageUrlPattern);
      });

      it('edit button click should load edit ApplicationStatus page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ApplicationStatus');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationStatusPageUrlPattern);
      });

      it('edit button click should load edit ApplicationStatus page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ApplicationStatus');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationStatusPageUrlPattern);
      });

      it('last delete button click should delete instance of ApplicationStatus', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('applicationStatus').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationStatusPageUrlPattern);

        applicationStatus = undefined;
      });
    });
  });

  describe('new ApplicationStatus page', () => {
    beforeEach(() => {
      cy.visit(`${applicationStatusPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ApplicationStatus');
    });

    it('should create an instance of ApplicationStatus', () => {
      cy.get(`[data-cy="code"]`).type('longingly');
      cy.get(`[data-cy="code"]`).should('have.value', 'longingly');

      cy.get(`[data-cy="status"]`).type('along frenetically');
      cy.get(`[data-cy="status"]`).should('have.value', 'along frenetically');

      cy.get(`[data-cy="createdBy"]`).type('infection bitterly via');
      cy.get(`[data-cy="createdBy"]`).should('have.value', 'infection bitterly via');

      cy.get(`[data-cy="updatedBy"]`).type('at digitalize');
      cy.get(`[data-cy="updatedBy"]`).should('have.value', 'at digitalize');

      cy.get(`[data-cy="deletedBy"]`).type('comment');
      cy.get(`[data-cy="deletedBy"]`).should('have.value', 'comment');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        applicationStatus = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', applicationStatusPageUrlPattern);
    });
  });
});
