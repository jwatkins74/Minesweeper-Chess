const slider = document.getElementById("slide");
slider.onchange = function() {
    console.log(this.value);
    localStorage.setItem("diff", this.value);
}
