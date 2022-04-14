document.addEventListener('DOMContentLoaded', function(event) {

  let content = document.getElementsByClassName('content'),
      contentArray = Array.from(content);

  if (paramStore.check(window.location.href)) {
    contentArray.forEach((item) => {
      console.log(item)
      paramStore.loadContent(item);
    });
  }
  else {
    contentArray.forEach((item) => {
      localStore.loadContent(item);
      item.addEventListener(
        'blur', () => {
          localStore.saveContent(item);
          paramStore.saveContent(item);
          if (item.id == 'title') {
            document.title = "Beer Label: " + item;
          }
        }, false
      );
      item.addEventListener(
        'keydown', (keydown) => {
          if (keydown.keyCode===13) {
            item.blur();
          }
        }, false
      );
    });
  }
});

let localStore = {
  saveContent: (item) => {
    localStorage.setItem(item.id, item.innerHTML);
  },
  loadContent: (item) => {
    // If url paramters override.
    let content = localStorage.getItem(item.id);
    if (content) {
      item.innerHTML = content;
    }
    paramStore.saveContent(item);
  },
};

let paramStore = {
  check: (url) => {
    let params = new URL(url).searchParams;
    let title = params.get('title');
    let description = params.get('description');
    let style = params.get('style');
        console.log(style)
    let abv = params.get('abv');
    return title && description && style && abv;
  },
  saveContent: (item) => {
    let shareLink = document.getElementsByClassName('sharelink'),
        url;

    if (!window.shareLink) {
      window.shareLink = new URL(window.location.href).searchParams;
    }
    window.shareLink.set(item.id, item.innerHTML);
    url = window.location.href+'?'+window.shareLink;
    if (paramStore.check(url)) {
      shareLink[0].innerHTML = url.toString();
    }
    else {
      shareLink[0].innerHTML = '';
    }
  },
  loadContent: (item) => {
    let params = new URL(window.location.href).searchParams;
    // If url parameters override.
    let content = params.get(item.id);
    console.log(item)
    if (content) {
      item.innerHTML = content;
    }
  },
};
