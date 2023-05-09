'use strict';

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list';

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
    const selectedArticle = document.getElementById(hrefAttribute);

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

function generateTags() {
    /* find all articles */
    const posts = document.querySelectorAll('.post');

    let postId = 0;
    const lists = document.querySelectorAll('.list-horizontal')

    /* START LOOP: for every article: */
    for (let post of posts) {
        /* find tags wrapper */
        //    console.log(post.getAttribute('data-tags')); 
        let tagsWrapper = post.getAttribute('data-tags');
        /* make html variable with empty string */
        let tags = "";
        /* get tags from data-tags attribute */
        tags = tagsWrapper;
        /* split tags into array */
        const tagsArray = tags.split(' ');

        let tagLinks = '';
        /* START LOOP: for each tag */
        for (let tag of tagsArray) {
            /* generate HTML of the link */
            /* add generated code to html variable */
            tagLinks += ('<li><a href="#tag-' + tag +
                '">' + tag + '</a></li> ');
            /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        // Tutaj nie wiedzialem jak inaczej "dostac sie" do taga <ul class="list list-horizontal">
        lists[postId].innerHTML += tagLinks;
        postId++;
        /* END LOOP: for every article: */
    }
}

generateTags();

function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    console.log('Tag was clicked!');

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = this.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    console.log(tag);

    /* find all tag links with class active */

    /* START LOOP: for each active tag link */

    /* remove class active */

    /* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */

    /* START LOOP: for each found tag link */

    /* add class active */

    /* END LOOP: for each found tag link */

    /* execute function "generateTitleLinks" with article selector as argument */
}

function addClickListenersToTags() {
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags a');

    /* START LOOP: for each link */
    /* add tagClickHandler as event listener for that link */
    /* END LOOP: for each link */
    for (let link of links) {
        link.addEventListener('click', tagClickHandler);
    }
}

addClickListenersToTags();