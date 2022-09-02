// Page loading animation
$(window).on("load", function () {
  if ($(".cover").length) {
    $(".cover").parallax({
      imageSrc: $(".cover").data("image"),
      zIndex: "1",
    });
  }

  $("#preloader").animate(
    {
      opacity: "0",
    },
    600,
    function () {
      setTimeout(function () {
        $("#preloader").css("visibility", "hidden").fadeOut();
      }, 300);
    }
  );
});

var categories = document.querySelectorAll(".mini .row:last-child .mini-box");
let category = 9;
categories.forEach((element) => {
  element.addEventListener("click", () => {
    $("#quizModal").modal("show");
    category = element.dataset.category;
  });
});

// Handle Modal Form
let questionSection = document.querySelector(".section2");
let miniDiv = document.querySelector(".mini");
let modalForm = document.forms.modalForm;
let all_difficulty = modalForm.ques_difficulty;

let quesNum = 1;
let quesNumStatic = 1;
let quesDifficulty = "easy";

let quesTitle = document.querySelector(".ques-title");
let quesCounter = document.querySelector(".ques-title span:first-child");
let allQuesNumber = document.querySelector(".ques-title span:last-child");
let progress = document.querySelector(".progress-bar");

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let choice_difficulty = Array.from(all_difficulty).filter(
    (element) => element.checked
  )[0].value;
  let choice_quesNum = modalForm.ques_number.value;
  quesDifficulty = choice_difficulty;

  quesNumStatic = choice_quesNum;

  allQuesNumber.innerHTML = choice_quesNum;

  makeRequest(category, quesDifficulty);
  miniDiv.remove();
  questionSection.style.display = "block";
  modalForm.closeModal.click();
});

//Get Data from API

let btnNext = document.getElementsByName("next")[0];
let question = document.getElementById("question");
let options = document.querySelector(".options");

let quesContainer = document.querySelector(".ques-item");
let btnScore = document.querySelector("#btnScore");

let correctOption = "";

async function makeRequest(categ, diff) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=1&category=${categ}&difficulty=${diff}&type=multiple`
    );
    if (!response.ok) {
      throw new Error("request failed");
    }
    const data = await response.json();

    showData(data.results[0]);
  } catch {
    question.innerText = `There is a problem with the connection...
               Check your network connection and do the process again`;
    options.style.display = "none";
    btnNext.remove();
    quesTitle.style.border = "none";
    quesTitle.innerHTML = `<i class="fa fa-ban" aria-hidden="true"></i>
`;
    setTimeout(() => {
      location.reload();
    }, 4000);
  }
}

function showData(data) {
  // console.log(quesNum);
  // console.log(quesNumStatic);
  // console.log("*******************");

  var correctAnswer = data.correct_answer;
  correctOption = data.correct_answer;

  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;

  // add correct answer in random position
  question.innerText = data.question;

  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  options.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
			   <li >
					<div class="form-check">
						<input  class="form-check-input" type="radio" name="ques_answer" id="ques_answer${
              index + 1
            }" value="${option}" >
						<label class="form-check-label" for="ques_answer${index + 1}">
              				${option}		
							</label>
					</div>
				</li>
        `
          )
          .join("")}
    `;
}

//
let answerForm = document.forms.answer_options;
let allAnswerOptions = answerForm.ques_answer;
let btnSubmit = answerForm.next;

let ques_wrapper = document.querySelector(".ques-wrapper");

answerForm.addEventListener("change", (e) => {
  if (e.target.name == "ques_answer") {
    btnSubmit.disabled = false;
  }
});

answerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  quesNum += 1;

  if (quesNum > quesNumStatic) {
    selectOption();
    quesTitle.style.border = "none";
    quesTitle.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i>`;
    question.innerHTML =
      "You have successfully completed the test..<br>\
                  Do you expect that you answered the questions well?";
    ques_wrapper.style.opacity = "0.9";

    options.remove();

    btnSubmit.style.display = "none";

    btnScore.style.display = "block";
  } else {
    makeRequest(category, quesDifficulty);

    quesCounter.innerText = quesNum;
    let x = `${(quesNum / quesNumStatic) * 100}%`;
    progress.style.width = x;

    selectOption();
    btnSubmit.disabled = true;
  }
});

let totalScore = 0;

function selectOption() {
  let choice_checked = Array.from(allAnswerOptions).filter(
    (element) => element.checked
  )[0].value;
  if (choice_checked === correctOption) {
    totalScore += 1;
  }

  console.log("Correct Answer : " + correctOption);
  console.log("your Option : " + choice_checked);
  console.log("Total Score : " + totalScore);
  console.log("#".repeat(15));
}

btnRepeatQuiz = document.querySelector("#btnRepeatQuiz");
btnScore.addEventListener("click", () => {
  let score = (totalScore / quesNumStatic) * 100;
  ques_wrapper.style.textAlign = "center";
  quesTitle.style.border = "1px solid rgb(182, 179, 179,0.3)";
  quesTitle.style.color = "#9a3da7";

  let scoreInt = parseInt(score);
  let scoreText = "";
  if (scoreInt >= 0 && scoreInt <= 25) {
    scoreText = "Very Bad";
  } else if (scoreInt >= 26 && scoreInt <= 50) {
    scoreText = "Bad";
  } else if (scoreInt >= 51 && scoreInt <= 75) {
    scoreText = "Good";
  } else if (scoreInt >= 76 && scoreInt <= 90) {
    scoreText = "Very Good";
  } else if (scoreInt >= 91 && scoreInt <= 100) {
    scoreText = "Excellent";
  }
  quesTitle.innerHTML = score.toFixed(1) + "%";
  question.innerHTML = `Total number of questions = <span class='spanResult'>${quesNumStatic}</span><br>
The number of your correct answer = <span class='spanResult'>${totalScore}</span><br><br>
Your Result : <span class='spanResult'>${scoreText}</span>`;
  btnScore.remove();
  btnRepeatQuiz.style.display = "block";
});
btnRepeatQuiz.addEventListener("click", () => {
  location.reload();
});

let currentYear = (document.getElementById("current-year").innerText =
  new Date().getFullYear());
