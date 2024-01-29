import 'core-js/stable'; //polifilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async await
import * as model from'./model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import {MODAL_CLOSE_SEC} from './config.js'
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';
// if(module.hot){  // Hot module replacement With HMR, when a developer makes changes to their code, the module that was updated is replaced in the running application, without requiring a full page refresh.
//   module.hot.accept();
// }

   
// https://forkify-api.herokuapp.com/v2 ---API documentation and all API 
// https://forkify-api.herokuapp.com/api/v2/recipes
///////////////////////////////////////

const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1); //url with hash #5edosueje7889skskksk slice will start reading from 5
  
    if(!id) return; //on load when we do not have any id

    recipeView.renderSpinner();
    // 0) Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id); // asyn function returns a promise
   

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  
  }catch(err){
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  
  try{
    resultView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    //3) Render results
    console.log(model.state.search.results);
    //resultView.render(model.state.search.results);
    
    resultView.render(model.getSearchResultsPage());

    // 4) Render initial pagination
    paginationView.render(model.state.search);
  }catch (err) {
    console.log(err);
  }
};

const controlPagination = function(goToPage){
// 1) Render new results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // update the recipe servings (in state)
model.updateServings(newServings);
//recipeView.recipe(model.state.recipe);
recipeView.update(model.state.recipe);

  // Update the recipe view
}

const controlAddBookmark = function(){
  //1) add or remove bookmark

  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }
  else if(model.state.recipe.bookmarked){
    model.deleteBookmark(model.state.recipe.id);
  }
 // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
 try{

  //render spinner
  recipeView.renderSpinner();
      //upload new recipe data
  await model.uploadRecipe(newRecipe);
 

  //render recipe
  recipeView.render(model.state.recipe);

  //display success message
  addRecipeView.renderMessage();

  //render boookmark view
  bookmarksView.render(model.state.bookmarks);

  //chnage ID in URL
  window.history.pushState(null, '',`#${model.state.recipe.id}`);
  

  //close form window
  setTimeout(function(){
    addRecipeView.toggleWindow();
  } , MODAL_CLOSE_SEC * 1000);
 } catch(err){
  console.log(err);
  addRecipeView.renderError(err.message);
 }


}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHANDLERRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();