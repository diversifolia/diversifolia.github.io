const dom = {
  main_menu : document.querySelector('#main-menu'),
  post_menu : document.querySelector('#post-menu'),
  view_port : document.querySelector('article'),
  home : document.querySelector('#home'),
  about : document.querySelector('#about'),
  title : document.querySelector('#title'),
  subtitle : document.querySelector('#subtitle'),
  mobile_menu_link : document.querySelector('#mobile-menu-link'),
  mobile_menu : document.querySelector('#mobile-menu'),
  side_menu : document.querySelector('#side-menu'),
  mobile_menu_close : document.querySelector('#menu-close'),
  gallery_viewer : document.querySelector('#gallery-viewer'),
  gallery_viewer_image : document.querySelector('#gallery-viewer-image'),
  gallery_viewer_close : document.querySelector('#close-gallery'),
  gallery_viewer_next : document.querySelector('#gallery-next'),
  gallery_viewer_prev : document.querySelector('#gallery-prev'),
}

var queryString = window.location.search;

// const urlParams = new URLSearchParams(queryString);

console.log(queryString)

const highlightMenuLink = (element) => {
  document.querySelectorAll('.current').forEach(result => {
    result.classList.remove('current')
  })
  element.classList.add('current')
}

const openGalleryViewer = (image) => {
  dom.gallery_viewer.classList.add('open')
  dom.gallery_viewer_image.src = image
}

const loadGalleryImg = (n) => {

  let current = dom.gallery_viewer_image.src
  let index = loaded_gallery.indexOf(current)
  console.log(index)
  let new_index = index + n
  if (new_index === -1) {
    new_index = loaded_gallery.length - 1
  } else if (new_index === loaded_gallery.length) {
    new_index = 0
  }
  dom.gallery_viewer_image.src = loaded_gallery[new_index]
}

let loaded_gallery = []

const loadView = (content, type) => {
  dom.view_port.innerHTML = content
  // console.log(dom.view_port.children)
  Array.from(dom.view_port.children).forEach(child => {
    // console.log(child)
    if (child.children.length === 2) {
      child.classList.add('double-column')
    }
  })



  if (type === 'gallery') {
    document.querySelectorAll('.wp-block-image').forEach(element => {
      let src = element.children[0].src

      if (src === undefined) {
        src = element.children[0].children[0].src
      }
      // console.log(src)
      let new_img = document.createElement('div')
      new_img.classList.add('new-img')
      element.insertBefore(new_img, element.children[0])
      new_img.style.backgroundImage = (`url(${src})`)

      loaded_gallery.push(src)

      new_img.addEventListener('click', () => {
        openGalleryViewer(src)
      })
    })
  }

}




// feed it a link array of links you want to link to the gotten wordpress post
async function getPage(id, link_array) {
  const response = await fetch('https://public-api.wordpress.com/wp/v2/sites/diversifoliaeu.wordpress.com/pages/' + id, {mode: 'cors'})
  const postData = await response.json()

  link_array.forEach(link => {
    link.addEventListener('click', () => {
      loadView(postData.content.rendered)
      highlightMenuLink(link)
      closeMobileMenu()
    })

  })

  if (id === 6) {
    loadView(postData.content.rendered)
  }
}

getPage(6, [dom.home, dom.title])
getPage(30, [dom.about, dom.subtitle])




async function getPosts() {
  const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/diversifoliaeu.wordpress.com/posts/', {mode: 'cors'})
  const postData = await response.json()
  console.log(postData)
  // return postData
  fillMenu(postData.posts)
}

let posts = getPosts()



const closeMobileMenu = () => {
  dom.side_menu.classList.remove('open')
}

const fillMenu = (posts) => {
    posts.forEach(post => {
      let child = document.createElement('li')
      child.textContent = post.title
      dom.post_menu.appendChild(child)
      child.addEventListener('click', () => {
        loadView(post.content, 'gallery')
        highlightMenuLink(child)
        closeMobileMenu()
      })
    })
}



dom.mobile_menu_link.addEventListener('click', () => dom.side_menu.classList.add('open'))

dom.mobile_menu_close.addEventListener('click', () => dom.side_menu.classList.remove('open'))

dom.gallery_viewer_close.addEventListener('click', () => dom.gallery_viewer.classList.remove('open'))

dom.gallery_viewer_next.addEventListener('click', () => loadGalleryImg(1))
dom.gallery_viewer_prev.addEventListener('click', () => loadGalleryImg(-1))
dom.gallery_viewer_image.addEventListener('click', () => loadGalleryImg(1))
