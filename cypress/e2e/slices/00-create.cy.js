import { SLICE_MOCK_FILE } from "../../consts";
import { sliceRenameModal } from "../../pages/RenameModal";
import { simulatorPage } from "../../pages/simulator/simulatorPage";
import { createSliceModal } from "../../pages/slices/createSliceModal";
import { sliceBuilder } from "../../pages/slices/sliceBuilder";
import { slicesList } from "../../pages/slices/slicesList";

const sliceName = "TestSlice";
const editedSliceName = "EditedSliceName";
const sliceId = "test_slice"; // generated automatically from the slice name
const lib = ".--slices";

describe("Create Slices", () => {
  beforeEach(() => {
    cy.setSliceMachineUserContext({});
    cy.clearProject();
  });

  it("A user can create and rename a slice", () => {
    cy.createSlice(lib, sliceId, sliceName);

    sliceBuilder.addNewWidgetField("Title", "Key Text");
    sliceBuilder.addNewWidgetField("Description", "Rich Text");

    cy.contains("Save").click();

    // remove widget
    cy.get('[data-cy="slice-menu-button"]').first().click();
    cy.contains("Delete field").click();
    cy.get('[data-cy="builder-save-button"]').should("not.be.disabled");

    // add a variation

    cy.get("button").contains("Default").click();
    cy.contains("+ Add new variation").click();

    cy.getInputByLabel("Variation name*").type("foo");
    cy.getInputByLabel("Variation ID*").clear();
    cy.getInputByLabel("Variation ID*").type("bar");

    cy.get("#variation-add").submit();

    cy.contains("button", "Simulate").should("have.attr", "disabled");
    cy.contains("button", "Simulate").realHover();
    cy.get("#simulator-button-tooltip").should("be.visible");
    cy.get("#simulator-button-tooltip").should(
      "contain",
      "Save your work in order to simulate"
    );
    cy.contains("button", "Update screenshot").should("have.attr", "disabled");
    cy.contains("button", "Update screenshot").realHover();
    cy.get("#update-screenshot-button-tooltip").should("be.visible");
    cy.get("#update-screenshot-button-tooltip").should(
      "contain",
      "Save your work in order to update the screenshot"
    );

    cy.location("pathname", { timeout: 20000 }).should(
      "eq",
      `/${lib}/${sliceName}/bar`
    );
    cy.get("button").contains("foo").click();
    cy.contains("Default").click();
    cy.location("pathname", { timeout: 20000 }).should(
      "eq",
      `/${lib}/${sliceName}/default`
    );

    cy.contains("Save").click();

    cy.contains("button", "Simulate").should("not.have.attr", "disabled");
    cy.contains("button", "Update screenshot").should(
      "not.have.attr",
      "disabled"
    );

    // simulator

    simulatorPage.setup();

    sliceBuilder.openSimulator();

    cy.getInputByLabel("Description").first().clear();
    cy.getInputByLabel("Description").first().type("👋");

    cy.get("[data-cy=save-mock]").click();

    cy.wait(1000);

    cy.get("button").contains("Default").click();
    cy.contains("foo").click();

    cy.wait(1000);

    cy.getInputByLabel("Description").first().clear();
    cy.getInputByLabel("Description").first().type("🎉");

    cy.get("[data-cy=save-mock]").click();

    cy.wait(1000);

    cy.get("button").contains("foo").click();
    cy.contains("Default").click();

    cy.readFile(SLICE_MOCK_FILE(sliceName), "utf-8")
      .its(0)
      .its("primary.description.value")
      .its(0)
      .its("content.text")
      .should("equal", "👋");
    cy.readFile(SLICE_MOCK_FILE(sliceName), "utf-8")
      .its(1)
      .its("primary.description.value")
      .its(0)
      .its("content.text")
      .should("equal", "🎉");

    cy.renameSlice(sliceName, editedSliceName);
  });

  it("allows drag n drop to the top position", () => {
    // inspired by https://github.com/atlassian/react-beautiful-dnd/blob/master/cypress/integration/reorder.spec.js
    // could not get it to work with mouse events

    // TODO: use faster fixtures
    cy.createSlice(lib, sliceId, sliceName);

    sliceBuilder.addNewWidgetField("Title", "Key Text");
    sliceBuilder.addNewWidgetField("Description", "Rich Text");

    cy.get('ul[data-cy="slice-non-repeatable-zone"] > li')
      .eq(1)
      .contains("Description");

    cy.get("[data-rbd-draggable-id='list-item-description'] button")
      .first()
      .focus()
      .trigger("keydown", { keyCode: 32 });
    cy.get("[data-rbd-draggable-id='list-item-description'] button")
      .first()
      .trigger("keydown", { keyCode: 38, force: true })
      .wait(1 * 1000)
      .trigger("keydown", { keyCode: 32, force: true });

    cy.get('ul[data-cy="slice-non-repeatable-zone"] > li')
      .eq(0)
      .contains("Description");
  });

  // See: #599
  it("A user cannot create a slice with a name starting with a number", () => {
    slicesList.goTo();
    slicesList.emptyStateButton.click();

    createSliceModal.nameInput.type("42Test");
    createSliceModal.submitButton.should("be.disabled");
  });

  // See: #791
  it("A user cannot rename a slice with a name starting with a number", () => {
    const sliceName = "SliceName";

    cy.createSlice(lib, sliceId, sliceName);
    slicesList.goTo();

    slicesList.getOptionDopDownButton(sliceName).click();
    slicesList.renameButton.click();

    sliceRenameModal.input.clear().type("42Test");
    sliceRenameModal.submitButton.should("be.disabled");
  });
});
