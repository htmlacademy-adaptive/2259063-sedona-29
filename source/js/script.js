let menu = document.querySelector(".main-nav__list");
let button = document.querySelector(".main-nav__button");
let logo = document.querySelector(".main-nav__logo")
let map = document.querySelector("iframe")

menu.classList.remove("main-nav__list--noscript");
map?.classList.remove("location__map--nojs");
button.classList.remove("main-nav__button--noscript");
logo.classList.add("main-nav__logo--closed-menu");

button.onclick = function () {
  menu.classList.toggle("main-nav__list--close");
  button.classList.toggle("main-nav__button--burger");
  logo.classList.toggle("main-nav__logo--closed-menu");
}
