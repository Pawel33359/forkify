import icons from 'url:../../img/icons.svg';
import View from './View.js';
import { MAX_RANGE_PAGES } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMesage = `We couldn't find that page!`;
  _message = ``;
  _curPage;
  _numPages;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const click =
        e.target.className === 'pagination__number--single'
          ? e.target
          : e.target.closest('.btn--inline');

      console.log(e.target);
      if (!click) return;

      const goToPage = +click.dataset.goto;
      handler(goToPage);
    });
  }
  // addHandlerNumber(handler){
  //   this._parentElement.querySelector('.')
  // }

  _generateMarkup() {
    this._curPage = this._data.page;
    this._numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1 there are other pages
    if (this._curPage === 1 && this._numPages > 1)
      return (
        this._generateMarkupNumberPages() +
        this._generateMarkupButton(this._curPage, 1)
      );

    // Last page
    if (this._curPage === this._numPages && this._curPage > 1)
      return (
        this._generateMarkupButton(this._curPage, -1) +
        this._generateMarkupNumberPages()
      );

    // Other page
    if (this._curPage < this._numPages)
      return (
        this._generateMarkupButton(this._curPage, -1) +
        this._generateMarkupNumberPages() +
        this._generateMarkupButton(this._curPage, 1)
      );

    // Page 1 no other pages
    return '';
  }
  _generateMarkupButton(curPage, pageDir) {
    let buttonPagination = `<button data-goto="${
      curPage + pageDir
    }" class="btn--inline pagination__btn--`;
    buttonPagination +=
      pageDir === 1
        ? `next">
    <span>Next</span>
    <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
    </svg>`
        : `prev">
    <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Prev</span>
    `;
    buttonPagination += `</button>`;
    return buttonPagination;
  }

  _generateMarkupNumberPages() {
    let pageNum = `<ul class="pagination__numbers">`;

    // variables to check if ... was alreeady made
    let prevDots = false;
    let nextDots = false;

    //Get variables to set what are the last pages to show counting from current page
    let maxPagePrev;
    let maxPageNext;

    // If current page is one of the few first
    if (this._curPage <= MAX_RANGE_PAGES) {
      maxPagePrev = 1;
      maxPageNext = maxPagePrev + MAX_RANGE_PAGES * 2;
    }
    // If current page is one of the few last
    if (this._curPage >= this._numPages - MAX_RANGE_PAGES) {
      maxPagePrev = this._numPages - MAX_RANGE_PAGES * 2;
      maxPageNext = this._numPages;
    }
    // If current page is somwhere in the middle
    if (
      this._curPage > MAX_RANGE_PAGES &&
      this._curPage < this._numPages - MAX_RANGE_PAGES
    ) {
      maxPagePrev = this._curPage - MAX_RANGE_PAGES;
      maxPageNext = this._curPage + MAX_RANGE_PAGES;
    }

    for (let i = 1; i <= this._numPages; i++) {
      // Show pagination numbers only if its within range or its first or last page
      if (
        (i <= maxPageNext && i >= maxPagePrev) ||
        i === 1 ||
        i === this._numPages
      )
        pageNum += `<li class="pagination__number--single${
          i === this._curPage ? ' page__active' : ''
        }" data-goto="${i}">${i}</li>`;
      else {
        // Show dots if its outside range and no prev dots were created
        if (i < maxPagePrev && prevDots === false) {
          pageNum += `<li class="pagination__number--dots">...</li>`;
          prevDots = true;
        }
        // Show dots if its outside range and no next dots were created
        if (i > maxPageNext && nextDots === false) {
          pageNum += `<li class="pagination__number--dots">...</li>`;
          nextDots = true;
        }
      }
    }
    pageNum += `</ul>`;
    return pageNum;
  }
}

export default new PaginationView();
