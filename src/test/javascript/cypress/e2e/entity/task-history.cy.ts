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

describe('TaskHistory e2e test', () => {
  const taskHistoryPageUrl = '/task-history';
  const taskHistoryPageUrlPattern = new RegExp('/task-history(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const taskHistorySample = {};

  let taskHistory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/task-histories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/task-histories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/task-histories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (taskHistory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/task-histories/${taskHistory.id}`,
      }).then(() => {
        taskHistory = undefined;
      });
    }
  });

  it('TaskHistories menu should load TaskHistories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('task-history');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TaskHistory').should('exist');
    cy.url().should('match', taskHistoryPageUrlPattern);
  });

  describe('TaskHistory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(taskHistoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TaskHistory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/task-history/new$'));
        cy.getEntityCreateUpdateHeading('TaskHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskHistoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/task-histories',
          body: taskHistorySample,
        }).then(({ body }) => {
          taskHistory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/task-histories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/task-histories?page=0&size=20>; rel="last",<http://localhost/api/task-histories?page=0&size=20>; rel="first"',
              },
              body: [taskHistory],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(taskHistoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TaskHistory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('taskHistory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskHistoryPageUrlPattern);
      });

      it('edit button click should load edit TaskHistory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TaskHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskHistoryPageUrlPattern);
      });

      it('edit button click should load edit TaskHistory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TaskHistory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskHistoryPageUrlPattern);
      });

      it('last delete button click should delete instance of TaskHistory', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('taskHistory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskHistoryPageUrlPattern);

        taskHistory = undefined;
      });
    });
  });

  describe('new TaskHistory page', () => {
    beforeEach(() => {
      cy.visit(`${taskHistoryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TaskHistory');
    });

    it('should create an instance of TaskHistory', () => {
      cy.get(`[data-cy="branch"]`).type('minus island');
      cy.get(`[data-cy="branch"]`).should('have.value', 'minus island');

      cy.get(`[data-cy="startDate"]`).type('huzzah why gang');
      cy.get(`[data-cy="startDate"]`).should('have.value', 'huzzah why gang');

      cy.get(`[data-cy="endDate"]`).type('modulo phooey catalyze');
      cy.get(`[data-cy="endDate"]`).should('have.value', 'modulo phooey catalyze');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        taskHistory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', taskHistoryPageUrlPattern);
    });
  });
});
