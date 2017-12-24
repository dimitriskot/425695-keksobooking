'use strict';

(function () {
  // получение случайного элемента массива
  var getRandomElement = function (array) {
    var randomElement = array[Math.floor(Math.random() * array.length)];
    return randomElement;
  };

  // получение случайной длины массива
  var getRandomArrayLength = function (array) {
    var randomArrayLength = Math.ceil(Math.random() * array.length);
    return randomArrayLength;
  };

  // получение случайного числа
  var getRandomNumber = function (count) {
    var number = Math.ceil(Math.random() * count);
    return number;
  };

  // получение случайного числа из диапазона
  var getRandomNumberFromRange = function (min, max) {
    var number = Math.floor(Math.random() * (max - min) + min);
    return number;
  };

  var errorHandler = function (errorMessage) {
    var errorPopup = document.createElement('div');
    errorPopup.style = 'z-index: 100; top: 100px; margin: 0 auto; padding-top: 20px; padding-bottom: 20px; width: 400px; height: 200px; text-align: center; background-color: white; border: 2px solid black; border-radius: 5px; display: flex; flex-direction: column; justify-content: space-between';
    errorPopup.style.position = 'absolute';
    errorPopup.style.left = 0;
    errorPopup.style.right = 0;
    errorPopup.style.fontSize = '30px';

    errorPopup.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorPopup);
    var errorButton = document.createElement('button');
    errorButton.style = 'margin: 0 auto; width: 50px; height: 20px; text-align: center;';
    errorButton.textContent = 'OK';
    var closeError = function (event) {
      event.preventDefault();
      document.body.removeChild(errorPopup);
    };
    errorButton.addEventListener('click', closeError);
    errorPopup.appendChild(errorButton);
  };

  window.util = {
    getRandomElement: getRandomElement,
    getRandomArrayLength: getRandomArrayLength,
    getRandomNumber: getRandomNumber,
    getRandomNumberFromRange: getRandomNumberFromRange,
    errorHandler: errorHandler
  };
})();
