import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _lastIng = 3;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerIngredientOptions();
  }

  showWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }
  hideWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.showWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.hideWindow.bind(this));
    this._overlay.addEventListener('click', this.hideWindow.bind(this));
  }

  addHandlerUpload(handler) {
    //  Add event listener to remove invalid class
    this._parentElement.addEventListener('click', e => {
      const ingName = e.target.name;
      if (!ingName) return;
      if (ingName.includes('ingredient')) {
        this._removeInvalid();
      }
    });
    // Add event listener for submitting
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      this._removeInvalid();
      const dataArr = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _addHandlerIngredientOptions() {
    const options = this._parentElement.querySelector('.ingredient__options');
    options.addEventListener('click', e => {
      e.preventDefault();

      // remove error class and message if there is any
      this._removeInvalid();

      // get last ingredient html element
      const lastIngField = this._parentElement.querySelector(
        `input[name="ingredient-${this._lastIng}"]`
      );

      // check if add ingredient button was clicked on
      if (e.target.className.includes('add__ingredient')) {
        // Generate new HTML input field and insert it after the last ing field
        const newIngField = this._generateMarkupIngredient();
        lastIngField.insertAdjacentHTML('afterend', newIngField);

        //Increase the number of last ingredient
        this._lastIng++;
        console.log(this._lastIng);
      }
      // check if delete ingredient button was clicked on
      if (e.target.className.includes('delete__ingredient')) {
        // Make sure you won't delete every ingredient
        if (this._lastIng < 2) return;

        // Delete label and input field
        document.getElementById(`ingredient-${this._lastIng}`).remove();
        lastIngField.remove();

        //Decrease the number of last ingredient
        this._lastIng--;
        console.log(this._lastIng);
      }
    });
  }

  _generateMarkup() {}

  _generateMarkupIngredient() {
    return `<label id="ingredient-${this._lastIng + 1}">Ingredient ${
      this._lastIng + 1
    }</label>
    <input
      type="text"
      name="ingredient-${this._lastIng + 1}"
      placeholder="Format: 'Quantity,Unit,Description'"
    />`;
  }

  showError(wrongIng) {
    wrongIng.forEach(ing => {
      this._showErrorMessage(ing);
    });
  }
  _showErrorMessage(ing) {
    // get right input field and add invalid class and error message
    const ingredient = this._parentElement.querySelector(
      `input[name="ingredient-${ing.id}"]`
    );
    ingredient.classList.add('invalid');
    ingredient.insertAdjacentHTML(
      'afterend',
      `<div class="invalid__message"></div>
      <div class="invalid__message">${ing.message}</div>`
    );
  }

  _removeInvalid() {
    // remove invalid class from each input and remove every error message
    this._parentElement
      .querySelectorAll('input')
      .forEach(input => input.classList.remove('invalid'));
    this._parentElement.querySelectorAll('.invalid__message').forEach(inv => {
      inv.remove();
    });
  }
}

export default new AddRecipeView();

//   _errorMesage = `We couldn't find that page!`;
//   _message = ``;
