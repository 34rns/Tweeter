(() => {
  const searchInput = document.querySelector("#searchHere");
  const msgInput = document.querySelector("#tweet");
  const msgForm = document.querySelector(".tweetForm");
  const tweetArea = document.querySelector(".tweetMsgContainer");
  const alertSpan = document.querySelector(".msg");

  let allTweets = localStorage.getItem("allTweets")
    ? JSON.parse(localStorage.getItem("allTweets"))
    : [];

  function timeOfTweet() {
    const date = new Date();
    const hr = date.getHours();
    const min = date.getMinutes();
    const s = date.getSeconds();
    return `${hr}:${min}:${s}`;
  }
  function receiveInput() {
    const msg = msgInput.value;
    const time = timeOfTweet();
    return { msg, time };
  }

  function showMsgToUIFormMemory(tweet) {
    // extracting info from array
    const { id, time, msg } = tweet;

    // creating the tweet
    const htmlTxt = `
       <div class="tweetMsg" data-id='${id}'>
       <p>
   ${msg}
       </p>
       <h6 class="time">${time}</h6>
       <button class="delBtn" >Delete</button>
     </div>
   
       `;
    tweetArea.insertAdjacentHTML("beforeend", htmlTxt);
  }
  function addMsgToMemory(msg, time) {
    const tweet = {
      id: allTweets.length + 1,
      msg,
      time,
    };
    // storing msg to memory
    allTweets.push(tweet);
    return tweet;
  }
  function validMsg(msg, time) {
    let isValid = true;
    if (msg === "") {
      return (isValid = false);
    }
    return isValid;
  }
  function clearAlertMsg() {
    alertSpan.textContent = "";
  }
  function showAlertMsg(msg, color = "green") {
    alertSpan.textContent = msg;
    alertSpan.style.color = color;
    setTimeout(() => {
      clearAlertMsg();
    }, 2000);
  }
  function resetInput() {
    msgInput.value = "";
  }
  function getId(e) {
    const parentElm = e.target.parentElement;
    const id = Number(parentElm.getAttribute("data-id"));
    return id;
  }
  function removeFromMemory(id) {
    allTweets = allTweets.filter((twt) => twt.id !== id);
  }
  function removeFromDom(id) {
    document.querySelector(`[data-id='${id}']`).remove();
  }
  function tweetToLStorage(tweet) {
    let allTweets;
    if (localStorage.getItem("allTweets")) {
      // get the old tweets if have
      allTweets = JSON.parse(localStorage.getItem("allTweets"));
      // add the new one
      allTweets.push(tweet);
    } else {
      allTweets = [];
      allTweets.push(tweet);
    }
    localStorage.setItem("allTweets", JSON.stringify(allTweets));
  }
  function removeFromLStorage(id) {
    let allTweets = JSON.parse(localStorage.getItem("allTweets"));
    allTweets = allTweets.filter((twt) => twt.id !== id);
    localStorage.setItem("allTweets", JSON.stringify(allTweets));
  }

  function showFilteredMsgToUI(searchArray) {
    let htmlElm = "";
    if (searchArray.length === 0) {
      showAlertMsg("Not found. Search something else!", "orange");
      return;
    }
    searchArray.forEach((tweet) => {
      const { id, msg, time } = tweet;
      const htmlTxt = `
          <div class="tweetMsg" data-id="${id}">
            <p>${msg}</p>
            <h6 class="time">${time}</h6>
            <button class="delBtn">Delete</button>
          </div>
        `;
      htmlElm += htmlTxt;
    });
    tweetArea.innerHTML = htmlElm;
  }
  function msgFromFunc(e) {
    e.preventDefault();
    // receiving inputs
    const { msg, time } = receiveInput();
    // validating input msg
    const isValid = validMsg(msg, time);
    if (isValid === false) {
      showAlertMsg("write something to tweet!!", "red");
      return;
    } else {
      // show msg that tweet has been tweeted
      showAlertMsg("tweeted!!");
      // resetting input value;
      resetInput();
      // msg add to memory
      const tweet = addMsgToMemory(msg, time);
      // showing msg to Dom
      showMsgToUIFormMemory(tweet);
      // storing msg to localStorage
      tweetToLStorage(tweet);
    }
  }
  function tweetAreaFunc(e) {
    // for deleting button
    if (e.target.classList.contains("delBtn")) {
      // getting the id
      const id = getId(e);
      // remove from memory
      removeFromMemory(id);
      console.log(allTweets);
      // remove from DOM
      removeFromDom(id);
      // remove from LocalStorage
      removeFromLStorage(id);
    }
  }
  msgForm.addEventListener("submit", msgFromFunc);
  tweetArea.addEventListener("click", tweetAreaFunc);
  document.addEventListener("DOMContentLoaded", (e) => {
    // looping
    let htmlElm;
    htmlElm =
      allTweets.length === 0
        ? showAlertMsg("You have tweeted nothing!", "lightblue")
        : "";
    htmlElm = "";
    allTweets.forEach((tweet) => {
      const { id, msg, time } = tweet;
      htmlElm += `
    <div class="tweetMsg" data-id='${id}'>
    <p>
${msg}
    </p>
    <h6 class="time">${time}</h6>
    <button class="delBtn" >Delete</button>
  </div>

    `;
      tweetArea.insertAdjacentHTML("beforeend", htmlElm);
    });
  });
  searchInput.addEventListener("keyup", (e) => {
    const txt = e.target.value;
    console.log(txt);
    // debugger;
    const searchArray = allTweets.filter((tweet) => tweet.msg.includes(txt));
    console.log(searchArray);
    showFilteredMsgToUI(searchArray);
  });
})();
