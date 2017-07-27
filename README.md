# Dat Cardcat Formats

Handles directory structures of library archives. These might be structured into different formats, like Calibre `Author Name/Title of Publication/filename.ext` or flat format, such as `Author Name, Alphabetized - Title of Publication.ext`. This provides ways of moving back and forth between the paths and object representations of that archived item.

For example:
`Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf`
yields:

```
{
	author: 'Edward Said',
	title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
	file: 'metadata.opf',
	format: 'calibre'
}
```

## Install

```bash
npm install dat-cardcat-formats;
```

## Simple Use:

```js
import parseEntry, { formatPath, reformatPath } from 'dat-cardcat-formats';

// Create a new path from some data. Calling parseEntry on this path might not return the data we give 
const path = reformatPath('Edward Said', 'After Colonialism: Imperial Histories and Postcolonial Displacements', 'metadata.opf', 'calibre')
);

// Get some data from a path. Calling formatPath on this data should return this path.
const data = parseEntry('Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf');

// Get a path from some data. This path should return the same data if we call parseEntry on it.
const path = formatPath(data);

```

