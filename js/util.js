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

  window.util = {
    fragment: document.createDocumentFragment(),
    getRandomElement: getRandomElement,
    getRandomArrayLength: getRandomArrayLength,
    getRandomNumber: getRandomNumber,
    getRandomNumberFromRange: getRandomNumberFromRange
  };
})();
