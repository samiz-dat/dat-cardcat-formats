import path from 'upath';
import _ from 'lodash';
import { joinName, parseName, parseNames, alphabetizedTitle } from './utils';

/*
 * This module is meant to be used in the context of digital collections of texts.
 * The purpose of this module is to extract as much information from each file path as possible,
 * which means that it assumes the paths are structured according to a consistent logic.
 */

// Files to ignore, even if they are in the right place
const ignore = ['.DS_Store', '.dat', '.git', 'nohup.out'];
// The possible parser choices available
const choices = ['calibre', 'flat'];

// These might reformat the input data to create a path.
// This newly created path will be reversible: parser <--> formatter
const formatters = {
  // Every part of calibre path structure is downloadable
  calibre: (authors, title, file) => path.join(_.first(authors), title, file),
  // With flat files the filename is discarded and the title is used.
  flat: (authors, title, file) => {
    const formatName = n => joinName(parseName(n), true);
    const ext = path.extname(file);
    const authorPart = _.join(_.take(authors, 3).map(a => formatName(a)), ';');
    return `${authorPart} - ${title}${ext}`;
  },
};

// These parsers do the work of parsing filepaths
const parsers = {
  // Calibre parser is the default one
  calibre: (pathArr, filePath) => {
    if (pathArr.length === 3 && !ignore.includes(pathArr[2])) {
      const parsed = parseNames([pathArr[0]]);
      const authors = parsed.map(n => ({
        author: joinName(n),
        author_sort: n.original,
        role: n.role || undefined,
      }));
      return {
        authors,
        author_sort: joinName(authors[0].author_sort, true),
        title: pathArr[1],
        title_sort: alphabetizedTitle(pathArr[1]),
        file: pathArr[2],
        path: filePath,
        format: 'calibre',
      };
    }
    return false;
  },
  // The Flat style is "Last name, First name; Second Author, Optional - Title.filetype"
  flat: (pathArr, filePath) => {
    if (pathArr.length === 1) {
      const file = pathArr[0];
      const ext = path.extname(file);
      const parts = file.split(' - ');
      if (parts.length === 2) {
        const title = parts[1].replace(ext, '');
        const authorNames = parts[0].split(';');
        const parsed = parseNames(authorNames);
        const authors = parsed.map(n => ({
          author: joinName(n),
          author_sort: n.original,
          role: n.role || undefined,
        }));
        if (authors.length && title) {
          return {
            authors,
            author_sort: authors[0].author_sort,
            title,
            title_sort: alphabetizedTitle(title),
            file,
            path: filePath,
            format: 'flat',
          };
        }
      }
    }
    return false;
  },
};


// This creates a path in the defined format.
export function formatPath(opts) {
  if (!opts.format) return false;
  return formatters[opts.format](opts);
}

// Does the given candidate pass one of the parsers?
// If so, return { author, author_sort, title, file, format }
export default function (file, format) {
  // Only files (not directories) are eligible
  const pathSep = '/'; // Note: not using path.sep!
  const arr = path.normalize(file).split(pathSep);
  // Sometimes there is a leading slash which messes things up
  if (arr[0] === '') {
    arr.shift();
  }
  if (format) {
    // Call the appropriate parser for the given format
    return parsers[format](arr);
  }
  // Otherwise try out each format (in order specified by "choices") and see if any work
  for (const choice of choices) {
    const result = parsers[choice](arr, file);
    if (result) {
      return result;
    }
  }
  // None of the parsers worked.
  return false;
}
