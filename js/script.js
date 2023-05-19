'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorSidebarList = '.list.authors';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
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

function generateTitleLinks(customSelector = '') {
  /* Remove links from the sidebar list */
  let linkList = document.querySelector(optTitleListSelector);
  linkList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  for (let article of articles) {
    /* Find each post id and save it */
    const href = article.id;

    /* Find each post title and save it */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* Create HTML code of the link */
    const html =
      `<li><a href="#${href}"><span>${articleTitle}</span></a></li>`;

    /* Inject new links into HTML */
    linkList.innerHTML += html;
  }

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags = {}) {
  let min = 99999;
  let max = 0;

  for (let tag in tags) {
    min = Math.min(tags[tag], min);
    max = Math.max(tags[tag], max);
  }

  return { min, max };
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return `${optCloudClassPrefix}${classNumber}`;
}

function generateTags() {
  /* create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    let tagsWrapper = article.getAttribute('data-tags');
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    let tags = tagsWrapper;
    /* split tags into array */
    const tagsArray = tags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of tagsArray) {
      /* generate HTML of the link */
      /* add generated code to html variable */
      const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
      html += linkHTML;
      /* check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* add generated code into the tags wrapper */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    article.querySelector(optArticleTagsSelector).innerHTML = html;
    /* END LOOP: for every article: */
  }

  /* find list of tags in the right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';

  /* START LOOP: for each tag in allTags */
  for (let tag in allTags) {
    /* generate code of a link and add it to allTagsHTML */
    allTagsHTML += `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag}</a></li> `;
  }
  /* END LOOP: for each tag in allTags:*/

  /* add html from allTags to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  /* Add authors to articles */
  for (let article of articles) {
    const author = article.getAttribute('data-author');
    let html = `<a href="#author-${author}">${author.replace('-', ' ')}</a>`;
    article.querySelector(optArticleAuthorSelector).innerHTML += html;
  }

  /* Add authors to the sidebar list */
  let allAuthors = {};
  for (let article of articles) {
    const author = article.getAttribute('data-author').replace('-', ' ');
    if (!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }

  const authorList = document.querySelector(optAuthorSidebarList);
  let authorsSidebarHTML = '';
  for (let author in allAuthors) {
    authorsSidebarHTML += `<li><a href="#author-${author.replace(' ', '-')}" class="author">${author} (${allAuthors[author]})</a></li> `;
  }
  authorList.innerHTML = authorsSidebarHTML;

  addClickListenersToAuthors();
}

generateAuthors();

function addClickListenersToAuthors() {
  /* Add click listeners to authors in articles */
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    let link = article.querySelector('a');
    link.addEventListener('click', authorClickHandler);
  }

  /* Add click listeners to authors on the sidebar */
  const authors = document.querySelectorAll('.author');
  for (let author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract the author from the "href" constant */
  const author = href.replace('#author-', '');

  generateTitleLinks('[data-author~="' + author + '"]');
}

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  /* START LOOP: for each active tag link */

  /* remove class active */

  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */

  /* START LOOP: for each found tag link */

  /* add class active */

  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
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
