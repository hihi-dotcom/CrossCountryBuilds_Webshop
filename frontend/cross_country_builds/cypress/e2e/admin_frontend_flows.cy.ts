describe("Admin oldali frontend folyamatok letesztelése", () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it("Az admin navbar linkjeinek végig kattingatása", () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type("haha");
        cy.get('input[name="password"]').type('Tiktok123');
        cy.contains('button', 'Bejelentkezés').click();
        cy.url().should('include', `/admin`);

        cy.contains("nav a", "Megrendelések").click();
        cy.url().should('include', `/admin/orders`);

        cy.contains("nav a", "Szerviz").click();
        cy.url().should('include', `/admin/dates`);

        cy.contains("nav a", "Termékek").click();
        cy.url().should('include', `/admin/products`);

        cy.contains("nav a", "Felhasználók").click();
        cy.url().should('include', `/admin`);
    });

    it("Felhasználó keresése", () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type("haha");
        cy.get('input[name="password"]').type('Tiktok123');
        cy.contains('button', 'Bejelentkezés').click();
        cy.url().should('include', `/admin`);

        cy.get('input[name="productname"]').type("adamczirjak");
        cy.contains("adamczirjak").should('be.visible');
    });
    it("Megrendelés lezárása az admin felületen", () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type("haha");
        cy.get('input[name="password"]').type('Tiktok123');
        cy.contains('button', 'Bejelentkezés').click();
        cy.url().should('include', `/admin`);

        cy.contains("nav a", "Megrendelések").click();
        cy.url().should('include', `/admin/orders`);

        cy.get('select[data-testid="orderStatus"]:not([disabled])').first().select("kész");
    });
    it("Szabad szervizidőpont hozzáadásának tesztelése", () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type("haha");
        cy.get('input[name="password"]').type('Tiktok123');
        cy.contains('button', 'Bejelentkezés').click();
        cy.url().should('include', `/admin`);

        cy.contains("nav a", "Szerviz").click();
        cy.url().should('include', `/admin/dates`);
        cy.get('input[name="appointmentDate"]').type('2026-03-25T14:30');
        cy.contains('button', "Hozzáadás").click();
        cy.contains("Időpont létrehozva!").should("be.visible");
    });

    it("Szerviz lezárásának tesztelése", () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type("haha");
        cy.get('input[name="password"]').type('Tiktok123');
        cy.contains('button', 'Bejelentkezés').click();
        cy.url().should('include', `/admin`);
        cy.contains("nav a", "Szerviz").click();
        cy.url().should('include', `/admin/dates`);

        cy.contains('a', 'Kész!').first().click();
        cy.get('input[name="bringback_date"]').type('2026-03-30T14:30');
        cy.contains("button", "Mentés").click();
        cy.url().should('include', `/admin/dates`);
    });

    it("Termék készleten lévő mennyiségének változtatásának tesztje", () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type("haha");
        cy.get('input[name="password"]').type('Tiktok123');
        cy.contains('button', 'Bejelentkezés').click();
        cy.url().should('include', `/admin`);

        cy.contains("nav a", "Termékek").click();
        cy.url().should('include', `/admin/products`);
        cy.contains('a', 'Szerkesztés').first().click();
        cy.wait(1000);
        cy.get('input[name="stock_number"]').should("not.be.disabled").clear().type("30");
        cy.contains("button", "Mentés").click();
        cy.url().should('include', `/admin/products`);
        cy.get('span[data-testid="stock_number"]').first().should("have.text", "30");
    })

});