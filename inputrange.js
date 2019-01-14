var a_elem = document.getElementById("a");
var rangeValuea = function () {
  var newValue = a_elem.value;
  var target = document.querySelector('.avalue');
  target.innerHTML = newValue;
};
a_elem.addEventListener("input", rangeValuea);

var b_elem = document.getElementById("b");
var rangeValueb = function () {
  var newValue = b_elem.value;
  var target = document.querySelector('.bvalue');
  target.innerHTML = newValue;
};
b_elem.addEventListener("input", rangeValueb);

var ast_elem = document.getElementById("ast");
var rangeValueast = function () {
  var newValue = ast_elem.value;
  var target = document.querySelector('.astvalue');
  target.innerHTML = newValue;
};
ast_elem.addEventListener("input", rangeValueast);

var bst_elem = document.getElementById("bst");
var rangeValuebst = function () {
  var newValue = bst_elem.value;
  var target = document.querySelector('.bstvalue');
  target.innerHTML = newValue;
};
bst_elem.addEventListener("input", rangeValuebst);