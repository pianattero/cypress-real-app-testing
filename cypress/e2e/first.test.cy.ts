/// <reference types="cypress" />

describe("Test with Backend", () => {
	beforeEach("login to app", () => {
		cy.login();
	});

	it("verify correct request and response of article creation", () => {
		// para interceptar llamadas a back - SIEMPRE por encima de la acción
		cy.intercept(
			"POST",
			"https://conduit-api.bondaracademy.com/api/articles/"
		).as("postArticles");

		cy.contains("New Article").click();
		cy.get('[formcontrolname="title"]').type("Article Title");
		cy.get('[formcontrolname="description"]').type("Article Description");
		cy.get('[formcontrolname="body"]').type("Article Body");
		cy.contains("Publish Article").click();

		cy.wait("@postArticles").then((xhr: any) => {
			// espera a que la llamada se complete antes de acceder a ella
			console.log(xhr);
			expect(xhr.response.statusCode).to.equal(201);
			expect(xhr.request.body.article.body).to.equal("Article Body");
			expect(xhr.response.body.article.description).to.equal(
				"Article Description"
			);
		});
	});
});
