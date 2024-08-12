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

describe('CardType e2e test', () => {
  const cardTypePageUrl = '/card-type';
  const cardTypePageUrlPattern = new RegExp('/card-type(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const cardTypeSample = { cardCode: 18350, createdBy: 'appropriation probability', createdAt: '2024-08-11T20:50:30.490Z' };

  let cardType;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/card-types+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/card-types').as('postEntityRequest');
    cy.intercept('DELETE', '/api/card-types/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (cardType) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/card-types/${cardType.id}`,
      }).then(() => {
        cardType = undefined;
      });
    }
  });

  it('CardTypes menu should load CardTypes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('card-type');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CardType').should('exist');
    cy.url().should('match', cardTypePageUrlPattern);
  });

  describe('CardType page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(cardTypePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CardType page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/card-type/new$'));
        cy.getEntityCreateUpdateHeading('CardType');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cardTypePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/card-types',
          body: cardTypeSample,
        }).then(({ body }) => {
          cardType = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/card-types+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/card-types?page=0&size=20>; rel="last",<http://localhost/api/card-types?page=0&size=20>; rel="first"',
              },
              body: [cardType],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(cardTypePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CardType page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('cardType');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cardTypePageUrlPattern);
      });

      it('edit button click should load edit CardType page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CardType');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cardTypePageUrlPattern);
      });

      it('edit button click should load edit CardType page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CardType');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cardTypePageUrlPattern);
      });

      it('last delete button click should delete instance of CardType', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('cardType').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cardTypePageUrlPattern);

        cardType = undefined;
      });
    });
  });

  describe('new CardType page', () => {
    beforeEach(() => {
      cy.visit(`${cardTypePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CardType');
    });

    it('should create an instance of CardType', () => {
      cy.get(`[data-cy="cardCode"]`).type('29151');
      cy.get(`[data-cy="cardCode"]`).should('have.value', '29151');

      cy.get(`[data-cy="cardName"]`).type('for');
      cy.get(`[data-cy="cardName"]`).should('have.value', 'for');

      cy.get(`[data-cy="createdBy"]`).type('ew exclude meaningfully');
      cy.get(`[data-cy="createdBy"]`).should('have.value', 'ew exclude meaningfully');

      cy.get(`[data-cy="createdAt"]`).type('2024-08-12T04:15');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-08-12T04:15');

      cy.get(`[data-cy="updatedBy"]`).type('philanthropy hunting speedily');
      cy.get(`[data-cy="updatedBy"]`).should('have.value', 'philanthropy hunting speedily');

      cy.get(`[data-cy="updatedAt"]`).type('2024-08-11T21:53');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-08-11T21:53');

      cy.get(`[data-cy="deletedBy"]`).type('eleventh');
      cy.get(`[data-cy="deletedBy"]`).should('have.value', 'eleventh');

      cy.get(`[data-cy="deletedAt"]`).type('2024-08-12T06:09');
      cy.get(`[data-cy="deletedAt"]`).blur();
      cy.get(`[data-cy="deletedAt"]`).should('have.value', '2024-08-12T06:09');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        cardType = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', cardTypePageUrlPattern);
    });
  });
});
