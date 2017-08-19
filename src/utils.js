import _ from 'lodash';
import parser from 'another-name-parser';

function mapRole(shortRole) {
  const map = {
    'eds.': 'editors',
    'ed.': 'editor',
    'trans.': 'translator',
    'int.': 'introduction',
    'intr.': 'introduction',
  };
  return _.get(map, shortRole, shortRole);
}

export function alphabetizedTitle(title) {
  if (title.startsWith('The ') || title.startsWith('the ')) return `${title.substr(4)}, ${title.substr(0, 3)}`;
  if (title.startsWith('A ') || title.startsWith('a ')) return `${title.substr(2)}, ${title.substr(0, 1)}`;
  if (title.startsWith('An ') || title.startsWith('an ')) return `${title.substr(3)}, ${title.substr(0, 2)}`;
  return title;
}

// A wrapper that also extracts a role
export function parseName(name) {
  if (name === 'et al.') return undefined;
  const roleMatch = name.match(/\(([^)]*)\)[^(]*$/);
  if (roleMatch && roleMatch[1]) {
    const parsed = parser(name.replace(/ *\([^)]*\) */g, ''));
    parsed.role = mapRole(roleMatch[1]);
    return parsed;
  }
  return parser(name);
}

export function parseNames(names) {
  const parsed = names.map(name => parseName(name));
  if (_.get(parsed[parsed.length - 1], 'role', undefined) === 'editors') {
    _.each(parsed, (o) => { o.role = 'editor'; });
  }
  return parsed;
}

// Joins a name into a string representation
export function joinName(name, alphabetical) {
  if (alphabetical) {
    const lastName = name.last ? `${name.last},` : undefined;
    return _.join(_.compact([lastName, name.prefix, name.first, name.middle, name.suffix]), ' ');
  }
  return _.join(_.compact([name.prefix, name.first, name.middle, name.last, name.suffix]), ' ');
}
