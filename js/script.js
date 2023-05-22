'use strict';

const templates = {
  listLink: Handlebars.compile(document.querySelector('#template-list-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors'
};

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
  let linkList = document.querySelector(opts.titleListSelector);
  linkList.innerHTML = '';

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  for (let article of articles) {
    /* Find each post id and save it */
    const href = article.id;

    /* Find each post title and save it */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* Create HTML code of the link */
    const linkHTMLData = { id: href, title: articleTitle };
    const linkHTML = templates.listLink(linkHTMLData);

    /* Inject new links into HTML */
    linkList.innerHTML += linkHTML;
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
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);

  return `${opts.cloudClassPrefix}${classNumber}`;
}

function generateTags() {
  /* create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

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
      const linkHTMLData = { id: `tag-${tag}`, title: tag };
      const linkHTML = templates.listLink(linkHTMLData);
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
    article.querySelector(opts.articleTagsSelector).innerHTML = html;
    /* END LOOP: for every article: */
  }

  /* find list of tags in the right column */
  const tagList = document.querySelector(opts.tagsListSelector);

  /* create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = { tags: [] };

  /* START LOOP: for each tag in allTags */
  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* END LOOP: for each tag in allTags:*/
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function generateAuthors() {
  const articles = document.querySelectorAll(opts.articleSelector);

  /* Add authors to articles */
  for (let article of articles) {
    const author = article.getAttribute('data-author');
    const authorLinkString = `author-${author}`;
    const authorSpaceString = author.replace('-', ' ');
    const linkHTMLData = { id: authorLinkString, title: authorSpaceString };
    const linkHTML = templates.authorLink(linkHTMLData);
    article.querySelector(opts.articleAuthorSelector).innerHTML += linkHTML;

  }

  /* Add authors to the sidebar list with templates */
  const authors = {};
  for (let article of articles) {
    const author = article.getAttribute('data-author').replace('-', ' ');
    if (!authors.hasOwnProperty(author)) {
      authors[author] = 1;
    } else {
      authors[author]++;
    }
  }

  const authorsData = { authors: [] };
  /* START LOOP: for each tag in allTags */
  for (let author in authors) {
    authorsData.authors.push({
      authorNoSpace: author.replace(' ', '-'),
      author: author,
      count: authors[author]
    });

    const authorsList = document.querySelector(opts.authorsListSelector);
    authorsList.innerHTML = templates.authorListLink(authorsData);

    addClickListenersToAuthors();
  }
}
generateAuthors();

function addClickListenersToAuthors() {
  /* Add click listeners to authors in articles */
  const articles = document.querySelectorAll(opts.articleSelector);

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
  /* find all links to tags in articles*/
  let links = document.querySelectorAll('.post-tags a');

  /* START LOOP: for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */

  /* find all links to tags on the sidebar*/
  let sidebarLinks = document.querySelectorAll('.list.tags a');

  for (let link of sidebarLinks) {
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();
