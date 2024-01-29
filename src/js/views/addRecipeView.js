import View from './view.js';
import icons from 'url:../../img/icons.svg'; 

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully added.';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');


    constructor(){
        super();
        this._addHandlerShowWindow(); //calling on page load
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click',this.toggleWindow.bind(this));
        this._overlay.addEventListener('click',this.toggleWindow.bind(this)
        );
    }

    _addHandlerUpload(handler){
        this._parentElement.addEventListener('submit',function(e){
           e.preventDefault();
           const dataArr = [...new FormData(this)]; //this in event handler point to parent element which is _parentElement here
           const data = Object.fromEntries(dataArr);
           handler(data);
        });
    }

    _generateMarkup(){
      
    }
}

export default new AddRecipeView();

