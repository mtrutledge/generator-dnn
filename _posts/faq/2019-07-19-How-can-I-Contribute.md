---
layout: bootstrap
title: How can I contribute?
date: 2018-07-19 12:10:39
categories: faq
excerpt: Tells you how you can contribute to the generator-dnn project.
---
<section id="codelab">
	<div class="container">
    </div>
</section>

## {{ page.title }}

*We have tried to make this as simple as possible. The most important part is when you want to test locally you need to create a link using `npm link` in your local generator-dnn directory.*

## Project organization

* Branch `master` is always stable and release-ready.
* Branch `development` contains the next versions features and bugs merged from pull requests.
* Feature branches should be created for adding new features and branched off of `development`.
* Bug fix branches should be created for fixing bugs and branched off of `development`.

## Opening a new issue

**Do not open a duplicate issue!**

1. Look through existing issues to see if your issue already exists.
2. If your issue already exists, comment on its thread with any information you have. Even if this is simply to note that you are having the same problem, it is still helpful!
3. Always *be as descriptive as you can*.
4. What is the expected behavior? What is the actual behavior? What are the steps to reproduce?
5. Attach screenshots, videos, GIFs if possible.
6. **Include library version or branch experiencing the issue.**
7. **Include OS version and devices experiencing the issue.**

## Submitting a pull request

1. Find an issue to work on, or create a new one. *Avoid duplicates, please check existing issues!*
2. Fork the repo, or make sure you are synced with the latest changes on `development`.
3. Create a new branch with a sweet name: `git checkout -b issue_<##>_<description>`.
4. Do some programming.
5. Write [unit tests](http://nshipster.com/unit-testing) when applicable.
6. Keep your code nice and clean by adhering to the coding standards & guidelines below.
7. Don't break unit tests or functionality.
8. Update the documentation header comments if needed.
9. **Rebase on `development` branch and resolve any conflicts _before submitting a pull request!_**
10. Submit a pull request to the `development` branch.

**You should submit one pull request per feature!** The smaller the PR, the better your chances are of getting merged. Enormous PRs will likely take enormous amounts of time to review, or they will be rejected.

## Running the Yeoman Generator Locally

Once you fork the repo and have it checkout out locally you will need to be able to test the generator locally. In order to do this go to the directory you have generator-dnn checkout to and run the following command

`npm link`

That will install your project dependencies and symlink a global module to your local file. After npm is done, you’ll be able to call `yo dnn` and you should be able to see your changes!

# Style guidelines

Try to stick to the style that is already in the files. eslint is installed and will let you know if you are making errors that need to be corrected. Please correct all linting errors.

<p><a href="{{ site.url }}/faq"><i class="fa fa-chevron-left"></i> Back to FAQ</a></p>