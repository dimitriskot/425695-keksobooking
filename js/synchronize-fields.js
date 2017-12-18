'use strict';

(function () {
  window.synchronizeFields = function (firstNode, secondNode, firstArray, secondArray, callback) {
    console.log(firstArray);
    for (var i = 0; i < firstArray.length; i++) {
      if (firstArray[i].selected) {
        firstNode.value = firstArray[i].value;
      }
      callback(secondNode, firstNode.value);
    }
  };
})();
