import previewView from './previewView.js';
import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMesage = `We couldn't find that recipe. Please try another one!`;
  _message = ``;

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
