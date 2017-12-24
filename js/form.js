'use strict';

(function () {
  // первая форма (время заезда)
  var timeIn = window.constants.noticeForm.querySelector('#timein');
  // вторая форма (время выезда)
  var timeOut = window.constants.noticeForm.querySelector('#timeout');
  // массив значений первой формы (время заезда)
  var firstTimes = timeIn.children;
  // массив значений второй формы (время выезда)
  var secondTimes = timeOut.children;
  // первая форма (тип жилья)
  var type = window.constants.noticeForm.querySelector('#type');
  // вторая форма (цена жилья)
  var price = window.constants.noticeForm.querySelector('#price');
  // массив значений первой формы (тип жилья)
  var formTypes = type.children;
  // массив значений второй формы (цена жилья)
  var minPricesForType = [
    '1000',
    '0',
    '5000',
    '10000'
  ];

  var roomNumber = window.constants.noticeForm.querySelector('#room_number');
  var capacity = window.constants.noticeForm.querySelector('#capacity');
  var formAddress = window.constants.noticeForm.querySelector('#address');
  var MAIN_PIN_HALF_WIDTH = 31;
  var MAIN_PIN_HEIGHT = 82;

  var roomCapacity = {
    '1': ['для 1 гостя'],
    '2': ['для 1 гостя', 'для 2 гостей'],
    '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
    '100': ['не для гостей']
  };

  // функция-колбэк присваивания передаваемой форме (element)
  // значения передаваемого элемента (item) (для времён заезда/выезда)
  var syncElement = function (element, item) {
    element.value = item.value;
  };
  // функция-колбэк присваивания передаваемой форме (element)
  // значения передаваемого элемента (item) (для цены жилья)
  var syncMinPrice = function (element, item) {
    element.min = item;
    element.placeholder = element.min;
  };
  // объявление обработчика синхронизации времени выезада со временем заезда
  // и присваивание ему значения функции window.synchronizeFields с параметрами
  var timeInSync = function () {
    window.synchronizeFields(timeOut, firstTimes, secondTimes, syncElement);
  };

  timeInSync();
  // объявление обработчика синхронизации времени заезда со временем выезада
  // и присваивание ему значения функции window.synchronizeFields с нужными параметрами
  var timeOutSync = function () {
    window.synchronizeFields(timeIn, secondTimes, firstTimes, syncElement);
  };
  // объявление обработчика синхронизации цены жилья с типом жилья
  // и присваивание ему значения функции window.synchronizeFields с нужными параметрами
  var typeSync = function () {
    window.synchronizeFields(price, formTypes, minPricesForType, syncMinPrice);
  };

  typeSync();

  timeIn.addEventListener('change', timeInSync);
  timeOut.addEventListener('change', timeOutSync);
  type.addEventListener('change', typeSync);

  /* КАК БЫЛО
    // синхронизация времён заезда/выезда
    var timeInSync = function () {
      var firstTimes = timeIn.children;
      var secondTimes = timeOut.children;
      for (var i = 0; i < firstTimes.length; i++) {
        if (firstTimes[i].selected) {
          timeOut.value = secondTimes[i].value;
        }
      }
    };

    // синхронизация времён заезда/выезда
    var timeOutSync = function () {
      var firstTimes = timeIn.children;
      var secondTimes = timeOut.children;
      for (var i = 0; i < secondTimes.length; i++) {
        if (secondTimes[i].selected) {
          timeIn.value = firstTimes[i].value;
        }
      }
    };

    // синхронизация типа жилья с минимальной ценой
    var typeSync = function () {
      var formTypes = type.children;
      for (var i = 0; i < formTypes.length; i++) {
        if (formTypes[i].selected) {
          price.min = minPricesForType[i];
          price.placeholder = price.min;
        }
      }
    };
  */
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

  getCapacities();

  // timeIn.addEventListener('change', timeInSync);
  // timeOut.addEventListener('change', timeOutSync);
  // type.addEventListener('change', typeSync);
  roomNumber.addEventListener('change', getCapacities);

  var getFormAddress = function (coords) {
    var pinX = coords.x + MAIN_PIN_HALF_WIDTH;
    var pinY = coords.y + MAIN_PIN_HEIGHT;
    formAddress.value = pinX + ', ' + pinY;
  };

  window.form = {
    getFormAddress: getFormAddress
  };
})();
