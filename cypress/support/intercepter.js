const DELAY = 200;

const intercepter = {
  general: {
    getUserInfo: () => {
      cy.intercept('GET', '/user/info', {
        fixture: 'general/footScan',
        delay: DELAY,
      }).as('getUserInfo');
    },
  },
};

export default intercepter;
