'use strict';

(function () {
  var timeIn = window.constants.noticeForm.querySelector('#timein');
  var timeOut = window.constants.noticeForm.querySelector('#timeout');
  var firstTimes = timeIn.children;
  var secondTimes = timeOut.children;
  var type = window.constants.noticeForm.querySelector('#type');
  var price = window.constants.noticeForm.querySelector('#price');
  var formTypes = type.children;
  var roomNumber = window.constants.noticeForm.querySelector('#room_number');
  var capacity = window.constants.noticeForm.querySelector('#capacity');
  var formAddress = window.constants.noticeForm.querySelector('#address');
  var MAIN_PIN_HALF_WIDTH = 31;
  var MAIN_PIN_HEIGHT = 82;

  var minPricesForType = [
    '1000',
    '0',
    '5000',
    '10000'
  ];

  var roomCapacity = {
    '1': ['для 1 гостя'],
    '2': ['для 1 гостя', 'для 2 гостей'],
    '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
    '100': ['не для гостей']
  };

  var syncElement = function (element, item) {
    element.value = item.value;
  };

  var syncMinPrice = function (element, item) {
    element.min = item;
    element.placeholder = element.min;
  };

  var timeInSync = function () {
    window.synchronizeFields(timeOut, firstTimes, secondTimes, syncElement);
  };

  timeInSync();

  var timeOutSync = function () {
    window.synchronizeFields(timeIn, secondTimes, firstTimes, syncElement);
  };

  var typeSync = function () {
    window.synchronizeFields(price, formTypes, minPricesForType, syncMinPrice);
  };

  typeSync();

  // очистка capacity
  var clearCapacity = function () {
    while (capacity.firstChild) {
      capacity.removeChild(capacity.firstChild);
    }
  };

  // генерация значения для capacity
  var renderCapacity = function (value) {
    for (var i = 0; i < roomCapacity[value].length; i++) {
      var capacityItem = document.createElement('option');
      capacityItem.textContent = roomCapacity[value][i];
      capacity.appendChild(capacityItem);
    }
  };

  // синхронизация количества комнат с количеством гостей
  var getCapacities = function () {
    var roomNumbers = roomNumber.children;
    clearCapacity();
    for (var i = 0; i < roomNumbers.length; i++) {
      if (roomNumbers[i].selected) {
        renderCapacity(roomNumber.value);
      }
    }
  };

  timeIn.addEventListener('change', timeInSync);
  timeOut.addEventListener('change', timeOutSync);
  type.addEventListener('change', typeSync);
  roomNumber.addEventListener('change', getCapacities);

  var getFormAddress = function (coords) {
    var pinX = coords.x + MAIN_PIN_HALF_WIDTH;
    var pinY = coords.y + MAIN_PIN_HEIGHT;
    formAddress.value = pinX + ', ' + pinY;
  };

  var resetForm = function () {
    window.constants.noticeForm.reset();
  };

  window.constants.noticeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    window.upload(new FormData(window.constants.noticeForm), resetForm, window.util.errorHandler);
  });

  window.form = {
    getFormAddress: getFormAddress
  };
})();
