import chai from 'chai';
import path from 'path';

import parseEntry, { formatPath } from '../src/formats.js';

chai.should();
const expect = chai.expect;

const invalidPaths = [
  'Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements',
  'Said, Edward -After Colonialism.opf',
  'metadata.opf',
  '',
  '../',
  'one/two/three/four.pdf',
];

const validPaths = [
  'Deleuze, Gilles; Guattari, Felix - A Thousand Plateaus.opf',
  'Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf',
  'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
  'BAVO (eds.)/Cultural Activism Today. The Art of Over-Identification/metadata.opf',
  'BAVO (eds.) - Cultural Activism Today. The Art of Over-Identification.opf',
  'Susan Buck-Morss/Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)/metadata.opf',
  'Buck-Morss, Susan - Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
  '/Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf',
  '/Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
  'Buden, Boris; Žilnik, Želimir; kuda.org, et al. - Uvod u prošlost (Serbian).opf',
];

const formattedPaths = [
  {
    authors: ['Edward Said'],
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'metadata.opf',
    calibre: 'Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf',
    flat: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
  },
  {
    authors: ['BAVO (eds.)'],
    title: 'Cultural Activism Today. The Art of Over-Identification',
    file: 'metadata.opf',
    calibre: 'BAVO (editors)/Cultural Activism Today. The Art of Over-Identification/metadata.opf',
    flat: 'BAVO (editors) - Cultural Activism Today. The Art of Over-Identification.opf',
  },
  {
    authors: ['Susan Buck-Morss'],
    title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    file: 'metadata.opf',
    calibre: 'Susan Buck-Morss/Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)/metadata.opf',
    flat: 'Buck-Morss, Susan - Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
  },
  {
    authors: ['Boris Buden', 'Želimir Žilnik', 'kuda.org'],
    title: 'Uvod u prošlost (Serbian)',
    file: 'metadata.opf',
    calibre: 'Boris Buden/Uvod u prošlost (Serbian)/metadata.opf',
    flat: 'Buden, Boris; Žilnik, Želimir; kuda.org - Uvod u prošlost (Serbian).opf',
  },
];

const correctData = [
  {
    author: 'Gilles Deleuze',
    role: undefined,
    title: 'A Thousand Plateaus',
    title_sort: 'Thousand Plateaus, A',
    file: 'Deleuze, Gilles; Guattari, Felix - A Thousand Plateaus.opf',
    format: 'flat',
    authorCount: 2,
  },
  {
    author: 'Edward Said',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    author: 'Edward Said',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    author: 'BAVO',
    role: 'editor',
    title: 'Cultural Activism Today. The Art of Over-Identification',
    title_sort: 'Cultural Activism Today. The Art of Over-Identification',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    author: 'BAVO',
    role: 'editor',
    title: 'Cultural Activism Today. The Art of Over-Identification',
    title_sort: 'Cultural Activism Today. The Art of Over-Identification',
    file: 'BAVO (eds.) - Cultural Activism Today. The Art of Over-Identification.opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    author: 'Susan Buck-Morss',
    role: undefined,
    title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    title_sort: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    author: 'Susan Buck-Morss',
    role: undefined,
    title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    title_sort: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    file: 'Buck-Morss, Susan - Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    author: 'Edward Said',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    author: 'Edward Said',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    author: 'Boris Buden',
    role: undefined,
    title: 'Uvod u prošlost (Serbian)',
    title_sort: 'Uvod u prošlost (Serbian)',
    file: 'Buden, Boris; Žilnik, Želimir; kuda.org, et al. - Uvod u prošlost (Serbian).opf',
    format: 'flat',
    authorCount: 3,
  },
];

describe('Cardcat parsers', () => {

  for (let i = 0; i < correctData.length; i++) {
    context('parsing ' + validPaths[i], () => {
      const parsed = parseEntry(validPaths[i]);

      it('has the format "' + correctData[i].format + '"', () => {
        expect(parsed.format).to.eql(correctData[i].format);
      });

      it('has the author "' + correctData[i].author + '"', () => {
        expect(parsed.authors[0].author).to.eql(correctData[i].author);
      });

      it('has the right number of authors: "' + correctData[i].authorCount + '"', () => {
        expect(parsed.authors.length).to.eql(correctData[i].authorCount);
      });

      it('has the role "' + correctData[i].role + '"', () => {
        expect(parsed.authors[0].role).to.eql(correctData[i].role);
      });

      it('has the title "' + correctData[i].title + '"', () => {
        expect(parsed.title).to.eql(correctData[i].title);
      });

      it('has the title_sort "' + correctData[i].title_sort + '"', () => {
        expect(parsed.title_sort).to.eql(correctData[i].title_sort);
      });

      it('has the file "' + correctData[i].file + '"', () => {
        expect(parsed.file).to.eql(correctData[i].file);
      });
    });
  }

  for (let i = 0; i < invalidPaths.length; i++) {
    context('parsing invalid path: ' + invalidPaths[i], () => {
      const parsed = parseEntry(invalidPaths[i]);
      it('fails', () => {
        expect(parsed).to.eql(false);
      });
    });
  }
});


describe('Cardcat formatters', () => {
  for (let i = 0; i < formattedPaths.length; i++) {
    context('formatting paths ' + i, () => {
      const formattedCalibre = formatPath(formattedPaths[i].authors, formattedPaths[i].title, formattedPaths[i].file, 'calibre');
      const formattedFlat = formatPath(formattedPaths[i].authors, formattedPaths[i].title, formattedPaths[i].file, 'flat');

      it('"calibre" has the path "' + formattedPaths[i].calibre + '"', () => {
        expect(formattedCalibre).to.eql(formattedPaths[i].calibre);
      });

      it('"flat" has the path "' + formattedPaths[i].flat + '"', () => {
        expect(formattedFlat).to.eql(formattedPaths[i].flat);
      });

    });
  }

});

// @TODO: test reformatters