function skillsMember() {
  // Skills
  var skills = document.querySelector(".skills");
  if (skills) {
    var skill = new ProgressBar.Circle(skills, {
      color: "#fff",
      strokeWidth: 5,
      duration: 1400,
      easing: "easeInOut",
      from: {
        color: "#fff",
        width: 5
      },
      to: {
        color: "#fff",
        width: 5
      },
      step: function(step, circle) {
        circle.path.setAttribute("stroke", "#fff");
        circle.path.setAttribute("stroke-width", step * 5);
        var value = Math.round(circle.value() * 100);
        if (value === 0) {
          circle.setText("");
        } else {
          circle.setText(value);
        }
      }
    });
    skill.text.style.fontFamily = "Open Sans";
    skill.text.style.fontSize = "60px";
    skill.animate(1);
  }
}