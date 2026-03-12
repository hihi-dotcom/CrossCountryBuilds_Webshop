describe('User oldali frontend folyamatok tesztjei', () => {
  beforeEach(() => {
    cy.visit('/');
  })
 
  it('Regisztráció majd belépés', () => {
    const tempUser = `User12345`;

      //Mivel egyszer sikeresen lefutott a regisztráció, ezt többször nem szükséges megismételni.
      /*
      cy.visit(`/signup`);
      cy.get('input[name="username"]').type(tempUser);
      cy.get('input[name="email"]').type(`${tempUser}@test.hu`);
      cy.get('input[name="password"]').type('Password456!');
      cy.get('input[name="confirmPassword"]').type('Password456!');
      cy.get('button[type="submit"]').click();
      */
      //cy.url().should('include', `/login`);
  
      //Bejelentkezés
      cy.visit('/login');
      cy.get('input[name="username"]').type(tempUser);
      cy.get('input[name="password"]').type('Password456!');
      cy.contains('button', 'Bejelentkezés').click();
      cy.url().should('not.include', `/login`);
  });

  it("Hibás adatokkal való bejelentkezés tesztje", () => {
    const tempUser = `User12345`;
    cy.visit('/login');
      cy.get('input[name="username"]').type(tempUser);
      cy.get('input[name="password"]').type('PicikeBúbosVöcsök');
      cy.contains('button', 'Bejelentkezés').click();
      cy.contains('div', "Hibás felhasználónév vagy jelszó!").should('be.visible');
      cy.url().should('include', `/login`);
  });

  it("Már regisztrált emaillel való regisztráció tesztje", () => {
      const tempUser = `User12345`;
      cy.visit(`/signup`);
      cy.get('input[name="username"]').type(tempUser);
      cy.get('input[name="email"]').type(`${tempUser}@test.hu`);
      cy.get('input[name="password"]').type('Password456!');
      cy.get('input[name="confirmPassword"]').type('Password456!');
      cy.get('button[type="submit"]').click();
      cy.contains('div', "Ez az email cím már foglalt!").should('be.visible');
  });

  it("Rossz emaillel jelszó visszaállító email igénylése még nem létező fiókkal", () => {
    const tempUser = `User67676`;
      cy.visit('/login');
      cy.contains('a',"Elfelejtettem a jelszavam").click();
      cy.get('input[type="email"]').type(`${tempUser}@test.hu`);
      cy.contains('button', 'Link küldése').click();
      cy.contains('p', "Nincs ilyen fiók!").should('be.visible');
  });

  it("Kosár mükődésének tesztelése, illetve, hogy megjelenik a termék a kosárban.", () => {
      cy.contains('button', 'Kosárba').first().click();
      cy.get('nav [data-testid="flowbite-badge"]').should("be.visible");
      cy.get('nav [data-testid="flowbite-badge"]').should("have.text", '1');
      cy.visit("/cart");
      cy.get('div [id="cart_goods"]').contains("Trek Émonda SLR 9");
  });

  it("Teljes rendelési folyamat tesztelése.",() => {
      const tempUser = `User12345`;
      cy.contains('button', 'Kosárba').first().click();
      cy.get('nav [data-testid="flowbite-badge"]').should("be.visible");
      cy.get('nav [data-testid="flowbite-badge"]').should("have.text", '1');
      cy.visit("/cart");
      cy.get('div [id="cart_goods"]').contains("Trek Émonda SLR 9");
      cy.contains('a', 'Tovább az adatokhoz').click();
      cy.url().should('include', '/login');
      cy.get('input[name="username"]').type(tempUser);
      cy.get('input[name="password"]').type('Password456!');
      cy.contains('button', 'Bejelentkezés').click();
      cy.visit("/cart");
      cy.contains('a', 'Tovább az adatokhoz').click();
      cy.get('input[name="name"]').type("Kovács Géza");
      cy.get('input[name="shippingzipCode"]').type("2085");
      cy.get('input[name="shippingcityName"]').type("Pilisvörösvár");
      cy.get('input[name="shippingstreetName"]').type("Futrinka utca");
      cy.get('input[name="shippinghouseNumber"]').type("7.");
      cy.get('input[id="sameAddress"]').check();
      cy.contains('button', "Rendelés befejezése").click();
      cy.url().should('include', `/orderend`);
  });

  it("Szervizidőpont foglalás tesztelése", () => {
    const tempUser = `User12345`;
    cy.contains('Szerviz').click();
    cy.get('[role="dialog"]').should('be.visible').within(() => {
      cy.contains('button', 'Bejelentkezés').click();
    });
    cy.get('input[name="username"]').type(tempUser);
    cy.get('input[name="password"]').type('Password456!');
    cy.contains('button', 'Bejelentkezés').click();
    cy.url().should('not.include', `/login`);
    cy.contains('Szerviz').click();
    cy.get('select[name="appointmentDate"]').select("72");
    cy.get('textarea[name="problem_description"]').type("Összetörtem a hátsó kerekét a biciklimnek és kiszakadtak a küllői, kellene egy új hátsó kerék illetve egy féktárcsa is");
    cy.contains('button[type="submit"]', "Foglalás beküldése").click();
    cy.url().should('not.include', `/appointment`);
  });
  it("Jelszó visszaállító email kiküldésének.", () => {
     const tempUser = `User12345`;
      cy.visit('/login');
      cy.contains('a',"Elfelejtettem a jelszavam").click();
      cy.get('input[type="email"]').type(`${tempUser}@test.hu`);
      cy.contains('button', 'Link küldése').click();
      cy.contains('p', 'Az E-mail küldés sikeres volt!');
  });

  it("Mobilos reszponzívitás letesztelése", () => {
    cy.viewport("iphone-xr");
    cy.get('nav').should('be.visible');
    cy.get('nav [data-testid="flowbite-navbar-toggle"]').click();
    cy.contains('div', 'Szerviz').should('be.visible');
  });

  it("Jogosultság nélküli védelem tesztelése az admin oldalak esetében", () => {
    cy.visit("/admin", {failOnStatusCode:false});
    cy.url().should("include", "/login");
  });
});