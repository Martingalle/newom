const input = document.querySelector('#search');
const results = document.querySelector('#results');
const opinionShow = document.getElementById("opinionShow")
const youtube = "https://www.youtube.com/watch?v"

if (opinionShow) {
  const opinionId = opinionShow.dataset.opinionId
}

const inputSearchResult = (data) => {
  console.log(data)
  results.innerHTML = '';
  data.items.forEach((item) => {
    const opinionId = opinionShow.dataset.opinionId;
    var youtube_url = youtube + item.id.videoId
    results.insertAdjacentHTML('beforeend', `
        <li class="track-search-result-display">
          <img src=${item.snippet.thumbnails.medium.url} alt="">
          <p class="track-name">${item.snippet.title}</p>

            <button class="btn" type="button" aria-haspopup="true" aria-expanded="false">
              <a rel="nofollow" data-method="post" class="button-small-light" href="/opinions/${opinionId}/tracks?track[name]=${item.snippet.title}&amp;track[photo]=${item.snippet.thumbnails.medium.url}&amp;track[audio_url]=${youtube_url}&amp;track[youtube_id]=${item.id.videoId}">add</a>
            </button>
          </div>

        </li>`);
  });
};

const autocomplete = (e) => {
    fetch(`https://www.googleapis.com/youtube/v3/search?q=${e.target.value}&type=video&videoEmbedabble=true&part=id,snippet&maxResults=5&key=AIzaSyDNB4crv9Q0GtCyd1HHZsC0JJXN1-7GdnA`)
    .then(response => response.json())
    .then(data => inputSearchResult(data));
};

if (input) {
  input.addEventListener('keyup', autocomplete);
}



