import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}

/**
 * Search Controller
 */

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput()

    if (query) {
        // 2) New Search object and add to state
        state.search = new Search(query)

        // 3) Prepare UI for result
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)
        
        try {
        // 4) Search for recipes
        await state.search.getResults()

        // 5) Rnder results on UI
        clearLoader()
        searchView.renderResults(state.search.result)
        } catch (error) {
            alert('Something went wrong:)')
            clearLoader()
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '')
    console.log(id)
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)


        // Highlight selected search item
        if (state.search) {
          searchView.highlightSelected(id)
        }
        // Create new recipe object
        state.recipe = new Recipe(id)
        
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()
            // Caculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()
            // Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe)

        } catch(err) {
            alert('Error processing recipe')
        }
        
    }
}

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

 /**
  * List Controller
  */

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List()

    // Add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item)
    })
}

/**
  * Like Controller
  */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img)
        // Toggle the like button

        // Add like to UI list

        console.log(state.likes)
    } else {
        // Remove like from state
        state.likes.deleteLike(currentID)
        // Toggle the like button

        // Remove like from UI list

    }
}

/**
 * Handle delete and update list item events
 */

 elements.shopping.addEventListener('click', e => {
     const id = e.target.closest('.shopping__item').dataset.itemid
     // handle delete event
     if (e.target.matches('.shopping__delete, .shopping__delete *')) {
         // delete from state and UI
         state.list.deleteItem(id)
         listView.deleteItem(id)
        // Handle the count update
     } else if (e.target.matches('.shopping__count-value')) {
         // Add ingredients to the shopping list
         const val = parseFloat(e.target.value)
         state.list.updateCount(id, val)
     }
 })

 // Handling recipe button clicks
 elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
         // Decrease button is clicked
         if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
         }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Decrease button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredient to shopping list
        controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // like controller
        controlLike()
    }
 })

 window.l = new List()

