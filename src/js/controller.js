import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';

///////////////////////////////////////

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0 ) update Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2)Loading recipe
    await model.loadRecipe(id);

    //3) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //  2) load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) render page navigation
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const contolServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);
  // Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  //  Render new
  resultsView.render(model.getSearchResultsPage(goToPage));

  //  Render new Pagination
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // // Show loading spinner
    // addRecipeView.renderSpinner();

    //  Upload recipe
    const wrongIng = await model.uploadRecipe(newRecipe);

    // Check if there were any invalid ingredients
    if (wrongIng !== null) addRecipeView.showError(wrongIng);
    if (wrongIng === null) {
      //  Render Recipe
      recipeView.render(model.state.recipe);

      //Success Message
      addRecipeView.renderMessage();

      // Render bookmark view
      bookmarksView.render(model.state.bookmarks);

      // Change ID in URL
      window.history.pushState(null, '', `#${model.state.recipe.id}`);

      //Close form window
      setTimeout(function () {
        addRecipeView.hideWindow();
      }, MODAL_CLOSE_SEC * 1000);
    }
  } catch (err) {
    console.error('!', err, '!');
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(contolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
