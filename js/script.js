'use strict';

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');

    /* remove class 'active' from all article links */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);

    clickedElement.classList.add('active');

    /* remove class 'active' from all articles  */
    const activeArticles = document.querySelectorAll('.post.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const hrefAttribute = clickedElement.getAttribute('href').slice(1);

    /* find the correct article using the selector (value of 'href' attribute) */
    const articles = document.querySelectorAll('.post');
    let selectedArticle;

    for (let article of articles) {
        if (article.id == hrefAttribute) {
            selectedArticle = article;
        }
    }

    /* add class 'active' to the correct article */
    selectedArticle.classList.add('active');

}


function generateTitleLinks() {
    /* Remove links from the sidebar list */
    let linkList = document.getElementsByClassName('list titles');
    linkList[0].innerHTML = '';

    /* Find each post id and save it */
    const posts = document.querySelectorAll('.post');
    const postIdArray = [];
    for (let post of posts) {
        postIdArray.push(post.id);
    }

    /* Find each post title and save it */
    const postTitles = document.querySelectorAll('.post-title');
    const postTitleArray = [];
    for (let title of postTitles) {
        postTitleArray.push(title.innerHTML);
    }

    /* Create HTML code of the link, save all to an array */
    const linksInHTML = [];
    for (let i = 0; i < posts.length; i++) {
        linksInHTML.push(
            '<li><a href="#' + postIdArray[i] + '"><span>' + postTitleArray[i] + '</span></a></li>'
        );
    }

    /* Inject new links into HTML */
    for (let link of linksInHTML) {
        linkList[0].innerHTML += link;
    }

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();