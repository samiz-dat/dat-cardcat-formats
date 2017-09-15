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

const testData = [
  {
    test: 'Deleuze, Gilles; Guattari, Felix - A Thousand Plateaus.opf',
    author: 'Gilles Deleuze',
    author_sort: 'Deleuze, Gilles',
    role: undefined,
    title: 'A Thousand Plateaus',
    title_sort: 'Thousand Plateaus, A',
    file: 'Deleuze, Gilles; Guattari, Felix - A Thousand Plateaus.opf',
    format: 'flat',
    authorCount: 2,
  },
  {
    test: 'Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf',
    author: 'Edward Said',
    author_sort: 'Said, Edward',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    test: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    author: 'Edward Said',
    author_sort: 'Said, Edward',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    test: 'BAVO (eds.)/Cultural Activism Today. The Art of Over-Identification/metadata.opf',
    author: 'BAVO',
    author_sort: 'BAVO',
    role: 'editor',
    title: 'Cultural Activism Today. The Art of Over-Identification',
    title_sort: 'Cultural Activism Today. The Art of Over-Identification',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    test: 'BAVO (eds.) - Cultural Activism Today. The Art of Over-Identification.opf',
    author: 'BAVO',
    author_sort: 'BAVO',
    role: 'editor',
    title: 'Cultural Activism Today. The Art of Over-Identification',
    title_sort: 'Cultural Activism Today. The Art of Over-Identification',
    file: 'BAVO (eds.) - Cultural Activism Today. The Art of Over-Identification.opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    test: 'Susan Buck-Morss/Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)/metadata.opf',
    author: 'Susan Buck-Morss',
    author_sort: 'Buck-Morss, Susan',
    role: undefined,
    title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    title_sort: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    test: 'Buck-Morss, Susan - Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
    author: 'Susan Buck-Morss',
    author_sort: 'Buck-Morss, Susan',
    role: undefined,
    title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    title_sort: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    file: 'Buck-Morss, Susan - Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    test: '/Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf',
    author: 'Edward Said',
    author_sort: 'Said, Edward',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'metadata.opf',
    format: 'calibre',
    authorCount: 1,
  },
  {
    test: '/Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    author: 'Edward Said',
    author_sort: 'Said, Edward',
    role: undefined,
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    title_sort: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    format: 'flat',
    authorCount: 1,
  },
  {
    test: 'Buden, Boris; Žilnik, Želimir; kuda.org, et al. - Uvod u prošlost (Serbian).opf',
    author: 'Boris Buden',
    author_sort: 'Buden, Boris',
    role: undefined,
    title: 'Uvod u prošlost (Serbian)',
    title_sort: 'Uvod u prošlost (Serbian)',
    file: 'Buden, Boris; Žilnik, Želimir; kuda.org, et al. - Uvod u prošlost (Serbian).opf',
    format: 'flat',
    authorCount: 3,
  },
  {
    test: 'C/Chevalier (Editor), Tracy/Encyclopedia of the Essay.opf',
    author: 'Tracy Chevalier',
    author_sort: 'Chevalier, Tracy',
    role: 'Editor',
    title: 'Encyclopedia of the Essay',
    title_sort: 'Encyclopedia of the Essay',
    file: 'Encyclopedia of the Essay.opf',
    format: 'oml',
    authorCount: 1,
  },
  {
    test: 'L/Laclau, Ernesto; Mouffe, Chantal/Hegemony and Socialist Strategy (1985).opf',
    author: 'Ernesto Laclau',
    author_sort: 'Laclau, Ernesto',
    role: undefined,
    title: 'Hegemony and Socialist Strategy',
    title_sort: 'Hegemony and Socialist Strategy',
    file: 'Hegemony and Socialist Strategy (1985).opf',
    format: 'oml',
    authorCount: 2,
  }
];

const formattedPaths = [
  {
    authors: ['Edward Said'],
    title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
    file: 'metadata.opf',
    calibre: 'Edward Said/After Colonialism: Imperial Histories and Postcolonial Displacements/metadata.opf',
    flat: 'Said, Edward - After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    oml: 'S/Said, Edward/After Colonialism: Imperial Histories and Postcolonial Displacements.opf',
    opf: {
      title: 'After Colonialism: Imperial Histories and Postcolonial Displacements',
      authors: [{
        value: 'Edward Said',
        fileAs: 'Said, Edward',
        role: 'Author',
      }],
    },
  },
  {
    authors: ['BAVO (eds.)'],
    title: 'Cultural Activism Today. The Art of Over-Identification',
    file: 'metadata.opf',
    calibre: 'BAVO (editors)/Cultural Activism Today. The Art of Over-Identification/metadata.opf',
    flat: 'BAVO (editors) - Cultural Activism Today. The Art of Over-Identification.opf',
    oml: 'B/BAVO (editors)/Cultural Activism Today. The Art of Over-Identification.opf',
    opf: {
      title: 'Cultural Activism Today. The Art of Over-Identification',
      authors: [{
        value: 'BAVO',
        fileAs: 'BAVO',
        role: 'Editors',
      }],
    },
  },
  {
    authors: ['Susan Buck-Morss'],
    title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
    file: 'metadata.opf',
    calibre: 'Susan Buck-Morss/Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)/metadata.opf',
    flat: 'Buck-Morss, Susan - Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
    oml: 'B/Buck-Morss, Susan/Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish).opf',
    opf: {
      title: 'Hegel y Haití. La dialéctica amo-esclavo, una interpretación revolucionaria (Spanish)',
      authors: [{
        value: 'Susan Buck-Morss',
        fileAs: 'Buck-Morss, Susan',
        role: 'Author',
      }],
    },
  },
  {
    authors: ['Boris Buden', 'Želimir Žilnik', 'kuda.org'],
    title: 'Uvod u prošlost (Serbian)',
    file: 'metadata.opf',
    calibre: 'Boris Buden, Želimir Žilnik, kuda.org/Uvod u prošlost (Serbian)/metadata.opf',
    flat: 'Buden, Boris; Žilnik, Želimir; kuda.org - Uvod u prošlost (Serbian).opf',
    oml: 'B/Buden, Boris; Žilnik, Želimir; kuda.org/Uvod u prošlost (Serbian).opf',
    opf: {
      title: 'Uvod u prošlost (Serbian)',
      authors: [{
        value: 'Boris Buden',
        fileAs: 'Buden, Boris',
        role: 'Author',
      },
      {
        value: 'Želimir Žilnik',
        fileAs: 'Žilnik, Želimir',
        role: 'Author',
      },
      {
        value: 'kuda.org',
        fileAs: 'kuda.org',
        role: 'Author',
      }],
    },
  },
];


describe('Cardcat parsers', () => {

  for (let i = 0; i < testData.length; i++) {
    context('parsing ' + testData[i].test, () => {
      const parsed = parseEntry(testData[i].test);

      it('has the format "' + testData[i].format + '"', () => {
        expect(parsed.format).to.eql(testData[i].format);
      });

      it('has the author "' + testData[i].author + '"', () => {
        expect(parsed.authors[0].author).to.eql(testData[i].author);
      });

      it('has the sorted author "' + testData[i].author_sort + '"', () => {
        expect(parsed.authors[0].author_sort).to.eql(testData[i].author_sort);
      });

      it('has the right number of authors: "' + testData[i].authorCount + '"', () => {
        expect(parsed.authors.length).to.eql(testData[i].authorCount);
      });

      it('has the role "' + testData[i].role + '"', () => {
        expect(parsed.authors[0].role).to.eql(testData[i].role);
      });

      it('has the title "' + testData[i].title + '"', () => {
        expect(parsed.title).to.eql(testData[i].title);
      });

      it('has the title_sort "' + testData[i].title_sort + '"', () => {
        expect(parsed.title_sort).to.eql(testData[i].title_sort);
      });

      it('has the file "' + testData[i].file + '"', () => {
        expect(parsed.file).to.eql(testData[i].file);
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
      const formattedOML = formatPath(formattedPaths[i].authors, formattedPaths[i].title, formattedPaths[i].file, 'oml');
      const formattedOPF = formatPath(formattedPaths[i].authors, formattedPaths[i].title, formattedPaths[i].file, 'opf');

      it('"calibre" has the path "' + formattedPaths[i].calibre + '"', () => {
        expect(formattedCalibre).to.eql(formattedPaths[i].calibre);
      });

      it('"flat" has the path "' + formattedPaths[i].flat + '"', () => {
        expect(formattedFlat).to.eql(formattedPaths[i].flat);
      });

      it('"oml" has the path "' + formattedPaths[i].oml + '"', () => {
        expect(formattedOML).to.eql(formattedPaths[i].oml);
      });

      it('"opf" has the value "' + formattedPaths[i].opf + '"', () => {
        expect(formattedOPF).to.deep.equal(formattedPaths[i].opf);
      });

    });
  }

});

// @TODO: test reformatters