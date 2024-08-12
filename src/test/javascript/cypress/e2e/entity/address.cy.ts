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
      cy.get(`[data-cy="address"]`).type('boo yowza irritably');
      cy.get(`[data-cy="address"]`).should('have.value', 'boo yowza irritably');

      cy.get(`[data-cy="country"]`).type('Bulgaria');
      cy.get(`[data-cy="country"]`).should('have.value', 'Bulgaria');

      cy.get(`[data-cy="province"]`).type('illumine');
      cy.get(`[data-cy="province"]`).should('have.value', 'illumine');

      cy.get(`[data-cy="city"]`).type('Port Edmondside');
      cy.get(`[data-cy="city"]`).should('have.value', 'Port Edmondside');

      cy.get(`[data-cy="district"]`).type('grumpy hungrily');
      cy.get(`[data-cy="district"]`).should('have.value', 'grumpy hungrily');

      cy.get(`[data-cy="village"]`).type('train');
      cy.get(`[data-cy="village"]`).should('have.value', 'train');

      cy.get(`[data-cy="postalCode"]`).type('21053');
      cy.get(`[data-cy="postalCode"]`).should('have.value', '21053');

      cy.get(`[data-cy="telephone"]`).type('1-543-383-4778 x95113');
      cy.get(`[data-cy="telephone"]`).should('have.value', '1-543-383-4778 x95113');

      cy.get(`[data-cy="createdBy"]`).type('cooperative irradiate');
      cy.get(`[data-cy="createdBy"]`).should('have.value', 'cooperative irradiate');

      cy.get(`[data-cy="createdAt"]`).type('although unnaturally');
      cy.get(`[data-cy="createdAt"]`).should('have.value', 'although unnaturally');

      cy.get(`[data-cy="updatedBy"]`).type('however owlishly likely');
      cy.get(`[data-cy="updatedBy"]`).should('have.value', 'however owlishly likely');

      cy.get(`[data-cy="updatedAt"]`).type('true composed');
      cy.get(`[data-cy="updatedAt"]`).should('have.value', 'true composed');

      cy.get(`[data-cy="deletedBy"]`).type('cheerfully however');
      cy.get(`[data-cy="deletedBy"]`).should('have.value', 'cheerfully however');

      cy.get(`[data-cy="deletedAt"]`).type('hungrily if eicosanoid');
      cy.get(`[data-cy="deletedAt"]`).should('have.value', 'hungrily if eicosanoid');

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
