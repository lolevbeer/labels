document.addEventListener('DOMContentLoaded', function(event) {

  let content = document.getElementsByClassName('content'),
      adjust = document.getElementsByClassName('font-adjust'),
      contentArray = Array.from(content),
      adjustArray = Array.from(adjust);

  if (paramStore.check(window.location.href)) {
    contentArray.forEach((item) => {
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
            document.title = "Beer Label: " + item.value;
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
    localStorage.setItem(item.id, item.value);
  },
  loadContent: (item) => {
    // If url paramters override.
    let content = localStorage.getItem(item.id);
    if (content) {
      item.value = content;
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
    let alcoholContent = params.get('alcohol-content');
    return title && description && style && alcoholContent;
  },
  saveContent: (item) => {
    let shareLink = document.getElementsByClassName('sharelink'),
        url;

    if (!window.shareLink) {
      window.shareLink = new URL(window.location.href).searchParams;
    }
    window.shareLink.set(item.id, item.value);
    url = window.location.origin+'?'+window.shareLink;
    console.log(url);
    if (paramStore.check(url)) {
      shareLink[0].innerHTML = url.toString();
    }
    else {
      shareLink[0].innerHTML = '';
    }
  },
  loadContent: (item) => {
    let params = new URL(window.location.href).searchParams;
    // If url paramters override.
    let content = params.get(item.id);
    if (content) {
      item.value = content;
    }
  },
};
