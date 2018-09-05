import YouTubePlayer from 'youtube-player';

let player;

document.addEventListener('DOMContentLoaded', () => {

  function updatePlayerControls() {
    let first_child = document.querySelector(".hello-tracks").firstElementChild.firstElementChild;
    let last_child = document.querySelector(".hello-tracks").lastElementChild.firstElementChild;
    let selected_song = document.querySelector(".opinion-track-selected");
    const left_arrow = document.querySelector(".left-arrow");
    const right_arrow = document.querySelector(".right-arrow");

    right_arrow.classList.remove("hidden-arrow");
    left_arrow.classList.remove("hidden-arrow");

    if (selected_song === first_child) {
      left_arrow.classList.add("hidden-arrow");
    } else if (selected_song === last_child) {
      right_arrow.classList.add("hidden-arrow");
    }
  }

  // when getting to /show/:id, I select the 1st song
  const first = document.querySelector(".tracks-js");
  if (first) {
    // if there is a first song, i add the selected css
    first.classList.add("opinion-track-selected");
    addInfosToPlayer ()
    // i can select any div from song tracks
    const array = document.querySelectorAll(".tracks-js");

    // i need to iterate on every div with addEventListener
    array.forEach((element) => {
      element.addEventListener("click", () => {
        // i iterate on every div to unselect last selected track
        array.forEach((div) => {
          if (div.classList.contains("opinion-track-selected")) {
            div.classList.remove("opinion-track-selected");
          }
        });

        element.classList.add("opinion-track-selected");
        loadVideoById();
        playVideo();
      });
    }); // end of iteration on div array with id "tracks-js"


  const play = document.querySelector(".play-button");
  play.addEventListener("click", () => {
    const pause = document.querySelector(".pause-button");
      play.classList.add("hidden");
      pause.classList.remove("hidden");
    // let youtubeId = document.querySelector(".opinion-track-selected").dataset.youtubeId;
    // player.playVideo(youtubeId);
    playVideo();
        // playVideo("cWGE9Gi0bB0");
  });

  const pause_button = document.querySelector(".pause-button");
  pause_button.addEventListener("click", () => {
    const play_button = document.querySelector(".play-button");
      pause_button.classList.add("hidden");
      play_button.classList.remove("hidden");
    pauseVideo();
  });

  const forward = document.querySelector(".right-arrow");
  forward.addEventListener("click", () => {
    playNextSong()
  });

  const backward = document.querySelector(".left-arrow");
  backward.addEventListener("click", () => {
    playPreviousSong()
  });

    // gets youtubeId in variable to pass to the player
    let youtubeId = document.querySelector(".opinion-track-selected").dataset.youtubeId;
    console.log(youtubeId);

    // display player on div with id="player"
    player = YouTubePlayer('player',
          // events: {
          // 'onStateChange': onPlayerStateChange
          // }},
          {
          playerVars: {
            fs: '0',
            modestbranding: '1'
          },
          height: '100%',
          width: '100%'
          });

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(youtubeId);

    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();

    player
      .pauseVideo()
      .then(() => {
          // Every function returns a promise that is resolved after the target function has been executed.
      });

    player
      .stopVideo()
      .then(() => {
          // Every function returns a promise that is resolved after the target function has been executed.
      });

    player.getDuration();
  } //end if (first)

  function playPreviousSong() {
      let selected = document.querySelector(".opinion-track-selected");
      let previous = selected.parentNode.previousElementSibling.firstElementChild;
      selected.classList.remove("opinion-track-selected");
      previous.classList.add("opinion-track-selected");
      loadVideoById();
      playVideo();
  }

  function playNextSong() {
      let selected = document.querySelector(".opinion-track-selected");
      let next = selected.parentNode.nextElementSibling.firstElementChild;
      selected.classList.remove("opinion-track-selected");
      next.classList.add("opinion-track-selected");
      loadVideoById();
      playVideo();
  }

  function changePlayToPause () {
    const play = document.querySelector(".play-button")
    const pause = document.querySelector(".pause-button");
      play.classList.add("hidden");
      pause.classList.remove("hidden");
  }

  function changePauseToPlay () {
    const play = document.querySelector(".play-button")
    const pause = document.querySelector(".pause-button");
      play.classList.remove("hidden");
      pause.classList.add("hidden");
  }

  function addInfosToPlayer () {
    const title = document.querySelector(".player-title h1");
    const added = document.querySelector(".player-title p");
    let name = document.querySelector(".opinion-track-selected").dataset.songName;
    let date = document.querySelector(".opinion-track-selected").dataset.addedDate;

    title.innerHTML = name;
    added.innerHTML = date;
  }

  function displayDurationHTML(duration) {
    console.log("la durée de la chanson est");
    console.log(duration);
  }

  function displayState(state){
    console.log("l'état de la vidéo est");
    console.log(state);
  }

  function playVideo() {
    changePlayToPause ();
    addInfosToPlayer();
    let youtubeId = document.querySelector(".opinion-track-selected").dataset.youtubeId;
    console.log(player.getPlayerState(youtubeId));
    player.playVideo(youtubeId);
    player.getCurrentTime(youtubeId);
    player.getDuration().then(displayDurationHTML);
    player.getPlayerState().then(displayState);
  }

  function loadVideoById () {
    updatePlayerControls();
    let youtubeId = document.querySelector(".opinion-track-selected").dataset.youtubeId;
    player.loadVideoById(youtubeId);
  }

  function stopVideo() {
    let youtubeId = document.querySelector(".opinion-track-selected").dataset.youtubeId;
    player.stopVideo(youtubeId);
  }

  function pauseVideo() {
    let youtubeId = document.querySelector(".opinion-track-selected").dataset.youtubeId;
    player.pauseVideo(youtubeId);
    console.log("je suis en pause");
    player.getPlayerState().then(displayState);
  }

player.on('stateChange', (event) => {
  console.log(event.data)
  switch (event.data) {
    case "-1":
      console.log('non démarré.');
      break;
    case 0:
      console.log('ended');
      playNextSong();
      break;
    case 1:
      console.log('en lecture');
      changePlayToPause();
      break;
    case 2:
      console.log('en pause');
      changePauseToPlay ();
      break;
    case 3:
      console.log('en mémoire tampon');
      break;
    case 5:
      console.log('en file dattente');
      break;
    default:
      console.log('This is the default');
  }
// -1 : non démarré 0 : arrêté 1 : en lecture 2 : en pause 3 : en mémoire tampon 5 : en file dattente
});

  // function onPlayerStateChange(event) {
  //   if (event.data == YT.PlayerState.PLAYING) {
  //     let playing = true;
  //   }
  // }

  // // javascript to change play button in pause button and reverse
  // const play_all = document.querySelectorAll(".play");
  //   play_all.forEach((element) => {
  //     element.addEventListener("click", () => {
  //       // playVideo(youtubeId);
  //       play_all.forEach((lt) => {
  //         if (lt.classList.contains("hidden-arrow")) {
  //           lt.classList.remove("hidden-arrow");
  //         } //end if condition
  //       }); //end forEach

  //       element.classList.add("hidden-arrow");
  //     });//end forEach AddEventListener
  //   });
  updatePlayerControls();
});//end DOM
