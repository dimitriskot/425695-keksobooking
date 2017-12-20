'use strict';

(function () {
  var timeIn = window.constantNode.noticeForm.querySelector('#timein');
  var timeOut = window.constantNode.noticeForm.querySelector('#timeout');
  var type = window.constantNode.noticeForm.querySelector('#type');
  var price = window.constantNode.noticeForm.querySelector('#price');
  var roomNumber = window.constantNode.noticeForm.querySelector('#room_number');
  var capacity = window.constantNode.noticeForm.querySelector('#capacity');

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
})();
