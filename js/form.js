'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');

  var minPricesForType = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // синхронизация времён заезда/выезда
  var syncTime = function (firstValue, secondValue) {
    var firstTimes = firstValue.children;
    var secondTimes = secondValue.children;
    for (var i = 0; i < firstTimes.length; i++) {
      if (firstTimes[i].selected) {
        var timeValue = firstTimes[i].value;
        for (var j = 0; j < secondTimes.length; j++) {
          if (secondTimes[j].value === timeValue) {
            secondTimes[j].selected = true;
          }
        }
      }
    }
  };

  // проверка клика мышкой по полю заезда/выезда
  var checkTime = function (event) {
    var timeIn = noticeForm.querySelector('#timein');
    var timeOut = noticeForm.querySelector('#timeout');
    var firstTime = event.target;
    var secondTime = (firstTime === timeIn) ? timeOut : timeIn;
    syncTime(firstTime, secondTime);
  };

  // синхронизация типа жилья с минимальной ценой
  var getMinPrice = function () {
    var type = noticeForm.querySelector('#type');
    var formTypes = type.children;
    var price = noticeForm.querySelector('#price');
    for (var i = 0; i < formTypes.length; i++) {
      if (formTypes[i].selected) {
        var typeValue = formTypes[i].value;
        price.min = minPricesForType[typeValue];
        price.placeholder = price.min;
      }
    }
  };

  var disableCapacity = function (roomValue) {
    var capacity = noticeForm.querySelector('#capacity');
    var capacities = capacity.children;
    if (roomValue !== '100') {
      for (var i = 0; i < capacities.length; i++) {
        if (capacities[i].value > roomValue || capacities[i].value === '0') {
          capacities[i].disabled = true;
          capacities[i].selected = false;
        } else {
          capacities[i].disabled = false;
        }
      }
    } else {
      for (var j = 0; j < capacities.length; j++) {
        if (capacities[j].value !== '0') {
          capacities[j].disabled = true;
        } else {
          capacities[j].disabled = false;
          capacities[j].selected = true;
        }
      }
    }
  };

  // связка количества комнат с количеством гостей
  var checkRoomNumber = function () {
    var roomNumber = noticeForm.querySelector('#room_number');
    var roomNumbers = roomNumber.children;
    for (var i = 0; i < roomNumbers.length; i++) {
      if (roomNumbers[i].selected) {
        if (roomNumbers[i].value === '1') {
          disableCapacity(roomNumbers[i].value);
          break;
        }
        if (roomNumbers[i].value === '2') {
          disableCapacity(roomNumbers[i].value);
          break;
        }
        if (roomNumbers[i].value === '3') {
          disableCapacity(roomNumbers[i].value);
          break;
        }
        disableCapacity(roomNumbers[i].value);
      }
    }
  };

  noticeForm.addEventListener('change', checkTime);
  noticeForm.addEventListener('change', getMinPrice);
  noticeForm.addEventListener('change', checkRoomNumber);
})();
