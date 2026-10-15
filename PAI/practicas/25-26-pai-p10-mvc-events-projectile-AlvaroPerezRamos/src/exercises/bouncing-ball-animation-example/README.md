# :school: PAI Animation Example [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Simple web bouncing ball Application in vanilla Typescript

## Purpose

Illustrate the implementation of animations in TS

## Application

The application is built around two classes: `Ball`, which encapsulates the logic of a ball 
moving at a constant speed and bouncing off the ‘walls’ of a canvas, and `ViewAnimation`, 
the class that orchestrates the animation.

The client program `main.ts` simply initialises the animation

## Project Directory Structure

This application consists of Typescript, HTML and CSS files. No frameworks are involved.

All source code (TS, CSS, HTML) is the root directory.
JS transpiled code goes to the `dist` directory.
The project files and directory organization are:

```text
.
├── animation.html
├── Ball.ts
├── dist
├── main.ts
├── package.json
├── package-lock.json
├── README.md
├── styles.css
├── tsconfig.json
└── ViewAnimation.ts
```

## Building and Running the code 

Compile using:
```text
$ tsc
```

`tsc` uses the information in `tsconfig.json` file


The application page `animation.html` can't be loaded directly on a browser due to security issues.
Load the application on a web server (using the "Live Server" extension on VSC, for example).

## Author

F de Sande (fsande@ull.es)

## Markdown

This text is Markdown text. To learn about Markdown, Study these references:
* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)
* [StackEdit. An On-line MarkDown Editor](https://stackedit.io/)
* [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

## License

This project is open source and available under the [MIT License](LICENSE).
