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

describe('Address e2e test', () => {
  const addressPageUrl = '/address';
  const addressPageUrlPattern = new RegExp('/address(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const addressSample = {};

  let address;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/addresses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/addresses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/addresses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (address) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/addresses/${address.id}`,
      }).then(() => {
        address = undefined;
      });
    }
  });

  it('Addresses menu should load Addresses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('address');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Address').should('exist');
    cy.url().should('match', addressPageUrlPattern);
  });

  describe('Address page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(addressPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Address page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/address/new$'));
        cy.getEntityCreateUpdateHeading('Address');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', addressPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/addresses',
          body: addressSample,
        }).then(({ body }) => {
          address = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/addresses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [address],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(addressPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Address page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('address');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', addressPageUrlPattern);
      });

      it('edit button click should load edit Address page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Address');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', addressPageUrlPattern);
      });

      it('edit button click should load edit Address page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Address');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', addressPageUrlPattern);
      });

      it('last delete button click should delete instance of Address', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('address').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', addressPageUrlPattern);

        address = undefined;
      });
    });
  });

  describe('new Address page', () => {
    beforeEach(() => {
      cy.visit(`${addressPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Address');
    });

    it('should create an instance of Address', () => {
      cy.get(`[data-cy="address"]`).type('zowie meanwhile');
      cy.get(`[data-cy="address"]`).should('have.value', 'zowie meanwhile');

      cy.get(`[data-cy="country"]`).type('Micronesia');
      cy.get(`[data-cy="country"]`).should('have.value', 'Micronesia');

      cy.get(`[data-cy="province"]`).type('when provided yippee');
      cy.get(`[data-cy="province"]`).should('have.value', 'when provided yippee');

      cy.get(`[data-cy="city"]`).type('North Dixie');
      cy.get(`[data-cy="city"]`).should('have.value', 'North Dixie');

      cy.get(`[data-cy="district"]`).type('er boo');
      cy.get(`[data-cy="district"]`).should('have.value', 'er boo');

      cy.get(`[data-cy="village"]`).type('by obnoxiously');
      cy.get(`[data-cy="village"]`).should('have.value', 'by obnoxiously');

      cy.get(`[data-cy="postalCode"]`).type('4501');
      cy.get(`[data-cy="postalCode"]`).should('have.value', '4501');

      cy.get(`[data-cy="telephone"]`).type('558-227-4082 x847');
      cy.get(`[data-cy="telephone"]`).should('have.value', '558-227-4082 x847');

      cy.get(`[data-cy="createdBy"]`).type('occurrence than');
      cy.get(`[data-cy="createdBy"]`).should('have.value', 'occurrence than');

      cy.get(`[data-cy="createdAt"]`).type('2024-08-12T05:07');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-08-12T05:07');

      cy.get(`[data-cy="updatedBy"]`).type('jolly');
      cy.get(`[data-cy="updatedBy"]`).should('have.value', 'jolly');

      cy.get(`[data-cy="updatedAt"]`).type('2024-08-12T04:47');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-08-12T04:47');

      cy.get(`[data-cy="deletedBy"]`).type('steer whose');
      cy.get(`[data-cy="deletedBy"]`).should('have.value', 'steer whose');

      cy.get(`[data-cy="deletedAt"]`).type('2024-08-12T04:56');
      cy.get(`[data-cy="deletedAt"]`).blur();
      cy.get(`[data-cy="deletedAt"]`).should('have.value', '2024-08-12T04:56');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        address = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', addressPageUrlPattern);
    });
  });
});
